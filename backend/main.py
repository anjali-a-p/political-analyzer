from fastapi import FastAPI
from pydantic import BaseModel
import trafilatura
import requests

app = FastAPI()

class AnalyzeRequest(BaseModel):
    url: str

@app.get("/")
def root():
    return {"message": "Political Analyzer API is running"}

@app.post("/analyze")
def analyze(request: AnalyzeRequest):
    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    downloaded = trafilatura.fetch_url(request.url)

    if downloaded is None:
        response = requests.get(request.url, headers=headers, timeout=10)
        downloaded = response.text

    text = trafilatura.extract(downloaded)

    if not text:
        return {"error": "Could not extract article text"}

    return {
        "url": request.url,
        "article_length": len(text),
        "preview": text[:500]
    }