import { handleChat } from '../worker/index.mjs';

// Vercel supplies a Web Request. Secrets are read only inside the function.
export default {
  fetch(request) {
    return handleChat(request, process.env);
  },
};
