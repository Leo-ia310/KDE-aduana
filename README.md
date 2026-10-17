# KDE Aduana Solutions

Sitio web adaptable para servicios aduaneros y logística en Nicaragua. Incluye cotizador por libra, información de servicios e instituciones, contacto, WhatsApp y asistente de atención con Groq.

## Ejecutar en local

Se requiere una versión de Node.js compatible con `--env-file-if-exists` (por ejemplo, Node.js 22 o posterior). No requiere instalar dependencias.

1. Copia `.env.example` a `.env.local`.
2. Configura `GROQ_API_KEY` en `.env.local`. Mantén ese archivo fuera de Git.
3. Ejecuta `npm start`.
4. Abre `http://127.0.0.1:4173`.

Sin clave, el sitio funciona y el chat ofrece continuar por WhatsApp. La clave se usa únicamente en el servidor. Nunca debe agregarse a los archivos de `dist/`.

## Desplegar en Vercel

1. Importa el repositorio `Leo-ia310/KDE-aduana` desde GitHub en Vercel.
2. Usa la raíz del repositorio como **Root Directory** y **Other** como framework. `vercel.json` configura automáticamente el comando `npm run build:vercel`, la salida `vercel-public` y la función `/api/chat`.
3. Antes del despliegue, agrega estas variables en **Environment Variables**:

   | Variable | Valor |
   | --- | --- |
   | `GROQ_API_KEY` | Tu clave de Groq; márcala como sensible. |
   | `GROQ_MODEL` | `openai/gpt-oss-20b` (opcional, es el valor predeterminado). |

4. Actívalas para **Production** y, si vas a probar previews, **Preview**. Después pulsa **Deploy**. Si agregas o cambias una variable después, realiza un nuevo despliegue.

Vercel sirve la página como archivos estáticos y ejecuta `api/chat.js` como una función Node.js 22. No necesita ejecutar `npm start` ni mantener un servidor escuchando un puerto. La función comparte la misma información de KDE y el mismo código de conversación que el servidor local.

El build incluye solo los archivos públicos. No publica `.env.local`, las claves, el código del servidor ni los metadatos de Sites. El endpoint limita el tamaño de las consultas y tiene un timeout de 20 segundos, dentro de los 30 segundos configurados para la función. El límite de frecuencia en memoria es por instancia; no es un contador global entre instancias de Vercel.

Referencias: [funciones Node.js de Vercel](https://vercel.com/docs/functions/runtimes/node-js) y [configuración del proyecto](https://vercel.com/docs/project-configuration).

## Archivos

- `dist/`: HTML, estilos, JavaScript y las imágenes originales del sitio.
- `worker/index.mjs`: asistente con contexto de KDE, validación de consultas y conexión a Groq.
- `server.mjs`: servidor local y endpoint `/api/chat`.
- `api/chat.js`: función del chatbot para Vercel.
- `vercel.json`: configuración de despliegue en Vercel.
- `scripts/build-vercel.mjs`: prepara únicamente los archivos públicos para Vercel.
- `scripts/build-worker.mjs`: genera el Worker de publicación con los recursos incorporados.
- `.openai/hosting.json`: identidad del sitio alojado en Sites.

## Comandos

```sh
npm start
npm test
npm run build
npm run build:vercel
```

La publicación en Sites utiliza `npm run build` y los secretos de servidor `GROQ_API_KEY` y `GROQ_MODEL`. Los archivos generados de servidor y las variables locales no se incluyen en Git.

## Contacto

- WhatsApp y teléfono: +505 8189 8088
- Correo: kdeaduanassolutions@gmail.com
- Instagram: https://www.instagram.com/kde_as/
- TikTok: https://www.tiktok.com/@kde_aduanasolution

Las tarifas y plazos son estimaciones que deben confirmarse con el equipo. El proyecto mantiene su aviso académico sin fines de lucro.
