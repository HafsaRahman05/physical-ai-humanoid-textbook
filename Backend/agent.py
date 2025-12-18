from agents import Agent, Runner, OpenAIChatCompletionsModel, AsyncOpenAI
from agents import set_tracing_disabled, function_tool
import os
from dotenv import load_dotenv
from agents import enable_verbose_stdout_logging
import cohere
from qdrant_client import QdrantClient
# from openai import AsyncOpenAI

# enable_verbose_stdout_logging()

load_dotenv()
# set_tracing_disabled(disabled=True)

gemini_api_key = os.getenv("GEMINI_API_KEY")
provider = AsyncOpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

model = OpenAIChatCompletionsModel(
    model="gemini-1.5-flash",
    openai_client=provider
)

# provider = AsyncOpenAI(
#     api_key=os.getenv("OPENAI_API_KEY")
# )

# model = OpenAIChatCompletionsModel(
#     model="gpt-4o-mini",
#     openai_client=provider
# )

# # initialize cohere client
# cohere_client = cohere.Client("6vWEfnr3WVRNV6eQCfFpkU9ZirY1KrDlxqAojmWH")

# #connect to Qdrant
# qdrant = QdrantClient(
#     url="https://ff396977-ee6f-4785-860b-4b9cfde40d29.us-east4-0.gcp.cloud.qdrant.io",
#     api_key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.L7G-8em8xU1RxivOftHjmyMIFT7fKkgBMwVPBQENlkk"
# )


# def get_embedding(text):
#     """get embedding vector from cohere embed v3"""
#     response = cohere_client.embed(
#         model="embed-english-v3.0",
#         input_type="search_query",
#         texts=[text],
#     )
#     return response.embeddings[0]

# @function_tool
# def retrieve(query):
#     embedding= get_embedding(query)
#     result=qdrant.query_points(
#         collection_name="physical_ai_book-2.0",
#         query=embedding,
#         limit=5
#     )
#     return [point.payload.get("text","") for point in result.points]


# @function_tool
# def how_many_jokes():
#     "get rendom number of jokes"
#     return Random.randint(1,10)
# agent = Agent(
#     name="Assistant",
#     instructions="""
#     You are an AI tutor for the Physical AI & Humanoid Robotics textbook.
#     To answer the user question, first call the tool `retrieve` with the user query.
#     Use ONLY the returned content from `retrieve` to answer.
#     If the answer is not in the retrieved content, say "I don't know".
#     """,
#     model=model,
#     tools=[how_many_jokes]
# )


# result = Runner.run_sync(
#     agent,
#     input="what is physical ai?",
# )


@function_tool
def how_many_jokes():
    "get random number of jokes"
    return random.randint(1, 10)


agent = Agent(
    name="Assistant",
    instructions="If the user asks for a joke, first call how_many_jokes.",
    model=model,
    tools=[how_many_jokes]
)

result = Runner.run_sync(agent, input="tell me a joke")
print(result.final_output)

# print(result.final_output)