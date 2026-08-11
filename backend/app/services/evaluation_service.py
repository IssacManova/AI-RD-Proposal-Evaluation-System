import google.generativeai as genai

from app.config.settings import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-3.5-flash")


def evaluate_proposal(proposal_text: str):

    proposal_text = proposal_text[:5000]

    prompt = f"""
You are an expert university research proposal evaluator.

Evaluate the following research proposal.

Return ONLY valid JSON in this exact structure:

{{
    "summary": "Short summary of the proposal",
    "novelty_score": 0,
    "methodology_score": 0,
    "feasibility_score": 0,
    "clarity_score": 0,
    "strengths": [],
    "weaknesses": [],
    "suggestions": [],
    "overall_recommendation": "..."
}}

Rules:
- All scores must be integers from 0 to 10.
- Do not calculate the overall score.
- Do not add extra fields.
- Return valid JSON only.

Proposal:

{proposal_text}
"""

    try:
        response = model.generate_content(prompt)

        import json

        text = response.text.strip()
        if text.startswith("```"):
            lines = text.splitlines()
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            text = "\n".join(lines).strip()

        evaluation = json.loads(text)

        # Calculate overall score
        scores = [
            evaluation["novelty_score"],
            evaluation["methodology_score"],
            evaluation["feasibility_score"],
            evaluation["clarity_score"]
        ]

        overall_score = sum(scores) / len(scores)

        # Convert score out of 10 to percentage
        overall_percentage = overall_score * 10

        evaluation["overall_score"] = round(overall_score, 2)
        evaluation["overall_percentage"] = round(overall_percentage, 2)

        return evaluation

    except Exception as e:
        print("Gemini Error:", e)
        return {
            "error": f"Gemini Evaluation Failed: {str(e)}"
        }