import xml.etree.ElementTree as ET
import trafilatura
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct
import cohere
from playwright.sync_api import sync_playwright
import gc
import time

# -------------------------------------
# CONFIG
# -------------------------------------
SITEMAP_URL = "sitemap.xml"
COLLECTION_NAME = "physical_ai_book-2.0"

COHERE_API_KEY = "6vWEfnr3WVRNV6eQCfFpkU9ZirY1KrDlxqAojmWH"
EMBED_MODEL = "embed-english-v3.0"
cohere_client = cohere.Client(COHERE_API_KEY)

# ---------- Qdrant CONFIG ----------
USE_LOCAL_QDRANT = False  # True = local, False = cloud

if USE_LOCAL_QDRANT:
    qdrant = QdrantClient(path="./qdrant_data")  # Local
else:
    qdrant = QdrantClient(
        url="https://ff396977-ee6f-4785-860b-4b9cfde40d29.us-east4-0.gcp.cloud.qdrant.io",
        api_key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.L7G-8em8xU1RxivOftHjmyMIFT7fKkgBMwVPBQENlkk",
        timeout=120  # increase timeout for cloud
    )

# -------------------------------------
# Step 1 — Extract URLs from sitemap
# -------------------------------------
def get_all_urls(sitemap_url):
    with open(sitemap_url, "r", encoding="utf-8") as f:
        xml = f.read()

    root = ET.fromstring(xml)
    urls = []

    for child in root:
        loc = child.find("{http://www.sitemaps.org/schemas/sitemap/0.9}loc")
        if loc is not None:
            urls.append(loc.text)

    print(f"\nFOUND {len(urls)} URLs")
    return urls

# -------------------------------------
# Step 2 — Download page + extract text
# -------------------------------------
def extract_text_from_url(browser, url):
    try:
        page = browser.new_page()
        page.goto(url, wait_until="networkidle", timeout=60000)
        html = page.content()
        page.close()
        text = trafilatura.extract(html)
        return text
    except Exception as e:
        print(f"⚠️ Failed to extract text from {url}: {e}")
        return None

# -------------------------------------
# Step 3 — SAFE Chunking
# -------------------------------------
def chunk_text(text, max_chars=1500):
    chunks = []
    start = 0
    length = len(text)

    while start < length:
        end = min(start + max_chars, length)
        chunk = text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        start = end

    return chunks

# -------------------------------------
# Step 4 — Create embedding
# -------------------------------------
def embed(text, retries=3):
    for attempt in range(retries):
        try:
            response = cohere_client.embed(
                model=EMBED_MODEL,
                input_type="search_document",
                texts=[text],
            )
            return response.embeddings[0]
        except Exception as e:
            print(f"⚠️ Embed attempt {attempt+1} failed: {e}")
            if attempt == retries - 1:
                raise e

# -------------------------------------
# Step 5 — Create Qdrant collection
# -------------------------------------
def create_collection():
    if not qdrant.collection_exists(COLLECTION_NAME):
        qdrant.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(
                size=1024,
                distance=Distance.COSINE
            )
        )
    else:
        print(f"⚠️ Collection '{COLLECTION_NAME}' already exists. Skipping creation.")

# -------------------------------------
# Step 6 — Batch upsert chunks
# -------------------------------------
# BATCH_SIZE = 10

def save_chunks_batch(chunks, start_id, url):
    points = []

    for i, chunk in enumerate(chunks):
        vector = embed(chunk)
        points.append(
            PointStruct(
                id=start_id + i,
                vector=vector,
                payload={"url": url, "text": chunk}
            )
        )

        try:
            qdrant.upsert(collection_name=COLLECTION_NAME, points=points)
        except Exception as e:
            print(f"⚠️ Failed to save batch starting {start_id}: {e}")


# -------------------------------------
# MAIN PIPELINE
# -------------------------------------
def ingest_book():
    urls = get_all_urls(SITEMAP_URL)
    create_collection()

    global_id = 1

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        for url in urls:
            print("\nProcessing:", url)

            text = extract_text_from_url(browser, url)
            if not text:
                print("⚠️ No text extracted")
                continue

            chunks = chunk_text(text)
            save_chunks_batch(chunks, global_id, url)
            print(f"✔ Saved chunks {global_id} to {global_id + len(chunks) - 1}")
            global_id += len(chunks)

            # MEMORY CLEAN
            del text
            del chunks
            gc.collect()

        browser.close()

    print("\n✅ INGESTION COMPLETED")
    print("Total chunks:", global_id - 1)

# -------------------------------------
if __name__ == "__main__":
    ingest_book()
