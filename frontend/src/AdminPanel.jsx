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
  const [replacementMainImage, setReplacementMainImage] = useState(null);
  const [subImages, setSubImages] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [highlightForm, setHighlightForm] = useState({
    title: "",
    subtitle: "",
    sort_order: 0,
    is_active: true,
  });
  const [highlightImages, setHighlightImages] = useState([]);
  const [editingHighlightId, setEditingHighlightId] = useState(null);

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #e4d3cf",
    fontSize: 15,
    boxSizing: "border-box",
    background: "#fff",
    color: "#422b23",
    outline: "none",
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: 100,
    resize: "vertical",
    fontFamily: "inherit",
  };

  const cardStyle = {
    background: "#fff",
    border: "1px solid #ead8d3",
    borderRadius: 18,
    padding: 24,
    marginBottom: 30,
    boxShadow: "0 8px 24px rgba(66,43,35,0.04)",
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
    setReplacementMainImage(null);
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
    setHighlightImages([]);
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
    setReplacementMainImage(null);
    setSubImages([]);
    setStatus("Editing product.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProductDelete = async (productId) => {
    try {
      const res = await fetch(`${API_BASE}/admin/products/${productId}`, {
        method: "DELETE",
      });
      const result = await res.json();
      console.log(result);
      if (!res.ok) {
        setStatus("Product delete failed.");
        return;
      }
      setStatus("Product deleted successfully.");
      if (editingId === productId) resetProductForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      setStatus("Product delete failed.");
    }
  };

  const handleDeleteSubImage = async (imageId) => {
    try {
      const res = await fetch(`${API_BASE}/admin/product-images/${imageId}`, {
        method: "DELETE",
      });
      const result = await res.json();
      console.log(result);
      if (!res.ok) {
        setStatus("Subimage delete failed.");
        return;
      }
      setStatus("Subimage removed successfully.");
      fetchProducts();
    } catch (err) {
      console.error(err);
      setStatus("Subimage delete failed.");
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

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
        if (replacementMainImage) {
          data.append("main_image", replacementMainImage);
        }

        const res = await fetch(`${API_BASE}/admin/products/${editingId}`, {
          method: "PUT",
          body: data,
        });
        const result = await res.json();
        console.log("Update product response:", result);

        if (!res.ok) {
          setStatus("Product update failed.");
          return;
        }

        if (subImages.length > 0) {
          const imageData = new FormData();
          subImages.forEach((file) => imageData.append("images", file));

          const imageRes = await fetch(`${API_BASE}/admin/products/${editingId}/images`, {
            method: "POST",
            body: imageData,
          });
          const imageResult = await imageRes.json();
          console.log("Add subimages response:", imageResult);

          if (!imageRes.ok) {
            setStatus("Product updated, but adding subimages failed.");
            fetchProducts();
            return;
          }
        }

        setStatus("Product updated successfully.");
      } else {
        if (!mainImage) {
          setStatus("Please select a main image.");
          return;
        }

        data.append("main_image", mainImage);
        subImages.forEach((file) => data.append("sub_images", file));

        const res = await fetch(`${API_BASE}/admin/products`, {
          method: "POST",
          body: data,
        });

        const result = await res.json();
        console.log("Create product response:", result);

        if (!res.ok) {
          setStatus("Product save failed.");
          return;
        }

        setStatus("Product added successfully.");
      }

      resetProductForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      setStatus("Product save failed.");
    }
  };

  const handleHighlightEdit = (item) => {
    setEditingHighlightId(item.id);
    setHighlightForm({
      title: item.title || "",
      subtitle: item.subtitle || "",
      sort_order: item.sort_order || 0,
      is_active: item.is_active ?? true,
    });
    setHighlightImages([]);
    setStatus("Editing Customer Love item. Image replacement is not enabled in this version.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHighlightDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/admin/review-highlights/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      console.log(result);
      if (!res.ok) {
        setStatus("Failed to delete Customer Love item.");
        return;
      }
      if (editingHighlightId === id) resetHighlightForm();
      setStatus("Customer Love item deleted successfully.");
      fetchHighlights();
    } catch (err) {
      console.error(err);
      setStatus("Failed to delete Customer Love item.");
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
        const res = await fetch(`${API_BASE}/admin/review-highlights/${editingHighlightId}`, {
          method: "PUT",
          body: data,
        });
        const result = await res.json();
        console.log("Update highlight response:", result);

        if (!res.ok) {
          setStatus("Failed to update Customer Love item.");
          return;
        }

        setStatus("Customer Love item updated successfully.");
      } else {
        if (highlightImages.length === 0) {
          setStatus("Please select at least one highlight image.");
          return;
        }

        highlightImages.forEach((file) => {
          data.append("images", file);
        });

        const res = await fetch(`${API_BASE}/admin/review-highlights`, {
          method: "POST",
          body: data,
        });

        const result = await res.json();
        console.log("Create highlight response:", result);

        if (!res.ok) {
          setStatus("Failed to add Customer Love item.");
          return;
        }

        setStatus("Customer Love item added successfully.");
      }

      resetHighlightForm();
      fetchHighlights();
    } catch (err) {
      console.error(err);
      setStatus("Failed to add Customer Love item.");
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
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 34 }}>Admin Panel</h1>
          <p style={{ marginTop: 8, color: "#8a6f6b", fontSize: 16 }}>
            Manage products and Customer Love highlights.
          </p>
        </div>

        {status && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #ead8d3",
              padding: "12px 16px",
              borderRadius: 12,
              marginBottom: 24,
              color: "#6e5955",
            }}
          >
            {status}
          </div>
        )}

        <div style={cardStyle}>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>
            {editingId ? "Edit Product" : "Product Upload"}
          </h2>
          <p style={{ color: "#8a6f6b", marginTop: 0, marginBottom: 18 }}>
            Add a new product or update an existing one.
          </p>

          <form onSubmit={handleProductSubmit} style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <input
                style={inputStyle}
                placeholder="Product Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                type="number"
                style={inputStyle}
                placeholder="Price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />

              <select
                style={inputStyle}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="new_arrivals">New Arrivals</option>
                <option value="collections">Collections</option>
              </select>

              <input
                style={inputStyle}
                placeholder="Collection"
                value={form.collection}
                onChange={(e) => setForm({ ...form, collection: e.target.value })}
              />
            </div>

            <textarea
              style={textareaStyle}
              rows={2}
              placeholder="Short Description"
              value={form.short_desc}
              onChange={(e) => setForm({ ...form, short_desc: e.target.value })}
            />

            <textarea
              style={textareaStyle}
              rows={3}
              placeholder="Intro"
              value={form.intro}
              onChange={(e) => setForm({ ...form, intro: e.target.value })}
            />

            <textarea
              style={textareaStyle}
              rows={3}
              placeholder="Fit & Style"
              value={form.fit}
              onChange={(e) => setForm({ ...form, fit: e.target.value })}
            />

            <textarea
              style={textareaStyle}
              rows={3}
              placeholder="Size Guide"
              value={form.size_guide}
              onChange={(e) => setForm({ ...form, size_guide: e.target.value })}
            />

            <textarea
              style={textareaStyle}
              rows={3}
              placeholder="Care Instructions"
              value={form.care}
              onChange={(e) => setForm({ ...form, care: e.target.value })}
            />

            <label style={{ display: "flex", gap: 10, alignItems: "center", color: "#6e5955" }}>
              <input
                type="checkbox"
                checked={form.customizable}
                onChange={(e) => setForm({ ...form, customizable: e.target.checked })}
              />
              Customizable
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                  {editingId ? "Replace Main Image" : "Main Image"}
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    editingId
                      ? setReplacementMainImage(e.target.files?.[0] || null)
                      : setMainImage(e.target.files?.[0] || null)
                  }
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                  {editingId ? "Add More Sub Images" : "Sub Images"}
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setSubImages(Array.from(e.target.files || []))}
                />
              </div>
            </div>

            {editingId && (
              <div style={{ marginTop: 8 }}>
                <div style={{ marginBottom: 10, fontWeight: 600 }}>Existing Sub Images</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {(products.find((p) => p.id === editingId)?.images || []).map((img) => (
                    <div
                      key={img.id}
                      style={{
                        border: "1px solid #ead8d3",
                        borderRadius: 12,
                        padding: 8,
                        background: "#fff",
                        width: 110,
                      }}
                    >
                      <img
                        src={`${API_BASE}${img.url}`}
                        alt="Sub"
                        style={{
                          width: "100%",
                          height: 110,
                          objectFit: "cover",
                          borderRadius: 10,
                          display: "block",
                          marginBottom: 8,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteSubImage(img.id)}
                        style={{
                          background: "#efd8d6",
                          color: "#422b23",
                          border: "none",
                          borderRadius: 8,
                          padding: "6px 10px",
                          cursor: "pointer",
                          width: "100%",
                          fontSize: 13,
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                type="submit"
                style={{
                  background: "#422b23",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 18px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                {editingId ? "Update Product" : "Add Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetProductForm}
                  style={{
                    background: "#efd8d6",
                    color: "#422b23",
                    border: "none",
                    borderRadius: 10,
                    padding: "12px 18px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div style={cardStyle}>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>
            {editingHighlightId ? "Edit Customer Love" : "Customer Love"}
          </h2>
          <p style={{ color: "#8a6f6b", marginTop: 0, marginBottom: 18 }}>
            Add one circle with multiple images, like Instagram highlights.
          </p>

          <form onSubmit={handleHighlightSubmit} style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <input
                style={inputStyle}
                placeholder="Title"
                value={highlightForm.title}
                onChange={(e) => setHighlightForm({ ...highlightForm, title: e.target.value })}
              />

              <input
                style={inputStyle}
                placeholder="Subtitle"
                value={highlightForm.subtitle}
                onChange={(e) => setHighlightForm({ ...highlightForm, subtitle: e.target.value })}
              />

              <input
                type="number"
                style={inputStyle}
                placeholder="Sort Order"
                value={highlightForm.sort_order}
                onChange={(e) => setHighlightForm({ ...highlightForm, sort_order: e.target.value })}
              />

              <label style={{ display: "flex", gap: 10, alignItems: "center", color: "#6e5955" }}>
                <input
                  type="checkbox"
                  checked={highlightForm.is_active}
                  onChange={(e) => setHighlightForm({ ...highlightForm, is_active: e.target.checked })}
                />
                Active
              </label>
            </div>

            {!editingHighlightId && (
              <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                  Highlight Images
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setHighlightImages(Array.from(e.target.files || []))}
                />
              </div>
            )}

            {editingHighlightId && (
              <div
                style={{
                  background: "#fff8f7",
                  border: "1px solid #ead8d3",
                  padding: 12,
                  borderRadius: 12,
                  color: "#6e5955",
                  fontSize: 14,
                }}
              >
                Editing title/subtitle only. To change images, delete this item and create it again.
              </div>
            )}

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                type="submit"
                style={{
                  background: "#422b23",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 18px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                {editingHighlightId ? "Update Customer Love" : "Add Customer Love"}
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
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div style={{ display: "grid", gap: 14, marginTop: 24 }}>
            {highlights.map((item) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid #f0dfdb",
                  borderRadius: 14,
                  padding: 14,
                  display: "grid",
                  gridTemplateColumns: "110px 1fr",
                  gap: 14,
                  alignItems: "start",
                }}
              >
                <div>
                  <img
                    src={item.images?.length ? `${API_BASE}${item.images[0].url}` : "/images/logo.jpeg"}
                    alt={item.title}
                    style={{
                      width: 90,
                      height: 90,
                      objectFit: "cover",
                      borderRadius: "50%",
                      display: "block",
                      marginBottom: 8,
                    }}
                  />
                  <div style={{ fontSize: 12, color: "#8a6f6b" }}>
                    {item.images?.length || 0} image(s)
                  </div>
                </div>

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

        <div style={cardStyle}>
          <h2 style={{ marginTop: 0, marginBottom: 18 }}>Products List</h2>

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

                    <button
                      onClick={() => handleProductDelete(product.id)}
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
              <div style={{ color: "#8a6f6b" }}>No products found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}