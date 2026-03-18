import { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "new_arrivals",
    collection: "Bloom",
    short_desc: "",
    intro: "",
    fit: "",
    size_guide: "",
    care: "",
    customizable: true,
  });
  const [mainImage, setMainImage] = useState(null);
  const [subImages, setSubImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setStatus("Could not load products from backend.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      category: "new_arrivals",
      collection: "Bloom",
      short_desc: "",
      intro: "",
      fit: "",
      size_guide: "",
      care: "",
      customizable: true,
    });
    setMainImage(null);
    setSubImages([]);
    setEditingId(null);
    setStatus("");
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      price: product.price || "",
      category: product.category || "new_arrivals",
      collection: product.collection || "",
      short_desc: product.shortDesc || "",
      intro: product.intro || "",
      fit: product.fit || "",
      size_guide: product.sizeGuide || "",
      care: product.care || "",
      customizable: product.customizable ?? true,
    });
    setStatus(`Editing: ${product.name}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/admin/products/${id}`, {
        method: "DELETE",
      });
      setStatus("Product deleted.");
      fetchProducts();
    } catch (err) {
      console.error(err);
      setStatus("Delete failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");

    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("price", form.price);
      data.append("category", form.category);
      data.append("collection", form.collection);
      data.append("short_desc", form.short_desc);
      data.append("intro", form.intro);
      data.append("fit", form.fit);
      data.append("size_guide", form.size_guide);
      data.append("care", form.care);
      data.append("customizable", form.customizable);

      if (editingId) {
        await fetch(`${API_BASE}/admin/products/${editingId}`, {
          method: "PUT",
          body: data,
        });

        if (subImages.length > 0) {
          const imageData = new FormData();
          Array.from(subImages).forEach((file) =>
            imageData.append("images", file)
          );

          await fetch(`${API_BASE}/admin/products/${editingId}/images`, {
            method: "POST",
            body: imageData,
          });
        }

        setStatus("Product updated successfully.");
      } else {
        if (!mainImage) {
          setStatus("Please choose a main image.");
          return;
        }

        data.append("main_image", mainImage);
        Array.from(subImages).forEach((file) =>
          data.append("sub_images", file)
        );

        await fetch(`${API_BASE}/admin/products`, {
          method: "POST",
          body: data,
        });

        setStatus("Product added successfully.");
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      setStatus("Save failed.");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #d9c9c5",
    fontSize: 15,
    boxSizing: "border-box",
    background: "#fff",
  };

  const labelStyle = {
    fontSize: 14,
    marginBottom: 6,
    display: "block",
    color: "#6e5955",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9f6f1",
        padding: "32px 24px 60px",
        color: "#422b23",
        fontFamily: "Georgia, serif",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ marginBottom: 8 }}>Admin Panel</h1>
        <p style={{ marginTop: 0, color: "#8a6f6b" }}>
          Add, edit, and manage products for MOH by Amiksha.
        </p>

        {status && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #ead8d3",
              padding: "12px 16px",
              borderRadius: 10,
              marginBottom: 20,
              color: "#6e5955",
            }}
          >
            {status}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 28,
            alignItems: "start",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              background: "#fff",
              border: "1px solid #ead8d3",
              borderRadius: 18,
              padding: 24,
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              {editingId ? "Edit Product" : "Add Product"}
            </h2>

            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <label style={labelStyle}>Product Name</label>
                <input
                  style={inputStyle}
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>

              <div>
                <label style={labelStyle}>Price</label>
                <input
                  type="number"
                  style={inputStyle}
                  value={form.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                />
              </div>

              <div>
                <label style={labelStyle}>Category</label>
                <select
                  style={inputStyle}
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                >
                  <option value="new_arrivals">New Arrivals</option>
                  <option value="collections">Collections</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Collection</label>
                <input
                  style={inputStyle}
                  value={form.collection}
                  onChange={(e) => handleChange("collection", e.target.value)}
                />
              </div>

              <div>
                <label style={labelStyle}>Short Description</label>
                <textarea
                  rows={3}
                  style={inputStyle}
                  value={form.short_desc}
                  onChange={(e) => handleChange("short_desc", e.target.value)}
                />
              </div>

              <div>
                <label style={labelStyle}>Intro</label>
                <textarea
                  rows={4}
                  style={inputStyle}
                  value={form.intro}
                  onChange={(e) => handleChange("intro", e.target.value)}
                />
              </div>

              <div>
                <label style={labelStyle}>Fit & Style</label>
                <textarea
                  rows={3}
                  style={inputStyle}
                  value={form.fit}
                  onChange={(e) => handleChange("fit", e.target.value)}
                />
              </div>

              <div>
                <label style={labelStyle}>Size Guide</label>
                <textarea
                  rows={3}
                  style={inputStyle}
                  value={form.size_guide}
                  onChange={(e) => handleChange("size_guide", e.target.value)}
                />
              </div>

              <div>
                <label style={labelStyle}>Care Instructions</label>
                <textarea
                  rows={3}
                  style={inputStyle}
                  value={form.care}
                  onChange={(e) => handleChange("care", e.target.value)}
                />
              </div>

              <div>
                <label style={labelStyle}>Main Image</label>
                <input
                  type="file"
                  onChange={(e) => setMainImage(e.target.files[0])}
                />
              </div>

              <div>
                <label style={labelStyle}>Sub Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setSubImages(e.target.files)}
                />
              </div>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "#6e5955",
                }}
              >
                <input
                  type="checkbox"
                  checked={form.customizable}
                  onChange={(e) =>
                    handleChange("customizable", e.target.checked)
                  }
                />
                Customizable
              </label>

              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button
                  type="submit"
                  style={{
                    background: "#422b23",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "12px 18px",
                    cursor: "pointer",
                  }}
                >
                  {editingId ? "Update Product" : "Add Product"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    style={{
                      background: "#efd8d6",
                      color: "#422b23",
                      border: "none",
                      borderRadius: 10,
                      padding: "12px 18px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>

          <div
            style={{
              background: "#fff",
              border: "1px solid #ead8d3",
              borderRadius: 18,
              padding: 24,
            }}
          >
            <h2 style={{ marginTop: 0 }}>Existing Products</h2>

            <div style={{ display: "grid", gap: 16 }}>
              {products.map((product) => (
                <div
                  key={product.id}
                  style={{
                    border: "1px solid #f0dfdb",
                    borderRadius: 14,
                    padding: 14,
                    display: "grid",
                    gridTemplateColumns: "90px 1fr",
                    gap: 14,
                    alignItems: "start",
                  }}
                >
                  <img
                    src={`${API_BASE}${product.image}`}
                    alt={product.name}
                    style={{
                      width: 90,
                      height: 110,
                      objectFit: "cover",
                      borderRadius: 10,
                    }}
                  />

                  <div>
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 600,
                        marginBottom: 6,
                      }}
                    >
                      {product.name}
                    </div>
                    <div style={{ color: "#8a6f6b", marginBottom: 4 }}>
                      ₹{product.price}
                    </div>
                    <div style={{ color: "#8a6f6b", marginBottom: 10 }}>
                      {product.collection} · {product.category}
                    </div>

                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        onClick={() => handleEdit(product)}
                        style={{
                          background: "#d6bd9f",
                          color: "#422b23",
                          border: "none",
                          borderRadius: 8,
                          padding: "8px 12px",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(product.id)}
                        style={{
                          background: "#efd8d6",
                          color: "#422b23",
                          border: "none",
                          borderRadius: 8,
                          padding: "8px 12px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {products.length === 0 && (
                <div style={{ color: "#8a6f6b" }}>No products found yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}