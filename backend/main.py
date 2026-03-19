from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import psycopg2
import os
import shutil
from typing import Optional
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


def get_connection():
    return psycopg2.connect(
        host="localhost",
        port="5432",
        dbname="moh_db",
        user="postgres",
        password="pa$$w0rd"
    )


@app.get("/")
def home():
    return {"brand": "MOH by Amiksha", "status": "running"}


@app.get("/products")
def get_products():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT id, name, price, category, collection, short_desc, intro, fit, size_guide, care, customizable, main_image
        FROM products
        ORDER BY id;
    """)
    product_rows = cur.fetchall()

    products = []
    for row in product_rows:
        product_id = row[0]

        cur.execute("""
            SELECT image_url
            FROM product_images
            WHERE product_id = %s
            ORDER BY sort_order, id;
        """, (product_id,))
        image_rows = cur.fetchall()

        products.append({
            "id": row[0],
            "name": row[1],
            "price": row[2],
            "category": row[3],
            "collection": row[4],
            "shortDesc": row[5],
            "intro": row[6],
            "fit": row[7],
            "sizeGuide": row[8],
            "care": row[9],
            "customizable": row[10],
            "image": row[11],
            "images": [img[0] for img in image_rows] if image_rows else [row[11]],
            "sizes": ["XS", "S", "M", "L", "XL"]
        })

    cur.close()
    conn.close()
    return products


@app.get("/admin/products")
def admin_get_products():
    return get_products()


@app.post("/admin/products")
def create_product(
    name: str = Form(...),
    price: int = Form(...),
    category: str = Form(...),
    collection: str = Form(...),
    short_desc: str = Form(""),
    intro: str = Form(""),
    fit: str = Form(""),
    size_guide: str = Form(""),
    care: str = Form(""),
    customizable: bool = Form(True),
    main_image: UploadFile = File(...),
    sub_images: List[UploadFile] = File([])
):
    pass

@app.get("/review-highlights")
def get_review_highlights():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT id, title, subtitle, image_url, sort_order, is_active
        FROM review_highlights
        WHERE is_active = TRUE
        ORDER BY sort_order, id;
    """)

    rows = cur.fetchall()
    cur.close()
    conn.close()

    return [
        {
            "id": row[0],
            "title": row[1],
            "subtitle": row[2],
            "image_url": row[3],
            "sort_order": row[4],
            "is_active": row[5],
        }
        for row in rows
    ]


@app.get("/admin/review-highlights")
def admin_get_review_highlights():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT id, title, subtitle, image_url, sort_order, is_active
        FROM review_highlights
        ORDER BY sort_order, id;
    """)

    rows = cur.fetchall()
    cur.close()
    conn.close()

    return [
        {
            "id": row[0],
            "title": row[1],
            "subtitle": row[2],
            "image_url": row[3],
            "sort_order": row[4],
            "is_active": row[5],
        }
        for row in rows
    ]


@app.post("/admin/review-highlights")
def create_review_highlight(
    title: str = Form(...),
    subtitle: str = Form(""),
    sort_order: int = Form(0),
    is_active: bool = Form(True),
    image: UploadFile = File(...)
):
    conn = get_connection()
    cur = conn.cursor()

    image_path = f"/uploads/{image.filename}"
    with open(os.path.join(UPLOAD_DIR, image.filename), "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    cur.execute("""
        INSERT INTO review_highlights (title, subtitle, image_url, sort_order, is_active)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id;
    """, (title, subtitle, image_path, sort_order, is_active))

    highlight_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return {"message": "Review highlight created", "id": highlight_id}


@app.put("/admin/review-highlights/{highlight_id}")
def update_review_highlight(
    highlight_id: int,
    title: str = Form(...),
    subtitle: str = Form(""),
    sort_order: int = Form(0),
    is_active: bool = Form(True)
):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        UPDATE review_highlights
        SET title = %s,
            subtitle = %s,
            sort_order = %s,
            is_active = %s
        WHERE id = %s
    """, (title, subtitle, sort_order, is_active, highlight_id))

    conn.commit()
    cur.close()
    conn.close()

    return {"message": "Review highlight updated"}


@app.delete("/admin/review-highlights/{highlight_id}")
def delete_review_highlight(highlight_id: int):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("DELETE FROM review_highlights WHERE id = %s", (highlight_id,))
    conn.commit()

    cur.close()
    conn.close()

    return {"message": "Review highlight deleted"}
    conn = get_connection()
    cur = conn.cursor()

    # save main image
    main_path = f"/uploads/{main_image.filename}"
    with open(os.path.join(UPLOAD_DIR, main_image.filename), "wb") as buffer:
        shutil.copyfileobj(main_image.file, buffer)

    cur.execute("""
        INSERT INTO products (
            name, price, category, collection, short_desc, intro, fit, size_guide, care, customizable, main_image
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id;
    """, (
        name, price, category, collection, short_desc, intro, fit, size_guide, care, customizable, main_path
    ))

    product_id = cur.fetchone()[0]

    # add main image to product_images too
    cur.execute("""
        INSERT INTO product_images (product_id, image_url, sort_order)
        VALUES (%s, %s, %s)
    """, (product_id, main_path, 1))

    # save sub images
    for idx, img in enumerate(sub_images, start=2):
        image_path = f"/uploads/{img.filename}"
        with open(os.path.join(UPLOAD_DIR, img.filename), "wb") as buffer:
            shutil.copyfileobj(img.file, buffer)

        cur.execute("""
            INSERT INTO product_images (product_id, image_url, sort_order)
            VALUES (%s, %s, %s)
        """, (product_id, image_path, idx))

    conn.commit()
    cur.close()
    conn.close()

    return {"message": "Product created successfully", "product_id": product_id}


@app.put("/admin/products/{product_id}")
def update_product(
    product_id: int,
    name: str = Form(...),
    price: int = Form(...),
    category: str = Form(...),
    collection: str = Form(...),
    short_desc: str = Form(""),
    intro: str = Form(""),
    fit: str = Form(""),
    size_guide: str = Form(""),
    care: str = Form(""),
    customizable: bool = Form(True)
):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        UPDATE products
        SET name=%s, price=%s, category=%s, collection=%s, short_desc=%s,
            intro=%s, fit=%s, size_guide=%s, care=%s, customizable=%s
        WHERE id=%s
    """, (
        name, price, category, collection, short_desc, intro, fit, size_guide, care, customizable, product_id
    ))

    conn.commit()
    cur.close()
    conn.close()

    return {"message": "Product updated successfully"}


@app.delete("/admin/products/{product_id}")
def delete_product(product_id: int):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("DELETE FROM products WHERE id = %s", (product_id,))
    conn.commit()

    cur.close()
    conn.close()

    return {"message": "Product deleted successfully"}


@app.post("/admin/products/{product_id}/images")
def add_product_images(
    product_id: int,
    images: List[UploadFile] = File(...)
):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT COALESCE(MAX(sort_order), 0)
        FROM product_images
        WHERE product_id = %s
    """, (product_id,))
    start_order = cur.fetchone()[0] + 1

    for idx, img in enumerate(images, start=start_order):
        image_path = f"/uploads/{img.filename}"
        with open(os.path.join(UPLOAD_DIR, img.filename), "wb") as buffer:
            shutil.copyfileobj(img.file, buffer)

        cur.execute("""
            INSERT INTO product_images (product_id, image_url, sort_order)
            VALUES (%s, %s, %s)
        """, (product_id, image_path, idx))

    conn.commit()
    cur.close()
    conn.close()

    return {"message": "Images added successfully"}