# MOH by Amiksha — Full-Stack Website

A beautiful floral-themed women's clothing brand website for **MOH by Amiksha**.

## Tech Stack
- **Frontend**: React (Vite)
- **Backend**: Python FastAPI
- **Database**: PostgreSQL
- **Ordering**: WhatsApp direct integration (no cart)

---

## Project Structure

```
moh-by-amiksha/
├── src/
│   └── App.jsx          # Full React frontend
├── backend/
│   └── main.py          # FastAPI backend
├── database/
│   └── schema.sql       # PostgreSQL schema + seed data
└── README.md
```

---

## Setup Instructions

### 1. Frontend (React + Vite)

```bash
npm create vite@latest moh-frontend -- --template react
cd moh-frontend
cp ../src/App.jsx src/App.jsx
npm install
npm run dev
```

> Open http://localhost:5173

### 2. Backend (Python FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install fastapi uvicorn psycopg2-binary python-dotenv

# Create .env
echo "DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/moh_amiksha" > .env

uvicorn main:app --reload --port 8000
```

> API docs at http://localhost:8000/docs

### 3. Database (PostgreSQL)

```bash
psql -U postgres -f database/schema.sql
```

---

## Configuration

### WhatsApp Number
In `src/App.jsx`, update:
```js
const WHATSAPP_NUMBER = "919999999999"; // Your WhatsApp number with country code
```

### Environment Variables (backend)
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/moh_amiksha
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | All products (filter: `?category=new_arrivals`) |
| GET | `/api/products/:id` | Single product |
| GET | `/api/collections` | All collections with counts |
| POST | `/api/custom-order` | Save custom order |
| POST | `/api/enquiry` | Save product enquiry |

---

## Features

- 🌸 Floral pastel design (powder pink, champagne, rose, ivory)
- 👗 Women's section only
- 🗂️ 3 tabs: New Arrivals · Collections · All
- 💬 WhatsApp ordering (no cart!)
- ✂️ Custom order form (size, color, fabric, notes)
- 📱 Mobile responsive
- 🔗 Instagram link integration
- 🌿 Floating WhatsApp button

---

## Customization

To add real product images, update `image_url` in the `products` table or serve them from a static folder. The product cards will render images if provided.
