import re


def preprocess_text(text: str) -> str:
    """
    Clean extracted PDF text before AI evaluation.
    """

    # Remove multiple spaces
    text = re.sub(r"\s+", " ", text)

    # Remove unwanted symbols
    text = re.sub(r"[^\w\s.,!?()\-:]", "", text)

    return text.strip()