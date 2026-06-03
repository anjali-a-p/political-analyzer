from fastapi import FastAPI
from pydantic import BaseModel
from urllib.parse import urlparse
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
    downloaded = trafilatura.fetch_url(request.url)

    if downloaded is None:
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(request.url, headers=headers, timeout=10)
        downloaded = response.text

    text = trafilatura.extract(downloaded)

    if not text:
        return {"error": "Could not extract article text"}

    words = text.split()
    domain = urlparse(request.url).netloc

    return {
        "url": request.url,
        "source_domain": domain,
        "article_length": len(text),
        "word_count": len(words),
        "preview": text[:700]
    }