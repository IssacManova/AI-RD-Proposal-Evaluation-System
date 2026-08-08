from sentence_transformers import SentenceTransformer


# Load the Sentence-BERT model once when the application starts
model = SentenceTransformer("all-MiniLM-L6-v2")


def generate_embedding(text: str):
    """
    Convert proposal text into a Sentence-BERT embedding.
    """

    embedding = model.encode(
        text,
        convert_to_numpy=True
    )

    return embedding.tolist()