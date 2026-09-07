/**
 * ==============================================================================
 * CLÍNICAS VITA — GOOGLE APPS SCRIPT WEBHOOK ENGINE (LEADS B2C & ADHESIÓN B2B)
 * ==============================================================================
 * Conexión serverless infalible para clinicasvita.com
 * Hoja vinculada: 10OS5VjBCJ6cSPSqyFhTOKZD0b1NG7aO3J5aTc--XQ3I
 * 
 * INSTRUCCIONES DE DESPLIEGUE:
 * 1. Pega todo este código en el editor de Apps Script (Extensiones > Apps Script).
 * 2. Guarda el proyecto (Ctrl + S o Cmd + S).
 * 3. Ejecuta una vez la función "inicializarHojas" para generar pestañas y cabeceras.
 * 4. Haz clic en "Implementar" (Deploy) > "Nueva implementación" (New deployment).
 * 5. Selecciona tipo: "Aplicación web" (Web App).
 * 6. Configura:
 *    - Descripción: "Clinicas Vita Webhook v1"
 *    - Ejecutar como: "Yo" (tu cuenta)
 *    - Quién tiene acceso: "Cualquier usuario" (Anyone) -> ¡IMPRESCINDIBLE!
 * 7. Copia la URL de la aplicación web que termina en /exec y pégala en js/main.js
 * ==============================================================================
 */

const SPREADSHEET_ID = "10OS5VjBCJ6cSPSqyFhTOKZD0b1NG7aO3J5aTc--XQ3I";

// Correos para alertas inmediatas (opcional)
const NOTIFICATION_EMAILS = "info@clinicasvita.com, asociados@clinicasvita.com";

/**
 * Función que crea y formatea automáticamente las pestañas si no existen
 */
function inicializarHojas() {
  const ss = getSpreadsheet();
  
  // 1. Pestaña B2C (Pacientes)
  let sheetB2C = ss.getSheetByName("Leads_B2C_Pacientes");
  if (!sheetB2C) {
    sheetB2C = ss.insertSheet("Leads_B2C_Pacientes");
    const headersB2C = [
      "Fecha y Hora", 
      "Tipo Lead", 
      "Nombre Paciente", 
      "Teléfono", 
      "Email", 
      "Provincia", 
      "Síntomas / Accidente", 
      "Estado Asistencial"
    ];
    sheetB2C.appendRow(headersB2C);
    formatHeaderRow(sheetB2C, headersB2C.length, "#0050E7"); // Azul Eléctrico Vita
  }

  // 2. Pestaña B2B (Centros Médicos)
  let sheetB2B = ss.getSheetByName("Adhesion_B2B_Centros");
  if (!sheetB2B) {
    sheetB2B = ss.insertSheet("Adhesion_B2B_Centros");
    const headersB2B = [
      "Fecha y Hora", 
      "Tipo Lead", 
      "Nombre Centro / Clínica", 
      "Persona Contacto", 
      "Teléfono", 
      "Email Profesional", 
      "Provincia", 
      "Especialidades", 
      "Propuesta / Mensaje", 
      "Estado Expansión"
    ];
    sheetB2B.appendRow(headersB2B);
    formatHeaderRow(sheetB2B, headersB2B.length, "#0A1931"); // Azul Marino Institucional
  }
}

function formatHeaderRow(sheet, numCols, bgColor) {
  const range = sheet.getRange(1, 1, 1, numCols);
  range.setBackground(bgColor);
  range.setFontColor("#FFFFFF");
  range.setFontWeight("bold");
  range.setFontFamily("Roboto");
  range.setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
  for (let i = 1; i <= numCols; i++) {
    sheet.autoResizeColumn(i);
  }
}

function getSpreadsheet() {
  try {
    return SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (err) {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
}

/**
 * Receptor GET con no-cors (Arquitectura anti-bloqueos de InfoAccidentes)
 */
function doGet(e) {
  return handleLeadRequest(e);
}

/**
 * Receptor POST (por compatibilidad adicional)
 */
function doPost(e) {
  return handleLeadRequest(e);
}

function handleLeadRequest(e) {
  try {
    inicializarHojas();
    const ss = getSpreadsheet();
    const params = (e && e.parameter) ? e.parameter : {};

    const tipo = params.tipo || "B2C_Lesionado";
    const fecha = Utilities.formatDate(new Date(), "Europe/Madrid", "dd/MM/yyyy HH:mm:ss");

    if (tipo === "B2B_Adhesion_Centro") {
      // -------------------------------------------------------------
      // REGISTRO LEAD B2B: CENTRO MÉDICO / PROFESIONAL
      // -------------------------------------------------------------
      const sheetB2B = ss.getSheetByName("Adhesion_B2B_Centros");
      const rowB2B = [
        fecha,
        tipo,
        params.nombreCentro || "No especificado",
        params.nombre || "No especificado",
        params.telefono || "Sin teléfono",
        params.email || "Sin email",
        params.provincia || "España",
        params.especialidad || "General",
        params.mensaje || "",
        "Pendiente Contacto"
      ];
      sheetB2B.appendRow(rowB2B);

      enviarAlertaEmail(
        "Nuevo Centro Interesado en Red Vita: " + (params.nombreCentro || "Clínica"),
        `Se ha recibido una solicitud de adhesión a la Red Médica Vita:\n\n` +
        `• Centro: ${params.nombreCentro}\n` +
        `• Contacto: ${params.nombre}\n` +
        `• Teléfono: ${params.telefono}\n` +
        `• Email: ${params.email}\n` +
        `• Provincia: ${params.provincia}\n` +
        `• Especialidad: ${params.especialidad}\n` +
        `• Mensaje: ${params.mensaje}\n\n` +
        `Fecha: ${fecha}`
      );

    } else {
      // -------------------------------------------------------------
      // REGISTRO LEAD B2C: LESIONADO DE TRÁFICO
      // -------------------------------------------------------------
      const sheetB2C = ss.getSheetByName("Leads_B2C_Pacientes");
      const rowB2C = [
        fecha,
        tipo,
        params.nombre || "Anónimo",
        params.telefono || "Sin teléfono",
        params.email || "Sin email",
        params.provincia || "No indicada",
        params.mensaje || "",
        "Nuevo - Asignar Clínica"
      ];
      sheetB2C.appendRow(rowB2C);

      enviarAlertaEmail(
        "🚨 URGENCIA: Nuevo Lesionado Vita - " + (params.provincia || "España"),
        `Nuevo paciente solicitando asistencia médica:\n\n` +
        `• Nombre: ${params.nombre}\n` +
        `• Teléfono: ${params.telefono}\n` +
        `• Provincia: ${params.provincia}\n` +
        `• Síntomas/Detalle: ${params.mensaje}\n\n` +
        `Contactar antes de las 72 horas para asegurar la cobertura médica.`
      );
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Lead registrado correctamente" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function enviarAlertaEmail(asunto, cuerpo) {
  try {
    if (NOTIFICATION_EMAILS && NOTIFICATION_EMAILS.length > 5) {
      MailApp.sendEmail({
        to: NOTIFICATION_EMAILS,
        subject: "[Clínicas Vita] " + asunto,
        body: cuerpo
      });
    }
  } catch (e) {
    // Si falla el envío de email, no bloquea el guardado en la hoja
    console.warn("Fallo al enviar notificación por email:", e.message);
  }
}
