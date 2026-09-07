# Plan de Desarrollo y Hoja de Ruta — Clínicas Vita (clinicasvita.com)

Este documento contiene la planificación estratégica y técnica para la creación, optimización y posicionamiento SEO de **Clínicas Vita**.

---

## 🎯 Visión y Objetivos Principales

1. **B2C (Lesionados de Tráfico):** Posicionar a Clínicas Vita como la red médica de referencia en España para la atención asistencial, fisioterapia, traumatología y pruebas diagnósticas a víctimas de tráfico **sin adelantar dinero**.
2. **B2B (Red de Centros Médicos y Profesionales):** Captar e incorporar activamente a la red nacional de Clínicas Vita a centros médicos, clínicas de fisioterapia, traumatólogos y centros de diagnóstico por imagen.

---

## 📋 Fases del Proyecto

### Fase 1: Fundaciones de Marca y Motor Técnico ✅
- `[x]` Creación del espacio de trabajo `/Users/macniacos/clinicasvita.com`.
- `[x]` Definición de las reglas de negocio (`.agents/AGENTS.md`) — Modelo No UNESPA / No Consorcio, Mix 75/25, Foco Sur.
- `[x]` Especificación del sistema de diseño oficial (`DESIGN.md`) con Azul Eléctrico y Azul Marino.
- `[x]` Generación del catálogo completo de recursos vectoriales y rasterizados (`assets/img/brand/`):
  - Isotipos SVG y PNG (Color, Blanco, Azul, Marino).
  - Logotipos horizontales SVG y PNG (Full Color, Blanco, Invertido).
  - Favicon SVG/PNG, Apple Touch Icon y OpenGraph Card.
- `[x]` Creación del motor de configuración centralizada (`js/config.js`) para propagación instantánea de teléfono, WhatsApp y correos (`info@` y `asociados@`).
- `[x]` Creación del motor de leads y enrutamiento dual B2C/B2B (`js/main.js`).
- `[x]` Actualización de la Home institucional (`index.html`) con la nueva identidad de marca y ratio 75/25.

### Fase 2: Silos Semánticos B2C & B2B (Estructura y Contenidos)
- `[ ]` **Silo B2C Lesionados:** `/lesionados-accidente/` (Atención médica integral, latigazo cervical, plazos clave, derechos de libre elección).
- `[ ]` **Silo B2C Rehabilitación:** `/rehabilitacion-fisioterapia/` (Tratamiento médico continuado y clínicas concertadas).
- `[ ]` **Silo B2C Traumatología:** `/traumatologia-pruebas/` (Resonancias magnéticas, ecografías, TAC e informes periciales).
- `[ ]` **Silo B2B Adhesión Red:** `/unirse-red-medica/` (Adhesión de clínicas y centros, con atención especial al Plan Sur / Andalucía).
- `[ ]` **Herramienta B2C:** `/calculadora-indemnizacion/` (Estimador médico de días de curación y secuelas).

### Fase 3: Landings Locales (52 Provincias de España)
- `[ ]` Generación automatizada de 52 páginas locales para lesiónados de tráfico por provincia.
- `[ ]` Generación automatizada de 52 páginas de red de clínicas asociadas por provincia.

### Fase 4: Integración de Analítica, GTM y Apps Script
- `[ ]` Conexión de GTM Container ID y GA4 Measurement ID.
- `[ ]` Configuración de Webhook Google Sheets para recepción unificada de leads B2C y solicitudes B2B.

### Fase 5: QA, Rendimiento 100/100 y Despliegue Privado / Git
- `[ ]` Verificación WCAG AAA y prueba responsive en móvil.
- `[ ]` Creación de repositorio privado Git y pipeline de despliegue pre-producción.
