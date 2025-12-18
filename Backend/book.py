import cohere
from qdrant_client import QdrantClient

# initialize cohere client
cohere_client = cohere.Client("6vWEfnr3WVRNV6eQCfFpkU9ZirY1KrDlxqAojmWH")

#connect to Qdrant
qdrant = QdrantClient(
    url="https://ff396977-ee6f-4785-860b-4b9cfde40d29.us-east4-0.gcp.cloud.qdrant.io",
    api_key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.L7G-8em8xU1RxivOftHjmyMIFT7fKkgBMwVPBQENlkk"
)


def get_embedding(text):
    """get embedding vector from cohere embed v3"""
    response = cohere_client.embed(
        model="embed-english-v3.0",
        input_type="search_query",
        texts=[text],
    )
    return response.embeddings[0]

def retrieve(query):
    embedding= get_embedding(query)
    result=qdrant.query_points(
        collection_name="physical_ai_book-2.0",
        query=embedding,
        limit=5
    )
    return [point.payload.get("text","") for point in result.points]

print (retrieve("what data do you have?"))