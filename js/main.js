/**
 * Clínicas Vita — Motor Principal de Interacciones y Captación
 * Soporta envío de leads B2C (Lesionados) y B2B (Clínicas/Profesionales)
 */

window.dataLayer = window.dataLayer || [];

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
            const payload = {
                tipo: "B2C_Lesionado",
                nombre: formData.get('nombre') || "",
                telefono: formData.get('telefono') || "",
                email: formData.get('email') || "",
                provincia: formData.get('provincia') || "",
                mensaje: formData.get('mensaje') || "Solicitud de asistencia médica tras accidente"
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
});

console.log("Clínicas Vita Core initialized (Config & Forms ready).");
