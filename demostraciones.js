/* Illustrative sequences only. No forms, network calls or invented customer outcomes. */
(()=>{
 const web=document.querySelector('#demo-web'),work=document.querySelector('#demo-work');
 const webText=web.querySelector('[data-web-outcome]'),workText=work.querySelector('[data-work-outcome]');
 const invoiceRows=[...work.querySelectorAll('.invoice-row')],invoiceSources=[...work.querySelectorAll('.invoice-source')],invoiceStages=[...work.querySelectorAll('.invoice-journey>span')],invoiceCount=work.querySelector('[data-invoice-count]');
 const messages=[['Se recuerda la cita por WhatsApp.','Un «no puedo ir» libera el hueco.','Menos de 6 horas: tres avisos a la vez.','Irene responde: «Sí, me viene bien».','La confirmación vuelve a la agenda.'],['El documento llega a tu correo.','Se recoge la información que contiene.','Los datos quedan preparados en un mismo lugar.','Un posible duplicado requiere revisión.']];
 const clinic=[
 ['Rubén · Por confirmar','Rubén','Hola, Rubén. Tu cita es hoy a las 16:00. ¿Puedes venir?','Recordatorio enviado'],
 ['Hueco libre','Rubén','No voy a poder ir. Lo siento.','Cancelación recibida · Se libera el hueco'],
 ['Avisando a la lista','Lista de espera','Hueco urgente. Tres avisos enviados.','Menos de 6 horas: aviso a tres a la vez'],
 ['Confirmando','Irene','Sí, me viene bien. ¡Gracias por avisarme!','Se comprueba que el hueco sigue disponible'],
 ['Irene S. · Confirmada','Irene','Tu cita queda confirmada hoy a las 16:00. ¡Hasta pronto!','Agenda actualizada · Equipo informado']
 ];
 const compactInvoice=matchMedia('(max-width:700px), (orientation:landscape) and (max-height:540px)');
 let active=-1,start=0,lastStep=-1,lastInvoiceKey='',mobileInvoiceElapsed=0,lastTime=null;
 const clamp=v=>Math.max(0,Math.min(1,v));
 window.renderDemonstration=(phase,time,paused,reduced)=>{
   const delta=lastTime===null?0:Math.min(.07,Math.max(0,time-lastTime));lastTime=time;
   const mode=phase>=1.5&&phase<2.5?0:phase>=2.5&&phase<3.5?1:-1;
   if(mode!==active){active=mode;start=time;lastStep=-1;}
   [web,work].forEach((el,i)=>{const centre=i+2,opacity=clamp((phase-(centre-.5))/(i===0?.32:.12))*clamp(((centre+.5)-phase)/.12);el.style.opacity=opacity.toFixed(3);el.style.visibility=opacity>.01?'visible':'hidden';el.style.transform=`translateY(${((1-opacity)*16).toFixed(1)}px)`;});
   // Let the physical connection arrive before starting the message sequence.
   const calendarReveal=clamp((phase-1.50)/.38),chatReveal=clamp((phase-1.78)/.16);
   web.style.setProperty('--calendar-reveal',calendarReveal.toFixed(3));
   web.style.setProperty('--chat-reveal',chatReveal.toFixed(3));
   if(phase<1.94){start=time;window.clinicVisualStep=0;}
   if(mode<0)return;
   if(mode===1&&phase<2.9)start=time;
   // On compact screens, keep the invoice's progress across scrolling and stop
   // at the completed record. The appointment and desktop loops stay unchanged.
   const compact=mode===1&&compactInvoice.matches;
   if(compact){
     if(reduced)mobileInvoiceElapsed=5;
     else if(phase>=2.9&&!paused)mobileInvoiceElapsed=Math.min(5,mobileInvoiceElapsed+delta);
   }
   const elapsed=compact?mobileInvoiceElapsed:(time-start)%26;
   const step=mode===0?(reduced?4:elapsed<4?0:elapsed<8?1:elapsed<14?2:elapsed<19?3:4):(reduced?3:compact?(elapsed<1.1?0:elapsed<2.2?1:elapsed<5?2:3):(elapsed<3?0:elapsed<6?1:elapsed<14?2:3));
   if(mode===1){
     const progress=invoiceRows.map((row,i)=>reduced?1:compact?clamp((elapsed-2.2-i*.7)/.6):clamp((elapsed-6.6-i*1.8)/1.4));
     const count=progress.filter(x=>x>=1).length;
     window.invoiceVisual={elapsed,step,progress};
     work.style.setProperty('--invoice-progress',reduced?'1':clamp(elapsed/(compact?5:19)).toFixed(3));
     work.style.setProperty('--scan',clamp(compact?(elapsed-1.1)/1.1:(elapsed-3)/3).toFixed(3));
     const key=step+':'+count+':'+progress.findIndex(x=>x>0&&x<1);
     if(key!==lastInvoiceKey){
     invoiceRows.forEach((row,i)=>row.classList.toggle('is-filled',progress[i]>=1));
     invoiceSources.forEach((el,i)=>el.dataset.active=String(progress[i]>0&&progress[i]<1));
     invoiceStages.forEach((el,i)=>{el.classList.toggle('is-current',i===step);el.classList.toggle('is-complete',i<step);});
     invoiceCount.textContent=String(count);
     workText.textContent=step===0?'Una factura llega con el correo.':step===1?'Se leen los datos del documento.':step===2?`${count} de 4 datos en su sitio.`:'4 datos preparados. Revisa el duplicado.';
     lastInvoiceKey=key;
     }
   }
   if(step!==lastStep){const el=mode?work:web;el.dataset.step=String(step);if(mode===0){webText.textContent=messages[0][step];window.clinicVisualStep=step;const values=clinic[step];['#demo-web [data-appointment]','#demo-web [data-chat-person]','#demo-web [data-clinic-message]','#demo-web [data-clinic-status]'].forEach((selector,i)=>document.querySelector(selector).textContent=values[i]);web.querySelector('[data-irene-state]').textContent=step===3?'Responde':'Enviado';web.querySelector('[data-irene-message]').textContent=step===3?'Sí, me viene bien. ¡Gracias!':'Hay un hueco hoy a las 16:00. ¿Te viene bien?';}lastStep=step;}
 };
})();
