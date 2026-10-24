(() => {
  'use strict';
  if (!location.pathname.startsWith('/demo-taller/') || document.getElementById('autonomiza-contact')) return;
  const ENDPOINT = 'https://n8n.autonomiza.es/webhook/taller-demo-zne62txkwvzf';
  const RESERVE = 'https://n8n.autonomiza.es/webhook/taller-demo-reservar-exkqf9y3ktud';
  const EXIT = '/respuesta-inmediata/';
  const PRIVACY = '/demo-taller/privacidad/#chat-web';
  const LIVE = ['https://autonomiza.es', 'https://www.autonomiza.es'].includes(location.origin);
  const LOCAL = location.origin==='http://127.0.0.1:8786';
  const ENABLED = LIVE || LOCAL;
  const BUSINESSES = {revision:'Revisión o ITV', averia:'Avería o ruido', presupuesto:'Presupuesto', otra:'Otra consulta'};
  const CHANNELS = {whatsapp:'WhatsApp', correo:'Correo', llamada:'Llamada'};
  const QUESTIONS = ['¿Qué necesitas?', 'Cuéntame un poco más: qué coche es y qué le pasa, o qué quieres saber.', '¿Cómo te llamas?', '¿Por dónde te contestamos?', '', 'Antes de enviar'];
  const answer = {necesidad:'', mensaje:'', nombre:'', canal:'', telefono:'', correo:'', acepta:false};
  let step=0, openedAt=null, submitted=false, result=null, opener=null;
  let generation=0, busy=false, greeted=false, initialized=false;
  const mobile=window.matchMedia('(max-width:700px)');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
  function button(text,action,cls='ac-button'){const n=el('button',cls,text);n.type='button';n.addEventListener('click',action);return n;}
  function link(text,href,cls='ac-link',external=false){const n=el('a',cls,text);n.href=href;if(external){n.target='_blank';n.rel='noopener noreferrer';}return n;}
  function avatar(){const frame=el('span','ac-face'),n=el('img','ac-avatar');n.src='/demo-taller/simbolo.svg';n.alt='';n.width=32;n.height=32;frame.append(n);return frame;}
  const root=el('div');root.id='autonomiza-contact';
  const launcher=button('',openChat,'ac-launcher');launcher.append(avatar(),el('span','ac-launch-label','Hablar con el taller'));
  launcher.setAttribute('aria-label','Hablar con el taller');launcher.setAttribute('aria-haspopup','dialog');launcher.setAttribute('aria-controls','ac-dialog');launcher.setAttribute('aria-expanded','false');
  const outside=el('div','ac-launch-area');outside.id='autonomiza-chat-launch';outside.append(launcher);
  const dialog=el('dialog','ac-dialog');dialog.id='ac-dialog';dialog.setAttribute('aria-labelledby','ac-title');
  const top=el('div','ac-top'),identity=el('div','ac-identity'),title=el('h2','','Asistente · Taller Demo');title.id='ac-title';
  identity.append(avatar(),title);
  const close=button('×',()=>dialog.close(),'ac-close');close.setAttribute('aria-label','Cerrar chat');top.append(identity,close);
  const form=el('form','ac-form');form.noValidate=true;form.autocomplete='off';
  const honeypot=el('input');honeypot.type='text';honeypot.name='empresa_web';honeypot.tabIndex=-1;honeypot.autocomplete='off';honeypot.setAttribute('aria-hidden','true');
  const trap=el('div');trap.hidden=true;trap.append(honeypot);
  const scroll=el('div','ac-scroll');scroll.tabIndex=0;scroll.setAttribute('aria-label','Conversación con Taller Demo');
  if(!LIVE)scroll.append(el('p','ac-preview',LOCAL?'Vista local con envío real de prueba. Usa datos inventados.':'Vista de archivo: los envíos no están disponibles.'));
  const transcript=el('div','ac-transcript');
  const confirm=el('div','ac-confirm');scroll.append(transcript,confirm);
  const composer=el('div','ac-composer'),content=el('div','ac-content');
  const next=el('button','ac-send','↑');next.type='submit';next.setAttribute('aria-label','Enviar respuesta');composer.append(content,next);
  const error=el('p','ac-error');error.id='ac-error';error.setAttribute('role','alert');
  const live=el('div','ac-sr');live.setAttribute('aria-live','polite');live.setAttribute('aria-atomic','true');
  form.append(trap,scroll,composer,error);
  const footer=el('div','ac-footer');footer.append(el('p','ac-whatsapp','Prefiero llamar: 947 00 00 00 · Número ficticio, no llames.'),link('¿Quieres esto en tu negocio? Habla con Iván',EXIT,'td-chat-exit'));
  const notice=el('div','td-chat-notice');notice.append(document.createTextNode('Ejemplo ficticio de Autonomiza: este taller no existe. Lo que escribas lo recibe Autonomiza para enseñarte cómo funciona. '),link('Autonomiza','/')); 
  dialog.append(top,notice,form,footer,live);root.append(dialog);document.body.append(root);
  document.body.append(outside);
  const triggers=[launcher];
  for(const a of document.querySelectorAll('.td-chat-trigger')){
    a.addEventListener('click',event=>{event.preventDefault();openChat(event);});
    a.setAttribute('aria-haspopup','dialog');a.setAttribute('aria-controls','ac-dialog');a.setAttribute('aria-expanded','false');triggers.push(a);
  }
  function expanded(value){for(const t of triggers)t.setAttribute('aria-expanded',String(value));}
  let switchClosures=0;
  dialog.addEventListener('close',()=>{if(switchClosures){switchClosures--;return;}expanded(false);if(opener?.isConnected)opener.focus();});
  dialog.addEventListener('keydown',event=>{if(event.key==='Escape'&&!mobile.matches){event.preventDefault();dialog.close();}});
  function present(){if(mobile.matches){dialog.setAttribute('aria-modal','true');dialog.showModal();}else{dialog.removeAttribute('aria-modal');dialog.show();}}
  function viewport(){if(!mobile.matches||!window.visualViewport)return;dialog.style.setProperty('--ac-height',window.visualViewport.height+'px');dialog.style.setProperty('--ac-top',window.visualViewport.offsetTop+'px');}
  window.visualViewport?.addEventListener('resize',viewport);window.visualViewport?.addEventListener('scroll',viewport);
  mobile.addEventListener('change',()=>{if(!dialog.open)return;switchClosures++;dialog.close();present();close.focus();});
  function openChat(event){
    if(dialog.open)return;opener=event?.currentTarget||launcher;if(openedAt===null)openedAt=Date.now();
    viewport();present();expanded(true);close.focus({preventScroll:true});
    if(!initialized){initialized=true;render();}else if(!busy)focusQuestion();
  }
  function bottom(){scroll.scrollTop=scroll.scrollHeight;}
  function focusQuestion(){if(!dialog.open)return;const input=content.querySelector('[data-field]');const target=input||confirm.querySelector('input')||transcript.querySelector('#ac-question')||close;target.focus({preventScroll:true});bottom();}
  function saveDraft(){const input=form.querySelector('[data-field]');if(input)answer[input.dataset.field]=input.type==='checkbox'?input.checked:input.value;}
  function bubble(text,cls=''){
    const row=el('div','ac-ivan '+cls),p=el('p','ac-bubble',text);row.append(avatar(),p);transcript.append(row);return {row,p};
  }
  function question(i){return i===4?(answer.canal!=='correo'?'¿A qué teléfono te contestamos?':'¿A qué correo te contestamos?'):QUESTIONS[i];}
  function values(){return [BUSINESSES[answer.necesidad],answer.mensaje,answer.nombre,CHANNELS[answer.canal],answer.canal!=='correo'?answer.telefono:answer.correo];}
  function edit(i){if(submitted||busy)return;saveDraft();step=i;answer.acepta=false;render();}
  function history(){
    transcript.replaceChildren();
    if(greeted)bubble('Hola 👋 Soy el asistente de Taller Demo. Dime qué necesitas y te contesto al momento.','ac-greeting');
    const previous=values();
    for(let i=0;i<step;i++){
      bubble(question(i));
      const reply=button(previous[i]||'',()=>edit(i),'ac-answer');reply.dataset.edit=String(i);reply.setAttribute('aria-label','Corregir respuesta: '+previous[i]);reply.disabled=submitted||busy;transcript.append(reply);
    }
  }
  function later(text,done,cls=''){
    const token=generation;
    const deliver=()=>{if(token!==generation)return;typing?.remove();const b=bubble(text,cls);live.textContent=text;done(b);bottom();};
    let typing=null;
    if(reduced.matches){deliver();return;}
    typing=el('div','ac-ivan ac-typing');typing.append(avatar(),el('span','ac-bubble','escribiendo…'));typing.setAttribute('aria-hidden','true');transcript.append(typing);live.textContent='El asistente está escribiendo';bottom();setTimeout(deliver,700);
  }
  function unlock(){busy=false;for(const b of transcript.querySelectorAll('[data-edit]'))b.disabled=submitted;}
  function choice(options,key){
    const group=el('div','ac-choices');group.setAttribute('role','group');group.setAttribute('aria-labelledby','ac-question');
    for(const [value,label] of Object.entries(options)){
      const n=button(label,()=>{if(submitted||busy)return;if(key==='canal'&&value!==answer.canal){answer.telefono='';answer.correo='';}answer[key]=value;step++;render();},'ac-choice');
      n.setAttribute('aria-pressed',String(answer[key]===value));group.append(n);
    }
    transcript.append(group);composer.hidden=true;
  }
  function inputField(key,tag,type,min,max,placeholder,autocomplete){
    const input=el(tag,'ac-input');input.id='ac-input';input.name=key;input.dataset.field=key;if(type)input.type=type;
    input.required=true;input.minLength=min;input.maxLength=max;input.value=answer[key];input.autocomplete=autocomplete||'off';input.placeholder=placeholder;
    input.setAttribute('aria-labelledby','ac-question');input.setAttribute('aria-describedby','ac-error');if(tag==='textarea')input.rows=1;
    if(type==='tel')input.inputMode='tel';if(type==='email'){input.inputMode='email';input.autocapitalize='none';input.spellcheck=false;}
    input.addEventListener('input',()=>{saveDraft();error.textContent='';input.removeAttribute('aria-invalid');if(tag==='textarea'){input.style.height='auto';input.style.height=Math.max(44,Math.min(120,input.scrollHeight))+'px';}});
    input.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.isComposing){event.preventDefault();form.requestSubmit();}});
    content.append(input);
    if(key==='mensaje'){
      const count=el('small','ac-count');const update=()=>{count.hidden=input.value.length<450;count.textContent=`${input.value.length} / 500 caracteres`;};update();input.addEventListener('input',update);content.append(count);
    }
    composer.hidden=false;
  }
  function privacy(){
    const consent=el('label','ac-consent'),check=el('input');check.type='checkbox';check.name='acepta';check.dataset.field='acepta';check.required=true;check.checked=false;check.setAttribute('aria-describedby','ac-error');
    check.addEventListener('change',()=>{answer.acepta=check.checked;error.textContent='';});
    const text=el('span');text.append(document.createTextNode('He leído el '),link('aviso de privacidad',PRIVACY,'ac-link',true),document.createTextNode(' y acepto que se usen estos datos para responder a mi consulta.'));
    consent.append(check,text);
    const info=el('p','ac-privacy','Responsable: Iván Rodríguez Ruiz (Autonomiza). Usa datos inventados. Si pones tu correo real, te llegará la confirmación de prueba. El mensaje se envía a Gemini de Google para responderlo.');
    next.textContent='Sí, envíalo';next.className='ac-button';next.setAttribute('aria-label','Sí, envíalo');confirm.append(consent,info,next);answer.acepta=false;composer.hidden=true;
  }
  function summary(){const contact=answer.canal==='correo'?answer.correo:answer.telefono;return `Perfecto, ${answer.nombre}. Te contestamos por ${CHANNELS[answer.canal]} a ${contact}. ¿Lo envío?`;}
  let serverError='';
  function render(){
    if(submitted)return;generation++;busy=true;history();confirm.replaceChildren();content.replaceChildren();error.textContent='';composer.hidden=true;
    next.disabled=false;next.className='ac-send';next.textContent='↑';next.setAttribute('aria-label','Enviar respuesta');composer.append(next);
    function ask(){later(step===5?summary():question(step),({p})=>{
      p.id='ac-question';p.tabIndex=-1;p.dataset.question='';unlock();
      if(step===0)choice(BUSINESSES,'necesidad');
      if(step===1)inputField('mensaje','textarea',null,3,500,'Ej.: Seat León de 2016, revisión pre-ITV…');
      if(step===2)inputField('nombre','input','text',2,60,'Tu nombre','name');
      if(step===3)choice(CHANNELS,'canal');
      if(step===4)inputField(answer.canal!=='correo'?'telefono':'correo','input',answer.canal!=='correo'?'tel':'email',answer.canal!=='correo'?6:1,answer.canal!=='correo'?25:120,answer.canal!=='correo'?'+34 600 000 000':'nombre@ejemplo.com',answer.canal!=='correo'?'tel':'email');
      if(step===5)privacy();focusQuestion();if(serverError){error.textContent=serverError;serverError='';}
    });}
    if(!greeted)later('Hola 👋 Soy el asistente de Taller Demo. Dime qué necesitas y te contesto al momento.',()=>{greeted=true;ask();},'ac-greeting');else ask();
  }
  function invalid(message) {
    error.textContent=message;const input=form.querySelector('[data-field]');if(input){input.setAttribute('aria-invalid','true');input.focus();}
    return false;
  }
  function valid() {
    if(step===1){answer.mensaje=answer.mensaje.trim();if(answer.mensaje.length<3||answer.mensaje.length>500)return invalid('Escribe tu consulta en entre 3 y 500 caracteres.');}
    if(step===2){answer.nombre=answer.nombre.trim();if(answer.nombre.length<2||answer.nombre.length>60)return invalid('Escribe un nombre de entre 2 y 60 caracteres.');}
    if(step===4){
      if(answer.canal!=='correo'){
        answer.telefono=answer.telefono.trim();if(!/^[0-9+().\s-]{6,25}$/.test(answer.telefono)||!/[0-9]/.test(answer.telefono))return invalid('Revisa el teléfono: entre 6 y 25 caracteres, con números y, si hace falta, prefijo.');
      }else{
        answer.correo=answer.correo.trim();const email=content.querySelector('input');email.value=answer.correo;
        if(!answer.correo||answer.correo.length>120||!email.checkValidity())return invalid('Escribe una dirección de correo válida, de hasta 120 caracteres.');
      }
    }
    if(step===5&&!answer.acepta)return invalid('Marca la casilla de privacidad para enviar tu consulta.');
    return true;
  }
  function bookingUrl(raw){try{const u=new URL(raw);return u.href===RESERVE?u.href:null;}catch{return null;}}
  function networkTyping(){const row=el('div','ac-ivan ac-typing');row.append(avatar(),el('span','ac-bubble','escribiendo…'));row.setAttribute('aria-hidden','true');transcript.append(row);live.textContent='El asistente está escribiendo';bottom();return row;}
  async function request(endpoint,payload){
    if(!ENABLED)throw new Error('Origen no habilitado');
    // Browser calls the contracted endpoint directly. Local CORS is temporarily enabled by Claude.
    const target=endpoint;
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);
    try{const response=await fetch(target,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:controller.signal,credentials:'omit',cache:'no-store',redirect:'error',referrerPolicy:'no-referrer'});return {status:response.status,data:await response.json()};}finally{clearTimeout(timer);}
  }
  function reset(){
    if(busy)return;generation++;submitted=false;result=null;step=0;openedAt=Date.now();greeted=true;serverError='';
    for(const k of Object.keys(answer))answer[k]=k==='acepta'?false:'';
    render();
  }
  function newInquiry(){confirm.replaceChildren();confirm.append(button('Hacer otra consulta',reset,'ac-button'));}
  function responseBubble(message){const {p}=bubble(message);p.classList.add('ac-result');p.tabIndex=-1;live.textContent=message;if(dialog.open)p.focus({preventScroll:true});bottom();}
  function fallback(message){responseBubble(message);confirm.replaceChildren();confirm.append(el('p','ac-help','Teléfono del taller: 947 00 00 00 (ficticio; no llames).'),link('Habla con Iván en Autonomiza',EXIT,'ac-button'));}
  function correct400(data){
    submitted=false;busy=false;const steps={necesidad:0,mensaje:1,nombre:2,canal:3,telefono:4,correo:4,acepta:5};
    const keys=Array.isArray(data.campos)?data.campos:[];const key=keys.find(k=>Object.hasOwn(steps,k));
    serverError=typeof data.error==='string'?data.error:'Revisa los datos indicados y vuelve a enviarlos.';step=key?steps[key]:5;answer.acepta=false;render();
  }
  function renderSlots(data){
    const reserve=bookingUrl(data.reservar),id=typeof data.id==='string'&&data.id.length<=200?data.id:null;
    const slots=Array.isArray(data.huecos)?data.huecos.slice(0,3).filter(h=>h&&typeof h.etiqueta==='string'&&h.etiqueta.trim()&&typeof h.inicio==='string'&&typeof h.fin==='string'&&Number.isFinite(Date.parse(h.inicio))&&Date.parse(h.fin)>Date.parse(h.inicio)):[];
    if(!reserve||!id||!slots.length){newInquiry();return;}
    const group=el('div','ac-slots');group.setAttribute('role','group');group.setAttribute('aria-label','Huecos disponibles para la cita de demostración');
    const help=el('p','ac-help','Preparando los huecos…');help.setAttribute('role','status');group.append(help);let consumed=false;
    for(const slot of slots){
      const b=button(slot.etiqueta,async()=>{
        if(consumed||busy||b.disabled)return;consumed=true;busy=true;for(const x of group.querySelectorAll('button'))x.disabled=true;
        confirm.replaceChildren();transcript.append(el('p','ac-answer',slot.etiqueta));const typing=networkTyping();form.setAttribute('aria-busy','true');
        try{
          const {status,data:r}=await request(reserve,{id,inicio:slot.inicio});typing.remove();group.remove();
          if(status===200&&r.ok===true&&typeof r.mensaje==='string'){responseBubble(r.mensaje);newInquiry();}
          else if(status===409){responseBubble(typeof r.error==='string'?r.error:'Ese hueco ya no está disponible. Puedes hacer otra consulta.');newInquiry();}
          else if(status===404){responseBubble('No encuentro tu consulta, vuelve a escribirnos');newInquiry();}
          else if(status===400){responseBubble(typeof r.error==='string'?r.error:'No se ha podido validar el hueco. Haz otra consulta.');newInquiry();}
          else if(status===429){fallback(typeof r.error==='string'?r.error:'Has hecho demasiados intentos. Vuelve más tarde.');}
          else throw new Error('Reserva no confirmada');
        }catch{typing.remove();group.remove();fallback('No he podido confirmar la reserva. No vuelvas a reservar sin comprobar antes si ha llegado la confirmación. Puedes hablar con Autonomiza.');}
        finally{busy=false;form.removeAttribute('aria-busy');bottom();}
      },'ac-slot');b.disabled=true;b.dataset.inicio=slot.inicio;group.append(b);
    }
    transcript.append(group);const token=generation;
    setTimeout(()=>{if(token!==generation||!group.isConnected||consumed)return;for(const b of group.querySelectorAll('button'))b.disabled=false;help.textContent='Elige un hueco. La disponibilidad se comprueba al reservar.';live.textContent='Ya puedes elegir un hueco para la cita.';},3000);
    newInquiry();bottom();
  }
  async function send(){
    if(submitted||busy)return;const elapsed=Math.max(0,Date.now()-openedAt);
    if(elapsed<2500){invalid('Espera un momento antes de enviar.');return;}
    submitted=true;busy=true;next.disabled=true;for(const b of transcript.querySelectorAll('[data-edit]'))b.disabled=true;
    confirm.replaceChildren();content.replaceChildren();composer.hidden=true;error.textContent='';form.setAttribute('aria-busy','true');transcript.append(el('p','ac-answer ac-confirmation','Sí, envíalo'));const typing=networkTyping();
    const payload={necesidad:answer.necesidad,mensaje:answer.mensaje,nombre:answer.nombre,canal:answer.canal,acepta:true,pagina:(location.origin+location.pathname).slice(0,200),empresa_web:honeypot.value,t:elapsed};
    payload[answer.canal==='correo'?'correo':'telefono']=answer.canal==='correo'?answer.correo:answer.telefono;
    try{
      const {status,data}=await request(ENDPOINT,payload);typing.remove();
      if(status===200&&data.ok===true&&typeof data.mensaje==='string'&&data.mensaje.trim()){
        result='success';responseBubble(data.mensaje);busy=false;renderSlots(data);
      }else if(status===400){correct400(data);}
      else if(status===429){result='error';fallback(typeof data.error==='string'?data.error:'Has enviado demasiadas consultas. Vuelve más tarde.');}
      else throw new Error('Respuesta no válida');
    }catch{typing.remove();result='error';fallback('No he podido confirmar que tu consulta haya llegado. No la envíes de nuevo sin comprobarlo. Puedes hablar con Autonomiza.');}
    finally{if(submitted)busy=false;form.removeAttribute('aria-busy');bottom();}
  }
  form.addEventListener('submit',event=>{event.preventDefault();if(submitted||busy)return;saveDraft();if(!valid())return;if(step===5)send();else if(step!==0&&step!==3){step++;render();}});
})();
