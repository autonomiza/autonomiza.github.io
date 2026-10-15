/* Illustrative appointment sequence; no messages are sent. */
(()=>{
 const web=document.querySelector('#demo-web'),webText=web.querySelector('[data-web-outcome]');
 const messages=['Se recuerda la cita por WhatsApp.','Un «no puedo ir» libera el hueco.','Un hueco. Tres avisos a la lista de espera.','Irene responde: «Sí, me viene bien».','La confirmación vuelve a la agenda.'];
 const clinic=[
 ['Rubén · Por confirmar','Rubén','Hola, Rubén. Te recordamos tu cita de hoy a las 16:00. ¿Puedes venir?','Recordatorio enviado'],
 ['Hueco libre','Rubén','No voy a poder ir. Lo siento.','Cancelación recibida · Se libera el hueco'],
 ['Avisando a la lista','Lista de espera','Tres avisos enviados.','Se avisa según las reglas de recepción'],
 ['Confirmando','Irene','Sí, me viene bien. ¡Gracias por avisarme!','Se comprueba que el hueco sigue disponible'],
 ['Irene S. · Confirmada','Irene','Tu cita queda confirmada hoy a las 16:00. Te esperamos.','Agenda actualizada · Equipo informado']
 ];
 let active=false,start=0,lastStep=-1;
 const clamp=v=>Math.max(0,Math.min(1,v));
 window.renderDemonstration=(phase,time,paused,reduced)=>{
   const mode=phase>=1.5&&phase<2.5;
   if(mode!==active){active=mode;start=time;lastStep=-1;}
   const opacity=clamp((phase-1.5)/.32)*clamp((2.5-phase)/.12);
   web.style.opacity=opacity.toFixed(3);web.style.visibility=opacity>.01?'visible':'hidden';web.style.transform=`translateY(${((1-opacity)*16).toFixed(1)}px)`;
   web.style.setProperty('--calendar-reveal',clamp((phase-1.5)/.38).toFixed(3));web.style.setProperty('--chat-reveal',clamp((phase-1.78)/.16).toFixed(3));
   if(phase<1.94){start=time;window.clinicVisualStep=0;}
   if(!mode)return;
   const elapsed=(time-start)%26,step=reduced?4:elapsed<4?0:elapsed<8?1:elapsed<14?2:elapsed<19?3:4;
   if(step!==lastStep){web.dataset.step=String(step);webText.textContent=messages[step];window.clinicVisualStep=step;const values=clinic[step];['[data-appointment]','[data-chat-person]','[data-clinic-message]','[data-clinic-status]'].forEach((selector,i)=>web.querySelector(selector).textContent=values[i]);web.querySelector('[data-irene-state]').textContent=step===3?'Responde':'Enviado';web.querySelector('[data-irene-message]').textContent=step===3?'Sí, me viene bien. ¡Gracias!':'Hay un hueco hoy a las 16:00. ¿Te viene bien?';lastStep=step;}
 };
})();
