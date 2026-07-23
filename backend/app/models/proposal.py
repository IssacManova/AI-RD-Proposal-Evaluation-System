from datetime import datetime


class Proposal:
    def __init__(
        self,
        title,
        domain,
        filename,
        file_path,
        researcher_email,
        extracted_text,
    ):
        self.title = title
        self.domain = domain
        self.filename = filename
        self.file_path = file_path
        self.researcher_email = researcher_email
        self.extracted_text = extracted_text
        self.uploaded_at = datetime.utcnow()

    def to_dict(self):
        return {
            "title": self.title,
            "domain": self.domain,
            "filename": self.filename,
            "file_path": self.file_path,
            "researcher_email": self.researcher_email,
            "uploaded_at": self.uploaded_at,
            "extracted_text": self.extracted_text,
        }