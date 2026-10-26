(() => {
  'use strict';
  if (document.getElementById('autonomiza-contact')) return;
  const ENDPOINT = 'https://n8n.autonomiza.es/webhook/contacto-web-5r5ypdyed6rx';
  const WHATSAPP = 'https://wa.me/34745041754?text=Hola%20Iv%C3%A1n%2C%20quiero%20contarte%20algo%20de%20mi%20negocio';
  const PRIVACY = '/politica-de-privacidad#chat-web';
  const LIVE = ['https://autonomiza.es', 'https://www.autonomiza.es'].includes(location.origin);
  const BUSINESSES = {clinica:'Clínica o consulta', comercio:'Comercio o almacén', taller:'Taller, obra o fábrica', oficina:'Oficina, despacho u otro'};
  const CHANNELS = {whatsapp:'WhatsApp', correo:'Correo', videollamada:'Videollamada de 20 min'};
  const QUESTIONS = ['¿A qué se dedica tu negocio?', '¿Qué tarea te quita más tiempo o se te queda siempre para luego?', '¿Cómo te llamas?', '¿Por dónde prefieres que te conteste?', '', 'Antes de enviar'];
  const answer = {negocio:'', tarea:'', nombre:'', canal:'', telefono:'', correo:'', acepta:false};
  let step=0, openedAt=null, submitted=false, result=null, opener=null;
  let generation=0, busy=false, greeted=false, initialized=false;
  const mobile=window.matchMedia('(max-width:700px)');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
  function button(text,action,cls='ac-button'){const n=el('button',cls,text);n.type='button';n.addEventListener('click',action);return n;}
  function link(text,href,cls='ac-link',external=false){const n=el('a',cls,text);n.href=href;if(external){n.target='_blank';n.rel='noopener noreferrer';}return n;}
  function avatar(){const frame=el('span','ac-face'),n=el('img','ac-avatar');n.src='/assets/ivan-recortado.webp';n.alt='';n.width=32;n.height=32;frame.append(n);return frame;}
  const root=el('div');root.id='autonomiza-contact';
  const launcher=button('',openChat,'ac-launcher');launcher.append(avatar(),el('span','ac-launch-label','Habla con Iván'));
  launcher.setAttribute('aria-label','Habla con Iván');launcher.setAttribute('aria-haspopup','dialog');launcher.setAttribute('aria-controls','ac-dialog');launcher.setAttribute('aria-expanded','false');
  const outside=el('div','ac-launch-area');outside.id='autonomiza-chat-launch';outside.append(launcher);
  const dialog=el('dialog','ac-dialog');dialog.id='ac-dialog';dialog.setAttribute('aria-labelledby','ac-title');
  const top=el('div','ac-top'),identity=el('div','ac-identity'),title=el('h2','','Iván · Autonomiza');title.id='ac-title';
  identity.append(avatar(),title);
  const close=button('×',()=>dialog.close(),'ac-close');close.setAttribute('aria-label','Cerrar chat');top.append(identity,close);
  const form=el('form','ac-form');form.noValidate=true;form.autocomplete='off';
  const honeypot=el('input');honeypot.type='text';honeypot.name='empresa_web';honeypot.tabIndex=-1;honeypot.autocomplete='off';honeypot.setAttribute('aria-hidden','true');
  const trap=el('div');trap.hidden=true;trap.append(honeypot);
  const scroll=el('div','ac-scroll');scroll.tabIndex=0;scroll.setAttribute('aria-label','Conversación con Iván');
  if(!LIVE)scroll.append(el('p','ac-preview','Vista previa: aquí no se envían datos.'));
  const transcript=el('div','ac-transcript');
  const confirm=el('div','ac-confirm');scroll.append(transcript,confirm);
  const composer=el('div','ac-composer'),content=el('div','ac-content');
  const next=el('button','ac-send','↑');next.type='submit';next.setAttribute('aria-label','Enviar respuesta');composer.append(content,next);
  const error=el('p','ac-error');error.id='ac-error';error.setAttribute('role','alert');
  const live=el('div','ac-sr');live.setAttribute('aria-live','polite');live.setAttribute('aria-atomic','true');
  form.append(trap,scroll,composer,error);
  const footer=el('div','ac-footer');footer.append(link('Prefiero escribir por WhatsApp',WHATSAPP,'ac-whatsapp',true));
  dialog.append(top,form,footer,live);root.append(dialog);document.body.append(root);
  const header=document.querySelector('body > header');
  if(header){
    header.classList.add('ac-contact-header');
    const row=header.querySelector(':scope > .in')||header;row.classList.add('ac-header-row');
    const brand=row.querySelector('a');brand?.classList.add('ac-header-brand');
    for(const contact of header.querySelectorAll('a[href^="https://wa.me/"],a[href^="mailto:"]'))contact.remove();
    const group=el('div','ac-header-actions');group.append(outside);outside.classList.add('ac-in-header');row.append(group);
    function fitHeader(){
      outside.classList.remove('ac-icon-only');
      if(!row.clientWidth)return;
      const style=getComputedStyle(row),children=[...row.children].filter(n=>getComputedStyle(n).display!=='none');
      const needed=children.reduce((sum,n)=>sum+n.getBoundingClientRect().width,0)+(parseFloat(style.columnGap)||0)*Math.max(0,children.length-1)+(parseFloat(style.paddingLeft)||0)+(parseFloat(style.paddingRight)||0);
      outside.classList.toggle('ac-icon-only',needed>row.clientWidth+0.5);
    }
    fitHeader();window.addEventListener('resize',fitHeader);document.fonts?.ready.then(fitHeader);
    if(window.ResizeObserver)new ResizeObserver(fitHeader).observe(row);
  }else root.append(outside);
  const triggers=[launcher];
  for(const a of document.querySelectorAll('a')){
    if(a.hasAttribute('data-autonomiza-chat')||/^(Cuéntame qué te frena|Cuéntame tu caso)(?:\s|$)/.test(a.textContent.trim())){
      a.addEventListener('click',event=>{event.preventDefault();openChat(event);});
      a.setAttribute('aria-haspopup','dialog');a.setAttribute('aria-controls','ac-dialog');a.setAttribute('aria-expanded','false');triggers.push(a);
    }
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
  function question(i){return i===4?(answer.canal==='whatsapp'?'¿A qué teléfono te escribo?':'¿A qué correo te escribo?'):QUESTIONS[i];}
  function values(){return [BUSINESSES[answer.negocio],answer.tarea,answer.nombre,CHANNELS[answer.canal],answer.canal==='whatsapp'?answer.telefono:answer.correo];}
  function edit(i){if(submitted||busy)return;saveDraft();step=i;answer.acepta=false;render();}
  function history(){
    transcript.replaceChildren();
    if(greeted)bubble('Hola 👋 Te hago 4 preguntas rápidas y te contesto yo en persona.','ac-greeting');
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
    typing=el('div','ac-ivan ac-typing');typing.append(avatar(),el('span','ac-bubble','escribiendo…'));typing.setAttribute('aria-hidden','true');transcript.append(typing);live.textContent='Iván está escribiendo';bottom();setTimeout(deliver,700);
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
    if(key==='tarea'){
      const count=el('small','ac-count');const update=()=>{count.hidden=input.value.length<450;count.textContent=`${input.value.length} / 500 caracteres`;};update();input.addEventListener('input',update);content.append(count);
    }
    composer.hidden=false;
  }
  function privacy(){
    const consent=el('label','ac-consent'),check=el('input');check.type='checkbox';check.name='acepta';check.dataset.field='acepta';check.required=true;check.checked=false;check.setAttribute('aria-describedby','ac-error');
    check.addEventListener('change',()=>{answer.acepta=check.checked;error.textContent='';});
    consent.append(check,el('span','','He leído la política de privacidad y acepto que Iván use estos datos para responderme'));
    const info=el('p','ac-privacy');info.append(document.createTextNode('Responsable: Iván Rodríguez Ruiz. Uso tus datos solo para responderte. Puedes ejercer tus derechos en hola@autonomiza.es. Más información en la '),link('política de privacidad',PRIVACY,'ac-link',true),document.createTextNode('.'));
    next.textContent='Sí, envíalo';next.className='ac-button';next.setAttribute('aria-label',LIVE?'Sí, envíalo':'Sí, envíalo: ver respuesta de ejemplo, sin enviar datos');
    confirm.append(consent,info,next);answer.acepta=false;composer.hidden=true;
  }
  function summary(){if(answer.canal==='videollamada')return `Perfecto, ${answer.nombre}. Te mando el enlace a ${answer.correo}. ¿Te lo envío?`;const contact=answer.canal==='whatsapp'?answer.telefono:answer.correo;const channel=answer.canal==='whatsapp'?'WhatsApp':'correo';return `Perfecto, ${answer.nombre}. Te contesto por ${channel} a ${contact}. ¿Te lo envío?`;}
  function previewMessage(){
    const intro=`Gracias, ${answer.nombre}. Ya tengo tu caso: «${answer.tarea}». `;
    if(answer.canal==='videollamada')return intro+'Elige ahora el hueco que mejor te venga para la videollamada de 20 min; te mando la confirmación al correo. Si prefieres que te escriba yo antes, lo hago normalmente en unas horas, como mucho al día siguiente.';
    const channel=answer.canal==='whatsapp'?`WhatsApp, al ${answer.telefono}`:`correo, a ${answer.correo}`;
    return intro+`Te contesto yo, en persona, normalmente en unas horas, como mucho al día siguiente, por ${channel}. Si no quieres esperar, reserva directamente una videollamada de 20 min.`;
  }
  function render(serverError=''){
    if(submitted)return;generation++;busy=true;history();confirm.replaceChildren();content.replaceChildren();error.textContent='';composer.hidden=true;
    next.disabled=false;next.className='ac-send';next.textContent='↑';next.setAttribute('aria-label','Enviar respuesta');composer.append(next);
    function ask(){later(step===5?summary():question(step),({p})=>{
      p.id='ac-question';p.tabIndex=-1;p.dataset.question='';unlock();
      if(step===0)choice(BUSINESSES,'negocio');
      if(step===1)inputField('tarea','textarea',null,3,500,'Ej.: meter facturas a mano, recordar citas…');
      if(step===2)inputField('nombre','input','text',2,60,'Tu nombre','name');
      if(step===3)choice(CHANNELS,'canal');
      if(step===4)inputField(answer.canal==='whatsapp'?'telefono':'correo','input',answer.canal==='whatsapp'?'tel':'email',answer.canal==='whatsapp'?6:1,answer.canal==='whatsapp'?25:120,answer.canal==='whatsapp'?'+34 600 000 000':'nombre@ejemplo.com',answer.canal==='whatsapp'?'tel':'email');
      if(step===5)privacy();focusQuestion();if(serverError)invalid(serverError);
    });}
    if(!greeted)later('Hola 👋 Te hago 4 preguntas rápidas y te contesto yo en persona.',()=>{greeted=true;ask();},'ac-greeting');else ask();
  }
  function invalid(message) {
    error.textContent=message;const input=form.querySelector('[data-field]');if(input){input.setAttribute('aria-invalid','true');if(dialog.open)input.focus();}
    return false;
  }
  function valid() {
    if(step===1){answer.tarea=answer.tarea.trim();if(answer.tarea.length<3||answer.tarea.length>500)return invalid('Cuéntame la tarea en entre 3 y 500 caracteres.');}
    if(step===2){answer.nombre=answer.nombre.trim();if(answer.nombre.length<2||answer.nombre.length>60)return invalid('Escribe un nombre de entre 2 y 60 caracteres.');}
    if(step===4){
      if(answer.canal==='whatsapp'){
        answer.telefono=answer.telefono.trim();if(!/^[0-9+().\s-]{6,25}$/.test(answer.telefono)||!/[0-9]/.test(answer.telefono))return invalid('Revisa el teléfono: entre 6 y 25 caracteres, con números y, si hace falta, prefijo.');
      }else{
        answer.correo=answer.correo.trim();const email=content.querySelector('input');email.value=answer.correo;
        if(!answer.correo||answer.correo.length>120||!email.checkValidity())return invalid('Escribe una dirección de correo válida, de hasta 120 caracteres.');
      }
    }
    if(step===5&&!answer.acepta)return invalid('Marca la casilla de privacidad para enviar tu consulta.');
    return true;
  }
  function bookingUrl(raw) {
    try {const u=new URL(raw);return u.protocol==='https:'&&u.hostname==='calendar.app.google'&&!u.port&&!u.username&&!u.password?u.href:null;}catch{return null;}
  }
  function showResult(kind,message,reserve=null,fields=[]){
    result=kind;generation++;busy=true;confirm.replaceChildren();content.replaceChildren();composer.hidden=true;error.textContent='';
    later(message,({row,p})=>{
      p.classList.add('ac-result');p.tabIndex=-1;
      if(kind==='preview')confirm.append(el('p','ac-preview','No se han enviado tus datos. Esta respuesta es solo una muestra.'));
      if(fields.length)confirm.append(el('p','ac-help','Datos que revisar: '+fields.join(', ')+'.'));
      if(reserve)confirm.append(link('Reservar videollamada de 20 min',reserve,answer.canal==='videollamada'?'ac-button ac-booking':'ac-button ac-reserve',true));
      if(kind==='error')confirm.append(link('Escribir por WhatsApp',WHATSAPP,'ac-button',true),link('hola@autonomiza.es','mailto:hola@autonomiza.es','ac-email'));
      busy=false;if(dialog.open){p.focus({preventScroll:true});bottom();}
    });
  }
  function correct400(data){
    // A validation rejection is safe to correct; never retry automatically.
    const steps={negocio:0,tarea:1,nombre:2,canal:3,telefono:4,correo:4,acepta:5};
    const fields=Array.isArray(data?.campos)?data.campos:[];
    const positions=fields.filter(key=>typeof key==='string'&&Object.hasOwn(steps,key)).map(key=>steps[key]);
    step=positions.length?Math.min(...positions):5;
    submitted=false;busy=false;result=null;answer.acepta=false;
    const message=typeof data?.error==='string'&&data.error.trim()?data.error:'Revisa tus respuestas y vuelve a confirmar el envío.';
    render(message);
  }
  async function send() {
    if(submitted)return;
    const elapsed=Math.max(0,Date.now()-openedAt);
    if(elapsed<2500){invalid('Espera un momento antes de enviar.');return;}
    submitted=true;next.disabled=true;for(const b of transcript.querySelectorAll('[data-edit]'))b.disabled=true;next.textContent='Enviando…';form.setAttribute('aria-busy','true');
    transcript.append(el('p','ac-answer ac-confirmation','Sí, envíalo'));bottom();
    const payload={negocio:answer.negocio,tarea:answer.tarea,nombre:answer.nombre,canal:answer.canal,acepta:true,pagina:(location.origin+location.pathname).slice(0,200),empresa_web:honeypot.value,t:elapsed};
    payload[answer.canal==='whatsapp'?'telefono':'correo']=answer.canal==='whatsapp'?answer.telefono:answer.correo;
    if(!LIVE){
      form.removeAttribute('aria-busy');showResult('preview',previewMessage(),'https://calendar.app.google/SAbieWwwcU7BVWgp9');return;
    }
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),8000);
    try {
      const response=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:controller.signal,credentials:'omit',cache:'no-store',redirect:'error',referrerPolicy:'no-referrer'});
      const data=await response.json();
      if(response.status===200&&data.ok===true&&typeof data.mensaje==='string'&&data.mensaje.trim()){
        showResult('success',data.mensaje,bookingUrl(data.reservar));
      }else if(response.status===400){
        correct400(data);
      }else if(response.status===429){
        const names={negocio:'tipo de negocio',tarea:'tarea',nombre:'nombre',canal:'canal de respuesta',telefono:'teléfono',correo:'correo',acepta:'aceptación de privacidad'};
        const fields=Array.isArray(data.campos)?data.campos.filter(k=>Object.hasOwn(names,k)).map(k=>names[k]):[];
        showResult('error',typeof data.error==='string'?data.error:'Revisa tus datos o contacta conmigo por WhatsApp.',null,fields);
      }else throw new Error('Respuesta no válida');
    }catch{
      showResult('error','No he podido confirmar que tu consulta haya llegado. Puedes escribirme por WhatsApp o por correo.');
    }finally{clearTimeout(timer);form.removeAttribute('aria-busy');}
  }
  form.addEventListener('submit',event=>{event.preventDefault();if(submitted||busy)return;saveDraft();if(!valid())return;if(step===5)send();else if(step!==0&&step!==3){step++;render();}});
})();
