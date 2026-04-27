# Raíz API

FastAPI backend for the Raíz restaurant website. Handles reservation requests and contact form submissions.

Part of a portfolio project by [Derek Muñoz Solís](https://drame31.github.io/) demonstrating FastAPI + SQLAlchemy skills.

## Setup

```bash
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API available at `http://localhost:8000`. Interactive docs at `/api/docs`.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/reservations` | Create a reservation |
| GET | `/api/reservations/{code}` | Look up reservation by confirmation code |
| POST | `/api/contact` | Submit a contact message |

## Reservation payload

```json
{
  "name": "Ana Rodríguez",
  "email": "ana@example.com",
  "phone": "+506 8888-1234",
  "date": "2025-11-15",
  "time": "19:00",
  "party_size": 2,
  "notes": "Alergia a mariscos"
}
```

Restaurant hours are validated automatically. Monday reservations are rejected. Dates in the past are rejected.

## Deploy to Render.com

1. Push this folder to a GitHub repo (or add it to the same repo as your portfolio site)
2. In [Render.com](https://render.com), create a new **Web Service**
3. Connect the repo, set root directory to `projects/raiz/api`
4. Render detects `render.yaml` automatically — no manual config needed
5. Deploy. The service URL will be something like `https://raiz-api.onrender.com`
6. Update `API_URL` in `js/raiz.js` to point to your Render URL

**Note:** Free tier spins down after 15 minutes of inactivity. The first request after idle takes ~30 seconds. The frontend handles this with a loading state.
