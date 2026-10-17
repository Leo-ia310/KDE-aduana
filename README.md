# KDE Aduana Solutions

Sitio web adaptable para servicios aduaneros y logística en Nicaragua. Incluye cotizador por libra, información de servicios e instituciones, contacto, WhatsApp y asistente de atención con Groq.

## Ejecutar en local

Se requiere una versión de Node.js compatible con `--env-file-if-exists` (por ejemplo, Node.js 22 o posterior). No requiere instalar dependencias.

1. Copia `.env.example` a `.env.local`.
2. Configura `GROQ_API_KEY` en `.env.local`. Mantén ese archivo fuera de Git.
3. Ejecuta `npm start`.
4. Abre `http://127.0.0.1:4173`.

Sin clave, el sitio funciona y el chat ofrece continuar por WhatsApp. La clave se usa únicamente en el servidor. Nunca debe agregarse a los archivos de `dist/`.

## Archivos

- `dist/`: HTML, estilos, JavaScript y las imágenes originales del sitio.
- `worker/index.mjs`: asistente con contexto de KDE, validación de consultas y conexión a Groq.
- `server.mjs`: servidor local y endpoint `/api/chat`.
- `scripts/build-worker.mjs`: genera el Worker de publicación con los recursos incorporados.
- `.openai/hosting.json`: identidad del sitio alojado en Sites.

## Comandos

```sh
npm start
npm test
npm run build
```

La publicación en Sites utiliza `npm run build` y los secretos de servidor `GROQ_API_KEY` y `GROQ_MODEL`. Los archivos generados de servidor y las variables locales no se incluyen en Git.

## Contacto

- WhatsApp y teléfono: +505 8189 8088
- Correo: kdeaduanassolutions@gmail.com
- Instagram: https://www.instagram.com/kde_as/
- TikTok: https://www.tiktok.com/@kde_aduanasolution

Las tarifas y plazos son estimaciones que deben confirmarse con el equipo. El proyecto mantiene su aviso académico sin fines de lucro.
