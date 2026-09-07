/**
 * Clínicas Vita — Motor Principal de Interacciones y Captación
 * Soporta envío de leads B2C (Lesionados) y B2B (Clínicas/Profesionales)
 */

window.dataLayer = window.dataLayer || [];
function gtag(){ window.dataLayer.push(arguments); }
window.gtag = window.gtag || gtag;

// 1. Google Consent Mode v2 (Defaults según AEPD y estándares GA4 Tier 1)
(function initGCMDefaults() {
    const CONSENT_KEY = 'vita_cookie_consent';
    const saved = localStorage.getItem(CONSENT_KEY) || sessionStorage.getItem(CONSENT_KEY);
    const defaults = {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'analytics_storage': 'denied',
        'functionality_storage': 'granted',
        'personalization_storage': 'denied',
        'security_storage': 'granted'
    };
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.analytics) defaults.analytics_storage = 'granted';
            if (parsed.marketing) {
                defaults.ad_storage = 'granted';
                defaults.ad_user_data = 'granted';
                defaults.ad_personalization = 'granted';
            }
            if (parsed.personalization) defaults.personalization_storage = 'granted';
        } catch(e) {
            if (saved === 'accepted') {
                defaults.analytics_storage = 'granted';
                defaults.ad_storage = 'granted';
                defaults.ad_user_data = 'granted';
                defaults.ad_personalization = 'granted';
            }
        }
    }
    gtag('consent', 'default', defaults);
})();

function pushToDataLayer(eventData) {
    window.dataLayer.push(eventData);
}

// Envío a Google Sheets / Webhook de Clínicas Vita
window.sendLeadToVitaWebhook = function(payload) {
    const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwd0DwRxRZyBDscTHTj2iOX416g8ZTbZ5oztSfCjqN4Qy13EPedHLMgG90pYcpRaRpD/exec";
    
    try {
        const safePayload = {
            marca: "Clínicas Vita",
            tipo: payload.tipo || "B2C_Lesionado",
            nombre: payload.nombre || "",
            telefono: payload.telefono || "",
            email: payload.email || "",
            provincia: payload.provincia || "",
            especialidad: payload.especialidad || "",
            nombreCentro: payload.nombreCentro || "",
            mensaje: payload.mensaje || "",
            fecha: new Date().toISOString()
        };

        const urlEncodedData = new URLSearchParams(safePayload).toString();

        // Push a DataLayer para GA4 / GTM
        window.dataLayer.push({
            'event': 'generate_lead',
            'lead_type': safePayload.tipo,
            'provincia': safePayload.provincia || 'España',
            'lead_source': 'ClinicasVita_Web'
        });

        // Envío seguro sin bloqueos de CORS
        if (WEBHOOK_URL && !WEBHOOK_URL.includes("AKfycb...")) {
            fetch(`${WEBHOOK_URL}?${urlEncodedData}`, {
                method: 'GET',
                mode: 'no-cors'
            }).catch((err) => {
                console.warn("Vita Webhook ping warning:", err);
            });
        }

        return true;
    } catch (err) {
        console.warn("Vita Lead Error:", err);
        return false;
    }
};

// Vinculación de formularios
document.addEventListener('DOMContentLoaded', () => {
    // 1. Formulario B2C (Lesionados)
    const formB2C = document.querySelector('#form-b2c-asistencia');
    if (formB2C) {
        formB2C.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = formB2C.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.innerHTML : "";
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> Procesando solicitud...`;
            }

            const formData = new FormData(formB2C);
            const servicioReq = formData.get('servicio_requerido');
            const rawMsg = formData.get('mensaje') || "Solicitud de asistencia médica tras accidente";
            const fullMsg = servicioReq ? `[${servicioReq}] ${rawMsg}` : rawMsg;

            const payload = {
                tipo: "B2C_Lesionado",
                nombre: formData.get('nombre') || "",
                telefono: formData.get('telefono') || "",
                email: formData.get('email') || "",
                provincia: formData.get('provincia') || "",
                mensaje: fullMsg
            };

            window.sendLeadToVitaWebhook(payload);

            setTimeout(() => {
                formB2C.reset();
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
                const feedback = document.querySelector('#b2c-success-feedback');
                if (feedback) {
                    feedback.classList.remove('hidden');
                    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else {
                    const toast = document.createElement('div');
                    toast.className = 'fixed bottom-6 right-6 z-50 bg-vita-navy text-white px-6 py-4 rounded-xl shadow-xl border border-vita-blue flex items-center gap-3 transition-all duration-300';
                    toast.innerHTML = `<span class="w-3 h-3 rounded-full bg-emerald-400"></span><span>Solicitud recibida. Nuestro equipo de coordinación médica te contactará en breve.</span>`;
                    document.body.appendChild(toast);
                    setTimeout(() => toast.remove(), 6000);
                }
            }, 600);
        });
    }

    // 2. Formulario B2B (Adhesión Red Médica)
    const formB2B = document.querySelector('#form-b2b-adhesion');
    if (formB2B) {
        formB2B.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = formB2B.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.innerHTML : "";
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> Enviando solicitud de adhesión...`;
            }

            const formData = new FormData(formB2B);
            const payload = {
                tipo: "B2B_Adhesion_Centro",
                nombre: formData.get('contacto_nombre') || "",
                nombreCentro: formData.get('nombre_centro') || "",
                telefono: formData.get('contacto_telefono') || "",
                email: formData.get('contacto_email') || "",
                provincia: formData.get('centro_provincia') || "",
                especialidad: formData.get('centro_especialidad') || "",
                mensaje: formData.get('centro_mensaje') || "Solicitud de incorporación a la Red Médica Vita"
            };

            window.sendLeadToVitaWebhook(payload);

            setTimeout(() => {
                formB2B.reset();
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
                const feedback = document.querySelector('#b2b-success-feedback');
                if (feedback) {
                    feedback.classList.remove('hidden');
                    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else {
                    const toast = document.createElement('div');
                    toast.className = 'fixed bottom-6 right-6 z-50 bg-vita-navy text-white px-6 py-4 rounded-xl shadow-xl border border-vita-blue flex items-center gap-3 transition-all duration-300';
                    toast.innerHTML = `<span class="w-3 h-3 rounded-full bg-emerald-400"></span><span>Solicitud de adhesión enviada. El departamento de expansión médica contactará con su centro.</span>`;
                    document.body.appendChild(toast);
                    setTimeout(() => toast.remove(), 6000);
                }
            }, 600);
        });
    }

    // 3. Modal de WhatsApp con Selector de Provincias (Regla Crítica Sección 4 AGENTS.md)
    initVitaWhatsAppModal();

    // 4. Banner de Consentimiento de Cookies (AEPD Compliant)
    initVitaCookieBanner();

    // 5. Normalizador automático para previsualización local (file://)
    // Evita que el navegador abra el índice de carpetas al pinchar en logos o migas de pan
    if (window.location.protocol === 'file:') {
        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')) return;
            if (href === '../' || href === './' || href === '/') {
                link.setAttribute('href', `${href}index.html`);
            } else if (href.endsWith('/')) {
                link.setAttribute('href', `${href}index.html`);
            }
        });
    }
});

/**
 * Gestor del Modal de WhatsApp con memoria en localStorage
 */
function initVitaWhatsAppModal() {
    const PROVINCIAS = [
        "A Coruña", "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila", "Badajoz", "Baleares", "Barcelona",
        "Burgos", "Cáceres", "Cádiz", "Cantabria", "Castellón", "Ciudad Real", "Córdoba", "Cuenca", "Girona", "Granada",
        "Guadalajara", "Guipúzcoa", "Huelva", "Huesca", "Jaén", "La Rioja", "Las Palmas", "León", "Lleida", "Lugo",
        "Madrid", "Málaga", "Murcia", "Navarra", "Ourense", "Palencia", "Pontevedra", "Salamanca", "Santa Cruz de Tenerife", "Segovia",
        "Sevilla", "Soria", "Tarragona", "Teruel", "Toledo", "Valencia", "Valladolid", "Vizcaya", "Zamora", "Zaragoza",
        "Ceuta", "Melilla"
    ];

    // Inyectar HTML del modal en el body
    const modalHtml = `
    <div id="vita-whatsapp-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity" role="dialog" aria-modal="true" aria-labelledby="wa-modal-title">
        <div class="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <!-- Botón Cerrar -->
            <button id="vita-wa-close-btn" type="button" class="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600" aria-label="Cerrar modal">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>

            <!-- Icono WhatsApp -->
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <svg class="w-6 h-6 fill-[#25D366]" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.084-1.92-.45-1.512-.625-2.496-2.164-2.572-2.264-.075-.101-.607-.807-.607-1.54s.383-1.096.522-1.246c.14-.149.303-.187.404-.187.102 0 .204.002.294.006.095.004.222-.036.347.264.129.31.442 1.077.481 1.156.039.078.064.168.012.271-.052.102-.078.168-.155.259-.077.09-.163.201-.232.271-.077.078-.158.163-.067.319.09.156.402.663.862 1.073.593.528 1.092.691 1.248.769.156.078.247.065.337-.039.09-.104.389-.452.493-.607.103-.156.207-.129.347-.078s.893.421 1.048.499c.156.078.259.117.298.182.039.066.039.382-.105.787z"/></svg>
            </div>

            <h3 id="wa-modal-title" class="text-xl font-bold text-vita-navy tracking-tight mb-2">
                Asistencia Médica por WhatsApp
            </h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-6">
                Para coordinar tu valoración con el centro médico o de fisioterapia más cercano, indícanos la provincia donde ocurrió el siniestro o donde necesitas el tratamiento:
            </p>

            <form id="vita-wa-form" class="space-y-5">
                <div>
                    <label for="vita-wa-provincia-select" class="block text-xs font-semibold text-slate-700 mb-2">
                        Selecciona tu provincia:
                    </label>
                    <select id="vita-wa-provincia-select" required class="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all">
                        <option value="">-- Elige una provincia --</option>
                        ${PROVINCIAS.map(p => `<option value="${p}">${p}</option>`).join('')}
                    </select>
                </div>

                <!-- Mensaje de estado dinámico -->
                <div id="vita-wa-status-msg" class="hidden p-3.5 rounded-xl text-xs leading-relaxed"></div>

                <div class="space-y-2 pt-2">
                    <button id="vita-wa-submit-btn" type="submit" class="w-full py-3.5 px-4 bg-[#075E54] hover:bg-[#0b776a] text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
                        <svg class="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.084-1.92-.45-1.512-.625-2.496-2.164-2.572-2.264-.075-.101-.607-.807-.607-1.54s.383-1.096.522-1.246c.14-.149.303-.187.404-.187.102 0 .204.002.294.006.095.004.222-.036.347.264.129.31.442 1.077.481 1.156.039.078.064.168.012.271-.052.102-.078.168-.155.259-.077.09-.163.201-.232.271-.077.078-.158.163-.067.319.09.156.402.663.862 1.073.593.528 1.092.691 1.248.769.156.078.247.065.337-.039.09-.104.389-.452.493-.607.103-.156.207-.129.347-.078s.893.421 1.048.499c.156.078.259.117.298.182.039.066.039.382-.105.787z"/></svg>
                        <span>Continuar a WhatsApp</span>
                    </button>
                    <p class="text-[11px] text-slate-500 text-center">
                        Recordaremos tu provincia para que no tengas que seleccionarla de nuevo.
                    </p>
                </div>
            </form>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.querySelector('#vita-whatsapp-modal');
    const select = document.querySelector('#vita-wa-provincia-select');
    const form = document.querySelector('#vita-wa-form');
    const closeBtn = document.querySelector('#vita-wa-close-btn');
    const statusMsg = document.querySelector('#vita-wa-status-msg');

    function openModal() {
        // Recuperar provincia previamente guardada si existe
        const savedProv = localStorage.getItem('vita_selected_province');
        if (savedProv && select) {
            select.value = savedProv;
        }
        if (statusMsg) statusMsg.classList.add('hidden');
        modal.classList.remove('hidden');
        if (select) select.focus();
    }

    function closeModal() {
        modal.classList.add('hidden');
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Interceptar todos los enlaces o botones de WhatsApp
    document.querySelectorAll('[data-vita-whatsapp-link], a[href*="wa.me"], a[href*="whatsapp"]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    // Envío del formulario del modal
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const prov = select.value;
        if (!prov) return;

        // 1. Guardar en memoria (localStorage)
        localStorage.setItem('vita_selected_province', prov);

        // 2. Notificar a dataLayer
        window.dataLayer.push({
            'event': 'whatsapp_province_selected',
            'provincia': prov
        });

        const cfg = window.VITA_CONFIG || {};
        if (cfg.whatsapp && cfg.whatsapp.trim() !== "") {
            const baseMsg = `Hola Clínicas Vita, necesito asistencia médica por accidente de tráfico en ${prov}.`;
            const waUrl = `https://wa.me/${cfg.whatsapp.trim()}?text=${encodeURIComponent(baseMsg)}`;
            window.open(waUrl, '_blank', 'noopener,noreferrer');
            closeModal();
        } else {
            // Si la línea de WhatsApp corporativa está en activación, derivamos al formulario
            if (statusMsg) {
                statusMsg.className = 'p-3.5 rounded-xl text-xs bg-emerald-50 text-emerald-950 border border-emerald-200 block';
                statusMsg.innerHTML = `Línea WhatsApp asignada para <strong>${prov}</strong>. Redirigiendo a solicitud de asistencia prioritaria...`;
            }
            setTimeout(() => {
                closeModal();
                const formB2C = document.querySelector('#form-b2c-asistencia');
                const selectProv = document.querySelector('#b2c-provincia');
                if (selectProv) selectProv.value = prov;
                if (formB2C) {
                    formB2C.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    const nameInput = formB2C.querySelector('input[name="nombre"]');
                    if (nameInput) nameInput.focus();
                } else {
                    window.location.href = `../contacto/#contacto-lesionados`;
                }
            }, 800);
        }
    });
}

/**
 * Gestor del Banner de Consentimiento de Cookies & Google Consent Mode v2 (Tier 1 Internacional)
 */
function initVitaCookieBanner() {
    const CONSENT_KEY = 'vita_cookie_consent';
    const savedConsent = localStorage.getItem(CONSENT_KEY) || sessionStorage.getItem(CONSENT_KEY);

    // Helpers para rutas de políticas relativas/absolutas seguras
    function getPolicyUrl(path) {
        if (window.location.protocol === 'file:') {
            const current = window.location.pathname;
            if (current.includes('/previews/')) {
                return `../../${path}/index.html`;
            } else if (current.includes('/lesionados-accidente/') || current.includes('/contacto/') || current.includes('/politica-') || current.includes('/rehabilitacion-') || current.includes('/traumatologia-') || current.includes('/unirse-')) {
                return `../${path}/index.html`;
            }
            return `./${path}/index.html`;
        }
        return `/${path}/`;
    }

    const privacyUrl = getPolicyUrl('politica-privacidad');
    const cookiesUrl = getPolicyUrl('politica-cookies');

    // Función de actualización de Consent Mode v2
    window.updateVitaGCM = function(analytics, marketing, personalization) {
        const consentObj = {
            analytics: !!analytics,
            marketing: !!marketing,
            personalization: !!personalization
        };
        const allAccepted = analytics && marketing && personalization;

        if (allAccepted) {
            localStorage.setItem(CONSENT_KEY, JSON.stringify(consentObj));
            sessionStorage.removeItem(CONSENT_KEY);
        } else {
            sessionStorage.setItem(CONSENT_KEY, JSON.stringify(consentObj));
            localStorage.removeItem(CONSENT_KEY);
        }

        window.gtag('consent', 'update', {
            'ad_storage': marketing ? 'granted' : 'denied',
            'ad_user_data': marketing ? 'granted' : 'denied',
            'ad_personalization': marketing ? 'granted' : 'denied',
            'analytics_storage': analytics ? 'granted' : 'denied',
            'personalization_storage': personalization ? 'granted' : 'denied'
        });

        window.dataLayer.push({
            'event': 'consent_updated',
            'consent_state': consentObj
        });

        window.dispatchEvent(new CustomEvent('vitaCookieConsentChanged', { detail: consentObj }));
    };

    function hideBanner() {
        const banner = document.getElementById('vita-cookie-banner');
        const backdrop = document.getElementById('vita-cookie-backdrop');
        if (banner) {
            banner.classList.remove('opacity-100', 'translate-y-0');
            banner.classList.add('opacity-0', 'translate-y-8');
            setTimeout(() => banner.remove(), 350);
        }
        if (backdrop) {
            backdrop.classList.remove('opacity-100');
            backdrop.classList.add('opacity-0');
            setTimeout(() => backdrop.remove(), 350);
        }
    }

    function showBanner() {
        if (document.getElementById('vita-cookie-banner')) return;

        // Backdrop oscuro y blur
        const backdrop = document.createElement('div');
        backdrop.id = 'vita-cookie-backdrop';
        backdrop.className = 'fixed inset-0 z-[9998] bg-slate-900/60 backdrop-blur-[3px] transition-opacity duration-300 opacity-0 pointer-events-auto';
        document.body.appendChild(backdrop);

        // Tarjeta flotante moderna centrada en desktop y anclada inferior en móvil
        const banner = document.createElement('div');
        banner.id = 'vita-cookie-banner';
        banner.className = 'fixed bottom-4 left-4 right-4 md:left-1/2 md:top-1/2 md:bottom-auto md:right-auto md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-full z-[9999] bg-white text-slate-900 rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.35)] border border-slate-200 p-6 sm:p-7 transition-all duration-300 transform translate-y-8 opacity-0 flex flex-col gap-4 font-sans';
        banner.innerHTML = `
            <div class="flex-1 space-y-3">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-blue-50 text-[#0057cc] flex items-center justify-center shrink-0 border border-blue-100">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    </div>
                    <div>
                        <h3 class="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">Tu privacidad nos importa</h3>
                        <span class="text-[11px] text-slate-500 font-medium">Clínicas Vita · Gestión de Consentimiento Sanitario</span>
                    </div>
                </div>
                <p class="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                    Utilizamos cookies técnicas y de almacenamiento local necesarias para coordinar tu asistencia médica con los centros de la Red Vita, además de analítica anónima para optimizar la respuesta asistencial y nuestras campañas de Google Ads. Puedes aceptar todas las cookies, rechazarlas o configurar tus preferencias. Más detalles en nuestra <a href="${cookiesUrl}" class="text-[#0057cc] hover:underline font-semibold">Política de Cookies</a> y <a href="${privacyUrl}" class="text-[#0057cc] hover:underline font-semibold">Política de Privacidad</a>.
                </p>
            </div>
            <div class="flex flex-col gap-2.5 w-full pt-1">
                <button id="vita-cookie-accept-btn" type="button" class="w-full bg-[#0057cc] hover:bg-[#0040a2] text-white text-xs sm:text-sm font-bold py-3.5 px-5 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer text-center active:scale-[0.98]">
                    Aceptar todo
                </button>
                <div class="grid grid-cols-2 gap-2.5">
                    <button id="vita-cookie-reject-btn" type="button" class="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors cursor-pointer text-center active:scale-[0.98]">
                        Rechazar todo
                    </button>
                    <button id="vita-cookie-settings-btn" type="button" class="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors cursor-pointer text-center active:scale-[0.98]">
                        Configurar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        requestAnimationFrame(() => {
            backdrop.classList.remove('opacity-0');
            backdrop.classList.add('opacity-100');
            banner.classList.remove('translate-y-8', 'opacity-0');
            banner.classList.add('translate-y-0', 'opacity-100');
        });

        // Eventos
        document.getElementById('vita-cookie-accept-btn').addEventListener('click', () => {
            window.updateVitaGCM(true, true, true);
            hideBanner();
        });

        document.getElementById('vita-cookie-reject-btn').addEventListener('click', () => {
            window.updateVitaGCM(false, false, false);
            hideBanner();
        });

        document.getElementById('vita-cookie-settings-btn').addEventListener('click', () => {
            openCookieSettings();
        });
    }

    // Modal de Configuración Detallada
    function openCookieSettings() {
        let modal = document.getElementById('vita-cookie-modal');
        let consent = { analytics: false, marketing: false, personalization: false };
        try {
            const raw = localStorage.getItem(CONSENT_KEY) || sessionStorage.getItem(CONSENT_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (typeof parsed === 'object') consent = parsed;
            }
        } catch(e) {}

        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'vita-cookie-modal';
            modal.className = 'fixed inset-0 z-[10000] hidden items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-opacity duration-300';
            modal.innerHTML = `
                <div id="vita-cookie-modal-card" class="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative transform scale-95 opacity-0 transition-all duration-300 max-h-[90vh] overflow-y-auto font-sans border border-slate-200">
                    <button id="vita-cookie-modal-close" type="button" class="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" aria-label="Cerrar modal">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>

                    <h3 class="text-xl sm:text-2xl font-black text-slate-900 leading-tight">Preferencias de Privacidad</h3>
                    <p class="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                        Puedes activar o desactivar las diferentes categorías de cookies según tus preferencias. Las cookies técnicas son estrictamente necesarias para prestar el servicio asistencial.
                    </p>

                    <div class="space-y-4 my-6">
                        <!-- Categoría 1: Técnicas -->
                        <div class="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                            <div class="flex-1">
                                <div class="flex items-center gap-2">
                                    <span class="text-sm font-bold text-slate-900">Técnicas y Asistenciales</span>
                                    <span class="text-[10px] font-extrabold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full uppercase tracking-wider">Obligatorio</span>
                                </div>
                                <p class="text-xs text-slate-500 mt-1 leading-relaxed">
                                    Permiten guardar tus decisiones de privacidad, recordar tu provincia para asignación médica y mantener la seguridad del portal. No se pueden desactivar.
                                </p>
                            </div>
                            <div class="flex items-center h-5">
                                <input type="checkbox" checked disabled class="h-4.5 w-4.5 rounded border-gray-300 text-[#0057cc] cursor-not-allowed"/>
                            </div>
                        </div>

                        <!-- Categoría 2: Analítica -->
                        <div class="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                            <div class="flex-1">
                                <span class="text-sm font-bold text-slate-900">Análisis y Rendimiento (GA4)</span>
                                <p class="text-xs text-slate-500 mt-1 leading-relaxed">
                                    Métricas anónimas para medir la respuesta del sitio, páginas consultadas y optimizar los tiempos de derivación médica a clínicas.
                                </p>
                            </div>
                            <div class="flex items-center h-5">
                                <input type="checkbox" id="vita-consent-analytics" class="h-4.5 w-4.5 rounded border-gray-300 text-[#0057cc] focus:ring-[#0057cc] cursor-pointer"/>
                            </div>
                        </div>

                        <!-- Categoría 3: Atribución y Ads -->
                        <div class="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                            <div class="flex-1">
                                <span class="text-sm font-bold text-slate-900">Publicidad y Atribución (Google Ads)</span>
                                <p class="text-xs text-slate-500 mt-1 leading-relaxed">
                                    Optimiza la atribución de campañas publicitarias para lesionados que buscan asistencia médica inmediata tras un accidente de tráfico.
                                </p>
                            </div>
                            <div class="flex items-center h-5">
                                <input type="checkbox" id="vita-consent-marketing" class="h-4.5 w-4.5 rounded border-gray-300 text-[#0057cc] focus:ring-[#0057cc] cursor-pointer"/>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-3 pt-2">
                        <button id="vita-cookie-save-settings" type="button" class="flex-1 py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer text-center">
                            Guardar preferencias
                        </button>
                        <button id="vita-cookie-modal-accept-all" type="button" class="flex-1 py-3 px-4 rounded-xl bg-[#0057cc] hover:bg-[#0040a2] text-white text-xs font-bold transition-colors shadow-md cursor-pointer text-center">
                            Aceptar todo
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            document.getElementById('vita-cookie-modal-close').addEventListener('click', () => {
                closeModal();
            });

            document.getElementById('vita-cookie-save-settings').addEventListener('click', () => {
                const analytics = document.getElementById('vita-consent-analytics').checked;
                const marketing = document.getElementById('vita-consent-marketing').checked;
                window.updateVitaGCM(analytics, marketing, false);
                closeModal();
                hideBanner();
            });

            document.getElementById('vita-cookie-modal-accept-all').addEventListener('click', () => {
                window.updateVitaGCM(true, true, true);
                closeModal();
                hideBanner();
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
        }

        // Sincronizar estado checkboxes
        const chkAnalytics = document.getElementById('vita-consent-analytics');
        const chkMarketing = document.getElementById('vita-consent-marketing');
        if (chkAnalytics) chkAnalytics.checked = !!consent.analytics;
        if (chkMarketing) chkMarketing.checked = !!consent.marketing;

        modal.classList.remove('hidden');
        modal.classList.add('flex');
        requestAnimationFrame(() => {
            const card = document.getElementById('vita-cookie-modal-card');
            if (card) {
                card.classList.remove('scale-95', 'opacity-0');
                card.classList.add('scale-100', 'opacity-100');
            }
        });

        function closeModal() {
            const card = document.getElementById('vita-cookie-modal-card');
            if (card) {
                card.classList.remove('scale-100', 'opacity-100');
                card.classList.add('scale-95', 'opacity-0');
            }
            setTimeout(() => {
                modal.classList.remove('flex');
                modal.classList.add('hidden');
            }, 250);
        }
    }

    window.openVitaCookieSettings = openCookieSettings;

    // Enlace reactivo del botón `#btn-reabrir-cookies` en la página de política de cookies
    const reopenBtn = document.querySelector('#btn-reabrir-cookies');
    if (reopenBtn) {
        reopenBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCookieSettings();
        });
    }

    // Inicializar visualización si no hay consentimiento registrado
    if (!savedConsent) {
        showBanner();
    }
}

console.log("Clínicas Vita Core initialized (Config, Forms, WhatsApp Modal & Cookies ready).");
