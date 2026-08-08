from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


model = SentenceTransformer("all-MiniLM-L6-v2")


def generate_embedding(text: str):
    embedding = model.encode(text)
    return embedding.tolist()


def calculate_similarity(current_embedding, stored_embeddings):

    if not stored_embeddings:
        return []

    similarities = []

    for item in stored_embeddings:

        similarity = cosine_similarity(
            [current_embedding],
            [item["embedding"]]
        )[0][0]

        similarities.append({
            "_id": str(item["_id"]),
            "title": item["title"],
            "similarity_score": round(float(similarity * 100), 2)
        })

    similarities.sort(
        key=lambda x: x["similarity_score"],
        reverse=True
    )

    return similarities