import json
import google.generativeai as genai

from app.config.settings import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-3.5-flash")


def evaluate_proposal(proposal_text: str):

    # Limit the text sent to Gemini
    proposal_text = proposal_text[:5000]

    prompt = f"""
You are an expert university research proposal evaluator.

Evaluate the following research proposal.

Return ONLY a valid JSON object.

Do NOT use markdown.
Do NOT use triple backticks.
Do NOT include any explanation before or after the JSON.

Return exactly in this format:

{{
    "summary": "",
    "novelty_score": 0,
    "methodology_score": 0,
    "feasibility_score": 0,
    "clarity_score": 0,
    "strengths": [],
    "weaknesses": [],
    "suggestions": [],
    "overall_recommendation": ""
}}

Proposal:

{proposal_text}
"""

    try:
        response = model.generate_content(prompt)

        # Convert JSON string returned by Gemini into Python dictionary
        return json.loads(response.text)

    except Exception as e:
        print("Gemini Error:", e)

        return {
            "summary": "",
            "novelty_score": 0,
            "methodology_score": 0,
            "feasibility_score": 0,
            "clarity_score": 0,
            "strengths": [],
            "weaknesses": [],
            "suggestions": [],
            "overall_recommendation": "Evaluation Failed",
            "error": str(e)
        }