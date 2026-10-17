(() => {
  const greeting='¡Hola! Soy el asistente virtual de KDE 👋 ¿Necesitas ayuda con un envío, una compra o nuestros servicios?';
  const waUrl=message=>'https://wa.me/50581898088?text='+encodeURIComponent(message);
  const defaultMessage='¡Hola, KDE Aduana Solutions! Vengo de su página web y me gustaría recibir información sobre sus servicios y cotizar un envío.';
  const waIcon='<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 .9A14.9 14.9 0 0 0 3.1 23.3L1 31l7.9-2.1A14.9 14.9 0 1 0 16 .9Zm0 27.1a12.1 12.1 0 0 1-6.2-1.7l-.4-.2-4.7 1.2L6 22.8l-.3-.4A12.2 12.2 0 1 1 16 28Zm6.7-9.1c-.4-.2-2.2-1.1-2.5-1.2-.3-.1-.6-.2-.8.2-.3.4-1 1.2-1.2 1.4-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3-1.8-1.1-1-1.8-2.2-2-2.6-.2-.4 0-.6.2-.8l.6-.7c.2-.2.3-.4.4-.6.1-.2.1-.5 0-.7l-1.1-2.6c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.7.1-1 .5-.4.4-1.3 1.3-1.3 3.1s1.3 3.5 1.5 3.7c.2.2 2.6 4 6.3 5.6.9.4 1.6.6 2.1.7.9.3 1.7.3 2.3.2.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.6.2-1.8-.1-.2-.3-.3-.7-.5Z"/></svg>';
  const botIcon='<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="6" y="9" width="20" height="17" rx="6"/><path d="M16 5v4M3 16v5m26-5v5M12 22h8"/><circle cx="12" cy="16" r="1"/><circle cx="20" cy="16" r="1"/><circle cx="16" cy="4" r="1"/></svg>';
  const container=document.createElement('div');container.className='support-widget';
  container.innerHTML=`<div class="chat-greeting" id="chat-greeting"><button class="greeting-dismiss" aria-label="Ocultar saludo">×</button><button class="greeting-open"><strong>¡Hola! Soy tu asistente KDE 👋</strong><span>¿Necesitas ayuda? Estoy aquí para ti.</span></button></div><section id="kde-chat" class="chat-panel" aria-labelledby="chat-title" hidden><div class="chat-header"><span class="chat-avatar">${botIcon}</span><div><h2 id="chat-title">Asistente KDE</h2><p><span></span> Asistente virtual · IA</p></div><button class="chat-close" type="button" aria-label="Cerrar chat">×</button></div><div class="chat-messages" id="chat-messages" role="log" aria-live="polite" aria-relevant="additions"></div><div class="chat-suggestions"><button type="button" data-question="¿Cuáles son las tarifas y tiempos de envío?">Tarifas y tiempos</button><button type="button" data-question="¿Cómo funciona Compramos por ti?">Compramos por ti</button><button type="button" data-question="Quiero hablar con una persona por WhatsApp.">Hablar con el equipo</button></div><form class="chat-form"><label class="chat-sr-only" for="chat-input">Tu consulta para KDE</label><textarea id="chat-input" rows="1" maxlength="1500" placeholder="Escribe tu consulta…" required></textarea><button class="chat-send" type="submit" aria-label="Enviar consulta"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 4 17 8-17 8 3-8-3-8Zm3 8h14"/></svg></button></form><p class="chat-privacy">Asistente con IA. Las consultas se procesan con Groq.<br>Evita compartir datos sensibles. Confirma los detalles con el equipo.</p><a class="chat-footer-wa" target="_blank" rel="noopener noreferrer">Prefiero escribir por WhatsApp ↗</a></section><div class="support-buttons"><button id="chat-toggle" class="support-bubble bot-bubble" aria-label="Abrir asistente KDE" aria-expanded="false" aria-controls="kde-chat">${botIcon}<span class="chat-dot"></span></button><a id="whatsapp-bubble" class="support-bubble whatsapp-bubble" target="_blank" rel="noopener noreferrer" aria-label="Escribir a KDE por WhatsApp al +505 8189 8088" title="Escríbenos por WhatsApp">${waIcon}</a></div>`;
  document.body.append(container);
  const panel=container.querySelector('.chat-panel'),toggle=container.querySelector('#chat-toggle'),messages=container.querySelector('.chat-messages'),input=container.querySelector('#chat-input'),send=container.querySelector('.chat-send'),greet=container.querySelector('.chat-greeting'),suggestions=container.querySelector('.chat-suggestions');
  container.querySelector('#whatsapp-bubble').href=waUrl(defaultMessage);container.querySelector('.chat-footer-wa').href=waUrl(defaultMessage);
  let busy=false;const history=[];
  function addMessage(text,role,whatsapp=false,context=''){
    const node=document.createElement('div');node.className='chat-message '+role;
    const p=document.createElement('p');p.textContent=text;node.append(p);
    if(whatsapp){const a=document.createElement('a');a.className='chat-wa-action';a.target='_blank';a.rel='noopener noreferrer';a.href=waUrl('¡Hola, KDE! Vengo de su página web y quisiera hablar con el equipo.'+(context?' Mi consulta: '+context.slice(0,700):''));a.textContent='Continuar por WhatsApp ↗';node.append(a)}
    messages.append(node);messages.scrollTop=messages.scrollHeight;return node;
  }
  addMessage(greeting,'assistant');
  function openChat(){panel.hidden=false;toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-label','Cerrar asistente KDE');greet.hidden=true;container.querySelector('.chat-dot').hidden=true;input.focus()}
  function closeChat(){panel.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir asistente KDE');toggle.focus()}
  toggle.addEventListener('click',()=>panel.hidden?openChat():closeChat());container.querySelector('.chat-close').addEventListener('click',closeChat);container.querySelector('.greeting-open').addEventListener('click',openChat);container.querySelector('.greeting-dismiss').addEventListener('click',()=>greet.hidden=true);
  panel.addEventListener('keydown',event=>{if(event.key==='Escape')closeChat()});
  async function ask(question){
    const text=question.trim();if(!text||busy||text.length>1500)return;
    busy=true;input.value='';send.disabled=true;input.disabled=true;suggestions.hidden=true;messages.setAttribute('aria-busy','true');addMessage(text,'user');
    const pending=addMessage('KDE está escribiendo…','assistant typing');
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),25000);
    try{
      const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:[...history.slice(-10),{role:'user',content:text}]}),signal:controller.signal});
      const data=await response.json();pending.remove();
      if(!response.ok||typeof data.reply!=='string'){addMessage(data.error||'No pude responder en este momento. Nuestro equipo puede ayudarte por WhatsApp.','assistant',true,text)}
      else{addMessage(data.reply,'assistant',Boolean(data.whatsapp),text);history.push({role:'user',content:text},{role:'assistant',content:data.reply.slice(0,1500)});if(history.length>10)history.splice(0,history.length-10)}
    }catch{pending.remove();addMessage('No pude conectarme en este momento. Intenta de nuevo o escríbenos por WhatsApp.','assistant',true,text)}finally{clearTimeout(timer);busy=false;send.disabled=false;input.disabled=false;messages.setAttribute('aria-busy','false');if(!panel.hidden)input.focus()}
  }
  container.querySelector('.chat-form').addEventListener('submit',event=>{event.preventDefault();ask(input.value)});
  input.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.isComposing){event.preventDefault();ask(input.value)}});
  container.querySelectorAll('[data-question]').forEach(b=>b.addEventListener('click',()=>ask(b.dataset.question)));
})();
