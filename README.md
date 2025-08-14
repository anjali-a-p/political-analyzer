# Political Content Analyzer (Work in Progress)
Classifies text (articles, posts) as **Left / Center / Right** using transformer-based NLP.  
Backend: **Flask** + Hugging Face Transformers. Frontend: **React** with **Chart.js**.

## Features
- Zero-shot & fine-tuned classification (BERT/RoBERTa via Hugging Face)
- REST API endpoint `/classify` returning label + probabilities
- React UI to paste text/URL and visualize results
- (Planned) Web scraping with BeautifulSoup for article extraction

## Quickstart (Backend)
```bash
python -m venv venv
source venv/bin/activate     # Windows: venv\Scripts\activate
pip install flask flask-cors transformers torch
python app.py
# test
curl -X POST http://localhost:5000/classify -H "Content-Type: application/json" -d '{"text":"Example text"}'
```

## API
- POST `/classify`  body: `{"text": "...", "explain": false}` → `{"top_label": "...", "scores": {"Left":..,"Center":..,"Right":..}}`

## Roadmap
- [ ] URL scraping and preprocessing
- [ ] React UI with probability charts
- [ ] Optional Spring Boot service for auth/storage
- [ ] Dockerfile + simple deployment
