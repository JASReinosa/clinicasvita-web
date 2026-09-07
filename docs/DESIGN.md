---
name: Clínicas Vita Design System Specification
colors:
  primary: "#0050E7"        # Azul Eléctrico Vita. Vitalidad, movimiento, salud y acción asistencial.
  primary-dark: "#003DB3"   # Azul eléctrico intenso para hover y estados activos.
  primary-light: "#EBF2FF"  # Azul suave para fondos de badges y llamadas secundarias.
  secondary: "#0A1931"      # Azul Marino Profundo institucional. Rigor médico, sobriedad y confianza.
  secondary-dark: "#050E1E" # Azul noche profundo para headers premium y hero oscuro.
  accent-green: "#25D366"   # Verde oficial WhatsApp para conversión directa inmediata.
  accent-emerald: "#10B981" # Esmeralda para estados de confirmación médica y éxito.
  warning: "#F59E0B"        # Ámbar médico para alertas de plazos (ej. 72 horas).
  neutral-bg: "#F8FAFC"     # Blanco clínico/gris claro para fondos de secciones.
  surface: "#FFFFFF"        # Blanco puro para tarjetas, modales y formularios.
typography:
  family: "Inter, system-ui, -apple-system, sans-serif"
  headings: "Inter, sans-serif"
  mono: "Fira Code, monospace"
brand_values:
  - Confianza: "Seguridad, transparencia y profesionalidad."
  - Cercanía: "Escuchamos, acompañamos y estamos a tu lado."
  - Movimiento: "Avanzamos contigo hacia tu mejor versión."
  - Bienestar: "Cuidado integral de la salud física y emocional."
  - Versatilidad: "Funciona en cualquier formato y soporte."
---

# Manual de Identidad Visual y Diseño — Clínicas Vita (`clinicasvita.com`)

## 1. Visión y Personalidad de Marca
La identidad de **Clínicas Vita** es **fresca, cercana, profesional y dinámica**. Comunica salud integral, confianza y movimiento constante hacia la recuperación del paciente.

El imagotipo oficial se compone de:
* **Isotipo Humano en «V»:** Representa una figura humana con los brazos abiertos en actitud de vitalidad y superación, rematada por un círculo azul eléctrico.
* **Logotipo «vita»:** En caja baja tipográfica moderna, redondeada y amigable.
* **Submarca «CLINICASVITA.COM»:** En mayúsculas con espaciado amplio (*tracking* ampliado), alineada al ancho del imagotipo.

---

## 2. Paleta Cromática Oficial

| Variable | Hex | Aplicación |
| :--- | :--- | :--- |
| **Azul Eléctrico Vita (Primary)** | `#0050E7` | Botones principales (CTA), enlaces destacados, punto del isotipo, badges dinámicos. |
| **Azul Eléctrico Dark** | `#003DB3` | Estados `:hover` y `:active` de botones primarios. |
| **Azul Suave (Light Tint)** | `#EBF2FF` | Fondos de píldoras informativas, tarjetas activas y destacados suaves. |
| **Azul Marino Profundo (Secondary)** | `#0A1931` | Tipografía de títulos H1/H2, isotipo en modo color, bordes estructurales y pie de página. |
| **Azul Noche (Secondary Dark)** | `#050E1E` | Fondos de Hero institucional y contraste premium. |
| **Verde WhatsApp (Accent)** | `#25D366` | Botón flotante y enlaces directos de chat médico. |
| **Superficie Neutra (Neutral BG)** | `#F8FAFC` | Fondos de sección alternos para crear ritmo de lectura. |
| **Blanco Puro (Surface)** | `#FFFFFF` | Tarjetas asistenciales, campos de formulario y modales. |

---

## 3. Catálogo de Recursos Gráficos Vectoriales y Rasterizados

Todos los archivos generados están estandarizados y versionados en la carpeta:
`/assets/img/brand/`

### 3.1. Isotipos (Imagotipo individual)
* `isotipo.svg` / `isotipo.png` (512x512): Versión principal a color (Punto Azul `#0050E7` + V Marino `#0A1931`).
* `isotipo-white.svg` / `isotipo-white.png` (512x512): Versión monocroma blanca para fondos oscuros.
* `isotipo-blue.svg` / `isotipo-blue.png` (512x512): Versión monocroma azul eléctrico.
* `isotipo-navy.svg` / `isotipo-navy.png` (512x512): Versión monocroma azul marino.

### 3.2. Logotipos Completos Horizontales
* `logo-horizontal.svg` / `logo-horizontal.png`: Logotipo corporativo a color sobre fondo blanco/claro.
* `logo-horizontal-white.svg` / `logo-horizontal-white.png`: Logotipo en blanco para cabeceras o fondos oscuros.
* `logo-horizontal-inverted.svg`: Logotipo con isotipo azul y textos blancos para navbars oscuras.
* `logo-horizontal-blue.svg`: Logotipo monocromo azul.

### 3.3. Iconos y Favicons
* `favicon.svg`: Favicon vectorial nítido para navegadores modernos.
* `favicon.png` / `favicon-32x32.png`: Favicons estándar 32px y 64px.
* `apple-touch-icon.png` (180x180): Icono para dispositivos Apple iOS / Safari.
* `og-image.jpg` / `og-image.png` (1200x630): Tarjeta OpenGraph optimizada para redes sociales y WhatsApp.

---

## 4. Tipografía y Reglas de Maquetación
* **Titulares y Textos Generales:** `Inter, system-ui, -apple-system, sans-serif` (pesos 400, 500, 600, 700 y 800).
* **Ratios de Contraste:** Mínimo 4.5:1 (WCAG AA) para textos estándar y 7:1 (WCAG AAA) en enlaces y textos médicos críticos.
* **Microinteracciones:** Transiciones suaves `transition-all duration-200 ease-in-out` con elevación sutil de tarjeta (`hover:-translate-y-0.5 hover:shadow-lg`).
