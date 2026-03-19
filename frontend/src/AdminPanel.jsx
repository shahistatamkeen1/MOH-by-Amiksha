import { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [status, setStatus] = useState("");

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

  const [highlightForm, setHighlightForm] = useState({
    title: "",
    subtitle: "",
    sort_order: 0,
    is_active: true,
  });
  const [highlightImage, setHighlightImage] = useState(null);
  const [editingHighlightId, setEditingHighlightId] = useState(null);

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #d9c9c5",
    fontSize: 15,
    boxSizing: "border-box",
    background: "#fff",
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/products`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Products fetch error:", err);
      setStatus("Could not load products.");
    }
  };

  const fetchHighlights = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/review-highlights`);
      const data = await res.json();
      setHighlights(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Highlights fetch error:", err);
      setStatus("Could not load Customer Love items.");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchHighlights();
  }, []);

  const resetProductForm = () => {
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
  };

  const resetHighlightForm = () => {
    setHighlightForm({
      title: "",
      subtitle: "",
      sort_order: 0,
      is_active: true,
    });
    setHighlightImage(null);
    setEditingHighlightId(null);
  };

  const handleProductEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      price: product.price || "",
      category: product.category || "new_arrivals",
      collection: product.collection || "Bloom",
      short_desc: product.shortDesc || "",
      intro: product.intro || "",
      fit: product.fit || "",
      size_guide: product.sizeGuide || "",
      care: product.care || "",
      customizable: product.customizable ?? true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHighlightEdit = (item) => {
    setEditingHighlightId(item.id);
    setHighlightForm({
      title: item.title || "",
      subtitle: item.subtitle || "",
      sort_order: item.sort_order || 0,
      is_active: item.is_active ?? true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHighlightDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/admin/review-highlights/${id}`, {
        method: "DELETE",
      });
      fetchHighlights();
    } catch (err) {
      console.error(err);
    }
  };

  const handleHighlightSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("title", highlightForm.title);
      data.append("subtitle", highlightForm.subtitle);
      data.append("sort_order", highlightForm.sort_order);
      data.append("is_active", highlightForm.is_active);

      if (editingHighlightId) {
        await fetch(`${API_BASE}/admin/review-highlights/${editingHighlightId}`, {
          method: "PUT",
          body: data,
        });
      } else {
        if (!highlightImage) {
          setStatus("Please select a highlight image.");
          return;
        }
        data.append("image", highlightImage);

        await fetch(`${API_BASE}/admin/review-highlights`, {
          method: "POST",
          body: data,
        });
      }

      resetHighlightForm();
      fetchHighlights();
    } catch (err) {
      console.error(err);
      setStatus("Highlight save failed.");
    }
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
          Manage products and Customer Love highlights.
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
            background: "#fff",
            border: "1px solid #ead8d3",
            borderRadius: 18,
            padding: 24,
            marginBottom: 30,
          }}
        >
          <h2 style={{ marginTop: 0 }}>Customer Love</h2>

          <form onSubmit={handleHighlightSubmit} style={{ display: "grid", gap: 12, marginBottom: 24 }}>
            <input
              style={inputStyle}
              placeholder="Title"
              value={highlightForm.title}
              onChange={(e) =>
                setHighlightForm({ ...highlightForm, title: e.target.value })
              }
            />

            <input
              style={inputStyle}
              placeholder="Subtitle"
              value={highlightForm.subtitle}
              onChange={(e) =>
                setHighlightForm({ ...highlightForm, subtitle: e.target.value })
              }
            />

            <input
              type="number"
              style={inputStyle}
              placeholder="Sort Order"
              value={highlightForm.sort_order}
              onChange={(e) =>
                setHighlightForm({ ...highlightForm, sort_order: e.target.value })
              }
            />

            <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={highlightForm.is_active}
                onChange={(e) =>
                  setHighlightForm({ ...highlightForm, is_active: e.target.checked })
                }
              />
              Active
            </label>

            {!editingHighlightId && (
              <input
                type="file"
                onChange={(e) => setHighlightImage(e.target.files[0])}
              />
            )}

            <div style={{ display: "flex", gap: 12 }}>
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
                {editingHighlightId ? "Update Highlight" : "Add Highlight"}
              </button>

              {editingHighlightId && (
                <button
                  type="button"
                  onClick={resetHighlightForm}
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
          </form>

          <div style={{ display: "grid", gap: 14 }}>
            {highlights.map((item) => (
              <div
                key={item.id}
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
                  src={`${API_BASE}${item.image_url}`}
                  alt={item.title}
                  style={{
                    width: 90,
                    height: 90,
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />

                <div>
                  <div style={{ fontSize: 18, fontWeight: 600 }}>{item.title}</div>
                  <div style={{ color: "#8a6f6b", marginTop: 4 }}>{item.subtitle}</div>

                  <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    <button
                      onClick={() => handleHighlightEdit(item)}
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
                      onClick={() => handleHighlightDelete(item.id)}
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

            {highlights.length === 0 && (
              <div style={{ color: "#8a6f6b" }}>No Customer Love items yet.</div>
            )}
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #ead8d3",
            borderRadius: 18,
            padding: 24,
          }}
        >
          <h2 style={{ marginTop: 0 }}>Products</h2>
          <div style={{ display: "grid", gap: 14 }}>
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
                  <div style={{ fontSize: 18, fontWeight: 600 }}>{product.name}</div>
                  <div style={{ color: "#8a6f6b", marginTop: 4 }}>₹{product.price}</div>
                  <div style={{ color: "#8a6f6b", marginTop: 4 }}>
                    {product.collection} · {product.category}
                  </div>

                  <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    <button
                      onClick={() => handleProductEdit(product)}
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
                  </div>
                </div>
              </div>
            ))}

            {products.length === 0 && (
              <div style={{ color: "#8a6f6b" }}>No products found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}