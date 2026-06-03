from fastapi import FastAPI
from pydantic import BaseModel
import trafilatura

app = FastAPI()

class AnalyzeRequest(BaseModel):
    url: str

@app.get("/")
def root():
    return {"message": "Political Analyzer API is running"}

@app.post("/analyze")
def analyze(request: AnalyzeRequest):
    downloaded = trafilatura.fetch_url(request.url)

    if downloaded is None:
        return {"error": "Could not fetch URL"}

    text = trafilatura.extract(downloaded)

    if not text:
        return {"error": "Could not extract article text"}

    return {
        "url": request.url,
        "article_length": len(text),
        "preview": text[:500]
    }