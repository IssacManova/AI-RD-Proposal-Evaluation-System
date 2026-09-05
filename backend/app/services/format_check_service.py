"""
format_check_service.py
-----------------------
IEEE Standard Research Proposal Format Validator.

Checks whether the uploaded PDF text complies with the IEEE Standard Research Proposal format
including IEEE section headings (Abstract, Index Terms/Keywords, Section I-V, IEEE Citations).
Runs in milliseconds using high-performance regex keyword matching.
"""

import re
from typing import TypedDict, List


class SectionDef(TypedDict):
    id: str
    label: str
    keywords: List[str]
    required: bool


REQUIRED_SECTIONS: List[SectionDef] = [
    {
        "id": "abstract",
        "label": "IEEE Abstract",
        "keywords": [
            r"\babstract\b",
            r"\bexecutive\s+summary\b",
        ],
        "required": True,
    },
    {
        "id": "keywords",
        "label": "IEEE Index Terms / Keywords",
        "keywords": [
            r"\bindex\s+terms\b",
            r"\bkey\s*words\b",
            r"\bkeywords\b",
            r"\bsubject\s+headings\b",
        ],
        "required": True,
    },
    {
        "id": "introduction",
        "label": "IEEE Section I: Introduction",
        "keywords": [
            r"\b(?:section\s+i|1\.)?\s*introduction\b",
            r"\bbackground\b",
            r"\boverview\b",
        ],
        "required": True,
    },
    {
        "id": "problem_statement",
        "label": "Problem Statement & Motivation",
        "keywords": [
            r"\bproblem\s+statement\b",
            r"\bresearch\s+problem\b",
            r"\bmotivation\b",
            r"\bproblem\s+definition\b",
            r"\bproblem\s+formulation\b",
        ],
        "required": True,
    },
    {
        "id": "literature_review",
        "label": "IEEE Section II: Literature Review / Related Work",
        "keywords": [
            r"\b(?:section\s+ii|2\.)?\s*literature\s+review\b",
            r"\b(?:section\s+ii|2\.)?\s*related\s+work[s]?\b",
            r"\bprior\s+work[s]?\b",
            r"\bbackground\s+study\b",
            r"\bstate\s+of\s+the\s+art\b",
        ],
        "required": True,
    },
    {
        "id": "methodology",
        "label": "IEEE Section III: Proposed Methodology & System Architecture",
        "keywords": [
            r"\b(?:section\s+iii|3\.)?\s*methodology\b",
            r"\b(?:section\s+iii|3\.)?\s*proposed\s+method[s]?\b",
            r"\bmethod[s]?\b",
            r"\bapproach\b",
            r"\bresearch\s+design\b",
            r"\barchitecture\b",
            r"\bsystem\s+model\b",
        ],
        "required": True,
    },
    {
        "id": "expected_outcomes",
        "label": "IEEE Section IV: Expected Outcomes & Discussion",
        "keywords": [
            r"\b(?:section\s+iv|4\.)?\s*expected\s+outcome[s]?\b",
            r"\bcontribution[s]?\b",
            r"\bdeliverable[s]?\b",
            r"\bexpected\s+result[s]?\b",
            r"\bexperimental\s+setup\b",
            r"\bperformance\s+evaluation\b",
        ],
        "required": True,
    },
    {
        "id": "references",
        "label": "IEEE References & In-text Citations ([1], [2])",
        "keywords": [
            r"\breference[s]?\b",
            r"\bbibliography\b",
            r"\bworks\s+cited\b",
            r"\[\d+\]",
        ],
        "required": True,
    },
]


def check_format(text: str) -> dict:
    """
    Scan extracted PDF text against IEEE Standard Research Proposal criteria.

    Returns:
        {
            "format_standard": "IEEE Standard Format",
            "is_valid": bool,
            "score": int,              # 0-100 percentage of IEEE sections found
            "total_sections": int,
            "found_count": int,
            "missing_count": int,
            "sections": [
                {
                    "id": str,
                    "label": str,
                    "found": bool,
                    "required": bool
                },
                ...
            ]
        }
    """
    lower_text = text.lower()

    sections = []
    found_count = 0

    for section in REQUIRED_SECTIONS:
        found = any(
            re.search(kw, lower_text)
            for kw in section["keywords"]
        )
        if found:
            found_count += 1

        sections.append({
            "id":       section["id"],
            "label":    section["label"],
            "found":    found,
            "required": section["required"],
        })

    total     = len(REQUIRED_SECTIONS)
    missing   = total - found_count
    score     = round((found_count / total) * 100)
    is_valid  = missing == 0

    return {
        "format_standard": "IEEE Standard Format",
        "is_valid":       is_valid,
        "score":          score,
        "total_sections": total,
        "found_count":    found_count,
        "missing_count":  missing,
        "sections":       sections,
    }
