import { useState } from "react";

const API = "http://localhost:5000/api";

function inp(extra = {}) {
  return {
    width: "100%", padding: "12px 16px", borderRadius: 10,
    border: "1.5px solid #e2e8f0", background: "#fff",
    color: "#1e293b", fontSize: 14, outline: "none",
    fontFamily: "inherit", transition: "border-color 0.2s", ...extra,
  };
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background: "#fff", borderRadius: 18, padding: "22px 20px", boxShadow: "0 2px 20px rgba(0,0,0,0.08)", border: "1px solid #e8edf4", marginBottom: 18, ...style }}>
      {children}
    </div>
  );
}

function Badge({ text, color }) {
  return <span style={{ background: `${color}18`, color, border: `1px solid ${color}40`, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>{text}</span>;
}

// ── AUTH PAGE ──────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!form.email || !form.password) { setError("Please fill all fields."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); setLoading(false); return; }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch { setError("Cannot connect to server. Make sure backend is running on port 5000."); }
    setLoading(false);
  }

  async function handleSignup() {
    if (!form.name || !form.email || !form.password || !form.confirm) { setError("Please fill all fields."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); setLoading(false); return; }
      setSuccess("Account created! Please login."); setTab("login");
      setForm(f => ({ ...f, password: "", confirm: "" }));
    } catch { setError("Cannot connect to server. Make sure backend is running on port 5000."); }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#1e3a8a,#1e293b,#312e81)", display: "flex", flexDirection: "column", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap'); *{box-sizing:border-box} input:focus{border-color:#2563eb!important;box-shadow:0 0 0 3px rgba(37,99,235,0.15)}`}</style>

      {/* Navbar */}
      <div style={{ padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✈️</div>
          <span style={{ fontWeight: 800, fontSize: 16, color: "#fff" }}>AI Trip Planner</span>
        </div>
        <span style={{ fontSize: 11, background: "rgba(255,255,255,0.1)", color: "#94a3b8", padding: "4px 12px", borderRadius: 20, fontWeight: 700 }}>College Project</span>
      </div>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "24px 24px 16px" }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>🌍</div>
        <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 800, color: "#fff" }}>Plan Trips with AI</h1>
        <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>Itineraries · Maps · Weather · Hotels · Cost Estimation</p>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 12 }}>
          {["✈️ AI Itinerary", "🌤️ Weather", "🗺️ Maps", "🏨 Hotels", "💰 Cost"].map(f => (
            <span key={f} style={{ background: "rgba(255,255,255,0.1)", color: "#e2e8f0", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.15)" }}>{f}</span>
          ))}
        </div>
      </div>

      {/* Card */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "0 16px 40px" }}>
        <div style={{ background: "#fff", borderRadius: 24, padding: "28px 24px", width: "100%", maxWidth: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", height: "fit-content" }}>
          <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 12, padding: 4, marginBottom: 24 }}>
            {["login", "signup"].map(t => (
              <button key={t} onClick={() => { setTab(t); setError(""); setSuccess(""); }}
                style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit", background: tab === t ? "#2563eb" : "none", color: tab === t ? "#fff" : "#64748b", transition: "all 0.2s" }}>
                {t === "login" ? "🔑 Login" : "📝 Sign Up"}
              </button>
            ))}
          </div>

          {success && <div style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 10, padding: "10px 14px", color: "#166534", fontWeight: 600, fontSize: 13, marginBottom: 14 }}>✅ {success}</div>}
          {error && <div style={{ background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 10, padding: "10px 14px", color: "#dc2626", fontWeight: 600, fontSize: 13, marginBottom: 14 }}>⚠️ {error}</div>}

          {tab === "login" ? (
            <>
              <h2 style={{ margin: "0 0 20px", fontWeight: 800, color: "#1e293b", fontSize: 20 }}>Welcome Back 👋</h2>
              {[["EMAIL","email","you@email.com","email"],["PASSWORD","password","••••••••","password"]].map(([label,key,ph,type]) => (
                <div key={key} style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, letterSpacing: "0.04em" }}>{label}</label>
                  <input type={type} placeholder={ph} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    onKeyDown={e => e.key === "Enter" && handleLogin()} style={inp()} />
                </div>
              ))}
              <button onClick={handleLogin} disabled={loading}
                style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#2563eb,#7c3aed)", color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit", marginTop: 4, opacity: loading ? 0.7 : 1 }}>
                {loading ? "Logging in…" : "Login →"}
              </button>
              <p style={{ textAlign: "center", fontSize: 13, color: "#64748b", marginTop: 16, marginBottom: 0 }}>
                No account? <button onClick={() => setTab("signup")} style={{ background: "none", border: "none", color: "#2563eb", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>Sign Up</button>
              </p>
            </>
          ) : (
            <>
              <h2 style={{ margin: "0 0 20px", fontWeight: 800, color: "#1e293b", fontSize: 20 }}>Create Account 🚀</h2>
              {[["FULL NAME","name","Your name","text"],["EMAIL","email","you@email.com","email"],["PASSWORD","password","••••••••","password"],["CONFIRM PASSWORD","confirm","••••••••","password"]].map(([label,key,ph,type]) => (
                <div key={key} style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, letterSpacing: "0.04em" }}>{label}</label>
                  <input type={type} placeholder={ph} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    onKeyDown={e => e.key === "Enter" && handleSignup()} style={inp()} />
                </div>
              ))}
              <button onClick={handleSignup} disabled={loading}
                style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#059669,#0891b2)", color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit", marginTop: 4, opacity: loading ? 0.7 : 1 }}>
                {loading ? "Creating…" : "Create Account →"}
              </button>
              <p style={{ textAlign: "center", fontSize: 13, color: "#64748b", marginTop: 16, marginBottom: 0 }}>
                Already registered? <button onClick={() => setTab("login")} style={{ background: "none", border: "none", color: "#2563eb", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>Login</button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── NAVBAR ─────────────────────────────────────────────────────────────────────
function Navbar({ user, activePage, setPage, onLogout }) {
  const menus = [
    { id: "home", label: "🏠 Home" },
    { id: "planner", label: "✈️ Plan Trip" },
    { id: "weather", label: "🌤️ Weather" },
    { id: "map", label: "🗺️ Map" },
    { id: "hotels", label: "🏨 Hotels" },
    { id: "about", label: "ℹ️ About" },
  ];
  return (
    <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>✈️</div>
          <span style={{ fontWeight: 800, fontSize: 14, color: "#1e293b" }}>AI Trip Planner</span>
        </div>
        <div style={{ display: "flex", gap: 2, alignItems: "center", overflowX: "auto" }}>
          {menus.map(m => (
            <button key={m.id} onClick={() => setPage(m.id)}
              style={{ padding: "7px 10px", borderRadius: 9, border: "none", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit", background: activePage === m.id ? "#eff6ff" : "none", color: activePage === m.id ? "#2563eb" : "#64748b", whiteSpace: "nowrap" }}>
              {m.label}
            </button>
          ))}
          <div style={{ width: 1, height: 22, background: "#e2e8f0", margin: "0 6px" }} />
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 12, flexShrink: 0 }}>
            {user.name[0].toUpperCase()}
          </div>
          <button onClick={onLogout} style={{ padding: "6px 10px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer", color: "#64748b", fontFamily: "inherit", whiteSpace: "nowrap" }}>Logout</button>
        </div>
      </div>
    </div>
  );
}

// ── HOME PAGE ──────────────────────────────────────────────────────────────────
function HomePage({ user, setPage }) {
  return (
    <div>
      <div style={{ background: "linear-gradient(135deg,#1e3a8a,#1e293b,#312e81)", padding: "48px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>🌍</div>
        <h1 style={{ margin: "0 0 10px", fontSize: 28, fontWeight: 800, color: "#fff" }}>Welcome, {user.name}! 👋</h1>
        <p style={{ color: "#94a3b8", fontSize: 14, maxWidth: 440, margin: "0 auto 24px", lineHeight: 1.6 }}>Your AI travel companion. Plan trips, check weather, find hotels — all in one place.</p>
        <button onClick={() => setPage("planner")} style={{ padding: "14px 32px", borderRadius: 14, border: "none", background: "linear-gradient(135deg,#2563eb,#7c3aed)", color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer", fontFamily: "inherit" }}>
          ✨ Plan a New Trip
        </button>
      </div>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "28px 16px" }}>
        <h2 style={{ fontWeight: 800, color: "#1e293b", fontSize: 18, margin: "0 0 16px" }}>🚀 Quick Access</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14 }}>
          {[{id:"planner",emoji:"✈️",title:"Plan Trip",desc:"AI itinerary",color:"#2563eb"},{id:"weather",emoji:"🌤️",title:"Weather",desc:"Live forecast",color:"#0ea5e9"},{id:"map",emoji:"🗺️",title:"Maps",desc:"Explore places",color:"#059669"},{id:"hotels",emoji:"🏨",title:"Hotels",desc:"Find stays",color:"#d97706"}].map(item => (
            <button key={item.id} onClick={() => setPage(item.id)} style={{ padding: "20px 16px", borderRadius: 16, border: `2px solid ${item.color}20`, background: `${item.color}08`, cursor: "pointer", textAlign: "center", fontFamily: "inherit" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{item.emoji}</div>
              <div style={{ fontWeight: 800, color: item.color, fontSize: 15 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{item.desc}</div>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 24, background: "#1e293b", borderRadius: 18, padding: "20px" }}>
          <h3 style={{ margin: "0 0 14px", fontWeight: 800, color: "#fff", fontSize: 15 }}>🧠 Tech Stack</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[{l:"Frontend",v:"React.js",e:"⚛️",c:"#61dafb"},{l:"Backend",v:"Node.js + Express",e:"🟢",c:"#86efac"},{l:"Database",v:"MongoDB",e:"🍃",c:"#4ade80"},{l:"AI",v:"Claude API",e:"🤖",c:"#a78bfa"},{l:"Maps",v:"Google Maps",e:"🗺️",c:"#fbbf24"},{l:"Weather",v:"Open-Meteo API",e:"🌤️",c:"#38bdf8"}].map(t => (
              <div key={t.l} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "10px 12px", border: `1px solid ${t.c}30` }}>
                <div style={{ fontSize: 16 }}>{t.e}</div>
                <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, marginTop: 3 }}>{t.l}</div>
                <div style={{ fontWeight: 800, color: t.c, fontSize: 13 }}>{t.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── WEATHER PAGE ───────────────────────────────────────────────────────────────
function WeatherPage() {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchWeather() {
    if (!city) return;
    setLoading(true); setError(""); setData(null);
    try {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
      const geo = await geoRes.json();
      if (!geo.results?.length) { setError("City not found. Try a different name."); setLoading(false); return; }
      const { latitude, longitude, name, country } = geo.results[0];
      const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,visibility&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum&timezone=auto&forecast_days=5`);
      const w = await wRes.json();
      const c = w.current; const d = w.daily;
      const decode = (code) => {
        if (code === 0) return { desc: "Clear Sky", emoji: "☀️" };
        if (code <= 3) return { desc: "Partly Cloudy", emoji: "⛅" };
        if (code <= 48) return { desc: "Foggy", emoji: "🌫️" };
        if (code <= 57) return { desc: "Drizzle", emoji: "🌦️" };
        if (code <= 67) return { desc: "Rain", emoji: "🌧️" };
        if (code <= 77) return { desc: "Snow", emoji: "❄️" };
        if (code <= 82) return { desc: "Rain Showers", emoji: "🌧️" };
        if (code <= 99) return { desc: "Thunderstorm", emoji: "⛈️" };
        return { desc: "Unknown", emoji: "🌡️" };
      };
      setData({
        city: name, country,
        temp: Math.round(c.temperature_2m),
        feels: Math.round(c.apparent_temperature),
        humidity: c.relative_humidity_2m,
        wind: Math.round(c.wind_speed_10m),
        visibility: c.visibility ? Math.round(c.visibility / 1000) : "N/A",
        ...decode(c.weather_code),
        forecast: d.time.map((date, i) => ({ date, max: Math.round(d.temperature_2m_max[i]), min: Math.round(d.temperature_2m_min[i]), rain: d.precipitation_sum[i], ...decode(d.weather_code[i]) })),
      });
    } catch { setError("Failed to fetch weather. Please try again."); }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 16px" }}>
      <h2 style={{ fontWeight: 800, color: "#1e293b", fontSize: 20, margin: "0 0 16px" }}>🌤️ Live Weather</h2>
      <Card>
        <div style={{ display: "flex", gap: 10 }}>
          <input value={city} onChange={e => setCity(e.target.value)} onKeyDown={e => e.key === "Enter" && fetchWeather()}
            placeholder="Enter city e.g. Mumbai, Tokyo, London" style={{ ...inp(), flex: 1 }} />
          <button onClick={fetchWeather} style={{ padding: "12px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0ea5e9,#2563eb)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
            {loading ? "…" : "Search"}
          </button>
        </div>
        {error && <p style={{ color: "#ef4444", fontSize: 13, marginTop: 10, marginBottom: 0 }}>⚠️ {error}</p>}
      </Card>
      {data && (
        <>
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ textAlign: "center", minWidth: 90 }}>
                <div style={{ fontSize: 54 }}>{data.emoji}</div>
                <div style={{ fontWeight: 900, fontSize: 34, color: "#1e293b", lineHeight: 1 }}>{data.temp}°C</div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{data.desc}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 18, color: "#1e293b" }}>{data.city}, {data.country}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
                  {[["Feels Like",`${data.feels}°C`],["Humidity",`${data.humidity}%`],["Wind",`${data.wind} km/h`],["Visibility",`${data.visibility} km`]].map(([l,v]) => (
                    <div key={l} style={{ background: "#f1f5f9", borderRadius: 10, padding: "8px 12px" }}>
                      <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700 }}>{l}</div>
                      <div style={{ fontWeight: 800, color: "#1e293b", fontSize: 14 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
          <h3 style={{ fontWeight: 800, color: "#1e293b", fontSize: 16, margin: "0 0 10px" }}>📅 5-Day Forecast</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
            {data.forecast.map((f, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "12px 6px", textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", border: "1px solid #e8edf4" }}>
                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700 }}>{new Date(f.date).toLocaleDateString("en", { weekday: "short" })}</div>
                <div style={{ fontSize: 24, margin: "6px 0" }}>{f.emoji}</div>
                <div style={{ fontWeight: 800, color: "#1e293b", fontSize: 14 }}>{f.max}°</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{f.min}°</div>
                {f.rain > 0 && <div style={{ fontSize: 11, color: "#0ea5e9", fontWeight: 700, marginTop: 3 }}>💧{f.rain}mm</div>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── MAP PAGE ───────────────────────────────────────────────────────────────────
function MapPage() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("India");
  const query = encodeURIComponent(location);
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
      <h2 style={{ fontWeight: 800, color: "#1e293b", fontSize: 20, margin: "0 0 16px" }}>🗺️ Explore on Map</h2>
      <Card>
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && search.trim()) setLocation(search.trim()); }}
            placeholder="Search city or place e.g. Goa, India" style={{ ...inp(), flex: 1 }} />
          <button onClick={() => { if (search.trim()) setLocation(search.trim()); }}
            style={{ padding: "12px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#059669,#0891b2)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
            🔍 Search
          </button>
        </div>
        <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid #e2e8f0" }}>
          <iframe key={location} title="map" width="100%" height="360" frameBorder="0" style={{ display: "block" }}
            src={`https://maps.google.com/maps?q=${query}&output=embed&z=11`} allowFullScreen />
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          {[["🏨 Hotels","hotels"],["🍽️ Restaurants","restaurants"],["🏛️ Attractions","tourist attractions"],["🛍️ Shopping","shopping malls"]].map(([label, type]) => (
            <a key={type} href={`https://www.google.com/maps/search/${encodeURIComponent(type)}+in+${query}`} target="_blank" rel="noreferrer"
              style={{ padding: "7px 14px", borderRadius: 10, background: "#f1f5f9", color: "#475569", fontWeight: 700, fontSize: 12, textDecoration: "none", border: "1px solid #e2e8f0" }}>
              {label}
            </a>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── HOTELS PAGE ────────────────────────────────────────────────────────────────
function HotelsPage() {
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("mid");
  const [hotels, setHotels] = useState(null);
  const [loading, setLoading] = useState(false);

  async function findHotels() {
    if (!city) return;
    setLoading(true); setHotels(null);
    const prompt = `Suggest 6 hotels in ${city} for ${budget} budget travelers. Return ONLY JSON (no markdown):
{ "hotels": [{ "name":"", "type":"Budget/Mid-Range/Luxury", "price":"", "area":"", "rating":"X.X/5", "highlight":"", "amenities":["wifi","pool","breakfast"] }] }`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1500, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      const raw = data.content?.map(b => b.text || "").join("") || "";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setHotels(parsed.hotels);
    } catch { setHotels([]); }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 16px" }}>
      <h2 style={{ fontWeight: 800, color: "#1e293b", fontSize: 20, margin: "0 0 16px" }}>🏨 Hotel Suggestions</h2>
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 12 }}>
          <input value={city} onChange={e => setCity(e.target.value)} onKeyDown={e => e.key === "Enter" && findHotels()}
            placeholder="Enter city e.g. Goa, Mumbai, Delhi" style={inp()} />
          <select value={budget} onChange={e => setBudget(e.target.value)} style={{ ...inp(), width: 130 }}>
            <option value="budget">🎒 Budget</option>
            <option value="mid">🏨 Mid-Range</option>
            <option value="luxury">✨ Luxury</option>
          </select>
        </div>
        <button onClick={findHotels} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#d97706,#dc2626)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
          {loading ? "Finding hotels…" : "🏨 Find Hotels"}
        </button>
      </Card>
      {loading && <div style={{ textAlign: "center", padding: "40px 0" }}><div style={{ fontSize: 40 }}>🏨</div><p style={{ color: "#64748b", marginTop: 12 }}>Finding best hotels in {city}…</p></div>}
      {hotels?.map((h, i) => {
        const c = h.type === "Budget" ? "#059669" : h.type === "Luxury" ? "#d97706" : "#2563eb";
        return (
          <Card key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 6 }}>
                  <span style={{ fontWeight: 800, color: "#1e293b", fontSize: 15 }}>🏨 {h.name}</span>
                  <Badge text={h.type} color={c} />
                </div>
                <div style={{ fontSize: 13, color: "#64748b" }}>📍 {h.area} · ⭐ {h.rating}</div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>✨ {h.highlight}</div>
                {h.amenities?.length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                    {h.amenities.map((a, j) => <span key={j} style={{ fontSize: 11, background: "#f1f5f9", color: "#475569", borderRadius: 20, padding: "3px 10px", fontWeight: 600 }}>✓ {a}</span>)}
                  </div>
                )}
                <a href={`https://www.google.com/maps/search/${encodeURIComponent(h.name + " " + city)}`} target="_blank" rel="noreferrer"
                  style={{ display: "inline-block", marginTop: 10, padding: "6px 14px", borderRadius: 8, background: "#eff6ff", color: "#2563eb", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
                  📍 View on Maps →
                </a>
              </div>
              <div style={{ fontWeight: 900, color: c, fontSize: 16, whiteSpace: "nowrap" }}>{h.price}</div>
            </div>
          </Card>
        );
      })}
      {hotels?.length === 0 && !loading && <p style={{ color: "#ef4444", textAlign: "center" }}>Could not fetch hotels. Try again.</p>}
    </div>
  );
}

// ── ABOUT PAGE ─────────────────────────────────────────────────────────────────
function AboutPage() {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 16px" }}>
      <Card style={{ background: "linear-gradient(135deg,#1e3a8a,#1e293b)", border: "none" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 52 }}>✈️</div>
          <h2 style={{ color: "#fff", fontWeight: 800, fontSize: 22, margin: "10px 0 8px" }}>AI Trip Planner</h2>
          <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, margin: 0 }}>An AI-powered travel planning web application built as a college project.</p>
        </div>
      </Card>
      <Card>
        <h3 style={{ fontWeight: 800, color: "#1e293b", fontSize: 16, margin: "0 0 14px" }}>🎯 Features</h3>
        {[["✈️ AI Trip Planner","Day-wise itineraries using Claude AI"],["🌤️ Live Weather","Real-time weather via Open-Meteo API"],["🗺️ Maps","Google Maps with nearby places search"],["🏨 Hotels","AI-powered hotel recommendations"],["💰 Cost Estimation","Smart budget breakdown per category"],["🔐 Auth System","Signup/Login with MongoDB + JWT tokens"]].map(([t,d]) => (
          <div key={t} style={{ display: "flex", gap: 12, marginBottom: 10, padding: "10px 14px", background: "#f8fafc", borderRadius: 10 }}>
            <div><div style={{ fontWeight: 700, color: "#1e293b", fontSize: 14 }}>{t}</div><div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{d}</div></div>
          </div>
        ))}
      </Card>
      <Card style={{ background: "#1e293b", border: "none" }}>
        <h3 style={{ fontWeight: 800, color: "#fff", fontSize: 15, margin: "0 0 14px" }}>🧠 Tech Stack</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[{l:"Frontend",v:"React.js",e:"⚛️",c:"#61dafb"},{l:"Backend",v:"Node.js + Express",e:"🟢",c:"#86efac"},{l:"Database",v:"MongoDB",e:"🍃",c:"#4ade80"},{l:"Auth",v:"JWT + bcrypt",e:"🔐",c:"#f472b6"},{l:"AI Engine",v:"Claude Sonnet API",e:"🤖",c:"#a78bfa"},{l:"Weather",v:"Open-Meteo API",e:"🌤️",c:"#38bdf8"}].map(t => (
            <div key={t.l} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "10px 12px", border: `1px solid ${t.c}30` }}>
              <div style={{ fontSize: 16 }}>{t.e}</div>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, marginTop: 3 }}>{t.l}</div>
              <div style={{ fontWeight: 800, color: t.c, fontSize: 13 }}>{t.v}</div>
            </div>
          ))}
        </div>
      </Card>
      <div style={{ textAlign: "center", padding: "10px", color: "#94a3b8", fontSize: 13 }}>🎓 Made with ❤️ as a College Project</div>
    </div>
  );
}

// ── PLANNER PAGE ───────────────────────────────────────────────────────────────
function PlannerPage() {
  const [form, setForm] = useState({ location: "", days: "3", budget: "", currency: "INR", travelers: "1", tripType: "solo" });
  const [step, setStep] = useState("form");
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  async function generate() {
    if (!form.location || !form.days || !form.budget) { setError("Please fill Location, Days and Budget."); return; }
    setError(""); setStep("loading");
    const msgs = [`Researching ${form.location}…`, "Building day-wise itinerary…", "Finding nearby places…", "Estimating costs…", "Adding hotel suggestions…"];
    let mi = 0; setProgress(msgs[0]);
    const iv = setInterval(() => { mi = (mi + 1) % msgs.length; setProgress(msgs[mi]); }, 2000);
    const prompt = `Expert travel planner. Trip: Location: ${form.location}, Days: ${form.days}, Budget: ${form.budget} ${form.currency}, Travelers: ${form.travelers} (${form.tripType}).
Return ONLY JSON (no markdown):
{ "title":"", "summary":"", "days":[{"title":"Day 1: Title","theme":"tagline","cost":"est cost","activities":[{"name":"","time":"9:00 AM","emoji":"🏛️","description":"2 sentences","cost":"","tip":""}],"nearby":["place1","place2","place3"]}], "hotels":[{"name":"","type":"Budget/Mid/Luxury","price":"","area":"","rating":"X.X/5","highlight":""}], "cost_breakdown":{"total":"","accommodation":"","food":"","transport":"","activities":"","misc":""}, "tips":["tip1","tip2","tip3","tip4"] }`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 4000, messages: [{ role: "user", content: prompt }] }),
      });
      clearInterval(iv);
      const data = await res.json();
      const raw = data.content?.map(b => b.text || "").join("") || "";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setResult({ ...parsed, meta: form }); setStep("result");
    } catch { clearInterval(iv); setError("Generation failed. Please try again."); setStep("form"); }
  }

  if (step === "loading") return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 16px" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      <div style={{ background: "#fff", borderRadius: 24, padding: "40px 32px", boxShadow: "0 8px 40px rgba(0,0,0,0.1)", textAlign: "center", maxWidth: 300, width: "100%" }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>🌍</div>
        <div style={{ width: 44, height: 44, border: "4px solid #e2e8f0", borderTop: "4px solid #2563eb", borderRadius: "50%", animation: "spin 0.9s linear infinite", margin: "0 auto 16px" }} />
        <h2 style={{ fontWeight: 800, fontSize: 18, color: "#1e293b", margin: "0 0 8px" }}>Planning Your Trip…</h2>
        <p style={{ color: "#64748b", fontSize: 14, animation: "pulse 2s ease-in-out infinite", margin: 0 }}>{progress}</p>
      </div>
    </div>
  );

  if (step === "result" && result) {
    const r = result;
    const colors = ["#2563eb", "#7c3aed", "#0ea5e9", "#059669", "#d97706", "#dc2626"];
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "20px 16px 40px" }}>
        <div style={{ background: "linear-gradient(135deg,#1e3a8a,#1e293b)", borderRadius: 20, padding: "24px 20px", textAlign: "center", marginBottom: 20 }}>
          <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 800, color: "#fff" }}>{r.title}</h2>
          <p style={{ color: "#94a3b8", fontSize: 13, margin: 0 }}>{r.summary}</p>
        </div>
        <h3 style={{ fontWeight: 800, color: "#1e293b", fontSize: 17, margin: "0 0 12px" }}>📅 Day-wise Itinerary</h3>
        {r.days?.map((day, i) => {
          const DayItem = () => {
            const [open, setOpen] = useState(i === 0);
            const accent = colors[i % colors.length];
            return (
              <div style={{ background: "#fff", borderRadius: 14, marginBottom: 12, border: `1.5px solid ${open ? accent : "#e8edf4"}`, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                <button onClick={() => setOpen(o => !o)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg,${accent},${accent}99)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 14, flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: "#1e293b" }}>{day.title}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{day.theme}</div>
                  </div>
                  {day.cost && <Badge text={day.cost} color={accent} />}
                  <span style={{ color: accent, transform: open ? "rotate(180deg)" : "none", transition: "0.3s" }}>▾</span>
                </button>
                {open && (
                  <div style={{ padding: "0 16px 16px" }}>
                    {day.activities?.map((a, j) => (
                      <div key={j} style={{ display: "flex", gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: j < day.activities.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                        <div style={{ width: 30, height: 30, borderRadius: 8, background: `${accent}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>{a.emoji || "📍"}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 4 }}>
                            <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 13 }}>{a.name}</div>
                            {a.time && <span style={{ fontSize: 11, color: accent, fontWeight: 700, background: `${accent}15`, borderRadius: 6, padding: "2px 7px" }}>{a.time}</span>}
                          </div>
                          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2, lineHeight: 1.5 }}>{a.description}</div>
                          {a.cost && <div style={{ fontSize: 11, color: "#059669", fontWeight: 700, marginTop: 3 }}>💰 {a.cost}</div>}
                          {a.tip && <div style={{ marginTop: 6, padding: "6px 10px", background: "#fffbeb", borderRadius: 7, fontSize: 11, color: "#92400e", borderLeft: "3px solid #f59e0b" }}>💡 {a.tip}</div>}
                        </div>
                      </div>
                    ))}
                    {day.nearby?.length > 0 && (
                      <div style={{ padding: "8px 12px", background: "#f8fafc", borderRadius: 10 }}>
                        <div style={{ fontWeight: 700, fontSize: 12, color: "#475569", marginBottom: 6 }}>📍 Nearby Places</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{day.nearby.map((p, k) => <span key={k} style={{ fontSize: 11, background: "#e2e8f0", color: "#475569", borderRadius: 20, padding: "3px 10px", fontWeight: 600 }}>{p}</span>)}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          };
          return <DayItem key={i} />;
        })}
        {r.cost_breakdown && (
          <Card>
            <h3 style={{ margin: "0 0 12px", fontWeight: 800, color: "#1e293b", fontSize: 16 }}>💰 Cost Estimation</h3>
            <div style={{ padding: "12px 16px", borderRadius: 12, background: "linear-gradient(135deg,#1e293b,#1e3a8a)", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ color: "#94a3b8", fontWeight: 700 }}>Total Budget</span>
              <span style={{ color: "#fbbf24", fontWeight: 900, fontSize: 20 }}>{r.cost_breakdown.total}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[{l:"Accommodation",v:r.cost_breakdown.accommodation,e:"🏨",c:"#2563eb"},{l:"Food",v:r.cost_breakdown.food,e:"🍽️",c:"#dc2626"},{l:"Transport",v:r.cost_breakdown.transport,e:"🚌",c:"#d97706"},{l:"Activities",v:r.cost_breakdown.activities,e:"🎯",c:"#7c3aed"},{l:"Misc",v:r.cost_breakdown.misc,e:"🛍️",c:"#059669"}].filter(x => x.v).map(item => (
                <div key={item.l} style={{ padding: "10px 12px", borderRadius: 10, background: `${item.c}08`, border: `1.5px solid ${item.c}25` }}>
                  <div style={{ fontSize: 16 }}>{item.e}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, marginTop: 3 }}>{item.l}</div>
                  <div style={{ fontWeight: 900, color: item.c, fontSize: 14 }}>{item.v}</div>
                </div>
              ))}
            </div>
          </Card>
        )}
        {r.tips?.length > 0 && (
          <Card>
            <h3 style={{ margin: "0 0 12px", fontWeight: 800, color: "#1e293b", fontSize: 16 }}>💡 Travel Tips</h3>
            {r.tips.map((tip, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, padding: "10px 12px", borderRadius: 10, background: i % 2 === 0 ? "#f8fafc" : "#fff" }}>
                <span>✅</span><span style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>{tip}</span>
              </div>
            ))}
          </Card>
        )}
        <button onClick={() => { setStep("form"); setResult(null); }} style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#2563eb,#7c3aed)", color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>
          ← Plan Another Trip
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px" }}>
      <h2 style={{ fontWeight: 800, color: "#1e293b", fontSize: 20, margin: "0 0 16px" }}>✈️ Plan Your Trip</h2>
      <Card>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, letterSpacing: "0.04em" }}>LOCATION *</label>
          <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Goa, India" style={inp()} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, letterSpacing: "0.04em" }}>DAYS *</label>
            <input type="number" min="1" max="30" value={form.days} onChange={e => setForm(f => ({ ...f, days: e.target.value }))} style={inp()} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, letterSpacing: "0.04em" }}>BUDGET *</label>
            <div style={{ display: "flex", gap: 6 }}>
              <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} style={{ ...inp(), width: 72, flexShrink: 0 }}>
                {["INR","USD","EUR","GBP","AUD"].map(c => <option key={c}>{c}</option>)}
              </select>
              <input type="number" placeholder="10000" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} style={{ ...inp(), flex: 1 }} />
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, letterSpacing: "0.04em" }}>TRAVELERS</label>
            <input type="number" min="1" max="20" value={form.travelers} onChange={e => setForm(f => ({ ...f, travelers: e.target.value }))} style={inp()} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, letterSpacing: "0.04em" }}>TRIP TYPE</label>
            <select value={form.tripType} onChange={e => setForm(f => ({ ...f, tripType: e.target.value }))} style={inp()}>
              <option value="solo">Solo</option>
              <option value="couple">Couple</option>
              <option value="friends">Friends</option>
              <option value="family">Family</option>
              <option value="college group">College Group</option>
            </select>
          </div>
        </div>
        {error && <div style={{ background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 10, padding: "10px 14px", color: "#dc2626", fontWeight: 600, fontSize: 13, marginBottom: 14 }}>⚠️ {error}</div>}
        <button onClick={generate} style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#2563eb,#7c3aed)", color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer", fontFamily: "inherit" }}>
          ✨ Generate My Trip Plan
        </button>
      </Card>
    </div>
  );
}

// ── ROOT APP ───────────────────────────────────────────────────────────────────
export default function App() {
  const saved = localStorage.getItem("user");
  const [user, setUser] = useState(saved ? JSON.parse(saved) : null);
  const [page, setPage] = useState("home");

  function handleLogin(u) { setUser(u); setPage("home"); }
  function handleLogout() { localStorage.removeItem("token"); localStorage.removeItem("user"); setUser(null); setPage("home"); }

  if (!user) return <AuthPage onLogin={handleLogin} />;

  const pages = {
    home: <HomePage user={user} setPage={setPage} />,
    planner: <PlannerPage />,
    weather: <WeatherPage />,
    map: <MapPage />,
    hotels: <HotelsPage />,
    about: <AboutPage />,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap'); *{box-sizing:border-box} input:focus,select:focus{border-color:#2563eb!important;box-shadow:0 0 0 3px rgba(37,99,235,0.1)}`}</style>
      <Navbar user={user} activePage={page} setPage={setPage} onLogout={handleLogout} />
      {pages[page]}
      <div style={{ textAlign: "center", padding: "20px", color: "#94a3b8", fontSize: 12, borderTop: "1px solid #e2e8f0", marginTop: 20 }}>
        🎓 AI Trip Planner · College Project · React · Node.js · MongoDB · Claude AI
      </div>
    </div>
  );
}