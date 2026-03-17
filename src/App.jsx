import { useState, useEffect, useRef, useCallback } from "react";

const HUDBracket = ({ position }) => {
  const styles = {
    "top-left":     { top: 16, left: 16,  borderTop: "2px solid rgba(255,255,255,0.6)", borderLeft: "2px solid rgba(255,255,255,0.6)" },
    "top-right":    { top: 16, right: 16, borderTop: "2px solid rgba(255,255,255,0.6)", borderRight: "2px solid rgba(255,255,255,0.6)" },
    "bottom-left":  { bottom: 16, left: 16,  borderBottom: "2px solid rgba(255,255,255,0.6)", borderLeft: "2px solid rgba(255,255,255,0.6)" },
    "bottom-right": { bottom: 16, right: 16, borderBottom: "2px solid rgba(255,255,255,0.6)", borderRight: "2px solid rgba(255,255,255,0.6)" },
  };
  return <div style={{ position: "absolute", width: 28, height: 28, ...styles[position] }} />;
};

const VIDEO_URL = "https://res.cloudinary.com/dae5xuxoc/video/upload/Olvaidlab_mqb9j8.mp4";

// Genera estrellas una sola vez al cargar el módulo
const STARS = Array.from({ length: 160 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 0.5 + Math.random() * 1.5,
  opacity: 0.2 + Math.random() * 0.6,
  twinkle: Math.random() < 0.25, // 25% titilan
  duration: 2 + Math.random() * 4,
  delay: Math.random() * 5,
}));

// Proyectos — agrega más aquí cuando estén listos
const PROJECTS = [
  { id: 1, name: "DOMIS.CL",       url: "https://www.domis.cl",        desc: "E-commerce · Retail" },
  { id: 2, name: "DR. OLIVARES M.", url: "https://www.drolivaresm.cl/", desc: "Salud · Medicina" },
];

// ── BUILDER ──────────────────────────────────────────────────────────────────
const BUILDER_STYLES = [
  { id: "ecommerce",    label: "E-COMMERCE",      desc: "Tienda online · Productos",    bg: "#ffffff", accent: "#f97316", text: "#111111" },
  { id: "corporativo",  label: "CORPORATIVO",     desc: "Empresa · Servicios B2B",      bg: "#0f172a", accent: "#3b82f6", text: "#e2e8f0" },
  { id: "landing",      label: "LANDING PAGE",    desc: "Conversión · Una sola página", bg: "#09090b", accent: "#a855f7", text: "#ffffff" },
  { id: "restaurante",  label: "RESTAURANTE",     desc: "Gastronomía · Café · Bar",     bg: "#1c1008", accent: "#ca8a04", text: "#fef9c3" },
  { id: "salud",        label: "SALUD / CLÍNICA", desc: "Médico · Bienestar · Dental",  bg: "#f0f9ff", accent: "#0284c7", text: "#0f172a" },
  { id: "portfolio",    label: "PORTAFOLIO",      desc: "Creativo · Diseñador · Foto",  bg: "#0a0a0a", accent: "#e2e8f0", text: "#ffffff" },
  { id: "inmobiliaria", label: "INMOBILIARIA",    desc: "Propiedades · Arriendos",      bg: "#111827", accent: "#10b981", text: "#f9fafb" },
  { id: "educacion",    label: "EDUCACIÓN",       desc: "Academia · Cursos · Colegio",  bg: "#fefce8", accent: "#7c3aed", text: "#1e1b4b" },
  { id: "tecnologia",   label: "TECNOLOGÍA / SaaS",desc: "Startup · App · Software",    bg: "#020617", accent: "#06b6d4", text: "#e2e8f0" },
  { id: "eventos",      label: "EVENTOS",         desc: "Matrimonios · Fiestas · Shows",bg: "#1a0a2e", accent: "#ec4899", text: "#fdf4ff" },
  { id: "fotografia",   label: "FOTOGRAFÍA",       desc: "Portfolio visual · Artistas",    bg: "#080808", accent: "#d4af6a", text: "#ffffff" },
  { id: "fitness",      label: "GYM / FITNESS",    desc: "Deporte · Salud · Entrenamiento",bg: "#0d0d0d", accent: "#c8f000", text: "#ffffff" },
  { id: "legal",        label: "LEGAL / ABOGADOS", desc: "Bufete · Consultoría · Notaría", bg: "#0c1828", accent: "#b8965a", text: "#e8ddc8" },
  { id: "ong",          label: "ONG / FUNDACIÓN",  desc: "Causa social · Donaciones",      bg: "#faf7f2", accent: "#e05c2a", text: "#1a1a1a" },
];

const BUILDER_PALETTES = [
  { id: "purpura", label: "PÚRPURA",  colors: ["#050308", "#c084fc", "#fff"] },
  { id: "oceano",  label: "OCÉANO",   colors: ["#020b14", "#0ea5e9", "#fff"] },
  { id: "fuego",   label: "FUEGO",    colors: ["#0d0202", "#ef4444", "#fff"] },
  { id: "dorado",  label: "DORADO",   colors: ["#0a0800", "#c9a84c", "#f5e6c8"] },
  { id: "blanco",  label: "BLANCO",   colors: ["#ffffff", "#111",    "#555"] },
];

const BUILDER_SECTIONS = [
  "HERO / PORTADA", "GALERÍA", "SOBRE NOSOTROS", "SERVICIOS",
  "TESTIMONIOS", "TIENDA / PRODUCTOS", "CONTACTO", "BLOG",
];

const STYLE_UPLOAD_SLOTS = {
  ecommerce:    [{ id: "hero",    label: "Imagen Hero" },      { id: "prod1",   label: "Producto 1" },    { id: "prod2",   label: "Producto 2" },    { id: "prod3",   label: "Producto 3" }],
  corporativo:  [{ id: "hero",    label: "Foto Hero" },        { id: "team",    label: "Equipo / Oficina" }],
  landing:      [{ id: "hero",    label: "Fondo Principal" }],
  restaurante:  [{ id: "hero",    label: "Ambiente / Local" }, { id: "dish1",   label: "Plato 1" },       { id: "dish2",   label: "Plato 2" },       { id: "dish3",   label: "Plato 3" }],
  salud:        [{ id: "hero",    label: "Doctor / Clínica" }, { id: "team",    label: "Equipo Médico" }],
  portfolio:    [{ id: "proj1",   label: "Proyecto 1" },       { id: "proj2",   label: "Proyecto 2" },    { id: "proj3",   label: "Proyecto 3" },    { id: "proj4",   label: "Proyecto 4" },  { id: "proj5", label: "Proyecto 5" }],
  inmobiliaria: [{ id: "hero",    label: "Ciudad / Skyline" }, { id: "prop1",   label: "Propiedad 1" },   { id: "prop2",   label: "Propiedad 2" },   { id: "prop3",   label: "Propiedad 3" }],
  educacion:    [{ id: "hero",    label: "Video / Thumbnail" },{ id: "course1", label: "Curso 1" },       { id: "course2", label: "Curso 2" },       { id: "course3", label: "Curso 3" }],
  tecnologia:   [{ id: "hero",    label: "Product Screenshot" }],
  eventos:      [{ id: "hero",    label: "Evento Principal" }, { id: "gal1",    label: "Galería 1" },     { id: "gal2",    label: "Galería 2" },     { id: "gal3",    label: "Galería 3" }],
  fotografia:   [{ id: "hero",    label: "Foto Principal" },   { id: "gal1",    label: "Foto 1" },        { id: "gal2",    label: "Foto 2" },        { id: "gal3",    label: "Foto 3" },     { id: "gal4", label: "Foto 4" }, { id: "gal5", label: "Foto 5" }],
  fitness:      [{ id: "hero",    label: "Imagen Hero" },      { id: "gym1",    label: "Instalaciones" }, { id: "gym2",    label: "Entrenamiento" }],
  legal:        [{ id: "hero",    label: "Oficina / Firma" },  { id: "team",    label: "Socios / Abogados" }],
  ong:          [{ id: "hero",    label: "Imagen Causa" },     { id: "impact1", label: "Impacto 1" },     { id: "impact2", label: "Impacto 2" }],
};

function MiniPreview({ paletteId, config, images = {} }) {
  const styleObj = BUILDER_STYLES.find(s => s.id === config.style);
  const pal      = BUILDER_PALETTES.find(p => p.id === paletteId);
  const bg    = pal ? pal.colors[0] : (styleObj?.bg     ?? "#050308");
  const ac    = pal ? pal.colors[1] : (styleObj?.accent ?? "#c084fc");
  const tx    = pal ? pal.colors[2] : (styleObj?.text   ?? "#fff");
  const brand = config.nombre || "MARCA";
  const st    = config.style;
  const F  = "'Barlow Condensed', sans-serif";
  const BN = "'Bebas Neue', sans-serif";
  const root = { width: "100%", height: "100%", background: bg, display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: F };
  // Returns background shorthand: uploaded image or fallback gradient
  const IG = (key, gradient) => images[key] ? `url(${images[key]}) center/cover no-repeat` : gradient;

  // ── E-COMMERCE ──────────────────────────────────────────────────────────────
  if (st === "ecommerce") return (
    <div style={root}>
      {/* Promo strip */}
      <div style={{ background: ac, padding: "3px 8px", textAlign: "center", flexShrink: 0 }}>
        <span style={{ color: bg, fontSize: 5.5, fontWeight: 700, letterSpacing: 2 }}>FREE SHIPPING · ENVÍO GRATIS EN COMPRAS +$50.000</span>
      </div>
      {/* Nav */}
      <div style={{ padding: "5px 10px", borderBottom: `1px solid ${ac}18`, display: "flex", alignItems: "center", justifyContent: "space-between", background: bg, flexShrink: 0 }}>
        <span style={{ color: tx, fontSize: 10, fontWeight: 700, fontFamily: BN, letterSpacing: 3 }}>{brand}</span>
        <div style={{ display: "flex", gap: 8 }}>
          {["MUJER","HOMBRE","KIDS","SALE"].map(n => <span key={n} style={{ color: tx, fontSize: 5, letterSpacing: 1, opacity: 0.5 }}>{n}</span>)}
        </div>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          <span style={{ fontSize: 8 }}>🔍</span><span style={{ fontSize: 8 }}>🛒</span>
        </div>
      </div>
      {/* Hero split */}
      <div style={{ display: "flex", height: 128, flexShrink: 0 }}>
        <div style={{ width: "45%", padding: "10px 10px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ color: ac, fontSize: 5, letterSpacing: 3, marginBottom: 4, opacity: 0.8 }}>NUEVA COLECCIÓN 2025</div>
          <div style={{ color: tx, fontFamily: BN, fontSize: 22, lineHeight: 1, letterSpacing: 1 }}>STYLE<br/>AHEAD</div>
          <div style={{ color: tx, fontSize: 5, opacity: 0.35, marginTop: 4, lineHeight: 1.4 }}>{config.mensaje || "Moda que define tu identidad"}</div>
          <div style={{ marginTop: 8, padding: "4px 10px", background: ac, color: bg, fontSize: 6, fontWeight: 700, letterSpacing: 2, display: "inline-block" }}>COMPRAR AHORA →</div>
        </div>
        {/* Fashion hero photo */}
        <div style={{ flex: 1, background: IG("hero", `linear-gradient(135deg, ${ac}25 0%, ${ac}55 50%, ${ac}15 100%)`), position: "relative", overflow: "hidden" }}>
          {!images.hero && <>
            <div style={{ position: "absolute", bottom: 0, right: "18%", width: 32, height: 95, background: `linear-gradient(to top, ${ac}90, ${ac}25)`, borderRadius: "50% 50% 0 0" }} />
            <div style={{ position: "absolute", bottom: 58, right: "30%", width: 18, height: 18, borderRadius: "50%", background: ac }} />
          </>}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 30, background: `linear-gradient(to bottom, ${bg}40, transparent)` }} />
          <div style={{ position: "absolute", top: 8, right: 8, background: ac, color: bg, fontSize: 5, padding: "2px 5px", fontWeight: 700 }}>NEW IN</div>
        </div>
      </div>
      {/* Product grid */}
      <div style={{ flex: 1, padding: "6px 8px" }}>
        <div style={{ color: tx, fontSize: 5.5, opacity: 0.25, letterSpacing: 2, marginBottom: 5 }}>DESTACADOS</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 4 }}>
          {[
            { name: "CAMISETA PREMIUM", price: "$29.990", imgKey: "prod1", g: `linear-gradient(145deg,${ac}35,${ac}70)` },
            { name: "ZAPATILLAS URBAN", price: "$79.990", imgKey: "prod2", g: `linear-gradient(145deg,${ac}20,${ac}50)` },
            { name: "BOLSO SIGNATURE",  price: "$49.990", imgKey: "prod3", g: `linear-gradient(145deg,${ac}28,${ac}60)` },
          ].map(({ name, price, imgKey, g }) => (
            <div key={name} style={{ border: `1px solid ${ac}15`, overflow: "hidden" }}>
              <div style={{ height: 44, background: IG(imgKey, g), position: "relative" }}>
                {!images[imgKey] && <div style={{ position: "absolute", bottom: 3, right: 3, background: ac, color: bg, fontSize: 4, padding: "1px 3px", fontWeight: 700 }}>NUEVO</div>}
              </div>
              <div style={{ padding: "4px" }}>
                <div style={{ color: tx, fontSize: 4.5, opacity: 0.7 }}>{name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                  <span style={{ color: ac, fontSize: 6, fontWeight: 700 }}>{price}</span>
                  <div style={{ width: 14, height: 12, background: ac, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: bg, fontSize: 7 }}>+</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── CORPORATIVO ──────────────────────────────────────────────────────────────
  if (st === "corporativo") return (
    <div style={root}>
      {/* Nav */}
      <div style={{ padding: "6px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${ac}12`, flexShrink: 0 }}>
        <span style={{ color: tx, fontSize: 9, fontFamily: BN, letterSpacing: 3 }}>{brand}</span>
        <div style={{ display: "flex", gap: 7 }}>
          {["NOSOTROS","SERVICIOS","CASOS","CONTACTO"].map(n => <span key={n} style={{ color: tx, fontSize: 4.5, opacity: 0.4 }}>{n}</span>)}
        </div>
        <div style={{ padding: "3px 7px", border: `1px solid ${ac}`, color: ac, fontSize: 5 }}>CONTACTAR</div>
      </div>
      {/* Diagonal hero */}
      <div style={{ height: 135, position: "relative", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ position: "absolute", inset: 0, background: IG("hero", `linear-gradient(120deg, ${bg} 52%, ${ac}15 100%)`) }} />
        {/* Right accent panel with building shapes */}
        <div style={{ position: "absolute", right: 0, top: 0, width: "38%", height: "100%", background: `${ac}08` }}>
          <div style={{ position: "absolute", bottom: 0, left: "10%", width: 20, height: 85, background: `${ac}22` }} />
          <div style={{ position: "absolute", bottom: 0, left: "38%", width: 14, height: 65, background: `${ac}16` }} />
          <div style={{ position: "absolute", bottom: 0, right: "8%", width: 24, height: 105, background: `${ac}14` }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `${ac}40` }} />
        </div>
        {/* Diagonal separator */}
        <div style={{ position: "absolute", top: 0, right: "36%", width: 2, height: "140%", background: `${ac}25`, transform: "rotate(8deg)", transformOrigin: "top" }} />
        {/* Hero text */}
        <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}>
          <div style={{ color: ac, fontSize: 5, letterSpacing: 3, marginBottom: 6, opacity: 0.9 }}>SOLUCIONES EMPRESARIALES</div>
          <div style={{ color: tx, fontFamily: BN, fontSize: 21, lineHeight: 1, letterSpacing: 1 }}>TRANSFORMA<br/>TU EMPRESA</div>
          <div style={{ color: tx, fontSize: 5, opacity: 0.3, marginTop: 4, lineHeight: 1.4 }}>{config.mensaje || "Consultoría estratégica de alto impacto"}</div>
          <div style={{ marginTop: 8, display: "flex", gap: 5 }}>
            <div style={{ padding: "4px 10px", background: ac, color: bg, fontSize: 5.5, fontWeight: 700 }}>AGENDAR LLAMADA</div>
            <div style={{ padding: "4px 8px", border: `1px solid ${ac}40`, color: ac, fontSize: 5.5 }}>VER CASOS</div>
          </div>
        </div>
      </div>
      {/* Stats bar */}
      <div style={{ display: "flex", borderBottom: `1px solid ${ac}10`, borderTop: `1px solid ${ac}10`, background: `${ac}05`, flexShrink: 0 }}>
        {[["150+","Proyectos"],["12","Años"],["98%","Satisfacción"],["40+","Países"]].map(([n, l]) => (
          <div key={l} style={{ flex: 1, padding: "6px 4px", textAlign: "center", borderRight: `1px solid ${ac}10` }}>
            <div style={{ color: ac, fontSize: 11, fontFamily: BN }}>{n}</div>
            <div style={{ color: tx, fontSize: 4.5, opacity: 0.3 }}>{l}</div>
          </div>
        ))}
      </div>
      {/* Services */}
      <div style={{ flex: 1, padding: "7px 8px" }}>
        <div style={{ display: "flex", gap: 4 }}>
          {[{ icon: "◈", name: "Estrategia", desc: "Planificación integral" }, { icon: "⬡", name: "Tecnología", desc: "Transformación digital" }, { icon: "◇", name: "Crecimiento", desc: "Escala tu negocio" }].map(({ icon, name, desc }) => (
            <div key={name} style={{ flex: 1, padding: "7px 5px", background: `${ac}05`, border: `1px solid ${ac}12`, borderTop: `2px solid ${ac}` }}>
              <div style={{ color: ac, fontSize: 12, marginBottom: 3 }}>{icon}</div>
              <div style={{ color: tx, fontSize: 6.5, fontWeight: 700, letterSpacing: 1 }}>{name}</div>
              <div style={{ color: tx, fontSize: 4.5, opacity: 0.3, marginTop: 2, lineHeight: 1.4 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── LANDING PAGE ─────────────────────────────────────────────────────────────
  if (st === "landing") return (
    <div style={root}>
      {/* Minimal nav */}
      <div style={{ padding: "5px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <span style={{ color: tx, fontSize: 8, fontFamily: BN, letterSpacing: 2 }}>{brand}</span>
        <div style={{ display: "flex", gap: 8 }}>
          {["PRECIOS","FAQ","LOGIN"].map(n => <span key={n} style={{ color: tx, fontSize: 4.5, opacity: 0.4 }}>{n}</span>)}
        </div>
        <div style={{ padding: "3px 8px", background: ac, color: bg, fontSize: 5, fontWeight: 700 }}>PROBAR GRATIS</div>
      </div>
      {/* Hero */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8px 12px", background: `radial-gradient(ellipse 80% 70% at 50% 50%, ${ac}22 0%, ${ac}06 60%, transparent 100%)`, position: "relative", overflow: "hidden" }}>
        {/* Grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${ac}07 1px, transparent 1px), linear-gradient(90deg, ${ac}07 1px, transparent 1px)`, backgroundSize: "22px 22px" }} />
        {/* Floating shapes */}
        <div style={{ position: "absolute", top: 14, left: 22, width: 38, height: 38, borderRadius: "50%", border: `1px solid ${ac}20`, background: `${ac}06` }} />
        <div style={{ position: "absolute", bottom: 18, right: 18, width: 22, height: 22, border: `1px solid ${ac}15`, background: `${ac}05`, transform: "rotate(45deg)" }} />
        <div style={{ position: "absolute", top: 20, right: 30, width: 12, height: 12, borderRadius: "50%", background: `${ac}25` }} />
        {/* Content */}
        <div style={{ textAlign: "center", position: "relative" }}>
          <div style={{ display: "inline-block", color: ac, fontSize: 5, letterSpacing: 4, border: `1px solid ${ac}35`, padding: "2px 10px", marginBottom: 9, background: `${ac}10` }}>✦ PLATAFORMA #1 ✦</div>
          <div style={{ color: tx, fontFamily: BN, fontSize: 26, lineHeight: 1, letterSpacing: 1 }}>LA WEB QUE<br/>CONVIERTE</div>
          <div style={{ color: tx, fontSize: 5.5, opacity: 0.35, marginTop: 6, maxWidth: 160, margin: "8px auto 0", lineHeight: 1.5 }}>{config.mensaje || "Multiplica tus conversiones con IA y automatizaciones"}</div>
          {/* Email capture */}
          <div style={{ marginTop: 12, display: "flex", gap: 3, justifyContent: "center" }}>
            <div style={{ flex: 1, maxWidth: 130, background: "rgba(255,255,255,0.06)", border: `1px solid ${ac}30`, padding: "5px 8px", textAlign: "left" }}>
              <span style={{ color: tx, fontSize: 5, opacity: 0.35 }}>tu@email.com</span>
            </div>
            <div style={{ padding: "5px 10px", background: ac, color: bg, fontSize: 6, fontWeight: 700, letterSpacing: 1, whiteSpace: "nowrap" }}>COMENZAR →</div>
          </div>
          <div style={{ marginTop: 7, display: "flex", gap: 8, justifyContent: "center" }}>
            {["✓ 14 días gratis","✓ Sin tarjeta","✓ Soporte 24/7"].map(b => (
              <span key={b} style={{ color: ac, fontSize: 4.5, opacity: 0.8 }}>{b}</span>
            ))}
          </div>
        </div>
        {/* Social proof */}
        <div style={{ position: "absolute", bottom: 8, display: "flex", gap: 14 }}>
          {[["10K+","Usuarios"],["$2M","Generados"],["4.9★","Rating"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ color: ac, fontSize: 9, fontFamily: BN }}>{n}</div>
              <div style={{ color: tx, fontSize: 4, opacity: 0.3 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── RESTAURANTE ──────────────────────────────────────────────────────────────
  if (st === "restaurante") return (
    <div style={root}>
      {/* Full-bleed atmospheric hero */}
      <div style={{ height: 160, position: "relative", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ position: "absolute", inset: 0, background: IG("hero", `linear-gradient(to bottom, ${bg} 0%, ${ac}20 35%, ${bg}DD 100%)`) }} />
        {/* Warm glow pool (candlelight effect) */}
        <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 100, height: 70, background: `radial-gradient(ellipse, ${ac}35 0%, transparent 70%)` }} />
        {/* Texture */}
        <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(0deg, transparent, transparent 4px, ${ac}04 4px, ${ac}04 5px)` }} />
        {/* Nav centered */}
        <div style={{ position: "relative", padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 8 }}>{["MENÚ","RESERVAS"].map(n => <span key={n} style={{ color: tx, fontSize: 4.5, letterSpacing: 2, opacity: 0.5 }}>{n}</span>)}</div>
          <span style={{ color: ac, fontSize: 13, fontFamily: BN, letterSpacing: 5, textShadow: `0 0 20px ${ac}80` }}>{brand}</span>
          <div style={{ display: "flex", gap: 8 }}>{["GALERÍA","NOSOTROS"].map(n => <span key={n} style={{ color: tx, fontSize: 4.5, letterSpacing: 2, opacity: 0.5 }}>{n}</span>)}</div>
        </div>
        {/* Hero text */}
        <div style={{ position: "relative", textAlign: "center", marginTop: 8 }}>
          <div style={{ color: tx, fontSize: 4.5, letterSpacing: 5, opacity: 0.4, fontStyle: "italic" }}>EST. 2018 · SANTIAGO</div>
          <div style={{ color: tx, fontSize: 11, fontFamily: BN, letterSpacing: 3, marginTop: 4, textShadow: `0 0 30px ${ac}50` }}>{config.rubro || "ALTA COCINA CHILENA"}</div>
          <div style={{ color: tx, fontSize: 5, opacity: 0.3, marginTop: 3, fontStyle: "italic" }}>"Cada plato, una experiencia única"</div>
          <div style={{ marginTop: 10, display: "flex", gap: 6, justifyContent: "center" }}>
            <div style={{ padding: "4px 12px", background: ac, color: bg, fontSize: 5.5, fontWeight: 700, letterSpacing: 2 }}>RESERVAR MESA</div>
            <div style={{ padding: "4px 10px", border: `1px solid ${ac}55`, color: ac, fontSize: 5.5 }}>VER MENÚ</div>
          </div>
        </div>
      </div>
      {/* Menu tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${ac}20`, borderTop: `1px solid ${ac}10`, background: `${ac}06`, flexShrink: 0 }}>
        {["ENTRADAS","FONDOS","POSTRES","MARIDAJE"].map((t, i) => (
          <div key={t} style={{ flex: 1, padding: "5px 2px", textAlign: "center", borderBottom: i === 1 ? `2px solid ${ac}` : "2px solid transparent" }}>
            <span style={{ color: i === 1 ? ac : tx, fontSize: 4.5, letterSpacing: 1, opacity: i === 1 ? 1 : 0.35 }}>{t}</span>
          </div>
        ))}
      </div>
      {/* Dish cards */}
      <div style={{ flex: 1, padding: "7px 8px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
          {[
            { name: "Lomo al Merkén", price: "$14.900", imgKey: "dish1", g: `linear-gradient(135deg,${ac}30,${ac}65)` },
            { name: "Ceviche Fuego",  price: "$10.900", imgKey: "dish2", g: `linear-gradient(135deg,${ac}18,${ac}45)` },
            { name: "Fondant Oscuro", price: "$7.900",  imgKey: "dish3", g: `linear-gradient(135deg,${ac}25,${ac}52)` },
          ].map(({ name, price, imgKey, g }) => (
            <div key={name} style={{ border: `1px solid ${ac}20`, overflow: "hidden" }}>
              <div style={{ height: 42, background: IG(imgKey, g), position: "relative" }}>
                <div style={{ position: "absolute", bottom: 4, right: 4, background: bg, color: ac, fontSize: 4, padding: "1px 3px" }}>⭐ 4.9</div>
              </div>
              <div style={{ padding: "4px" }}>
                <div style={{ color: tx, fontSize: 4.5, opacity: 0.8 }}>{name}</div>
                <div style={{ color: ac, fontSize: 6, fontWeight: 700, marginTop: 1 }}>{price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── SALUD / CLÍNICA ──────────────────────────────────────────────────────────
  if (st === "salud") return (
    <div style={root}>
      {/* Nav */}
      <div style={{ padding: "5px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${ac}15`, flexShrink: 0 }}>
        <span style={{ color: ac, fontSize: 9, fontFamily: BN, letterSpacing: 2 }}>{brand}</span>
        <div style={{ display: "flex", gap: 6 }}>{["ESPECIALIDADES","MÉDICOS","ONLINE"].map(n => <span key={n} style={{ color: tx, fontSize: 4.5, opacity: 0.5 }}>{n}</span>)}</div>
        <div style={{ padding: "3px 8px", background: ac, color: bg, fontSize: 5, fontWeight: 700 }}>📅 RESERVAR</div>
      </div>
      {/* Hero split: doctor photo + text + form */}
      <div style={{ display: "flex", height: 148, flexShrink: 0 }}>
        {/* Doctor "photo" */}
        <div style={{ width: "38%", background: IG("hero", `linear-gradient(180deg,${ac}12 0%,${ac}30 100%)`), position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 38, height: 105, background: `linear-gradient(to top,${ac}65,${ac}20)`, borderRadius: "50% 50% 0 0" }} />
          <div style={{ position: "absolute", bottom: 72, left: "50%", transform: "translateX(-50%)", width: 22, height: 22, borderRadius: "50%", background: `${ac}80` }} />
          <div style={{ position: "absolute", top: 7, left: 7, background: bg, color: ac, fontSize: 4.5, padding: "2px 5px", border: `1px solid ${ac}25` }}>Dr. Especialista</div>
        </div>
        {/* Right: text + booking form */}
        <div style={{ flex: 1, padding: "10px 10px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ color: ac, fontSize: 5, letterSpacing: 2, marginBottom: 4 }}>MEDICINA DE EXCELENCIA</div>
          <div style={{ color: tx, fontFamily: BN, fontSize: 17, lineHeight: 1 }}>TU SALUD<br/>ES PRIMERO</div>
          <div style={{ color: tx, fontSize: 4.5, opacity: 0.35, marginTop: 3, lineHeight: 1.4 }}>{config.mensaje || "Atención médica personalizada 24/7"}</div>
          {/* Booking mini-form */}
          <div style={{ marginTop: 8, background: `${ac}08`, border: `1px solid ${ac}20`, padding: "6px 7px" }}>
            <div style={{ color: ac, fontSize: 4.5, letterSpacing: 2, marginBottom: 4 }}>AGENDAR HORA</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <div style={{ background: "rgba(255,255,255,0.07)", border: `1px solid ${ac}18`, padding: "3px 5px" }}><span style={{ fontSize: 4.5, color: tx, opacity: 0.3 }}>Especialidad</span></div>
              <div style={{ background: "rgba(255,255,255,0.07)", border: `1px solid ${ac}18`, padding: "3px 5px" }}><span style={{ fontSize: 4.5, color: tx, opacity: 0.3 }}>Fecha preferida</span></div>
              <div style={{ padding: "4px 0", background: ac, textAlign: "center", color: bg, fontSize: 5, fontWeight: 700 }}>CONFIRMAR CITA</div>
            </div>
          </div>
        </div>
      </div>
      {/* Trust badges */}
      <div style={{ display: "flex", borderTop: `1px solid ${ac}10`, background: `${ac}04`, padding: "5px 8px", gap: 6, flexShrink: 0 }}>
        {[["🏥","ISO Certificada"],["⭐","4.9 Rating"],["👨‍⚕️","120+ Médicos"],["🌐","Online 24/7"]].map(([e, t]) => (
          <div key={t} style={{ flex: 1, display: "flex", alignItems: "center", gap: 3 }}>
            <span style={{ fontSize: 9 }}>{e}</span>
            <span style={{ color: tx, fontSize: 4, opacity: 0.45, lineHeight: 1.2 }}>{t}</span>
          </div>
        ))}
      </div>
      {/* Specialties grid */}
      <div style={{ flex: 1, padding: "5px 8px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 3 }}>
          {[["🦷","Dental"],["❤️","Cardio"],["🧠","Neuro"],["👁️","Oftalmo"]].map(([e, n]) => (
            <div key={n} style={{ padding: "5px 3px", background: `${ac}06`, border: `1px solid ${ac}14`, textAlign: "center" }}>
              <div style={{ fontSize: 11 }}>{e}</div>
              <div style={{ color: tx, fontSize: 4.5, opacity: 0.5, marginTop: 2 }}>{n}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── PORTAFOLIO ───────────────────────────────────────────────────────────────
  if (st === "portfolio") return (
    <div style={root}>
      {/* Floating minimal nav */}
      <div style={{ padding: "7px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <span style={{ color: tx, fontSize: 9, fontFamily: BN, letterSpacing: 3 }}>{brand}</span>
        <div style={{ display: "flex", gap: 10 }}>
          {["TRABAJO","PROCESO","CONTACTO"].map(n => <span key={n} style={{ color: tx, fontSize: 4.5, opacity: 0.35, letterSpacing: 1 }}>{n}</span>)}
        </div>
        <div style={{ width: 22, height: 22, borderRadius: "50%", border: `1px solid ${ac}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: ac, fontSize: 8 }}>→</span>
        </div>
      </div>
      {/* Intro text */}
      <div style={{ padding: "0 12px 8px", flexShrink: 0 }}>
        <div style={{ color: tx, fontFamily: BN, fontSize: 20, letterSpacing: 1, lineHeight: 1 }}>DISEÑO<br/>& CREATIVIDAD</div>
        <div style={{ color: tx, fontSize: 5, opacity: 0.25, marginTop: 3 }}>{config.mensaje || "Proyectos que dejan huella"}</div>
      </div>
      {/* Masonry grid */}
      <div style={{ flex: 1, padding: "0 8px 8px", display: "flex", gap: 4 }}>
        {/* Left: 1 tall */}
        <div style={{ flex: 1.4, background: IG("proj1", `linear-gradient(135deg,${ac}40,${ac}80)`), position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 40% 30%, ${ac}25, transparent 70%)` }} />
          <div style={{ position: "absolute", bottom: 8, left: 8 }}>
            <div style={{ color: "#fff", fontSize: 7, fontWeight: 700 }}>Branding</div>
            <div style={{ color: "#fff", fontSize: 4.5, opacity: 0.5 }}>2024</div>
          </div>
          <div style={{ position: "absolute", top: 8, right: 8, color: "#fff", fontSize: 9, opacity: 0.4 }}>→</div>
        </div>
        {/* Middle: 2 stacked */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ flex: 1, background: IG("proj2", `linear-gradient(135deg,${ac}20,${ac}55)`), position: "relative" }}>
            <div style={{ position: "absolute", bottom: 5, left: 5 }}><div style={{ color: "#fff", fontSize: 5.5, fontWeight: 700 }}>Web Design</div></div>
          </div>
          <div style={{ flex: 1, background: IG("proj3", `linear-gradient(135deg,${ac}15,${ac}40)`), position: "relative" }}>
            <div style={{ position: "absolute", bottom: 5, left: 5 }}><div style={{ color: "#fff", fontSize: 5.5, fontWeight: 700 }}>Motion</div></div>
          </div>
        </div>
        {/* Right: 3 small */}
        <div style={{ flex: 0.9, display: "flex", flexDirection: "column", gap: 4 }}>
          {[["proj4",`${ac}30`],["proj5",`${ac}45`],["proj5",`${ac}22`]].map(([k,c], i) => (
            <div key={i} style={{ flex: 1, background: IG(k, `linear-gradient(135deg,${c},${ac}65)`), position: "relative" }}>
              <div style={{ position: "absolute", bottom: 4, left: 4 }}><div style={{ color: "#fff", fontSize: 4.5, fontWeight: 700 }}>{["App UI","Editorial","Photo"][i]}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── INMOBILIARIA ─────────────────────────────────────────────────────────────
  if (st === "inmobiliaria") return (
    <div style={root}>
      {/* Nav */}
      <div style={{ padding: "5px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${ac}12`, flexShrink: 0 }}>
        <span style={{ color: tx, fontSize: 9, fontFamily: BN, letterSpacing: 3 }}>{brand}</span>
        <div style={{ display: "flex", gap: 6 }}>{["VENTA","ARRIENDO","PROYECTOS","TASACIÓN"].map(n => <span key={n} style={{ color: tx, fontSize: 4.5, opacity: 0.4 }}>{n}</span>)}</div>
        <div style={{ padding: "3px 7px", background: ac, color: bg, fontSize: 5, fontWeight: 700 }}>CONTACTAR</div>
      </div>
      {/* Full-bleed property hero */}
      <div style={{ height: 138, position: "relative", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ position: "absolute", inset: 0, background: IG("hero", `linear-gradient(160deg,${ac}22 0%,${ac}10 55%,${bg}E8 100%)`) }} />
        {/* Building skyline shapes */}
        <div style={{ position: "absolute", bottom: 0, right: "8%",  width: 52, height: 108, background: `${ac}18` }} />
        <div style={{ position: "absolute", bottom: 0, right: "24%", width: 38, height: 80, background: `${ac}13` }} />
        <div style={{ position: "absolute", bottom: 0, right: "40%", width: 28, height: 58, background: `${ac}09` }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, background: `linear-gradient(to top,${bg},transparent)` }} />
        {/* Hero content */}
        <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-55%)" }}>
          <div style={{ color: tx, fontFamily: BN, fontSize: 19, lineHeight: 1, letterSpacing: 1 }}>ENCUENTRA TU<br/>HOGAR IDEAL</div>
          <div style={{ color: tx, fontSize: 5, opacity: 0.45, marginTop: 3 }}>{config.mensaje || "Las mejores propiedades en un solo lugar"}</div>
          {/* Search bar */}
          <div style={{ marginTop: 8, display: "flex", gap: 3 }}>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)", padding: "5px 7px" }}>
              <span style={{ color: tx, fontSize: 5, opacity: 0.5 }}>🔍 Ciudad, sector...</span>
            </div>
            <div style={{ padding: "5px 8px", background: ac, color: bg, fontSize: 5.5, fontWeight: 700 }}>BUSCAR</div>
          </div>
          {/* Type pills */}
          <div style={{ marginTop: 5, display: "flex", gap: 3 }}>
            {["Casa","Depto","Terreno","Oficina"].map(f => (
              <div key={f} style={{ padding: "2px 6px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", color: tx, fontSize: 4, opacity: 0.6 }}>{f}</div>
            ))}
          </div>
        </div>
      </div>
      {/* Property cards */}
      <div style={{ flex: 1, padding: "7px 8px" }}>
        <div style={{ color: tx, fontSize: 5.5, opacity: 0.25, letterSpacing: 2, marginBottom: 5 }}>PROPIEDADES DESTACADAS</div>
        <div style={{ display: "flex", gap: 4 }}>
          {[
            { name: "Depto 2D/2B", loc: "Providencia", price: "$85M", m2: "68m²",  imgKey: "prop1", g: `linear-gradient(135deg,${ac}20,${ac}48)` },
            { name: "Casa 3D/2B",  loc: "Las Condes",  price: "$145M",m2: "140m²", imgKey: "prop2", g: `linear-gradient(135deg,${ac}14,${ac}35)` },
            { name: "Oficina Prime",loc: "Vitacura",   price: "$65M", m2: "80m²",  imgKey: "prop3", g: `linear-gradient(135deg,${ac}25,${ac}52)` },
          ].map(({ name, loc, price, m2, imgKey, g }) => (
            <div key={name} style={{ flex: 1, border: `1px solid ${ac}18`, overflow: "hidden" }}>
              <div style={{ height: 48, background: IG(imgKey, g), position: "relative" }}>
                <div style={{ position: "absolute", top: 4, left: 4, background: ac, color: bg, fontSize: 4, padding: "1px 4px", fontWeight: 700 }}>DISPONIBLE</div>
                <div style={{ position: "absolute", bottom: 4, right: 4, color: "rgba(255,255,255,0.75)", fontSize: 4.5 }}>{m2}</div>
              </div>
              <div style={{ padding: "4px" }}>
                <div style={{ color: tx, fontSize: 5, fontWeight: 700 }}>{name}</div>
                <div style={{ color: tx, fontSize: 4, opacity: 0.35, marginTop: 1 }}>📍 {loc}</div>
                <div style={{ color: ac, fontSize: 7, fontWeight: 700, marginTop: 2 }}>{price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── EDUCACIÓN ────────────────────────────────────────────────────────────────
  if (st === "educacion") return (
    <div style={root}>
      {/* Nav */}
      <div style={{ padding: "5px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${ac}15`, flexShrink: 0 }}>
        <span style={{ color: tx, fontSize: 9, fontFamily: BN, letterSpacing: 2 }}>{brand}</span>
        <div style={{ display: "flex", gap: 6 }}>{["CURSOS","LIVE","CERTIFICADOS","EMPRESAS"].map(n => <span key={n} style={{ color: tx, fontSize: 4.5, opacity: 0.4 }}>{n}</span>)}</div>
        <div style={{ padding: "3px 8px", background: ac, color: bg, fontSize: 5, fontWeight: 700 }}>IR GRATIS →</div>
      </div>
      {/* Hero split */}
      <div style={{ display: "flex", height: 132, flexShrink: 0, borderBottom: `1px solid ${ac}10` }}>
        <div style={{ flex: 1, padding: "10px 12px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ color: ac, fontSize: 5, letterSpacing: 2, marginBottom: 4 }}>APRENDE · CERTIFÍCATE · CRECE</div>
          <div style={{ color: tx, fontFamily: BN, fontSize: 19, lineHeight: 1 }}>DOMINA LAS<br/>HABILIDADES<br/>DEL FUTURO</div>
          <div style={{ color: tx, fontSize: 4.5, opacity: 0.3, marginTop: 4, lineHeight: 1.4 }}>{config.mensaje || "500+ cursos con expertos certificados"}</div>
          <div style={{ marginTop: 8, display: "flex", gap: 4 }}>
            <div style={{ padding: "4px 10px", background: ac, color: bg, fontSize: 5.5, fontWeight: 700 }}>VER CURSOS</div>
            <div style={{ padding: "4px 8px", border: `1px solid ${ac}40`, color: ac, fontSize: 5.5 }}>GRATIS →</div>
          </div>
        </div>
        {/* Video thumbnail */}
        <div style={{ width: "40%", background: IG("hero", `linear-gradient(135deg,${ac}20,${ac}42)`), position: "relative", overflow: "hidden", margin: "8px 8px 8px 0", borderRadius: 2 }}>
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 40% 40%,${ac}30,transparent 70%)` }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 10, marginLeft: 2 }}>▶</span>
            </div>
          </div>
          <div style={{ position: "absolute", bottom: 6, left: 6, right: 6 }}>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 5, fontWeight: 700 }}>Introducción gratis</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 4 }}>10 min · HD</div>
          </div>
        </div>
      </div>
      {/* Course list */}
      <div style={{ flex: 1, padding: "7px 8px" }}>
        <div style={{ color: tx, fontSize: 5.5, opacity: 0.25, letterSpacing: 2, marginBottom: 5 }}>MÁS POPULARES</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {[
            { icon: "💻", name: "Desarrollo Web Full Stack", rating: "4.9", students: "12.4K", price: "$59.990", g: `${ac}60` },
            { icon: "📱", name: "Diseño UX/UI Mobile",       rating: "4.8", students: "8.1K",  price: "$49.990", g: `${ac}45` },
            { icon: "📈", name: "Marketing Digital & IA",    rating: "4.7", students: "15.2K", price: "$39.990", g: `${ac}35` },
          ].map(({ icon, name, rating, students, price, g }) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 6px", border: `1px solid ${ac}14`, background: `${ac}04` }}>
              <div style={{ width: 28, height: 22, background: g, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 10 }}>{icon}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: tx, fontSize: 5.5, fontWeight: 700 }}>{name}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 1 }}>
                  <span style={{ color: ac, fontSize: 4.5 }}>⭐ {rating}</span>
                  <span style={{ color: tx, fontSize: 4.5, opacity: 0.3 }}>{students} alumnos</span>
                </div>
              </div>
              <div style={{ color: ac, fontSize: 6.5, fontWeight: 700, flexShrink: 0 }}>{price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── TECNOLOGÍA / SaaS ────────────────────────────────────────────────────────
  if (st === "tecnologia") return (
    <div style={root}>
      {/* Nav */}
      <div style={{ padding: "5px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${ac}15`, flexShrink: 0 }}>
        <span style={{ color: ac, fontSize: 9, fontFamily: BN, letterSpacing: 2 }}>{brand}</span>
        <div style={{ display: "flex", gap: 6 }}>{["PRODUCTO","PRECIOS","DOCS","BLOG"].map(n => <span key={n} style={{ color: tx, fontSize: 4.5, opacity: 0.4 }}>{n}</span>)}</div>
        <div style={{ display: "flex", gap: 4 }}>
          <div style={{ padding: "3px 6px", border: `1px solid ${ac}30`, color: ac, fontSize: 4.5 }}>LOGIN</div>
          <div style={{ padding: "3px 6px", background: ac, color: bg, fontSize: 4.5, fontWeight: 700 }}>PRUEBA GRATIS</div>
        </div>
      </div>
      {/* Hero */}
      <div style={{ padding: "10px 12px 7px", background: `linear-gradient(180deg,${bg} 0%,${ac}08 100%)`, flexShrink: 0, textAlign: "center" }}>
        <div style={{ display: "inline-block", color: ac, fontSize: 4.5, letterSpacing: 3, border: `1px solid ${ac}30`, padding: "2px 8px", marginBottom: 6, background: `${ac}10`, fontFamily: "monospace" }}>v2.0 NOW LIVE ✦</div>
        <div style={{ color: tx, fontFamily: BN, fontSize: 22, lineHeight: 1, letterSpacing: 1 }}>{brand}<br/>PLATFORM</div>
        <div style={{ color: tx, fontSize: 5, opacity: 0.35, marginTop: 4 }}>{config.mensaje || "Automatiza, escala y analiza en tiempo real"}</div>
        <div style={{ marginTop: 8, display: "flex", gap: 4, justifyContent: "center" }}>
          <div style={{ padding: "4px 12px", background: ac, color: bg, fontSize: 6, fontWeight: 700 }}>COMENZAR GRATIS</div>
          <div style={{ padding: "4px 10px", border: `1px solid ${ac}30`, color: ac, fontSize: 6 }}>VER DEMO</div>
        </div>
      </div>
      {/* Dashboard mockup */}
      <div style={{ margin: "0 8px 6px", border: `1px solid ${ac}20`, borderRadius: 3, overflow: "hidden", flexShrink: 0 }}>
        <div style={{ padding: "3px 6px", background: `${ac}15`, display: "flex", alignItems: "center", gap: 3 }}>
          {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width: 5, height: 5, borderRadius: "50%", background: c }} />)}
          <div style={{ flex: 1, background: `${ac}10`, height: 7, borderRadius: 1, marginLeft: 4 }} />
        </div>
        <div style={{ display: "flex", height: 58, background: `${ac}05` }}>
          <div style={{ width: 34, background: `${ac}10`, borderRight: `1px solid ${ac}15`, padding: "4px 3px", display: "flex", flexDirection: "column", gap: 2 }}>
            {[`${ac}60`,`${ac}30`,`${ac}25`,`${ac}18`].map((c, i) => <div key={i} style={{ height: 6, background: c, borderRadius: 1 }} />)}
          </div>
          <div style={{ flex: 1, padding: "4px 6px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 3 }}>
            {[70, 45, 85].map((h, i) => (
              <div key={i} style={{ background: `${ac}08`, border: `1px solid ${ac}12`, borderRadius: 1, display: "flex", alignItems: "flex-end", padding: "2px 3px" }}>
                <div style={{ width: "100%", height: `${h}%`, background: `linear-gradient(to top,${ac}65,${ac}20)`, borderRadius: 1 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Features */}
      <div style={{ flex: 1, padding: "0 8px 7px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 4 }}>
          {[["⚡","Ultra Rápido","<50ms latencia"],["🔒","Seguridad","SOC2 Compliant"],["📊","Analytics","Tiempo real"],["🔗","Integraciones","+200 apps"]].map(([e, n, d]) => (
            <div key={n} style={{ padding: "6px 6px", background: `${ac}06`, border: `1px solid ${ac}14`, display: "flex", gap: 5, alignItems: "flex-start" }}>
              <span style={{ fontSize: 10, flexShrink: 0 }}>{e}</span>
              <div>
                <div style={{ color: tx, fontSize: 5.5, fontWeight: 700 }}>{n}</div>
                <div style={{ color: tx, fontSize: 4.5, opacity: 0.3, marginTop: 1 }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── EVENTOS ──────────────────────────────────────────────────────────────────
  if (st === "eventos") return (
    <div style={root}>
      {/* Full-bleed romantic hero */}
      <div style={{ height: 168, position: "relative", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ position: "absolute", inset: 0, background: IG("hero", `radial-gradient(ellipse at 50% 30%, ${ac}38 0%, ${ac}12 55%, ${bg} 100%)`) }} />
        {/* Bokeh circles */}
        {[[10,18,22,0.14],[82,14,30,0.09],[18,68,16,0.11],[76,58,26,0.08],[46,42,42,0.07]].map(([x,y,s,o],i) => (
          <div key={i} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: s, height: s, borderRadius: "50%", background: ac, opacity: o, filter: "blur(5px)" }} />
        ))}
        {/* Subtle lines */}
        <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(45deg, transparent, transparent 20px, ${ac}04 20px, ${ac}04 21px)` }} />
        {/* Nav */}
        <div style={{ position: "relative", padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: tx, fontSize: 4.5, opacity: 0.5, letterSpacing: 2 }}>BODAS · EVENTOS</span>
          <span style={{ color: ac, fontSize: 11, fontFamily: BN, letterSpacing: 5, textShadow: `0 0 20px ${ac}` }}>{brand}</span>
          <span style={{ color: tx, fontSize: 4.5, opacity: 0.5, letterSpacing: 2 }}>GALERÍA · CITA</span>
        </div>
        {/* Hero text */}
        <div style={{ position: "relative", textAlign: "center", marginTop: 8 }}>
          <div style={{ color: ac, fontSize: 5, letterSpacing: 5, opacity: 0.7, marginBottom: 6, fontStyle: "italic" }}>✨ Tu momento único ✨</div>
          <div style={{ color: tx, fontFamily: BN, fontSize: 19, letterSpacing: 3, lineHeight: 1.1 }}>CREAMOS<br/>RECUERDOS<br/>ETERNOS</div>
          <div style={{ color: tx, fontSize: 4.5, opacity: 0.35, marginTop: 5 }}>{config.mensaje || "Bodas · Quinceaños · Empresariales"}</div>
          <div style={{ marginTop: 10, display: "flex", gap: 6, justifyContent: "center" }}>
            <div style={{ padding: "4px 14px", background: ac, color: bg, fontSize: 5.5, fontWeight: 700, letterSpacing: 2 }}>COTIZAR EVENTO</div>
            <div style={{ padding: "4px 10px", border: `1px solid ${ac}50`, color: ac, fontSize: 5.5 }}>VER GALERÍA</div>
          </div>
        </div>
      </div>
      {/* Photo gallery mosaic */}
      <div style={{ flex: 1, padding: "8px" }}>
        <div style={{ color: tx, fontSize: 5, opacity: 0.25, letterSpacing: 3, marginBottom: 6 }}>NUESTROS EVENTOS</div>
        <div style={{ height: "calc(100% - 18px)", display: "flex", gap: 4 }}>
          <div style={{ flex: 1.5, background: IG("gal1", `linear-gradient(145deg,${ac}35,${ac}65)`), position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 40% 40%,${ac}20,transparent)` }} />
            <div style={{ position: "absolute", bottom: 6, left: 6, color: "rgba(255,255,255,0.7)", fontSize: 4.5 }}>Boda 2024</div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ flex: 1, background: IG("gal2", `linear-gradient(135deg,${ac}20,${ac}50)`), position: "relative" }}>
              <div style={{ position: "absolute", bottom: 4, left: 4, color: "rgba(255,255,255,0.7)", fontSize: 4 }}>Corporativo</div>
            </div>
            <div style={{ flex: 1, background: IG("gal3", `linear-gradient(135deg,${ac}30,${ac}58)`), position: "relative" }}>
              <div style={{ position: "absolute", bottom: 4, left: 4, color: "rgba(255,255,255,0.7)", fontSize: 4 }}>Quinceaños</div>
            </div>
          </div>
          <div style={{ flex: 0.7, display: "flex", flexDirection: "column", gap: 4 }}>
            {[[`${ac}25`],[`${ac}40`],[`${ac}20`]].map(([c], i) => (
              <div key={i} style={{ flex: 1, background: `linear-gradient(135deg,${c},${ac}62)` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ── FOTOGRAFÍA ───────────────────────────────────────────────────────────────
  if (st === "fotografia") return (
    <div style={{ ...root, position: "relative" }}>
      <div style={{ height: 162, position: "relative", flexShrink: 0, background: IG("hero", `linear-gradient(145deg,${ac}15,${bg} 70%)`) }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 40%, rgba(0,0,0,0.65) 100%)" }} />
        {!images.hero && <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 30% 50%,${ac}25,transparent 70%)` }} />}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#fff", fontSize: 9, fontFamily: BN, letterSpacing: 3 }}>{brand}</span>
          <div style={{ display: "flex", gap: 8 }}>{["PORTFOLIO","SERVICIOS","CONTACTO"].map(n => <span key={n} style={{ color: "#fff", fontSize: 4.5, opacity: 0.75 }}>{n}</span>)}</div>
        </div>
        <div style={{ position: "absolute", bottom: 10, left: 12, right: 12, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <div style={{ color: ac, fontSize: 4.5, letterSpacing: 3, opacity: 0.9 }}>FOTOGRAFÍA PROFESIONAL</div>
            <div style={{ color: "#fff", fontFamily: BN, fontSize: 17, lineHeight: 1, letterSpacing: 2, marginTop: 3 }}>CAPTURANDO<br/>MOMENTOS</div>
          </div>
          <div style={{ padding: "4px 10px", background: ac, color: bg, fontSize: 5.5, fontWeight: 700 }}>CONTACTAR</div>
        </div>
      </div>
      <div style={{ flex: 1, padding: "6px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ color: tx, fontSize: 5, opacity: 0.25, letterSpacing: 3 }}>PORTFOLIO</div>
        <div style={{ flex: 1, display: "flex", gap: 4 }}>
          <div style={{ flex: 1.5, background: IG("gal1", `linear-gradient(135deg,${ac}35,${ac}65)`), position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)" }} />
            <div style={{ position: "absolute", bottom: 5, left: 5, color: "#fff", fontSize: 5, opacity: 0.85 }}>Bodas</div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ flex: 1, background: IG("gal2", `linear-gradient(135deg,${ac}20,${ac}50)`), position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent 60%)" }} />
              <div style={{ position: "absolute", bottom: 4, left: 4, color: "#fff", fontSize: 4.5, opacity: 0.85 }}>Eventos</div>
            </div>
            <div style={{ flex: 1, background: IG("gal3", `linear-gradient(135deg,${ac}28,${ac}55)`), position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent 60%)" }} />
              <div style={{ position: "absolute", bottom: 4, left: 4, color: "#fff", fontSize: 4.5, opacity: 0.85 }}>Retratos</div>
            </div>
          </div>
          <div style={{ flex: 0.8, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ flex: 1, background: IG("gal4", `linear-gradient(135deg,${ac}18,${ac}42)`), position: "relative" }}>
              <div style={{ position: "absolute", bottom: 3, left: 3, color: "#fff", fontSize: 4, opacity: 0.8 }}>Comercial</div>
            </div>
            <div style={{ flex: 1.3, background: IG("gal5", `linear-gradient(135deg,${ac}32,${ac}60)`), position: "relative" }}>
              <div style={{ position: "absolute", bottom: 3, left: 3, color: "#fff", fontSize: 4, opacity: 0.8 }}>Urbano</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── GYM / FITNESS ────────────────────────────────────────────────────────────
  if (st === "fitness") return (
    <div style={root}>
      <div style={{ padding: "5px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `2px solid ${ac}`, flexShrink: 0 }}>
        <span style={{ color: tx, fontSize: 9, fontFamily: BN, letterSpacing: 3 }}>{brand}</span>
        <div style={{ display: "flex", gap: 6 }}>{["CLASES","PLANES","NOSOTROS"].map(n => <span key={n} style={{ color: tx, fontSize: 4.5, opacity: 0.5 }}>{n}</span>)}</div>
        <div style={{ padding: "3px 8px", background: ac, color: bg, fontSize: 5, fontWeight: 700 }}>ÚNETE</div>
      </div>
      <div style={{ height: 140, position: "relative", flexShrink: 0, background: IG("hero", `linear-gradient(135deg,${bg} 30%,${ac}18 100%)`) }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${bg}E0 40%, transparent)` }} />
        {!images.hero && <>
          <div style={{ position: "absolute", bottom: 0, right: "15%", width: 50, height: 130, background: `${ac}10`, borderRadius: "50% 50% 0 0" }} />
          <div style={{ position: "absolute", bottom: 0, right: "5%",  width: 30, height: 90,  background: `${ac}08`, borderRadius: "50% 50% 0 0" }} />
        </>}
        <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
          <div style={{ color: ac, fontSize: 5, letterSpacing: 4, marginBottom: 5 }}>NO PAIN · NO GAIN</div>
          <div style={{ color: tx, fontFamily: BN, fontSize: 23, lineHeight: 1, letterSpacing: 1 }}>ENTRENA<br/>SIN LÍMITES</div>
          <div style={{ color: tx, fontSize: 5, opacity: 0.3, marginTop: 4 }}>{config.mensaje || "El gym que transforma vidas"}</div>
          <div style={{ marginTop: 8, display: "flex", gap: 5 }}>
            <div style={{ padding: "4px 10px", background: ac, color: bg, fontSize: 6, fontWeight: 700 }}>VER PLANES</div>
            <div style={{ padding: "4px 8px", border: `1px solid ${ac}40`, color: ac, fontSize: 6 }}>TOUR →</div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", borderTop: `2px solid ${ac}`, borderBottom: `1px solid ${ac}20`, flexShrink: 0 }}>
        {[["2.500+","Miembros"],["120","Clases/sem"],["25","Coaches"],["24/7","Acceso"]].map(([n, l]) => (
          <div key={l} style={{ flex: 1, padding: "5px 3px", textAlign: "center", borderRight: `1px solid ${ac}15` }}>
            <div style={{ color: ac, fontSize: 10, fontFamily: BN }}>{n}</div>
            <div style={{ color: tx, fontSize: 4, opacity: 0.35 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: "7px 8px" }}>
        <div style={{ color: tx, fontSize: 5.5, opacity: 0.25, letterSpacing: 2, marginBottom: 5 }}>INSTALACIONES</div>
        <div style={{ display: "flex", gap: 4, height: "calc(100% - 20px)" }}>
          <div style={{ flex: 1, background: IG("gym1", `linear-gradient(135deg,${ac}20,${ac}45)`), position: "relative" }}>
            <div style={{ position: "absolute", bottom: 5, left: 5, color: "rgba(255,255,255,0.85)", fontSize: 5, fontWeight: 700 }}>Musculación</div>
          </div>
          <div style={{ flex: 1, background: IG("gym2", `linear-gradient(135deg,${ac}14,${ac}32)`), position: "relative" }}>
            <div style={{ position: "absolute", bottom: 5, left: 5, color: "rgba(255,255,255,0.85)", fontSize: 5, fontWeight: 700 }}>Cardio</div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── LEGAL / ABOGADOS ─────────────────────────────────────────────────────────
  if (st === "legal") return (
    <div style={root}>
      <div style={{ padding: "5px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${ac}18`, flexShrink: 0 }}>
        <span style={{ color: tx, fontSize: 9, fontFamily: BN, letterSpacing: 3 }}>{brand}</span>
        <div style={{ display: "flex", gap: 6 }}>{["ÁREAS","EQUIPO","CASOS","CONTACTO"].map(n => <span key={n} style={{ color: tx, fontSize: 4.5, opacity: 0.4 }}>{n}</span>)}</div>
        <div style={{ padding: "3px 8px", border: `1px solid ${ac}`, color: ac, fontSize: 5 }}>CONSULTA</div>
      </div>
      <div style={{ height: 138, position: "relative", flexShrink: 0, background: IG("hero", `linear-gradient(160deg,${bg} 40%,${ac}10 100%)`) }}>
        <div style={{ position: "absolute", top: 0, left: "5%", width: 2, height: "100%", background: `linear-gradient(to bottom,transparent,${ac}55,transparent)` }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 14px" }}>
          <div style={{ color: ac, fontSize: 5, letterSpacing: 3, opacity: 0.8, marginBottom: 5 }}>DERECHO · EXCELENCIA · CONFIANZA</div>
          <div style={{ color: tx, fontFamily: BN, fontSize: 20, lineHeight: 1, letterSpacing: 1 }}>PROTEGEMOS<br/>TUS INTERESES</div>
          <div style={{ color: tx, fontSize: 5, opacity: 0.3, marginTop: 4, lineHeight: 1.5 }}>{config.mensaje || "25 años de experiencia empresarial"}</div>
          <div style={{ marginTop: 8, display: "flex", gap: 5 }}>
            <div style={{ padding: "4px 10px", background: ac, color: bg, fontSize: 5.5, fontWeight: 700 }}>CONSULTA GRATIS</div>
            <div style={{ padding: "4px 8px", border: `1px solid ${ac}40`, color: ac, fontSize: 5.5 }}>NUESTRO EQUIPO</div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", borderBottom: `1px solid ${ac}15`, background: `${ac}05`, flexShrink: 0 }}>
        {[["25+","Años"],["800+","Casos"],["15","Socios"],["100%","Conf."]].map(([n, l]) => (
          <div key={l} style={{ flex: 1, padding: "5px 3px", textAlign: "center", borderRight: `1px solid ${ac}12` }}>
            <div style={{ color: ac, fontSize: 10, fontFamily: BN }}>{n}</div>
            <div style={{ color: tx, fontSize: 4.5, opacity: 0.3 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: "7px 8px" }}>
        <div style={{ color: tx, fontSize: 5.5, opacity: 0.25, letterSpacing: 2, marginBottom: 5 }}>ÁREAS DE PRÁCTICA</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
          {[["§","Derecho Civil"],["⚖","Corporativo"],["◉","Laboral"],["△","Penal Empresarial"]].map(([icon, name]) => (
            <div key={name} style={{ padding: "5px 6px", background: `${ac}05`, border: `1px solid ${ac}12`, borderLeft: `2px solid ${ac}` }}>
              <div style={{ color: ac, fontSize: 9, marginBottom: 2 }}>{icon}</div>
              <div style={{ color: tx, fontSize: 5.5 }}>{name}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 5, height: 26, background: IG("team", `linear-gradient(90deg,${ac}08,${ac}16,${ac}08)`), display: "flex", alignItems: "center", paddingLeft: 8 }}>
          <span style={{ color: tx, fontSize: 4.5, opacity: 0.4, letterSpacing: 2 }}>NUESTRO EQUIPO DE SOCIOS</span>
        </div>
      </div>
    </div>
  );

  // ── ONG / FUNDACIÓN ──────────────────────────────────────────────────────────
  if (st === "ong") return (
    <div style={root}>
      <div style={{ padding: "5px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${ac}18`, flexShrink: 0 }}>
        <span style={{ color: ac, fontSize: 9, fontFamily: BN, letterSpacing: 2 }}>{brand}</span>
        <div style={{ display: "flex", gap: 5 }}>{["MISIÓN","PROYECTOS","VOLUNTARIOS","DONAR"].map(n => <span key={n} style={{ color: tx, fontSize: 4.5, opacity: 0.5 }}>{n}</span>)}</div>
        <div style={{ padding: "3px 8px", background: ac, color: bg, fontSize: 5, fontWeight: 700 }}>DONAR ♥</div>
      </div>
      <div style={{ height: 130, position: "relative", flexShrink: 0, background: IG("hero", `linear-gradient(135deg,${ac}20 0%,${ac}08 60%,${bg} 100%)`) }}>
        {!images.hero && <>
          <div style={{ position: "absolute", bottom: 0, right: "10%", width: 28, height: 80, background: `${ac}28`, borderRadius: "50% 50% 0 0" }} />
          <div style={{ position: "absolute", bottom: 0, right: "22%", width: 22, height: 65, background: `${ac}20`, borderRadius: "50% 50% 0 0" }} />
          <div style={{ position: "absolute", bottom: 0, right: "35%", width: 18, height: 55, background: `${ac}15`, borderRadius: "50% 50% 0 0" }} />
        </>}
        {images.hero && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} />}
        <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
          <div style={{ color: ac, fontSize: 5, letterSpacing: 3, marginBottom: 5, fontWeight: 700 }}>JUNTOS CAMBIAMOS EL MUNDO</div>
          <div style={{ color: tx, fontFamily: BN, fontSize: 19, lineHeight: 1, letterSpacing: 1 }}>CADA ACCIÓN<br/>IMPORTA</div>
          <div style={{ color: tx, fontSize: 4.5, opacity: 0.5, marginTop: 4 }}>{config.mensaje || "Apoya proyectos que transforman vidas"}</div>
          <div style={{ marginTop: 8, display: "flex", gap: 5 }}>
            <div style={{ padding: "4px 12px", background: ac, color: bg, fontSize: 6, fontWeight: 700 }}>DONAR AHORA</div>
            <div style={{ padding: "4px 8px", border: `1px solid ${ac}40`, color: tx, fontSize: 5.5 }}>VOLUNTARIO</div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", borderBottom: `1px solid ${ac}15`, background: `${ac}06`, flexShrink: 0 }}>
        {[["5.400","Familias"],["120","Proyectos"],["$2.8M","Recaudados"],["18","Países"]].map(([n, l]) => (
          <div key={l} style={{ flex: 1, padding: "5px 3px", textAlign: "center", borderRight: `1px solid ${ac}15` }}>
            <div style={{ color: ac, fontSize: 9, fontFamily: BN }}>{n}</div>
            <div style={{ color: tx, fontSize: 4, opacity: 0.4 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: "7px 8px", display: "flex", gap: 5 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ color: tx, fontSize: 5.5, opacity: 0.25, letterSpacing: 2 }}>IMPACTO</div>
          <div style={{ flex: 1, display: "flex", gap: 4 }}>
            <div style={{ flex: 1, background: IG("impact1", `linear-gradient(135deg,${ac}20,${ac}45)`), position: "relative" }}>
              <div style={{ position: "absolute", bottom: 4, left: 4, color: tx, fontSize: 4.5, opacity: 0.7 }}>Educación</div>
            </div>
            <div style={{ flex: 1, background: IG("impact2", `linear-gradient(135deg,${ac}14,${ac}32)`), position: "relative" }}>
              <div style={{ position: "absolute", bottom: 4, left: 4, color: tx, fontSize: 4.5, opacity: 0.7 }}>Alimentación</div>
            </div>
          </div>
        </div>
        <div style={{ width: 68, background: `${ac}08`, border: `1px solid ${ac}18`, padding: "6px 5px", display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ color: ac, fontSize: 5, letterSpacing: 1, fontWeight: 700 }}>TU APORTE</div>
          {[["$5.000","Snacks"],["$15.000","Kit Escolar"],["$30.000","Mes Comida"]].map(([price, label]) => (
            <div key={price} style={{ padding: "3px 4px", border: `1px solid ${ac}22`, background: `${ac}05`, textAlign: "center" }}>
              <div style={{ color: ac, fontSize: 6, fontWeight: 700 }}>{price}</div>
              <div style={{ color: tx, fontSize: 4, opacity: 0.4, marginTop: 1 }}>{label}</div>
            </div>
          ))}
          <div style={{ padding: "4px 0", background: ac, textAlign: "center", color: bg, fontSize: 5, fontWeight: 700, marginTop: 2 }}>DONAR ♥</div>
        </div>
      </div>
    </div>
  );

  // Default / sin estilo seleccionado
  return (
    <div style={{ ...root, alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ color: ac || "#c084fc", fontSize: 28, opacity: 0.15, marginBottom: 8 }}>◈</div>
        <div style={{ color: tx || "#fff", fontSize: 9, opacity: 0.15, letterSpacing: 3 }}>SELECCIONA UN ESTILO</div>
        <div style={{ color: tx || "#fff", fontSize: 7, opacity: 0.08, letterSpacing: 2, marginTop: 4 }}>← panel izquierdo</div>
      </div>
    </div>
  );
}

function WebsiteBuilder({ onClose }) {
  const [activeTab, setActiveTab]           = useState("estilo");
  const [config, setConfig]                 = useState({ style: null, palette: null, sections: ["HERO / PORTADA", "CONTACTO"], nombre: "", rubro: "", mensaje: "" });
  const [pulse, setPulse]                   = useState(false);
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const [uploadedImages, setUploadedImages]  = useState({});
  const [uploadSlot, setUploadSlot]          = useState(null);
  const fileInputRef                         = useRef(null);

  const applyChange = (key, val) => {
    setConfig(c => ({ ...c, [key]: val }));
    if (key === "style") { setUploadedImages({}); setPreviewExpanded(false); }
    setPulse(true);
    setTimeout(() => setPulse(false), 700);
  };

  const handleUpload = (slot) => { setUploadSlot(slot); fileInputRef.current?.click(); };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && uploadSlot) {
      const url = URL.createObjectURL(file);
      setUploadedImages(prev => ({ ...prev, [uploadSlot]: url }));
    }
    e.target.value = "";
  };
  const uploadSlots = STYLE_UPLOAD_SLOTS[config.style] || [];
  const toggleSection = sec => {
    setConfig(c => ({ ...c, sections: c.sections.includes(sec) ? c.sections.filter(s => s !== sec) : [...c.sections, sec] }));
    setPulse(true);
    setTimeout(() => setPulse(false), 700);
  };
  const sendToWhatsApp = () => {
    const msg = [
      "🖥️ *Nueva idea de web — olvaid-studio.github.io*", "",
      `*Estilo:* ${BUILDER_STYLES.find(s => s.id === config.style)?.label || "-"}`,
      `*Paleta:* ${BUILDER_PALETTES.find(p => p.id === config.palette)?.label || "-"}`,
      `*Secciones:* ${config.sections.join(", ") || "-"}`, "",
      `*Marca:* ${config.nombre}`,
      `*Rubro:* ${config.rubro}`,
      `*Mensaje clave:* ${config.mensaje}`,
    ].join("\n");
    window.open(`https://wa.me/56982348089?text=${encodeURIComponent(msg)}`, "_blank");
    onClose();
  };

  const TABS = [{ id: "estilo", label: "ESTILO" }, { id: "colores", label: "COLORES" }, { id: "secciones", label: "SECCIONES" }, { id: "negocio", label: "NEGOCIO" }];
  const glass = { background: "rgba(15,15,15,0.85)", backdropFilter: "blur(12px)", borderColor: "rgba(255,255,255,0.07)" };
  const inputSt = { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "8px 10px", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, outline: "none", letterSpacing: 1 };
  const completed = [config.style, config.palette, config.sections.length > 0, config.nombre.trim()];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "#0A0A0A", display: "flex", flexDirection: "column", fontFamily: "'Barlow Condensed', sans-serif" }}>
      <style>{`
        @keyframes pulseOut {
          0%   { transform: scale(0.2); opacity: 0.8; }
          100% { transform: scale(4);   opacity: 0; }
        }
        .bld-tab:hover { color: rgba(255,255,255,0.7) !important; }
        .bld-opt:hover { border-color: rgba(201,168,76,0.4) !important; background: rgba(201,168,76,0.05) !important; }
      `}</style>

      {/* ── TOP BAR ── */}
      <div style={{ height: 50, padding: "0 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", ...glass }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, letterSpacing: 4, color: "#c084fc" }}>OLVAID STUDIO</span>
          <span style={{ fontSize: 10, letterSpacing: 3, color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>— CONFIGURADOR WEB</span>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, letterSpacing: 2, padding: "5px 12px" }}>✕ CERRAR</button>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* LEFT SIDEBAR */}
        <div style={{ width: 230, borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", ...glass }}>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {TABS.map(t => (
              <button key={t.id} className="bld-tab" onClick={() => setActiveTab(t.id)} style={{ flex: 1, padding: "9px 0", background: activeTab === t.id ? "rgba(192,132,252,0.08)" : "none", border: "none", borderBottom: activeTab === t.id ? "2px solid #c084fc" : "2px solid transparent", color: activeTab === t.id ? "#c084fc" : "rgba(255,255,255,0.25)", cursor: "pointer", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", transition: "color 0.2s" }}>
                {t.label}
              </button>
            ))}
          </div>
          {/* Panel */}
          <div style={{ flex: 1, overflow: "auto", padding: 14 }}>

            {activeTab === "estilo" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, color: "rgba(255,255,255,0.2)", marginBottom: 4 }}>SELECCIONA UN ESTILO</div>
                {BUILDER_STYLES.map(s => (
                  <div key={s.id} className="bld-opt" onClick={() => applyChange("style", s.id)} style={{ cursor: "pointer", padding: 10, border: config.style === s.id ? "1px solid #c9a84c" : "1px solid rgba(255,255,255,0.07)", background: config.style === s.id ? "rgba(201,168,76,0.07)" : "rgba(255,255,255,0.01)", transition: "all 0.2s", boxShadow: config.style === s.id ? "0 0 10px rgba(201,168,76,0.15)" : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 30, height: 20, background: s.bg, border: `2px solid ${s.accent}`, borderRadius: 2, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: config.style === s.id ? "#c9a84c" : "#fff" }}>{s.label}</div>
                        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: 1, marginTop: 1 }}>{s.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "colores" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, color: "rgba(255,255,255,0.2)", marginBottom: 4 }}>PALETA DE COLORES</div>
                {BUILDER_PALETTES.map(p => (
                  <div key={p.id} className="bld-opt" onClick={() => applyChange("palette", p.id)} style={{ cursor: "pointer", padding: 10, border: config.palette === p.id ? "1px solid #c9a84c" : "1px solid rgba(255,255,255,0.07)", background: config.palette === p.id ? "rgba(201,168,76,0.07)" : "rgba(255,255,255,0.01)", transition: "all 0.2s", boxShadow: config.palette === p.id ? "0 0 10px rgba(201,168,76,0.15)" : "none" }}>
                    <div style={{ display: "flex", gap: 2, height: 14, marginBottom: 6 }}>{p.colors.map((col, i) => <div key={i} style={{ flex: 1, background: col, borderRadius: 1 }} />)}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: config.palette === p.id ? "#c9a84c" : "rgba(255,255,255,0.6)" }}>{p.label}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "secciones" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, color: "rgba(255,255,255,0.2)", marginBottom: 4 }}>PÁGINAS / SECCIONES</div>
                {BUILDER_SECTIONS.map(sec => {
                  const active = config.sections.includes(sec);
                  return (
                    <div key={sec} className="bld-opt" onClick={() => toggleSection(sec)} style={{ cursor: "pointer", padding: "9px 10px", border: active ? "1px solid #c9a84c" : "1px solid rgba(255,255,255,0.07)", background: active ? "rgba(201,168,76,0.07)" : "rgba(255,255,255,0.01)", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}>
                      <div style={{ width: 11, height: 11, borderRadius: 2, border: active ? "1px solid #c9a84c" : "1px solid rgba(255,255,255,0.2)", background: active ? "#c9a84c" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {active && <span style={{ color: "#0A0A0A", fontSize: 7, fontWeight: 900 }}>✓</span>}
                      </div>
                      <span style={{ fontSize: 11, letterSpacing: 2, color: active ? "#fff" : "rgba(255,255,255,0.35)" }}>{sec}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === "negocio" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, color: "rgba(255,255,255,0.2)", marginBottom: 4 }}>TU INFORMACIÓN</div>
                {[
                  { key: "nombre", label: "MARCA / NEGOCIO", placeholder: "Ej: Clínica Dental Montoya" },
                  { key: "rubro",  label: "RUBRO",            placeholder: "Ej: Salud · Odontología" },
                  { key: "mensaje",label: "MENSAJE CLAVE",    placeholder: "Ej: Tu sonrisa es nuestra misión" },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: "block", fontSize: 9, letterSpacing: 2, color: "rgba(255,255,255,0.3)", marginBottom: 5 }}>{f.label}</label>
                    <input value={config[f.key]} onChange={e => setConfig(c => ({ ...c, [f.key]: e.target.value }))} placeholder={f.placeholder} style={inputSt} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CENTER VIEWPORT */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", background: "#050505" }}>
          {/* Grid técnica */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(192,132,252,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(192,132,252,0.025) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
          {/* Pulse */}
          {pulse && <div style={{ position: "absolute", width: 160, height: 160, borderRadius: "50%", border: "2px solid rgba(201,168,76,0.5)", pointerEvents: "none", animation: "pulseOut 0.7s ease-out forwards" }} />}
          {/* Corner marks */}
          {[{top:16,left:16,bt:"top",bl:"left"},{top:16,right:16,bt:"top",bl:"right"},{bottom:16,left:16,bt:"bottom",bl:"left"},{bottom:16,right:16,bt:"bottom",bl:"right"}].map((c,i) => (
            <div key={i} style={{ position: "absolute", top: c.top, bottom: c.bottom, left: c.left, right: c.right, width: 14, height: 14, borderTop: c.bt==="top"?"1px solid rgba(192,132,252,0.2)":"none", borderBottom: c.bt==="bottom"?"1px solid rgba(192,132,252,0.2)":"none", borderLeft: c.bl==="left"?"1px solid rgba(192,132,252,0.2)":"none", borderRight: c.bl==="right"?"1px solid rgba(192,132,252,0.2)":"none" }} />
          ))}
          {/* Browser mockup — click to expand */}
          <div
            onClick={() => { if (config.style && !previewExpanded) setPreviewExpanded(true); }}
            style={{
              ...(previewExpanded
                ? { position: "absolute", inset: 0, width: "100%", borderRadius: 0, zIndex: 5 }
                : { width: 440, maxWidth: "90%", borderRadius: 6 }),
              border: "1px solid rgba(255,255,255,0.1)",
              overflow: "hidden",
              boxShadow: previewExpanded ? "none" : "0 0 80px rgba(192,132,252,0.08), 0 30px 80px rgba(0,0,0,0.6)",
              cursor: config.style && !previewExpanded ? "pointer" : "default",
              transition: "box-shadow 0.4s",
            }}
          >
            <div style={{ padding: "8px 12px", background: "#181818", display: "flex", alignItems: "center", gap: 6 }}>
              {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />)}
              <div style={{ flex: 1, background: "#252525", borderRadius: 3, height: 16, marginLeft: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", letterSpacing: 1 }}>olvaid-studio.com</span>
              </div>
              {previewExpanded && (
                <button
                  onClick={e => { e.stopPropagation(); setPreviewExpanded(false); }}
                  style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontSize: 9, letterSpacing: 1, padding: "2px 8px", flexShrink: 0 }}
                >▼ COLAPSAR</button>
              )}
            </div>
            <div style={{ height: previewExpanded ? "calc(100% - 34px)" : 400 }}>
              <MiniPreview paletteId={config.palette} config={config} images={uploadedImages} />
            </div>
          </div>
          {/* Expand hint */}
          {!previewExpanded && config.style && (
            <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", fontSize: 7, color: "rgba(255,255,255,0.2)", letterSpacing: 2, whiteSpace: "nowrap", pointerEvents: "none" }}>
              ↑ CLICK PARA EXPANDIR Y SUBIR FOTOS
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div style={{ width: 170, borderLeft: "1px solid rgba(255,255,255,0.06)", padding: "16px 14px", ...glass, display: "flex", flexDirection: "column", gap: 10, overflow: "auto" }}>
          {previewExpanded ? (
            /* ── Upload slots panel ── */
            <>
              <div style={{ fontSize: 9, letterSpacing: 3, color: "rgba(255,255,255,0.18)", flexShrink: 0 }}>SUBIR IMÁGENES</div>
              {uploadSlots.length === 0 && (
                <div style={{ color: "rgba(255,255,255,0.15)", fontSize: 9, textAlign: "center", marginTop: 24, lineHeight: 1.6 }}>
                  Selecciona un<br/>estilo primero
                </div>
              )}
              {uploadSlots.map(slot => (
                <div key={slot.id} style={{ flexShrink: 0 }}>
                  <div style={{ fontSize: 7.5, letterSpacing: 1, color: "#c084fc", marginBottom: 5, textTransform: "uppercase" }}>{slot.label}</div>
                  <div
                    onClick={() => handleUpload(slot.id)}
                    style={{
                      height: 54,
                      border: uploadedImages[slot.id] ? "1px solid rgba(192,132,252,0.5)" : "1px dashed rgba(255,255,255,0.15)",
                      background: uploadedImages[slot.id] ? `url(${uploadedImages[slot.id]}) center/cover no-repeat` : "rgba(255,255,255,0.02)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: 2,
                    }}
                  >
                    {!uploadedImages[slot.id] && (
                      <div style={{ textAlign: "center" }}>
                        <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 18, lineHeight: 1 }}>+</div>
                        <div style={{ color: "rgba(255,255,255,0.15)", fontSize: 6, letterSpacing: 1, marginTop: 2 }}>SUBIR FOTO</div>
                      </div>
                    )}
                    {uploadedImages[slot.id] && (
                      <div style={{ position: "absolute", bottom: 2, right: 2, background: "rgba(0,0,0,0.65)", color: "#c084fc", fontSize: 6, padding: "1px 4px", letterSpacing: 1 }}>cambiar</div>
                    )}
                  </div>
                </div>
              ))}
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
            </>
          ) : (
            /* ── Summary panel ── */
            <>
              <div style={{ fontSize: 9, letterSpacing: 3, color: "rgba(255,255,255,0.18)", textTransform: "uppercase" }}>RESUMEN</div>
              {[
                ["ESTILO",   BUILDER_STYLES.find(s => s.id === config.style)?.label],
                ["PALETA",   BUILDER_PALETTES.find(p => p.id === config.palette)?.label],
                ["SECCIONES",config.sections.length ? `${config.sections.length} selec.` : null],
                ["MARCA",    config.nombre],
                ["RUBRO",    config.rubro],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 8, letterSpacing: 2, color: "#c084fc", marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 11, color: v ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.15)", letterSpacing: 1 }}>{v || "—"}</div>
                </div>
              ))}
              <div style={{ flex: 1 }} />
              <div style={{ padding: "10px", background: "rgba(192,132,252,0.05)", border: "1px solid rgba(192,132,252,0.12)" }}>
                <div style={{ fontSize: 8, letterSpacing: 2, color: "#c084fc", marginBottom: 8 }}>PROGRESO</div>
                {["Estilo","Colores","Secciones","Negocio"].map((label, i) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: completed[i] ? "#84cc16" : "rgba(255,255,255,0.15)", boxShadow: completed[i] ? "0 0 6px #84cc16" : "none", transition: "all 0.3s" }} />
                    <span style={{ fontSize: 9, letterSpacing: 1, color: completed[i] ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.18)" }}>{label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── BOTTOM TOOLBAR ── */}
      <div style={{ height: 68, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", padding: "0 20px", gap: 14, ...glass }}>
        <span style={{ fontSize: 9, letterSpacing: 3, color: "rgba(255,255,255,0.18)", flexShrink: 0, textTransform: "uppercase" }}>PALETA RÁPIDA</span>
        {/* Color carousel */}
        <div style={{ flex: 1, display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
          {BUILDER_PALETTES.map(p => (
            <div key={p.id} onClick={() => applyChange("palette", p.id)} style={{ cursor: "pointer", flexShrink: 0, width: 72, border: config.palette === p.id ? "2px solid #c9a84c" : "1px solid rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden", boxShadow: config.palette === p.id ? "0 0 14px rgba(201,168,76,0.35)" : "none", transition: "all 0.2s" }}>
              <div style={{ display: "flex", height: 26 }}>{p.colors.map((col, i) => <div key={i} style={{ flex: 1, background: col }} />)}</div>
              <div style={{ padding: "2px 5px", background: "#111" }}>
                <span style={{ fontSize: 7, letterSpacing: 1, color: config.palette === p.id ? "#c9a84c" : "rgba(255,255,255,0.3)" }}>{p.label}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.06)", flexShrink: 0 }} />
        {/* NECESITO AYUDA */}
        <button onClick={() => {
          const msg = "Hola, quiero una web pero no sé por dónde empezar. ¿Me pueden ayudar?";
          window.open(`https://wa.me/56982348089?text=${encodeURIComponent(msg)}`, "_blank");
          onClose();
        }} style={{ flexShrink: 0, padding: "8px 14px", background: "rgba(192,132,252,0.08)", border: "1px solid rgba(192,132,252,0.25)", cursor: "pointer", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "rgba(192,132,252,0.7)", borderRadius: 2, lineHeight: 1.4, textAlign: "center" }}>
          🤔 NECESITO<br/>AYUDA
        </button>
        <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.06)", flexShrink: 0 }} />
        {/* TENGO LA IDEA EN MENTE */}
        <button onClick={() => {
          const msg = "Hola, tengo una idea de web en mente y me gustaría hablarla con ustedes.";
          window.open(`https://wa.me/56982348089?text=${encodeURIComponent(msg)}`, "_blank");
          onClose();
        }} style={{ flexShrink: 0, padding: "8px 14px", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.5)", cursor: "pointer", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#c9a84c", borderRadius: 2, lineHeight: 1.4, textAlign: "center", boxShadow: "0 0 14px rgba(201,168,76,0.2), inset 0 0 10px rgba(201,168,76,0.05)", fontWeight: 700 }}>
          💡 TENGO LA IDEA<br/>EN MENTE
        </button>
        <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.06)", flexShrink: 0 }} />
        {/* ENVIAR IDEA */}
        <button onClick={sendToWhatsApp} style={{ flexShrink: 0, padding: "11px 22px", background: "linear-gradient(135deg, #16a34a, #22c55e)", border: "none", cursor: "pointer", boxShadow: "0 0 24px rgba(34,197,94,0.35)", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#fff", borderRadius: 2 }}>
          ENVIAR IDEA →
        </button>
      </div>
    </div>
  );
}

// ── FIN BUILDER ───────────────────────────────────────────────────────────────

// Genera path SVG zigzag entre dos puntos (coordenadas en espacio 0-100)
function makeLightningPath(x1, y1, x2, y2, jags = 9) {
  const pts = [[x1, y1]];
  for (let i = 1; i < jags; i++) {
    const t = i / jags;
    const x = x1 + (x2 - x1) * t + (Math.random() - 0.5) * 7;
    const y = y1 + (y2 - y1) * t + (Math.random() - 0.5) * 5;
    pts.push([x, y]);
  }
  pts.push([x2, y2]);
  return "M " + pts.map(p => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ");
}

// Posición de cada tarjeta según índice y total
function cardPosition(index, total) {
  // Alterna paredes: 0→derecha, 1→izquierda, 2→derecha, ...
  const side = index % 2 === 0 ? "right" : "left";
  const topPercents = total === 1 ? [50] : total === 2 ? [35, 35] : [25, 50, 70];
  const top = topPercents[index] ?? 50;
  return { side, top };
}

export default function App() {
  const [builderOpen, setBuilderOpen]     = useState(false);
  const [menuOpen, setMenuOpen]           = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [loaded, setLoaded]               = useState(false);
  const [glitch, setGlitch]               = useState(false);
  const [projectsOpen, setProjectsOpen]   = useState(false);
  const [lightningPaths, setLightningPaths] = useState([]);
  const [lightningActive, setLightningActive] = useState(false);
  const [screenFlash, setScreenFlash]     = useState(false);
  const [ambientBolts, setAmbientBolts]   = useState([]);
  const videoRef = useRef(null);

  useEffect(() => {
    const t  = setTimeout(() => setLoaded(true), 100);
    const gi = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 4500);

    // Rayos ambientales aleatorios
    const scheduleAmbient = () => {
      const delay = 7000 + Math.random() * 9000; // cada 7-16s
      return setTimeout(() => {
        const count = Math.random() < 0.3 ? 2 : 1; // a veces 2 rayos
        const bolts = Array.from({ length: count }, () => {
          const fromLeft = Math.random() < 0.5;
          const startX = fromLeft ? -2 : 102;
          const endX   = fromLeft ? 102 : -2;
          const startY = 10 + Math.random() * 80;
          const endY   = 10 + Math.random() * 80;
          return { id: Math.random(), path: makeLightningPath(startX, startY, endX, endY, 10) };
        });
        setAmbientBolts(bolts);
        setTimeout(() => setAmbientBolts([]), 500);
        scheduleAmbient();
      }, delay);
    };
    const ambientTimer = scheduleAmbient();

    return () => { clearTimeout(t); clearInterval(gi); clearTimeout(ambientTimer); };
  }, []);

  const handleVerProyectos = useCallback(() => {
    if (projectsOpen) { setProjectsOpen(false); return; }

    // Genera un rayo por proyecto, cada uno apunta a su posición en la pared
    const paths = PROJECTS.map((_, i) => {
      const { side, top } = cardPosition(i, PROJECTS.length);
      const endX = side === "right" ? 94 : 6;
      const endY = top;
      return makeLightningPath(50, 82, endX, endY);
    });

    setLightningPaths(paths);
    setLightningActive(true);

    // Flash al impactar
    setTimeout(() => setScreenFlash(true), 400);
    setTimeout(() => setScreenFlash(false), 550);

    // Mostrar tarjetas
    setTimeout(() => {
      setProjectsOpen(true);
      setLightningActive(false);
    }, 700);
  }, [projectsOpen]);

  const menuItems = [
    { label: "PROYECTOS", action: handleVerProyectos },
    { label: "PROCESO",   url: "#" },
    { label: "ESTUDIO",   url: "#" },
    { label: "CONTACTO",  action: () => setContactModalOpen(true) }
  ];

  return (
    <div style={{
      position: "relative", width: "100vw", height: "100vh",
      background: "#050308", color: "#fff",
      fontFamily: "'Barlow Condensed', sans-serif",
      overflow: "hidden", cursor: projectsOpen ? "default" : "crosshair",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanMove {
          0%   { background-position: 0 0; }
          100% { background-position: 0 100px; }
        }
        @keyframes curtainLeft {
          from { transform: translateX(-60px); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        @keyframes curtainRight {
          from { transform: translateX(60px); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        @keyframes heroReveal {
          from { opacity: 0; transform: scale(1.04); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes glitchShift {
          0%   { opacity: 1; clip-path: inset(0 0 95% 0);   transform: translate(-4px, 0); }
          20%  { opacity: 1; clip-path: inset(40% 0 50% 0); transform: translate(4px, 0);  }
          40%  { opacity: 1; clip-path: inset(70% 0 10% 0); transform: translate(-2px, 0); }
          60%  { opacity: 1; clip-path: inset(20% 0 75% 0); transform: translate(3px, 0);  }
          80%  { opacity: 1; clip-path: inset(60% 0 30% 0); transform: translate(-3px, 0); }
          100% { opacity: 0; clip-path: inset(0 0 95% 0);   transform: translate(0, 0);    }
        }
        @keyframes lineExpand {
          from { width: 0; }
          to   { width: 100%; }
        }
        @keyframes videoGlow {
          0%, 100% { opacity: 0.4; transform: translateX(-50%) scaleX(1);    }
          50%      { opacity: 0.7; transform: translateX(-50%) scaleX(1.15); }
        }
        @keyframes blinkDot {
          0%, 100% { opacity: 1; } 50% { opacity: 0; }
        }
        @keyframes menuSlide {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes lightningStrike {
          0%   { stroke-dashoffset: 300; opacity: 1; }
          60%  { stroke-dashoffset: 0;   opacity: 1; }
          100% { stroke-dashoffset: 0;   opacity: 0; }
        }
        @keyframes cardSlideRight {
          from { opacity: 0; transform: translateX(40px) translateY(-50%); }
          to   { opacity: 1; transform: translateX(0)    translateY(-50%); }
        }
        @keyframes cardSlideLeft {
          from { opacity: 0; transform: translateX(-40px) translateY(-50%); }
          to   { opacity: 1; transform: translateX(0)     translateY(-50%); }
        }
        @keyframes impactFlash {
          0%   { opacity: 0; }
          50%  { opacity: 0.25; }
          100% { opacity: 0; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: var(--star-op); }
          50%      { opacity: calc(var(--star-op) * 0.2); }
        }

        .curtain-left  { animation: ${loaded ? "curtainLeft  1.2s cubic-bezier(0.16,1,0.3,1) 0.1s both" : "none"}; }
        .curtain-right { animation: ${loaded ? "curtainRight 1.2s cubic-bezier(0.16,1,0.3,1) 0.1s both" : "none"}; }
        .hero-area     { animation: ${loaded ? "heroReveal   1.4s cubic-bezier(0.16,1,0.3,1) 0.5s both" : "none"}; }
        .title-main    { animation: ${loaded ? "fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.8s both" : "none"}; }
        .subtitle-line { animation: ${loaded ? "fadeUp 1s cubic-bezier(0.16,1,0.3,1) 1.0s both" : "none"}; }
        .cta-row       { animation: ${loaded ? "fadeUp 1s cubic-bezier(0.16,1,0.3,1) 1.1s both" : "none"}; }
        .ui-top        { animation: ${loaded ? "fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s both" : "none"}; }

        .glitch-layer { position: relative; display: inline-block; }
        .glitch-layer::before,
        .glitch-layer::after {
          content: attr(data-text);
          position: absolute; left: 0; top: 0; width: 100%;
          opacity: 0; pointer-events: none;
        }
        .glitch-layer::before { color: #ff00ff; animation: ${glitch ? "glitchShift 0.15s steps(1) forwards" : "none"}; }
        .glitch-layer::after  { color: #00ffff; animation: ${glitch ? "glitchShift 0.15s steps(1) 0.04s forwards" : "none"}; }

        .scan-lines {
          position: absolute; inset: 0; pointer-events: none; z-index: 5;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px);
          animation: scanMove 8s linear infinite;
        }
        .video-glow    { animation: videoGlow 3s ease-in-out infinite; }
        .blink         { animation: blinkDot 1.2s step-end infinite; }
        .menu-overlay  { animation: menuSlide 0.3s cubic-bezier(0.16,1,0.3,1) both; }

        .lightning-path {
          stroke-dasharray: 300;
          stroke-dashoffset: 300;
          animation: lightningStrike 0.7s ease-out forwards;
        }
        .lightning-path-glow {
          stroke-dasharray: 300;
          stroke-dashoffset: 300;
          animation: lightningStrike 0.7s ease-out forwards;
          animation-delay: 0.02s;
        }

        .try-btn:hover       { background: rgba(255,255,255,0.12) !important; border-color: rgba(255,255,255,0.6) !important; }
        .menu-item:hover     { color: #c084fc !important; letter-spacing: 8px !important; }
        .cta-primary:hover   { background: #e0e0e0 !important; }
        .cta-secondary:hover { border-color: rgba(255,255,255,0.5) !important; color: #fff !important; }

        video::-webkit-media-controls { display: none !important; }
        video { object-fit: contain; }
      `}</style>

      {/* ── ESTRELLAS ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        {STARS.map(s => (
          <div key={s.id} style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "#fff",
            "--star-op": s.opacity,
            opacity: s.opacity,
            animation: s.twinkle
              ? `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`
              : "none",
          }} />
        ))}
      </div>

      {/* ── RAYOS AMBIENTALES ── */}
      {ambientBolts.length > 0 && (
        <svg key={ambientBolts[0].id} style={{
          position: "fixed", inset: 0, width: "100vw", height: "100vh",
          zIndex: 6, pointerEvents: "none",
        }} viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <filter id="aglow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.6" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {ambientBolts.map(bolt => (
            <g key={bolt.id} style={{ animation: "lightningStrike 0.5s ease-out forwards" }}>
              <path d={bolt.path} fill="none" stroke="rgba(192,132,252,0.25)"
                strokeWidth="0.8" filter="url(#aglow)"
                strokeDasharray="200" strokeDashoffset="200"
                style={{ animation: "lightningStrike 0.5s ease-out forwards" }} />
              <path d={bolt.path} fill="none" stroke="rgba(255,255,255,0.5)"
                strokeWidth="0.2"
                strokeDasharray="200" strokeDashoffset="200"
                style={{ animation: "lightningStrike 0.5s ease-out forwards" }} />
            </g>
          ))}
        </svg>
      )}

      {/* SCAN LINES */}
      <div className="scan-lines" />

      {/* NOISE GRAIN */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none", opacity: 0.035,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      {/* HUD BRACKETS */}
      {["top-left","top-right","bottom-left","bottom-right"].map(p => <HUDBracket key={p} position={p} />)}

      {/* COORD izquierda */}
      <div style={{
        position: "absolute", bottom: 30, left: 24, zIndex: 20,
        fontSize: 11, letterSpacing: 3, color: "rgba(255,255,255,0.35)",
        fontWeight: 600, textTransform: "uppercase", lineHeight: 1.8,
      }}>
        33.4°S / 70.6°W<br />
        <span style={{ opacity: 0.5 }}>SANTIAGO, CL</span>
      </div>

      {/* COORD derecha */}
      <div style={{
        position: "absolute", bottom: 30, right: 24, zIndex: 20,
        fontSize: 11, letterSpacing: 3, color: "rgba(255,255,255,0.35)",
        fontWeight: 600, textTransform: "uppercase", textAlign: "right",
      }}>
        <span className="blink" style={{ color: "#c084fc", marginRight: 6 }}>●</span>
        SISTEMA ACTIVO
      </div>

      {/* CORTINA IZQUIERDA */}
      <div className="curtain-left" style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: "22%",
        background: "linear-gradient(to right, #0e0610 60%, transparent 100%)",
        zIndex: 2,
      }}>
        <div style={{
          position: "absolute", right: 0, top: "10%", bottom: "10%",
          width: 1, background: "linear-gradient(to bottom, transparent, rgba(192,132,252,0.3), transparent)",
        }} />
      </div>

      {/* CORTINA DERECHA */}
      <div className="curtain-right" style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: "22%",
        background: "linear-gradient(to left, #0e0610 60%, transparent 100%)",
        zIndex: 2,
      }}>
        <div style={{
          position: "absolute", left: 0, top: "10%", bottom: "10%",
          width: 1, background: "linear-gradient(to bottom, transparent, rgba(192,132,252,0.3), transparent)",
        }} />
      </div>

      {/* HERO VIDEO */}
      <div className="hero-area" style={{
        position: "absolute", inset: 0, zIndex: 1,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{
            position: "relative", height: "82vh",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 75%, transparent 100%), linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            maskComposite: "intersect",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 75%, transparent 100%), linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskComposite: "source-in",
          }}>
            <video ref={videoRef} src={VIDEO_URL} autoPlay muted loop playsInline
              style={{ height: "100%", width: "auto", maxWidth: "50vw" }} />
          </div>
          <div className="video-glow" style={{
            position: "absolute", bottom: -10, left: "50%",
            width: 220, height: 44, borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(192,132,252,0.3) 0%, transparent 70%)",
            filter: "blur(10px)",
          }} />
          <div style={{
            position: "absolute", bottom: -30, left: "50%", transform: "translateX(-50%)",
            width: "80%", height: 30,
            background: "linear-gradient(to bottom, rgba(192,132,252,0.06), transparent)",
            filter: "blur(4px)",
          }} />
        </div>
      </div>

      {/* ── RAYOS ── */}
      {lightningActive && lightningPaths.length > 0 && (
        <svg
          key={lightningPaths[0]} // re-mount para re-trigger animation
          style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", zIndex: 60, pointerEvents: "none" }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="lglow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {lightningPaths.map((path, i) => (
            <g key={i}>
              {/* capa glow */}
              <path d={path} fill="none" stroke="rgba(192,132,252,0.6)" strokeWidth="1.5"
                filter="url(#lglow)" className="lightning-path-glow" />
              {/* capa blanca core */}
              <path d={path} fill="none" stroke="#fff" strokeWidth="0.5"
                className="lightning-path" />
            </g>
          ))}
        </svg>
      )}

      {/* ── FLASH DE IMPACTO ── */}
      {screenFlash && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 61, pointerEvents: "none",
          background: "rgba(192,132,252,0.25)",
          animation: "impactFlash 0.15s ease-out forwards",
        }} />
      )}


      {/* ── TARJETAS DE PROYECTOS ── */}
      {projectsOpen && PROJECTS.map((project, i) => {
        const { side, top } = cardPosition(i, PROJECTS.length);
        const isRight = side === "right";
        return (
          <div key={project.id} style={{
            position: "fixed",
            [side]: 0,
            top: `${top}%`,
            transform: "translateY(-50%)",
            zIndex: 55,
            width: 220,
            cursor: "default",
            animation: isRight ? "cardSlideRight 0.5s cubic-bezier(0.16,1,0.3,1) forwards"
                                : "cardSlideLeft  0.5s cubic-bezier(0.16,1,0.3,1) forwards",
            animationDelay: `${i * 0.35}s`,
            opacity: 0,
          }}>
            {/* Línea de conexión lateral */}
            <div style={{
              position: "absolute",
              top: "50%",
              [isRight ? "right" : "left"]: "100%",
              width: 32,
              height: 1,
              background: "linear-gradient(to " + (isRight ? "right" : "left") + ", transparent, rgba(192,132,252,0.6))",
            }} />

            <div style={{
              background: "rgba(14,6,16,0.97)",
              border: "1px solid rgba(192,132,252,0.4)",
              [isRight ? "borderRight" : "borderLeft"]: "none",
              padding: 0,
              overflow: "hidden",
            }}>
              {/* Header tarjeta */}
              <div style={{
                padding: "8px 12px",
                borderBottom: "1px solid rgba(192,132,252,0.2)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 16, letterSpacing: 2, color: "#c084fc",
                }}>{project.name}</span>
                <span style={{
                  fontSize: 10, letterSpacing: 2, color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                }}>{project.desc}</span>
              </div>

              {/* Preview iframe */}
              <div style={{ position: "relative", height: 130, overflow: "hidden", background: "#080410" }}>
                <iframe
                  src={project.url}
                  title={project.name}
                  style={{
                    width: "160%", height: "160%",
                    border: "none",
                    transform: "scale(0.625)", transformOrigin: "top left",
                    pointerEvents: "none",
                    opacity: 0.85,
                  }}
                />
                {/* overlay scanlines sobre iframe */}
                <div style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
                }} />
              </div>

              {/* Footer tarjeta */}
              <div style={{ padding: "8px 12px", display: "flex", gap: 8 }}>
                <a href={project.url} target="_blank" rel="noreferrer" style={{
                  flex: 1, textAlign: "center",
                  background: "rgba(192,132,252,0.15)",
                  border: "1px solid rgba(192,132,252,0.3)",
                  color: "#c084fc",
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 11, fontWeight: 700, letterSpacing: 2,
                  textTransform: "uppercase", padding: "6px 0",
                  textDecoration: "none",
                  display: "block",
                  cursor: "pointer",
                }}>VISITAR →</a>
                <button onClick={() => setProjectsOpen(false)} style={{
                  background: "none", border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.3)", cursor: "pointer",
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 11, letterSpacing: 1, padding: "6px 8px",
                  textTransform: "uppercase",
                }}>✕</button>
              </div>
            </div>
          </div>
        );
      })}

      {/* TOP BAR */}
      <div className="ui-top" style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 30,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 28px",
      }}>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 10,
          color: "#fff", fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 13, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, width: 20 }}>
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: "block", height: 1.5,
                background: (menuOpen && i !== 1) ? "#c084fc" : "#fff",
                opacity: menuOpen && i === 1 ? 0 : 1,
                transition: "all 0.3s",
                transform: menuOpen && i === 0 ? "rotate(45deg) translateY(5.5px)"
                         : menuOpen && i === 2 ? "rotate(-45deg) translateY(-5.5px)" : "none",
              }} />
            ))}
          </div>
          MENÚ
        </button>

        <button className="try-btn" onClick={() => setBuilderOpen(true)} style={{
          background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.3)",
          color: "#fff", fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 12, fontWeight: 600, letterSpacing: 2,
          textTransform: "uppercase", padding: "8px 16px",
          cursor: "pointer", transition: "all 0.3s",
          display: "flex", alignItems: "center", gap: 8, borderRadius: 2,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%", background: "#84cc16",
            boxShadow: "0 0 6px #84cc16, 0 0 12px #84cc16", display: "inline-block",
            animation: "blinkDot 1.5s ease-in-out infinite"
          }} />
          TRY A 3D PREVIEW
        </button>
      </div>

      {/* MENÚ OVERLAY */}
      {menuOpen && (
        <div className="menu-overlay" style={{
          position: "absolute", inset: 0, zIndex: 50,
          background: "rgba(8,8,8,0.97)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          {menuItems.map((item, i) => (
            <div key={item.label} style={{ animation: `fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${0.05*i}s both` }}>
              <button className="menu-item" onClick={() => {
                setMenuOpen(false);
                if (item.url && item.url !== "#") window.open(item.url, "_blank");
                if (item.action) item.action();
              }} style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(48px, 8vw, 96px)",
                color: "rgba(255,255,255,0.85)",
                letterSpacing: 6, textTransform: "uppercase",
                transition: "all 0.3s", display: "block", lineHeight: 1.05,
              }}>
                {item.label}
              </button>
            </div>
          ))}
          <button onClick={() => setMenuOpen(false)} style={{
            position: "absolute", top: 24, right: 28,
            background: "none", border: "none", color: "rgba(255,255,255,0.4)",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 13, letterSpacing: 3, cursor: "pointer", textTransform: "uppercase",
          }}>
            [ CERRAR ]
          </button>
          <div style={{
            position: "absolute", bottom: 32,
            fontSize: 11, letterSpacing: 4, color: "rgba(255,255,255,0.2)",
            fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase",
          }}>
            OLVAID STUDIO — SANTIAGO 2025
          </div>
        </div>
      )}

      {/* TÍTULO + SUBTÍTULO + CTA */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        zIndex: 56, textAlign: "center", padding: "0 0 52px",
        background: "linear-gradient(to top, rgba(5,3,8,0.95) 40%, transparent 100%)",
      }}>
        <div style={{
          width: "28%", height: 1, margin: "0 auto 20px",
          background: "linear-gradient(to right, transparent, rgba(192,132,252,0.5), transparent)",
          animation: loaded ? "lineExpand 1.2s cubic-bezier(0.16,1,0.3,1) 0.9s both" : "none",
        }} />

        <div className="glitch-layer title-main" data-text="OLVAIDLAB"
          onClick={() => { setProjectsOpen(false); setLightningActive(false); }}
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(56px, 11vw, 140px)",
            lineHeight: 0.88, letterSpacing: "-0.02em", color: "#fff",
            textShadow: "0 0 80px rgba(192,132,252,0.15)",
            cursor: projectsOpen ? "pointer" : "crosshair",
          }}>
          OLVAIDLAB
        </div>

        <div className="subtitle-line" style={{
          fontSize: "clamp(13px, 1.4vw, 17px)", letterSpacing: 2, fontWeight: 300,
          color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginTop: 10,
        }}>
          Diseño web que convierte visitantes en clientes
        </div>

        <div className="cta-row" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 28, marginTop: 22,
        }}>
          <button className="cta-primary" onClick={handleVerProyectos} style={{
            background: "#fff", color: "#050308", border: "none", cursor: "pointer",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 13, fontWeight: 700, letterSpacing: 3,
            textTransform: "uppercase", padding: "11px 28px", transition: "background 0.2s",
          }}>
            VER PROYECTOS
          </button>
          <button className="cta-secondary" onClick={() => setContactModalOpen(true)} style={{
            background: "none", color: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 13, fontWeight: 600, letterSpacing: 3,
            textTransform: "uppercase", padding: "11px 28px", transition: "all 0.2s",
          }}>
            CONTACTAR
          </button>
        </div>
      </div>

      {/* BUILDER */}
      {builderOpen && <WebsiteBuilder onClose={() => setBuilderOpen(false)} />}

      {/* CONTACT MODAL */}
      {contactModalOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,0.8)", backdropFilter: "blur(5px)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{
            background: "#0e0610", border: "1px solid rgba(192,132,252,0.3)",
            padding: 40, width: "90%", maxWidth: 400, position: "relative"
          }}>
            <button onClick={() => setContactModalOpen(false)} style={{
              position: "absolute", top: 16, right: 16, background: "none", border: "none",
              color: "#fff", cursor: "pointer", fontSize: 20
            }}>✕</button>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: 2, marginBottom: 20 }}>INICIAR PROYECTO</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const nombre = fd.get("nombre");
              const apellido = fd.get("apellido");
              const numero = fd.get("numero");
              const text = `Hola, me interesa hacer una web con ustedes. Mi nombre es ${nombre} ${apellido} y mi número es ${numero}.`;
              window.open(`https://wa.me/56982348089?text=${encodeURIComponent(text)}`, "_blank");
              window.location.href = `mailto:olvaidlab@gmail.com?subject=Nuevo prospecto web&body=${encodeURIComponent(text)}`;
              setContactModalOpen(false);
            }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <input name="nombre" placeholder="Nombre" required style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff", padding: "10px 14px", fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 16, outline: "none"
              }} />
              <input name="apellido" placeholder="Apellido" required style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff", padding: "10px 14px", fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 16, outline: "none"
              }} />
              <input name="numero" placeholder="Número de teléfono" required style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff", padding: "10px 14px", fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 16, outline: "none"
              }} />
              <button type="submit" style={{
                background: "#fff", color: "#050308", border: "none", cursor: "pointer",
                fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 700,
                letterSpacing: 2, textTransform: "uppercase", padding: "12px", marginTop: 10
              }}>ENVIAR MENSAJE</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
