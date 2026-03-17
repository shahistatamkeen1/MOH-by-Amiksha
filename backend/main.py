from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_connection():
    return psycopg2.connect(
        host="localhost",
        port="5432",
        dbname="moh_db",
        user="postgres",
        password=""
    )

@app.get("/")
def home():
    return {"brand": "MOH by Amiksha", "status": "running"}

@app.get("/products")
def get_products():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, name, category, collection, price, image_url, description, customizable
        FROM products
        ORDER BY id;
    """)
    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    products = []
    for row in rows:
        products.append({
            "id": row[0],
            "name": row[1],
            "category": row[2],
            "collection": row[3],
            "price": row[4],
            "image_url": row[5],
            "description": row[6],
            "customizable": row[7],
        })

    return products