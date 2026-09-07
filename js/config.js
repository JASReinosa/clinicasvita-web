/**
 * Clínicas Vita — Configuración Global Centralizada
 * Modifica teléfono, WhatsApp o correos en este único archivo y se reflejará
 * automáticamente en todos los enlaces, botones y textos de la web.
 */

window.VITA_CONFIG = {
    // TELÉFONO DE ASISTENCIA MÉDICA (dejar en blanco "" hasta disponer del número oficial)
    phone: "",            // Ej: "900 123 456" o "910 000 000"
    phoneRaw: "",         // Ej: "+34900123456" para enlaces tel:
    
    // WHATSAPP OFICIAL (dejar en blanco "" hasta disponer del número oficial)
    whatsapp: "",         // Ej: "34600000000" (con prefijo internacional sin '+')
    whatsappDefaultMsg: "Hola Clínicas Vita, necesito asistencia médica tras un accidente de tráfico.",
    
    // CORREOS CORPORATIVOS
    emailB2C: "info@clinicasvita.com",       // Lesionados y consultas de asistencia general
    emailB2B: "asociados@clinicasvita.com",  // Adhesión de clínicas, centros y especialistas
    
    // TEXTOS DINÁMICOS CUANDO EL NÚMERO AÚN NO ESTÁ ASIGNADO
    fallbacks: {
        phoneText: "Línea Médica en Activación",
        phoneActionText: "Solicitar Asistencia",
        whatsappText: "WhatsApp en Activación",
        whatsappActionText: "Consulta Online Inmediata"
    }
};

/**
 * Aplica la configuración global a todos los elementos del DOM marcados con data-vita-*
 */
window.applyVitaConfig = function() {
    const cfg = window.VITA_CONFIG;
    if (!cfg) return;

    // 1. Textos de Teléfono
    document.querySelectorAll('[data-vita-phone]').forEach(el => {
        if (cfg.phone && cfg.phone.trim() !== "") {
            el.textContent = cfg.phone;
        } else {
            const fallbackText = el.getAttribute('data-vita-fallback') || cfg.fallbacks.phoneActionText;
            el.textContent = fallbackText;
        }
    });

    // 2. Enlaces de Teléfono (tel:)
    document.querySelectorAll('[data-vita-phone-link]').forEach(el => {
        if (cfg.phoneRaw && cfg.phoneRaw.trim() !== "") {
            el.setAttribute('href', `tel:${cfg.phoneRaw.trim()}`);
        } else {
            el.setAttribute('href', '#contacto');
            el.addEventListener('click', (e) => {
                const target = document.querySelector('#contacto');
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    const input = target.querySelector('input[name="telefono"]') || target.querySelector('input');
                    if (input) input.focus();
                }
            });
        }
    });

    // 3. Enlaces de WhatsApp (Gestionados por el modal con selector de provincia en main.js)
    document.querySelectorAll('[data-vita-whatsapp-link]').forEach(el => {
        el.setAttribute('href', '#whatsapp');
        el.setAttribute('role', 'button');
    });

    // 4. Email B2C (Lesionados / General)
    document.querySelectorAll('[data-vita-email-b2c]').forEach(el => {
        el.textContent = cfg.emailB2C;
        if (el.tagName.toLowerCase() === 'a') {
            el.setAttribute('href', `mailto:${cfg.emailB2C}`);
        }
    });

    // 5. Email B2B (Socios / Clínicas)
    document.querySelectorAll('[data-vita-email-b2b]').forEach(el => {
        el.textContent = cfg.emailB2B;
        if (el.tagName.toLowerCase() === 'a') {
            el.setAttribute('href', `mailto:${cfg.emailB2B}`);
        }
    });
};

// Inicialización automática
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.applyVitaConfig);
} else {
    window.applyVitaConfig();
}
