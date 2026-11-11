# TeCuida · Landing (HTML + CSS + JS, sin dependencias)

Estructura: index.html · css/styles.css · js/main.js · img/logo.png

## Antes de publicar
1. js/main.js → `WHATSAPP_NUMBER`: poner el número real (51 + 9 dígitos).
2. index.html → reemplazar `[DOMINIO]` (canonical y Open Graph) y crear img/og-tecuida.jpg (1200x630, sin términos vetados).
3. Completar los `[dato]` (licencias, director técnico QF) y la dirección/contacto del footer.
4. Quitar los avisos `[Borrador: validar con el cliente]` de las FAQ 2 a 5 cuando el cliente las apruebe.
5. Medición: el script envía eventos a `dataLayer` (`whatsapp_click`, `faq_open`) y a Meta Pixel (`Contact`) si está instalado. Instalar GTM/GA4 y el píxel en <head>.
6. Datos estructurados (schema.org MedicalBusiness / FAQPage): agregar solo con datos reales verificados.

## Restricciones del proyecto
No usar términos vetados por Meta Ads (cannabis, THC, CBD, etc.) en textos, metadatos, alt, nombres de archivo ni mensajes prellenados.
