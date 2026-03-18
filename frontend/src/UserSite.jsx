import { useState, useEffect, useRef } from "react";

const WHATSAPP_NUMBER = "919912021000";



const COLORS = {
  cream: "#F9F6F1",
  blush: "#EFD8D6",
  rose: "#DBA1A2",
  deepRose: "#C07E80",
  champagne: "#D6BD9F",
  tobago: "#422B23",
  sage: "#C2C6B9",
  white: "#FFFFFF",
  darkText: "#2C1A18",
  mutedText: "#8A6F6B",
};

const API_BASE = "http://127.0.0.1:8000";

function getImageUrl(path) {
  if (!path) return "";

  // If it's already full URL → return as-is
  if (path.startsWith("http")) return path;

  // If it's fallback (frontend public images)
  if (path.startsWith("/images")) return path;

  // Otherwise it's backend (/uploads/...)
  return `${API_BASE}${path}`;
}

const fallbackProducts = [
  {
    id: 1,
    name: "Powder Pink Floral Dress",
    price: 4999,
    category: "new_arrivals",
    collection: "Bloom",
    image: "/images/look1.jpg",
    images: [
      "/images/look1.jpg",
      "/images/look1-2.png",
      "/images/look1-3.png",
    ],
    shortDesc:
      "Elegant powder pink dress with soft floral detailing and a graceful feminine silhouette.",
    intro:
      "A graceful powder pink dress designed to celebrate effortless femininity. The silhouette features a structured bodice paired with a softly flowing skirt, creating a flattering and elegant shape for every occasion. Handcrafted with delicate floral detailing, the piece reflects a blend of traditional artistry and modern design. The subtle textures and soft color palette make it perfect for both daytime elegance and evening charm.",
    fit:
      "Designed for a structured yet comfortable fit at the bust and waist, the dress flows gently into a relaxed silhouette. The balanced proportions enhance movement while maintaining a refined aesthetic.",
    sizeGuide:
      "Choose your regular size for a comfortable fit. The garment allows slight flexibility for adjustments, making it suitable for custom tailoring if needed.",
    care:
      "Dry clean recommended to preserve fabric quality and detailing. Store in a cool, dry place to maintain its shape and color.",
    sizes: ["XS", "S", "M", "L", "XL"],
    customizable: true,
  },
  {
    id: 2,
    name: "Soft Rose Top",
    price: 3299,
    category: "collections",
    collection: "Petal",
    image: "/images/look2.jpg",
    images: [
      "/images/look2.jpg",
    ],
    shortDesc:
      "A soft rose-toned top designed for understated elegance and everyday sophistication.",
    intro:
      "A refined rose-toned piece that balances simplicity with delicate femininity. Ideal for easy styling across day and evening looks.",
    fit:
      "Designed with a comfortable fit that feels polished without being restrictive.",
    sizeGuide:
      "Choose your regular size for the best fit. For a more relaxed feel, size up.",
    care: "Gentle dry clean recommended.",
    sizes: ["XS", "S", "M", "L", "XL"],
    customizable: true,
  },
  {
    id: 3,
    name: "Midnight Blue Floral Dress",
    price: 5499,
    category: "collections",
    collection: "Rose Garden",
    image: "/images/look3.jpg",
    images: [
      "/images/look3.jpg",
    ],
    shortDesc:
      "A charming floral dress in deep blue, perfect for statement styling and special outings.",
    intro:
      "A graceful deep blue floral silhouette designed for elegant outings and statement dressing. It combines floral artistry with a timeless feminine shape.",
    fit:
      "Designed for a flattering fit with soft structure and fluid movement.",
    sizeGuide:
      "Choose your regular size for a comfortable fit. Tailoring can refine the final silhouette if needed.",
    care: "Dry clean recommended to maintain color and finish.",
    sizes: ["XS", "S", "M", "L", "XL"],
    customizable: true,
  },
];

function openWhatsApp(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;
  window.open(url, "_blank");
}

const flowerSVG = (x, y, size, color, opacity = 0.6) => `
  <g transform="translate(${x},${y})" opacity="${opacity}">
    ${[0, 60, 120, 180, 240, 300]
      .map(
        (a) => `
      <ellipse cx="${Math.cos((a * Math.PI) / 180) * size * 0.8}" cy="${
          Math.sin((a * Math.PI) / 180) * size * 0.8
        }"
        rx="${size * 0.5}" ry="${size * 0.3}" transform="rotate(${a})" fill="${color}" />
    `
      )
      .join("")}
    <circle r="${size * 0.35}" fill="${color}" opacity="0.9"/>
  </g>
`;

function FloralBg() {
  return (
    <svg
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.18,
      }}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id="soft">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>
      <g filter="url(#soft)">
        {flowerSVG(80, 120, 36, COLORS.rose)}
        {flowerSVG(200, 50, 22, COLORS.champagne)}
        {flowerSVG(380, 180, 28, COLORS.blush)}
        {flowerSVG(1200, 80, 42, COLORS.rose)}
        {flowerSVG(1350, 200, 26, COLORS.champagne)}
        {flowerSVG(1100, 300, 18, COLORS.blush)}
        {flowerSVG(60, 600, 32, COLORS.champagne)}
        {flowerSVG(150, 750, 20, COLORS.rose)}
        {flowerSVG(1380, 700, 38, COLORS.blush)}
        {flowerSVG(700, 30, 16, COLORS.rose)}
        {flowerSVG(900, 860, 24, COLORS.champagne)}
        {flowerSVG(500, 820, 30, COLORS.rose)}
      </g>
    </svg>
  );
}

function Nav({ activeSection, setActiveSection, mobileOpen, setMobileOpen }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled
          ? "rgba(249,246,241,0.97)"
          : "rgba(249,246,241,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${COLORS.blush}`,
        transition: "background 0.3s",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/images/logo.jpeg"
            alt="MOH by Amiksha logo"
            style={{
              height: 42,
              width: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>

        <div
          style={{ display: "flex", gap: 8, alignItems: "center" }}
          className="nav-links"
        >
          {[
            ["home", "Home"],
            ["shop", "Shop"],
            ["collections", "Collections"],
            ["customize", "Customize"],
            ["about", "About"],
          ].map(([k, v]) => (
            <button
              key={k}
              onClick={() => setActiveSection(k)}
              style={{
                background: activeSection === k ? COLORS.rose : "transparent",
                color: activeSection === k ? COLORS.white : COLORS.tobago,
                border: "none",
                borderRadius: 40,
                padding: "8px 20px",
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 15,
                letterSpacing: "0.05em",
                cursor: "pointer",
                transition: "all 0.2s",
                fontWeight: 500,
              }}
            >
              {v}
            </button>
          ))}

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#25D366",
              color: COLORS.white,
              borderRadius: 40,
              padding: "8px 18px",
              textDecoration: "none",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 14,
              fontWeight: 600,
              marginLeft: 8,
            }}
          >
            WhatsApp
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: "none",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
          className="burger"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke={COLORS.tobago}
            strokeWidth="2"
          >
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div
          style={{
            background: COLORS.cream,
            padding: 20,
            borderTop: `1px solid ${COLORS.blush}`,
          }}
        >
          {[
            ["home", "Home"],
            ["shop", "Shop"],
            ["collections", "Collections"],
            ["customize", "Customize"],
            ["about", "About"],
          ].map(([k, v]) => (
            <button
              key={k}
              onClick={() => {
                setActiveSection(k);
                setMobileOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background: "transparent",
                border: "none",
                padding: "12px 0",
                color: COLORS.tobago,
                fontSize: 16,
                fontFamily: "'Cormorant Garamond',Georgia,serif",
                cursor: "pointer",
                borderBottom: `1px solid ${COLORS.blush}`,
              }}
            >
              {v}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

function ProductHero({ products }) {
const newArrivalProducts = [...products]
  .filter((p) => p.category === "new_arrivals")
  .reverse()
  .slice(0, 3);

  const heroItems =
    newArrivalProducts.length > 0
      ? newArrivalProducts.map((p) => ({
          image: p.image,
          name: p.name,
        }))
      : [
          { image: "/images/look1.jpg", name: "MOH Look 1" },
          { image: "/images/look2.jpg", name: "MOH Look 2" },
          { image: "/images/look3.jpg", name: "MOH Look 3" },
        ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [products]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroItems.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [heroItems.length]);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          aspectRatio: "3/4",
          borderRadius: "50% 50% 45% 45% / 40% 40% 60% 60%",
          overflow: "hidden",
          boxShadow: `0 24px 80px rgba(219,161,162,0.35)`,
          background: `linear-gradient(135deg, ${COLORS.blush} 0%, ${COLORS.rose} 50%, ${COLORS.champagne} 100%)`,
          position: "relative",
        }}
      >
        {heroItems.map((item, index) => (
          <img
            key={`${item.name}-${index}`}
            src={getImageUrl(item.image)}
            alt={item.name}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: currentIndex === index ? 1 : 0,
              transition: "opacity 0.9s ease-in-out",
            }}
          />
        ))}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(66,43,35,0.28), rgba(66,43,35,0.05))",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: 34,
            left: 0,
            right: 0,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 28,
              fontWeight: 700,
              color: COLORS.white,
              letterSpacing: "0.1em",
            }}
          >
            MOH
          </div>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 13,
              color: "rgba(255,255,255,0.9)",
              letterSpacing: "0.2em",
            }}
          >
            BY AMIKSHA
          </div>
        </div>
      </div>

      {[
        { top: "8%", right: "-5%", size: 80, color: COLORS.blush },
        { bottom: "15%", left: "-8%", size: 60, color: COLORS.champagne },
        { top: "45%", right: "-10%", size: 50, color: COLORS.rose },
      ].map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...s,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: s.color,
            opacity: 0.6,
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          bottom: -28,
          display: "flex",
          gap: 8,
          justifyContent: "center",
          width: "100%",
        }}
      >
        {heroItems.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              width: currentIndex === index ? 22 : 10,
              height: 10,
              borderRadius: 999,
              background: currentIndex === index ? COLORS.deepRose : COLORS.blush,
              transition: "all 0.25s ease",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function HeroSection({ setActiveSection, products }) {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        paddingTop: 72,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "80px 24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 60,
          alignItems: "center",
          width: "100%",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: COLORS.blush,
              borderRadius: 40,
              padding: "6px 18px",
              marginBottom: 24,
            }}
          >
            <span
              style={{
                fontFamily: "'Cormorant Garamond',Georgia,serif",
                fontSize: 13,
                color: COLORS.deepRose,
                letterSpacing: "0.1em",
              }}
            >
              NEW COLLECTION 2025
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(42px, 6vw, 76px)",
              fontWeight: 700,
              color: COLORS.tobago,
              lineHeight: 1.1,
              marginBottom: 24,
            }}
          >
            Wear Your
            <br />
            <em style={{ color: COLORS.deepRose, fontStyle: "italic" }}>Story</em>
          </h1>

          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 19,
              color: COLORS.mutedText,
              lineHeight: 1.8,
              marginBottom: 40,
              maxWidth: 440,
            }}
          >
            Handcrafted women's fashion from the heart of India. Each piece is a
            canvas of femininity — made to order, made for you.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button
              onClick={() => setActiveSection("shop")}
              style={{
                background: COLORS.tobago,
                color: COLORS.cream,
                border: "none",
                borderRadius: 40,
                padding: "14px 36px",
                fontSize: 16,
                cursor: "pointer",
                fontFamily: "'Cormorant Garamond',Georgia,serif",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              Explore Collection
            </button>

            <button
              onClick={() => setActiveSection("customize")}
              style={{
                background: "transparent",
                color: COLORS.tobago,
                border: `2px solid ${COLORS.rose}`,
                borderRadius: 40,
                padding: "14px 36px",
                fontSize: 16,
                cursor: "pointer",
                fontFamily: "'Cormorant Garamond',Georgia,serif",
                fontWeight: 600,
              }}
            >
              Customize Yours
            </button>
          </div>

          <div style={{ display: "flex", gap: 32, marginTop: 48 }}>
            {[["200+", "Happy Customers"], ["100%", "Handcrafted"], ["Made", "to Order"]].map(
              ([n, l]) => (
                <div key={l}>
                  <div
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      fontSize: 22,
                      fontWeight: 700,
                      color: COLORS.tobago,
                    }}
                  >
                    {n}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: 13,
                      color: COLORS.mutedText,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {l}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ProductHero products={products} />
        </div>
      </div>
    </section>
  );
}

function ProductCard({ p, onWhatsapp, onViewProduct }) {
  const [hovered, setHovered] = useState(false);
  const colors = [COLORS.blush, COLORS.champagne, "#E8D5C4", "#F5E6E8", COLORS.sage];
  const bg = colors[p.id % colors.length];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onViewProduct && onViewProduct(p)}
      style={{
        background: COLORS.white,
        borderRadius: 20,
        overflow: "hidden",
        border: `1px solid ${COLORS.blush}`,
        transition: "transform 0.3s, box-shadow 0.3s",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered
          ? `0 20px 50px rgba(219,161,162,0.22)`
          : "0 4px 16px rgba(0,0,0,0.05)",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          height: 360,
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img src={getImageUrl(p.image)}
          alt={p.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
        {p.category === "new_arrivals" && (
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              background: COLORS.rose,
              color: COLORS.white,
              borderRadius: 20,
              padding: "4px 12px",
              fontSize: 11,
              fontFamily: "'Cormorant Garamond',serif",
              letterSpacing: "0.1em",
            }}
          >
            NEW
          </div>
        )}
        {p.customizable && (
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: COLORS.champagne,
              color: COLORS.tobago,
              borderRadius: 20,
              padding: "4px 12px",
              fontSize: 11,
              fontFamily: "'Cormorant Garamond',serif",
              letterSpacing: "0.08em",
            }}
          >
            ✦ Custom
          </div>
        )}
      </div>

      <div style={{ padding: "20px 20px 22px" }}>
        <div
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 12,
            color: COLORS.mutedText,
            letterSpacing: "0.12em",
            marginBottom: 4,
          }}
        >
          {p.collection.toUpperCase()}
        </div>

        <div
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 18,
            fontWeight: 600,
            color: COLORS.tobago,
            marginBottom: 6,
          }}
        >
          {p.name}
        </div>

        <div
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 14,
            color: COLORS.mutedText,
            marginBottom: 14,
            lineHeight: 1.5,
          }}
        >
          {p.shortDesc}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 17,
              fontWeight: 700,
              color: COLORS.tobago,
            }}
          >
            ₹{p.price.toLocaleString()}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onWhatsapp(p);
            }}
            style={{
              background: "#25D366",
              color: COLORS.white,
              border: "none",
              borderRadius: 40,
              padding: "8px 18px",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "'Cormorant Garamond',serif",
              fontWeight: 600,
            }}
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
}

function ShopSection({ products, onViewProduct }) {
  const [filter, setFilter] = useState("all");
  const SITE_URL = API_BASE;

  const filtered =
    filter === "all"
      ? products
      : filter === "new_arrivals"
      ? products.filter((p) => p.category === "new_arrivals")
      : products.filter((p) => p.category === "collections");

  const handleWhatsapp = (p) => {
    openWhatsApp(
      `Hi! I'm interested in:

Product: ${p.name}
Price: ₹${p.price.toLocaleString()}
Image: ${getImageUrl(p.image)}

Please share more details.`
    );
  };

  return (
    <section style={{ padding: "100px 0 80px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 13,
              color: COLORS.rose,
              letterSpacing: "0.2em",
              marginBottom: 10,
            }}
          >
            WOMEN'S COLLECTION
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(32px,4vw,52px)",
              fontWeight: 700,
              color: COLORS.tobago,
              marginBottom: 16,
            }}
          >
            Women&apos;s Edit
          </h2>
          <p
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 18,
              color: COLORS.mutedText,
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            Discover handcrafted women&apos;s wear in soft floral tones —
            designed for elegance, comfort, and customization.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            marginBottom: 50,
            flexWrap: "wrap",
          }}
        >
          {[["all", "ALL"], ["new_arrivals", "New Arrivals"], ["collections", "Collections"]].map(
            ([k, v]) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                style={{
                  background: filter === k ? COLORS.tobago : COLORS.white,
                  color: filter === k ? COLORS.cream : COLORS.tobago,
                  border: `1.5px solid ${
                    filter === k ? COLORS.tobago : COLORS.blush
                  }`,
                  borderRadius: 40,
                  padding: "10px 28px",
                  fontSize: 15,
                  cursor: "pointer",
                  fontFamily: "'Cormorant Garamond',serif",
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                }}
              >
                {v}
              </button>
            )
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 28,
          }}
        >
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              p={p}
              onWhatsapp={handleWhatsapp}
              onViewProduct={onViewProduct}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CollectionsSection({ products }) {
  const collections = [
    {
      name: "Bloom",
      desc: "Soft femininity in every petal. Pastel florals celebrating womanhood.",
      count: products.filter((p) => p.collection === "Bloom").length,
      color: COLORS.blush,
    },
    {
      name: "Petal",
      desc: "Lightweight fabrics with hand-blocked prints for the free spirit.",
      count: products.filter((p) => p.collection === "Petal").length,
      color: COLORS.champagne,
    },
    {
      name: "Rose Garden",
      desc: "Rich embroidery and timeless silhouettes for special occasions.",
      count: products.filter((p) => p.collection === "Rose Garden").length,
      color: COLORS.rose,
    },
  ];

  return (
    <section
      style={{
        padding: "100px 0",
        background: `linear-gradient(180deg, transparent 0%, rgba(239,216,214,0.2) 100%)`,
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 13,
              color: COLORS.rose,
              letterSpacing: "0.2em",
              marginBottom: 10,
            }}
          >
            CURATED FOR YOU
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(32px,4vw,52px)",
              fontWeight: 700,
              color: COLORS.tobago,
            }}
          >
            Our Collections
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: 28,
          }}
        >
          {collections.map((col) => (
            <div
              key={col.name}
              style={{
                background: col.color,
                borderRadius: 24,
                padding: 40,
                position: "relative",
                overflow: "hidden",
                minHeight: 280,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 13,
                  color: COLORS.tobago,
                  letterSpacing: "0.15em",
                  opacity: 0.7,
                  marginBottom: 8,
                }}
              >
                {col.count} PIECES
              </div>
              <h3
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 32,
                  fontWeight: 700,
                  color: COLORS.tobago,
                  marginBottom: 12,
                }}
              >
                {col.name}
              </h3>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 16,
                  color: COLORS.tobago,
                  opacity: 0.8,
                  lineHeight: 1.6,
                  marginBottom: 24,
                }}
              >
                {col.desc}
              </p>

              <button
                onClick={() =>
                  openWhatsApp(
                    `Hi! I'd love to know more about the ${col.name} collection. Please share available designs and details.`
                  )
                }
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: COLORS.tobago,
                  color: COLORS.cream,
                  borderRadius: 40,
                  padding: "10px 24px",
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 14,
                  fontWeight: 600,
                  width: "fit-content",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Enquire on WhatsApp
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CustomizeSection({ products }) {
  const [form, setForm] = useState({
    piece: "",
    size: "",
    color: "",
    fabric: "",
    notes: "",
    name: "",
  });

  const customizableItems = (products || []).filter((p) => p.customizable);

  const handleWhatsapp = () => {
    if (!form.piece || !form.size || !form.name) return;

    openWhatsApp(
      `Hi! I'd like to place a custom order:

Name: ${form.name}
Piece: ${form.piece}
Size: ${form.size}
Color preference: ${form.color || "Open to suggestions"}
Fabric preference: ${form.fabric || "Open to suggestions"}
Notes: ${form.notes || "None"}

Please let me know the pricing and timeline.`
    );
  };

  return (
    <section style={{ padding: "100px 0", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 13,
              color: COLORS.rose,
              letterSpacing: "0.2em",
              marginBottom: 10,
            }}
          >
            MADE JUST FOR YOU
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(32px,4vw,52px)",
              fontWeight: 700,
              color: COLORS.tobago,
              marginBottom: 16,
            }}
          >
            Customize Your Piece
          </h2>
          <p
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 18,
              color: COLORS.mutedText,
              maxWidth: 500,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Every body is unique. Tell us your vision and we&apos;ll craft it with
            care — your size, your color, your story.
          </p>
        </div>

        <div
          style={{
            background: COLORS.white,
            borderRadius: 28,
            padding: "48px",
            border: `1px solid ${COLORS.blush}`,
            boxShadow: `0 8px 40px rgba(219,161,162,0.12)`,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {[
              { label: "Your Name *", key: "name", type: "text", placeholder: "Zara Ahmed" },
              {
                label: "Which piece? *",
                key: "piece",
                type: "select",
                options: customizableItems.map((p) => p.name),
              },
              {
                label: "Your Size *",
                key: "size",
                type: "select",
                options: ["XS", "S", "M", "L", "XL", "XXL", "Custom Measurements"],
              },
              {
                label: "Color Preference",
                key: "color",
                type: "text",
                placeholder: "Blush pink, ivory, sage...",
              },
              {
                label: "Fabric Preference",
                key: "fabric",
                type: "select",
                options: ["No preference", "Cotton", "Silk", "Chiffon", "Georgette", "Linen"],
              },
            ].map((field) => (
              <div key={field.key}>
                <label
                  style={{
                    display: "block",
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: 14,
                    color: COLORS.mutedText,
                    letterSpacing: "0.08em",
                    marginBottom: 8,
                  }}
                >
                  {field.label}
                </label>

                {field.type === "select" ? (
                  <select
                    value={form[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: 12,
                      border: `1.5px solid ${COLORS.blush}`,
                      background: COLORS.cream,
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: 16,
                      color: COLORS.tobago,
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option value="">Select...</option>
                    {field.options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={form[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: 12,
                      border: `1.5px solid ${COLORS.blush}`,
                      background: COLORS.cream,
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: 16,
                      color: COLORS.tobago,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                )}
              </div>
            ))}

            <div style={{ gridColumn: "1/-1" }}>
              <label
                style={{
                  display: "block",
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 14,
                  color: COLORS.mutedText,
                  letterSpacing: "0.08em",
                  marginBottom: 8,
                }}
              >
                Additional Notes
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Any special requests, occasions, measurements details..."
                rows={4}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: `1.5px solid ${COLORS.blush}`,
                  background: COLORS.cream,
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 16,
                  color: COLORS.tobago,
                  outline: "none",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: 32, textAlign: "center" }}>
            <button
              onClick={handleWhatsapp}
              style={{
                background: "#25D366",
                color: COLORS.white,
                border: "none",
                borderRadius: 40,
                padding: "16px 48px",
                fontSize: 17,
                cursor: "pointer",
                fontFamily: "'Playfair Display',serif",
                fontWeight: 600,
                boxShadow: "0 4px 20px rgba(37,211,102,0.25)",
              }}
            >
              Send Custom Order on WhatsApp
            </button>
            <p
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 14,
                color: COLORS.mutedText,
                marginTop: 14,
              }}
            >
              We&apos;ll reply within 24 hours with pricing &amp; timeline ✨
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section style={{ padding: "100px 0 80px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: "100%",
                maxWidth: 420,
                aspectRatio: "1",
                borderRadius: "60% 40% 60% 40% / 40% 60% 40% 60%",
                background: `linear-gradient(135deg, ${COLORS.champagne} 0%, ${COLORS.rose} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -20,
                right: 0,
                background: COLORS.white,
                borderRadius: 20,
                padding: "20px 28px",
                border: `1px solid ${COLORS.blush}`,
                boxShadow: `0 8px 30px rgba(219,161,162,0.15)`,
              }}
            >
              <div
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 28,
                  fontWeight: 700,
                  color: COLORS.tobago,
                }}
              >
                2020
              </div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 14,
                  color: COLORS.mutedText,
                }}
              >
                Founded with love
              </div>
            </div>
          </div>

          <div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 13,
                color: COLORS.rose,
                letterSpacing: "0.2em",
                marginBottom: 12,
              }}
            >
              OUR STORY
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "clamp(28px,3vw,44px)",
                fontWeight: 700,
                color: COLORS.tobago,
                marginBottom: 24,
                lineHeight: 1.2,
              }}
            >
              Crafted by Amiksha,
              <br />
              <em style={{ color: COLORS.deepRose, fontStyle: "italic" }}>for you</em>
            </h2>
            <p
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 18,
                color: COLORS.mutedText,
                lineHeight: 1.8,
                marginBottom: 20,
              }}
            >
              MOH by Amiksha began as a love letter to Indian femininity — a desire
              to create clothing that makes every woman feel beautiful, seen, and
              celebrated.
            </p>
            <p
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 18,
                color: COLORS.mutedText,
                lineHeight: 1.8,
                marginBottom: 36,
              }}
            >
              Every piece is handcrafted to order, which means no rushing, no
              compromises — just your perfect fit, made with patience and passion.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductDetailView({ product, products, onBack }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "S");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product.images?.[0] || product.image);

  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

  const handleWhatsAppOrder = () => {
    openWhatsApp(
      `Hi! I'm interested in this product:

Product: ${product.name}
Collection: ${product.collection}
Price: ₹${product.price.toLocaleString()}
Size: ${selectedSize}
Quantity: ${quantity}
Image: http://localhost:5173${mainImage}

Please share more details.`
    );
  };

  return (
    <section style={{ padding: "120px 0 80px", minHeight: "100vh", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <button
          onClick={onBack}
          style={{
            marginBottom: 28,
            background: "transparent",
            border: "none",
            color: COLORS.tobago,
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 20,
            cursor: "pointer",
          }}
        >
          ← Back to Shop
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 44,
            alignItems: "start",
          }}
        >
          <div>
            <div
              style={{
                borderRadius: 14,
                overflow: "hidden",
                background: COLORS.white,
                marginBottom: 18,
              }}
            >
              <img src={getImageUrl(mainImage)} 
                alt={product.name}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  objectFit: "cover",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 18,
              }}
            >
              {(product.images || [product.image]).map((img, index) => (
                <div
                  key={index}
                  onClick={() => setMainImage(img)}
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    cursor: "pointer",
                    border:
                      mainImage === img
                        ? `2px solid ${COLORS.deepRose}`
                        : "1px solid #e6d8d5",
                    background: COLORS.white,
                  }}
                >
                  <img src={getImageUrl(img)}
                    alt={`${product.name} ${index + 1}`}
                    style={{
                      width: "100%",
                      height: 220,
                      display: "block",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 18,
                color: COLORS.mutedText,
                marginBottom: 10,
              }}
            >
              ({product.collection})
            </div>

            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(38px, 4.5vw, 62px)",
                fontWeight: 500,
                color: COLORS.tobago,
                marginBottom: 16,
                lineHeight: 1.05,
              }}
            >
              {product.name}
            </h1>

            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 34,
                color: COLORS.tobago,
                marginBottom: 10,
              }}
            >
              Rs. {product.price.toLocaleString()}.00
            </div>

            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 16,
                color: COLORS.mutedText,
                marginBottom: 26,
              }}
            >
              Shipping calculated on WhatsApp. Handcrafted on order.
            </div>

            <div style={{ marginBottom: 28 }}>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 16,
                  color: COLORS.mutedText,
                  marginBottom: 12,
                }}
              >
                Size
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      minWidth: 56,
                      height: 42,
                      padding: "0 18px",
                      borderRadius: 30,
                      border: `1px solid ${
                        selectedSize === size ? COLORS.tobago : "#b9aaa6"
                      }`,
                      background:
                        selectedSize === size ? COLORS.tobago : "transparent",
                      color:
                        selectedSize === size ? COLORS.white : COLORS.tobago,
                      cursor: "pointer",
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 18,
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 16,
                  color: COLORS.mutedText,
                  marginBottom: 12,
                }}
              >
                Quantity
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  border: "1px solid #b9aaa6",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{
                    width: 48,
                    height: 46,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: 22,
                    color: COLORS.tobago,
                  }}
                >
                  −
                </button>
                <div
                  style={{
                    width: 48,
                    textAlign: "center",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 22,
                    color: COLORS.tobago,
                  }}
                >
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{
                    width: 48,
                    height: 46,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: 22,
                    color: COLORS.tobago,
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleWhatsAppOrder}
              style={{
                width: "100%",
                background: COLORS.champagne,
                color: COLORS.tobago,
                border: "none",
                borderRadius: 12,
                padding: "18px 24px",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 24,
                cursor: "pointer",
                marginBottom: 36,
                boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
              }}
            >
              Order on WhatsApp
            </button>

            <div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 20,
                  letterSpacing: "0.06em",
                  color: COLORS.tobago,
                  marginBottom: 14,
                }}
              >
                PRODUCT DESCRIPTION:
              </div>

              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 18,
                  lineHeight: 1.9,
                  color: COLORS.mutedText,
                  marginBottom: 24,
                }}
              >
                {product.intro}
              </p>

              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 16,
                  letterSpacing: "0.08em",
                  marginBottom: 8,
                  color: COLORS.tobago,
                }}
              >
                FIT & STYLE
              </h3>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 17,
                  lineHeight: 1.8,
                  color: COLORS.mutedText,
                  marginBottom: 20,
                }}
              >
                {product.fit}
              </p>

              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 16,
                  letterSpacing: "0.08em",
                  marginBottom: 8,
                  color: COLORS.tobago,
                }}
              >
                SIZE & FIT GUIDE
              </h3>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 17,
                  lineHeight: 1.8,
                  color: COLORS.mutedText,
                  marginBottom: 20,
                }}
              >
                {product.sizeGuide}
              </p>

              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 16,
                  letterSpacing: "0.08em",
                  marginBottom: 8,
                  color: COLORS.tobago,
                }}
              >
                CARE INSTRUCTIONS
              </h3>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 17,
                  lineHeight: 1.8,
                  color: COLORS.mutedText,
                }}
              >
                {product.care}
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 80 }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 28,
              color: COLORS.tobago,
              marginBottom: 28,
            }}
          >
            You may also like
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 22,
            }}
          >
            {relatedProducts.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onBack();
                  setTimeout(() => {
                    const event = new CustomEvent("openProduct", {
                      detail: item,
                    });
                    window.dispatchEvent(event);
                  }, 0);
                }}
                style={{ cursor: "pointer" }}
              >
                <div
                  style={{
                    borderRadius: 10,
                    overflow: "hidden",
                    marginBottom: 14,
                    background: COLORS.white,
                  }}
                >
                  <img src={getImageUrl(item.image)}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: 300,
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>

                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 18,
                    color: COLORS.tobago,
                    marginBottom: 8,
                  }}
                >
                  {item.name}
                </div>

                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 16,
                    color: COLORS.tobago,
                  }}
                >
                  Rs. {item.price.toLocaleString()}.00
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      style={{
        background: COLORS.tobago,
        color: COLORS.cream,
        padding: "60px 0 30px",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 48,
          }}
        >
          <div>
            <img
              src="/images/logo.jpeg"
              alt="MOH by Amiksha logo"
              style={{
                height: 60,
                width: "auto",
                objectFit: "contain",
                display: "block",
                background: "#ffffff",
                padding: "10px 14px",
                borderRadius: 14,
                marginBottom: 20,
              }}
            />
            <p
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 16,
                opacity: 0.7,
                lineHeight: 1.8,
                maxWidth: 260,
              }}
            >
              Handcrafted women's fashion celebrating femininity, crafted to
              order with love.
            </p>
          </div>

          {[
            ["Shop", ["All Pieces", "New Arrivals", "Collections", "Customize"]],
            ["Info", ["About Us", "Instagram", "WhatsApp Us", "Care Guide"]],
            ["Policy", ["Shipping", "Returns", "Privacy", "Terms"]],
          ].map(([h, items]) => (
            <div key={h}>
              <h4
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 14,
                  letterSpacing: "0.15em",
                  opacity: 0.6,
                  marginBottom: 20,
                }}
              >
                {h.toUpperCase()}
              </h4>
              {items.map((i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: 15,
                    opacity: 0.7,
                    marginBottom: 10,
                    cursor: "pointer",
                  }}
                >
                  {i}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: `1px solid rgba(239,216,214,0.2)`,
            paddingTop: 28,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 14,
              opacity: 0.5,
            }}
          >
            © 2025 MOH by Amiksha. All rights reserved.
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#25D366",
              color: COLORS.white,
              borderRadius: 40,
              padding: "10px 22px",
              textDecoration: "none",
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Chat with us
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function UserSite() {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState(fallbackProducts);
  const sectionRef = useRef(null);

useEffect(() => {
  fetch("http://127.0.0.1:8000/products")
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
      }
    })
    .catch((err) => {
      console.error("Failed to fetch products:", err);
    });
}, []);

  useEffect(() => {
    if (activeSection !== "home" && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeSection]);

  return (
    <div
      style={{
        background: COLORS.cream,
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${COLORS.cream}; }
        @media(max-width:768px) {
          .nav-links { display: none !important; }
          .burger { display: block !important; }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to { opacity:1; transform:translateY(0); }
        }
        section { animation: fadeUp 0.6s ease both; }
      `}</style>

      <FloralBg />
      <Nav
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div ref={sectionRef}>
{activeSection === "home" && (
  <HeroSection
    setActiveSection={setActiveSection}
    products={products}
  />
)}
{activeSection === "shop" && !selectedProduct && (
  <ShopSection products={products} onViewProduct={setSelectedProduct} />
)}
{selectedProduct && (
  <ProductDetailView
    product={selectedProduct}
    products={products}
    onBack={() => setSelectedProduct(null)}
  />
)}
        {activeSection === "collections" && <CollectionsSection products={products} />}
        {activeSection === "customize" && <CustomizeSection products={products} />}
        {activeSection === "about" && <AboutSection />}
      </div>

      <Footer />

      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noreferrer"
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 200,
          background: "#25D366",
          color: COLORS.white,
          width: 58,
          height: 58,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(37,211,102,0.4)",
          textDecoration: "none",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        title="Chat on WhatsApp"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}