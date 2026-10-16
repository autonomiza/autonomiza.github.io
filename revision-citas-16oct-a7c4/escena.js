/* One persistent scene. Scroll changes geometry; ambient time never controls reading. */
(()=>{
 'use strict';
 const stage=document.querySelector('.stage-wrap'),scene=document.querySelector('.scene'),canvas=document.querySelector('#scene-canvas'),ctx=canvas.getContext('2d');
 if(!ctx)return;
 const chapters=[...document.querySelectorAll('.chapter')],nodeLayer=document.querySelector('.scene-nodes'),icons=[...document.querySelectorAll('.business')];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width:700px)');
 const desktopFloat=matchMedia('(min-width:951px) and (min-height:541px) and (pointer:fine)');
 const shortLandscape=matchMedia('(orientation:landscape) and (max-height:540px)');
 const pause=document.querySelector('#pause'),caption=document.querySelector('#scene-caption'),founder=document.querySelector('.founder-photo'),signature=document.querySelector('.scene-signature'),meter=document.querySelector('.journey-meter i');
 const names=[['Automatización','Diseño web','Asistentes de chat','Aplicaciones a medida','Inteligencia artificial','Agenda inteligente','Integraciones','Gestión de información'],['Un correo','Falta un dato','Copiar y pegar','¿Quién lo revisa?','Enviar otra vez','¿Qué quedó pendiente?'],['Solicitud web','Datos reunidos','Borrador de IA','Tu revisión','Propuesta enviada','Seguimiento'],['1 · Entender','2 · Acordar','3 · Probar','4 · Acompañar']];
 const captions=['Todo empieza en tu negocio.','Demasiados hilos sueltos.','De una cancelación a una cita confirmada.','Del documento a los datos. Con revisión humana.','Entender, acordar, probar y acompañar.','La tecnología conecta. El trato es personal.'];
 const descriptions=['Esfera de capacidades digitales con oficina, comercio, fábrica y taller en el centro.','Los mismos hilos se abren y cruzan entre tareas dispersas.','Ejemplo ficticio: un recordatorio recibe una cancelación; salen tres avisos por WhatsApp a la lista de espera y una respuesta confirma el hueco según las reglas del negocio.','Ejemplo ficticio: un correo trae una factura, sus datos se preparan y se señala un proyecto pendiente de confirmar.','Las conexiones recorren cuatro pasos: entender tu trabajo, acordar el alcance, probar la solución y acompañarte.','El recorrido termina en el retrato original de Iván, junto a su presentación.'];
 let businessSize=64,widths=[],labelHeights=[],clinicRoutes=[],clinicMainRoutes=[],invoiceRoutes=[],invoiceOrigin={x:0,y:0};
 const invoiceTokens=[...document.querySelectorAll('.invoice-token')];
 const nodes=Array.from({length:Math.max(...names.map(group=>group.length))},(_,i)=>{const n=document.createElement(i===5?'a':'span');if(i===5){n.href='automatizacion-citas/';n.setAttribute('aria-label','Agenda inteligente: ver automatización de citas');}else{n.setAttribute('aria-hidden','true');}n.className='node';n.textContent=names[0][i];nodeLayer.append(n);return n;});
 let w=0,h=0,anchors=[],readingEnds=[],p=0,ambient=0,paused=false,visible=true,raf=0,last=0,dirty=true,labelState=-1,phase=-1,slow=0,lite=(navigator.hardwareConcurrency||8)<=4||(navigator.deviceMemory||8)<=4;
 const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),mix=(a,b,t)=>a+(b-a)*t,smooth=t=>t*t*(3-2*t),TAU=Math.PI*2;
 const ordered=[[.23,.22],[.75,.22],[.75,.50],[.23,.50],[.23,.78],[.75,.78]];
 const methodSteps=[[.36,.18],[.64,.40],[.36,.62],[.64,.84]];
 const tangled=[[.24,.18],[.76,.27],[.55,.47],[.22,.58],[.77,.70],[.33,.86]];
 function point(state,i,t){
   const a=t*TAU,r=Math.min(w*.35,h*.40),cx=w*.5,cy=h*.5;
   if(state===0){const k=i%3,angle=i*Math.PI/6+ambient*.035;const x=r*Math.cos(a),y=r*(k===0?.25:k===1?.62:1)*Math.sin(a);return [cx+x*Math.cos(angle)-y*Math.sin(angle),cy+x*Math.sin(angle)+y*Math.cos(angle)];}
   if(state===2&&clinicRoutes.length){const routes=(window.clinicVisualStep===2||window.clinicVisualStep===3)?clinicRoutes:clinicMainRoutes;const [A,C,D,B]=routes[i],u=1-t;return[u*u*u*A[0]+3*u*u*t*C[0]+3*u*t*t*D[0]+t*t*t*B[0],u*u*u*A[1]+3*u*u*t*C[1]+3*u*t*t*D[1]+t*t*t*B[1]];}
   if(state===1||state===2){const list=state===1?tangled:ordered,A=list[i],B=list[(i+1)%6];let x=mix(A[0],B[0],t),y=mix(A[1],B[1],t);
     if(state===2&&i===5){const u=1-t;return[(u*u*u*A[0]+3*u*u*t*1.17+3*u*t*t*.99+t*t*t*B[0])*w,(u*u*u*A[1]+3*u*u*t*.88-3*u*t*t*.12+t*t*t*B[1])*h];}
     if(state===1){x+=Math.sin(t*Math.PI)*(i%2?-.35:.35);y+=Math.sin(t*TAU)*.17;}else{const dx=B[0]-A[0],dy=B[1]-A[1];x+=Math.sin(t*Math.PI)*(-dy)*.17;y+=Math.sin(t*Math.PI)*dx*.17;}
     return [x*w,y*h];}
   if(state===3&&invoiceRoutes.length){const [A,C,D,B]=invoiceRoutes[i],u=1-t;return[u*u*u*A[0]+3*u*u*t*C[0]+3*u*t*t*D[0]+t*t*t*B[0],u*u*u*A[1]+3*u*u*t*C[1]+3*u*t*t*D[1]+t*t*t*B[1]];}
   if(state===3){const rail=[[.12,.10],[.5,.10],[.88,.10],[.88,.88],[.5,.88],[.12,.88]],A=rail[i],B=rail[(i+1)%6];return[mix(A[0],B[0],t)*w,mix(A[1],B[1],t)*h];}
   if(state===4){const n=Math.floor(i/2),q=((i%2)+t)/2,A=methodSteps[n],B=methodSteps[n+1];return[(mix(A[0],B[0],q)+Math.sin(q*Math.PI)*(n%2?-.12:.12))*w,mix(A[1],B[1],q)*h];}
   // The same six sections settle around the original portrait.
   const ph=Math.min(h*.62,335),pw=ph*315/335;
   const box=[.5-(pw/2+10)/w,.16-10/h,.5+(pw/2+10)/w,.16+(ph+10)/h];
   const corners=[[box[0],box[1]],[(box[0]+box[2])/2,box[1]],[box[2],box[1]],[box[2],box[3]],[(box[0]+box[2])/2,box[3]],[box[0],box[3]]];
   const A=corners[i],B=corners[(i+1)%6];return[mix(A[0],B[0],t)*w,mix(A[1],B[1],t)*h];
 }
 // Six loose threads gather into one flowing ribbon, then open onto the agenda.
 // Both halves reuse the same sampled paths and canvas budget as the sphere.
 function gatheringPoint(i,t){
   const A=[w*(.12+i*.095),h*.16],C=[w*.88,h*.37],D=[w*.12,h*.59],B=[w*(.58+i*.047),h*.84],u=1-t;
   return[u*u*u*A[0]+3*u*u*t*C[0]+3*u*t*t*D[0]+t*t*t*B[0],u*u*u*A[1]+3*u*u*t*C[1]+3*u*t*t*D[1]+t*t*t*B[1]];
 }
 function flowingPoint(i,q){
   if(p<=1||p>=1.94)return null;
   const gather=gatheringPoint(i,q),first=p<1.43;
   const A=first?point(1,i,q):gather,B=first?gather:point(2,i,q);
   const u=smooth(clamp(first?(p-1)/.43:(p-1.43)/.51));
   return[mix(A[0],B[0],u),mix(A[1],B[1],u)];
 }
 function nodePoint(state,i){
   if(state>=4){const n=methodSteps[i%4];return[n[0]*w,n[1]*h];}
   if(state===0){
     // Names orbit as upright labels; the same points anchor their connecting threads.
     const time=reduced.matches?0:ambient,angle=-Math.PI/2+i*TAU/names[0].length+time*TAU/110;
     const halfWidth=(widths[i]||100)/2,halfHeight=(labelHeights[i]||28)/2;
     const rx=mobile.matches?w*.49:Math.min(w*.42,w/2-12),ry=h*.43;
     return[clamp(w*.5+Math.cos(angle)*rx,halfWidth+6,w-halfWidth-6),clamp(h*.5+Math.sin(angle)*ry,halfHeight+8,h-halfHeight-8)];
   }
   const list=state===1?tangled:ordered,n=list[i%6];return[n[0]*w,n[1]*h];
 }
 function businessPoint(i){const theta=-Math.PI*.75+i*Math.PI/2+ambient*.065,r=Math.min(w,h)*.14;return[w*.5+Math.cos(theta)*r,h*.5+Math.sin(theta)*r];}
 // A handful of existing grid points breathe slowly; no additional animation loop.
 let sphereBounds={x:0,y:0,r:0};
 const twinkleLayer=document.createElement('div');twinkleLayer.className='ambient-twinkles';twinkleLayer.setAttribute('aria-hidden','true');document.body.append(twinkleLayer);
 function excludeSphere(){
   const box=scene.getBoundingClientRect();sphereBounds={x:box.left+w/2,y:box.top+h/2,r:Math.min(w*.35,h*.40)+12};
   scene.style.setProperty('--sphere-radius',sphereBounds.r+'px');
   scene.style.setProperty('--sphere-clear',String(1-smooth(clamp(p/.5))));
   for(const dot of twinkleLayer.children){const inside=p<.5&&Math.hypot(parseFloat(dot.style.left)-sphereBounds.x,parseFloat(dot.style.top)-sphereBounds.y)<sphereBounds.r+12;dot.style.visibility=inside?'hidden':'visible';}
 }
 function placeTwinkles(){
   const vw=document.documentElement.clientWidth,vh=innerHeight,header=document.querySelector('header').offsetHeight;
   const columns=Math.max(1,Math.floor(vw/32)),rows=Math.max(1,Math.floor((vh-header-24)/32)),count=mobile.matches?6:12,positions=new Map();
   twinkleLayer.replaceChildren();
   function move(dot){
     let selected=null;
     for(let attempt=0;attempt<60;attempt++){
       const col=Math.floor(Math.random()*columns),row=Math.floor(Math.random()*rows);
       const x=mobile.matches?vw-2-col*32:12+col*32,y=12+32*(Math.ceil(header/32)+row);
       if(x<vw*.22||y>vh-16)continue;
       if(p<.5&&Math.hypot(x-sphereBounds.x,y-sphereBounds.y)<sphereBounds.r+12)continue;
       if([...positions].some(([other,q])=>other!==dot&&Math.hypot(q.x-x,q.y-y)<(mobile.matches?112:180)))continue;
       selected={x,y};break;
     }
     if(!selected)return;
     positions.set(dot,selected);dot.style.left=selected.x+'px';dot.style.top=selected.y+'px';
     dot.style.setProperty('--glow',(.85+.15*selected.x/vw).toFixed(3));
   }
   for(let i=0;i<count;i++){
     const dot=document.createElement('i'),period=7+Math.random()*2;
     dot.style.setProperty('--breathe',period.toFixed(2)+'s');
     // Stagger first appearances, then choose a fresh distant grid point while dark.
     dot.style.animationDelay=(-period*((.5+i/count)%1)).toFixed(2)+'s';
     move(dot);if(!positions.has(dot))continue;dot.addEventListener('animationiteration',()=>{move(dot);excludeSphere();});twinkleLayer.append(dot);
   }
 }
 function syncTwinkles(){twinkleLayer.dataset.paused=String(paused||document.hidden||reduced.matches);}
 function measure(){
   w=scene.clientWidth;h=scene.clientHeight;labelState=-1;excludeSphere();placeTwinkles();
   // Follow the sphere's radius on desktop; measure only when layout changes.
   scene.style.setProperty('--business-size',`${clamp(Math.min(w*.35,h*.40)*.30,76,104).toFixed(1)}px`);
   businessSize=icons[0].clientWidth;
   const pixelBudget=lite?650000:1100000,dpr=Math.min(devicePixelRatio||1,lite?1:1.5,Math.sqrt(pixelBudget/(w*h)));
   canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
   const headerHeight=document.querySelector('header').offsetHeight;
   readingEnds=[];
   anchors=chapters.map(el=>{const top=el.getBoundingClientRect().top+scrollY;
     if(mobile.matches&&!shortLandscape.matches){
       // Finish each transition as its text reaches the reading area; hold while reading.
       const text=el.firstElementChild,rect=text.getBoundingClientRect();
       const start=rect.top+scrollY-headerHeight-stage.offsetHeight-20;
       readingEnds.push(Math.max(start,rect.bottom+scrollY-innerHeight+32));
       return start;
     }
     return top+el.offsetHeight/2-(innerHeight+headerHeight)/2;
   });
   const relative=el=>{let x=0,y=0;for(let n=el;n&&n!==scene;n=n.offsetParent){x+=n.offsetLeft;y+=n.offsetTop;}return{x,y,width:el.offsetWidth,height:el.offsetHeight};};
   const target=relative(document.querySelector('.cal-target')),cal=relative(document.querySelector('.clinic-calendar')),cards=[...document.querySelectorAll('.wait-card')].map(relative);
   clinicRoutes=Array.from({length:6},(_,i)=>{const card=cards[i%3],left=i<3,A=left?[cal.x,target.y+target.height/2]:[card.x+card.width,card.y+card.height/2],B=left?[card.x,card.y+card.height/2]:[cal.x+cal.width,target.y+target.height/2],outer=left?Math.max(6,cal.x-24-i*6):Math.min(w-5,cal.x+cal.width+12+(i-3)*5);return[A,[outer,A[1]],[outer,B[1]],B];});
   const main=relative(document.querySelector('.clinic-chat'));
   clinicMainRoutes=Array.from({length:6},(_,i)=>{const left=i<3,A=left?[cal.x,target.y+target.height/2]:[main.x+main.width,main.y+main.height/2],B=left?[main.x,main.y+main.height/2]:[cal.x+cal.width,target.y+target.height/2],outer=left?Math.max(6,cal.x-24-i*6):Math.min(w-5,cal.x+cal.width+12+(i-3)*5);return[A,[outer,A[1]],[outer,B[1]],B];});
   if(shortLandscape.matches||matchMedia('(min-width:701px) and (max-height:760px)').matches){
     const between=(card,i)=>{const A=[cal.x+cal.width,target.y+target.height/2],B=[card.x,card.y+card.height/2],x=(A[0]+B[0])/2+(i%3-1)*3;return i<3?[A,[x,A[1]],[x,B[1]],B]:[B,[x,B[1]],[x,A[1]],A];};
     clinicRoutes=Array.from({length:6},(_,i)=>between(cards[i%3],i));
     clinicMainRoutes=Array.from({length:6},(_,i)=>between(main,i));
   }
   const inbox=relative(document.querySelector('#demo-work .inbox-line')),paper=relative(document.querySelector('#demo-work .paper-document')),record=relative(document.querySelector('#demo-work .data-record'));
   invoiceOrigin=relative(document.querySelector('#demo-work'));
   const sources=[...document.querySelectorAll('.invoice-source')].map(relative),rows=[...document.querySelectorAll('.invoice-row')].map(relative),review=relative(document.querySelector('#demo-work .review-field')),stacked=mobile.matches&&!shortLandscape.matches;
   invoiceRoutes=Array.from({length:6},(_,i)=>{
     if(i===0){const A=[inbox.x+inbox.width*.7,inbox.y+inbox.height],B=[paper.x+paper.width*.5,paper.y];return[A,[A[0],A[1]+15],[B[0],B[1]-15],B];}
     if(i===5){const A=[record.x+record.width,review.y+review.height/2],B=[record.x+record.width*.5,review.y+review.height+12],x=Math.min(w-5,A[0]+16);return[A,[x,A[1]],[x,B[1]],B];}
     const source=sources[i-1],row=rows[i-1];
     if(stacked){const A=[inbox.x+inbox.width*.85,inbox.y+inbox.height],B=[record.x+record.width,row.y+row.height/2],x=record.x+record.width+14+i*2;return[A,[x,A[1]+15],[x,B[1]],B];}
     const A=[paper.x+paper.width,source.y+source.height/2],B=[record.x,row.y+row.height/2],mid=(A[0]+B[0])/2;return[A,[mid,A[1]],[mid,B[1]],B];
   });
   measureScroll();
 }
 function measureScroll(){
   const y=scrollY;let index=0;while(index<anchors.length-2&&y>anchors[index+1])index++;
   const start=readingEnds.length?Math.min(readingEnds[index],anchors[index+1]-1):anchors[index];
   p=readingEnds.length?index+clamp((y-start)/(anchors[index+1]-start),0,1):clamp(index+(y-start)/(anchors[index+1]-start),0,5);
   if(reduced.matches)p=Math.round(p);
   excludeSphere();
   dirty=true;wake();
 }
 function draw(){
   const gp=p<1?p:p<1.94?1+(p-1)/.94:p<2.35?2:p<2.9?2+(p-2.35)/.55:p<3.35?3:p<4?3+(p-3.35)/.65:p;
   const a=Math.floor(gp),b=Math.min(5,a+1),t=smooth(gp-a),closest=Math.round(p);
   const labelPhase=p<.5?0:p<1.5?1:p<3.5?2:3;
   if(labelPhase!==labelState){nodes.forEach((n,i)=>{n.textContent=names[labelPhase][i]||'';n.classList.toggle('review',labelPhase===2&&i===3);n.classList.toggle('method-step',labelPhase===3);});labelState=labelPhase;widths=nodes.map(n=>n.offsetWidth);labelHeights=nodes.map(n=>n.offsetHeight);}
   ctx.clearRect(0,0,w,h);
   const demoOpacity=Math.max(clamp((p-1.5)*2)*clamp((3.5-p)*2),0);ctx.globalAlpha=p>=1&&p<=2.35?.95:p>=2.75&&p<=3.25?.85:1-demoOpacity*.8;
   window.renderDemonstration(p,ambient,paused,reduced.matches);
   const invoice=window.invoiceVisual,invoiceShown=p>=2.9&&p<=3.35;
   invoiceTokens.forEach((el,i)=>{const u=invoice?.progress[i]||0,show=invoiceShown&&u>0&&u<1&&!reduced.matches;
     if(show){const q=point(3,i+1,smooth(u));el.style.transform=`translate(${(q[0]-invoiceOrigin.x).toFixed(1)}px,${(q[1]-invoiceOrigin.y).toFixed(1)}px) translate(-50%,-50%)`;}
     el.style.opacity=show?String(Math.min(1,u*8,(1-u)*8)):0;
   });
   const steps=lite?40:64,lines=[];
   for(let i=0;i<6;i++){
     const points=[];ctx.beginPath();
     for(let j=0;j<=steps;j++){const A=point(a,i,j/steps),B=point(b,i,j/steps),F=flowingPoint(i,j/steps),x=F?F[0]:mix(A[0],B[0],t),y=F?F[1]:mix(A[1],B[1],t);points.push([x,y]);j?ctx.lineTo(x,y):ctx.moveTo(x,y);}
     if(p>4){const gap=Math.round(steps*.045*smooth(clamp(p-4)));ctx.beginPath();for(let j=gap;j<=steps-gap;j++){const q=points[j];j===gap?ctx.moveTo(...q):ctx.lineTo(...q);}}
     const invoiceActive=invoiceShown&&invoice&&(i===0?invoice.step===0:i===5?invoice.step===3:invoice.progress[i-1]>0&&invoice.progress[i-1]<1);
     ctx.strokeStyle=invoiceShown?(i===5?'rgba(229,201,142,'+(invoiceActive?.65:.12)+')':'rgba(46,196,182,'+(invoiceActive?.8:.18)+')'):`rgba(46,196,182,${p<1?.26+i*.045:p>3?.38:.55})`;ctx.lineWidth=p<1?1:1.3;ctx.stroke();lines.push(points);
   }
   // Service threads dock onto the existing curves, sharing their scroll geometry.
   // No extra canvas, animation loop, blur or per-frame DOM measurements.
   const serviceAlpha=1-smooth(clamp(p/.5));
   const responsiveSignal=!reduced.matches,compactSignal=mobile.matches||shortLandscape.matches;
   const signalCycle=ambient/3.8,signalUnit=signalCycle%1,signalService=Math.floor(signalCycle)%names[0].length,signalBusiness=signalService%icons.length;
   const sourceEnergy=responsiveSignal?serviceAlpha*smooth(clamp(signalUnit/.08))*(1-smooth(clamp((signalUnit-.35)/.35))):0;
   const received=clamp((signalUnit-.68)/.27),businessEnergy=responsiveSignal?serviceAlpha*Math.sin(received*Math.PI):0;
   if(serviceAlpha>0){
     const cycle=responsiveSignal?signalCycle:ambient/1.6,active=Math.floor(cycle)%names[0].length,travel=clamp((cycle%1)/.78);
     for(let i=0;i<names[0].length;i++){
       const A=nodePoint(a,i),B=nodePoint(b,i),halfWidth=(widths[i]||100)/2,halfHeight=(labelHeights[i]||28)/2;
       const margin=Math.min(w/2,halfWidth+5),x=clamp(mix(A[0],B[0],t),margin,w-margin),y=mix(A[1],B[1],t);
       const dx=w*.5-x,dy=h*.5-y,len=Math.max(1,Math.hypot(dx,dy)),ux=dx/len,uy=dy/len;
       const edge=Math.min(halfWidth/Math.max(.001,Math.abs(ux)),halfHeight/Math.max(.001,Math.abs(uy)));
       const start=[x+ux*edge,y+uy*edge],orbit=mobile.matches?3:(i%4===2?3:0),angle=orbit*Math.PI/6+ambient*.035;
       const flatten=orbit%3===0?.25:orbit%3===1?.62:1;
       const localX=-ux*Math.cos(angle)-uy*Math.sin(angle),localY=ux*Math.sin(angle)-uy*Math.cos(angle);
       const dock=(Math.atan2(localY/flatten,localX)/TAU+1)%1;
       const from=point(a,orbit,dock),to=point(b,orbit,dock),end=[mix(from[0],to[0],t),mix(from[1],to[1],t)];
       const bend=(i%2?1:-1)*Math.min(14,len*.045),control=[(start[0]+end[0])/2-uy*bend,(start[1]+end[1])/2+ux*bend];
       ctx.beginPath();ctx.moveTo(...start);ctx.quadraticCurveTo(...control,...end);
       ctx.strokeStyle=`rgba(46,196,182,${serviceAlpha*.46})`;ctx.lineWidth=1;ctx.stroke();
       const quadratic=(A,C,B,u)=>{const v=1-u;return[v*v*A[0]+2*v*u*C[0]+u*u*B[0],v*v*A[1]+2*v*u*C[1]+u*u*B[1]];};
       const onCurve=u=>quadratic(start,control,end,u);
       if(i===active&&responsiveSignal){
         // A single signal continues from its orbit dock to the moving business.
         const business=businessPoint(signalBusiness),vx=end[0]-business[0],vy=end[1]-business[1],distance=Math.max(1,Math.hypot(vx,vy));
         const target=[business[0]+vx/distance*businessSize*.40,business[1]+vy/distance*businessSize*.40];
         const innerControl=[end[0]+(end[0]-control[0])*.30,end[1]+(end[1]-control[1])*.30];
         const lengthA=Math.hypot(end[0]-start[0],end[1]-start[1]),lengthB=Math.hypot(target[0]-end[0],target[1]-end[1]),split=clamp(lengthA/Math.max(1,lengthA+lengthB),.2,.8);
         const path=u=>u<=split?onCurve(u/split):quadratic(end,innerControl,target,(u-split)/(1-split));
         const routeEnergy=serviceAlpha*smooth(clamp(signalUnit/.10))*(1-smooth(clamp((signalUnit-.78)/.17)));
         ctx.beginPath();ctx.moveTo(...end);ctx.quadraticCurveTo(...innerControl,...target);ctx.lineWidth=1;ctx.strokeStyle=`rgba(46,196,182,${routeEnergy*.38})`;ctx.stroke();
         const progress=clamp((signalUnit-.12)/.56);
         if(signalUnit>.12&&signalUnit<.68){
           for(let k=5;k>=0;k--){const head=path(Math.max(0,progress-k*.016)),tail=path(Math.max(0,progress-(k+1)*.016));ctx.beginPath();ctx.moveTo(...tail);ctx.lineTo(...head);ctx.lineWidth=compactSignal?1.6:2.2;ctx.strokeStyle=`rgba(211,255,246,${serviceAlpha*(1-k/6)})`;ctx.stroke();}
           const head=path(progress);ctx.beginPath();ctx.arc(head[0],head[1],compactSignal?1.4:2,0,TAU);ctx.fillStyle=`rgba(235,255,252,${serviceAlpha})`;ctx.fill();
         }
         if(businessEnergy>0){
           ctx.beginPath();ctx.arc(business[0],business[1],businessSize*(.55+received*(compactSignal?.10:.16)),0,TAU);
           ctx.fillStyle=`rgba(46,196,182,${businessEnergy*(compactSignal?.055:.085)})`;ctx.fill();ctx.lineWidth=1;ctx.strokeStyle=`rgba(166,242,231,${businessEnergy*(compactSignal?.38:.55)})`;ctx.stroke();
         }
       }else if(i===active&&travel>0&&travel<1&&!reduced.matches){
         const envelope=Math.sin(travel*Math.PI);
         for(let k=0;k<4;k++){const head=onCurve(Math.max(0,travel-k*.045)),tail=onCurve(Math.max(0,travel-(k+1)*.045));ctx.beginPath();ctx.moveTo(...tail);ctx.lineTo(...head);ctx.strokeStyle=`rgba(166,242,231,${serviceAlpha*envelope*(1-k/4)})`;ctx.lineWidth=1.8;ctx.stroke();}
       }
     }
   }
   // Fractional positions preserve sub-pixel travel between sampled vertices.
   function along(trail,u){const f=clamp(u)*steps,n=Math.min(steps-1,Math.floor(f)),q=f-n;return[mix(trail[n][0],trail[n+1][0],q),mix(trail[n][1],trail[n+1][1],q)];}
   // Short light trails in a single canvas: no SVG filters or blur compositing.
   for(let i=0;i<6;i++){
     if(invoiceShown&&invoice&&(i>0||invoice.step!==0))continue;
     if(p>=1.94&&p<=2.35){const st=window.clinicVisualStep;if((st===2&&i>=3)||(st===3&&i!==5)||((st===0||st===4)&&i!==0)||(st===1&&i!==3))continue;}
     const trail=lines[i],gathering=Math.sin(clamp((p-1)/.94)*Math.PI),head=(ambient*.10+i*mix(.16,.035,gathering))%1;
     for(let k=7;k>=0;k--){const u=(head-k*.0125+1)%1,v=(head-(k+1)*.0125+1)%1;if(v>u)continue;const A=along(trail,v),B=along(trail,u);ctx.strokeStyle=`rgba(166,242,231,${(1-k/8)*.9})`;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(B[0],B[1]);ctx.stroke();}
   }
   // Once unfolded, labels/photos only need updating when scroll or inputs change.
   if(!dirty&&p>=1)return;
   nodes.forEach((n,i)=>{
     const sa=a,sb=b,A=nodePoint(sa,i),B=nodePoint(sb,i),x=mix(A[0],B[0],t),y=mix(A[1],B[1],t);
     const opacity=(p>1.5&&p<3.5)?0:labelPhase===3?(i<4?smooth(clamp((p-3.5)*2))*(1-smooth(clamp((p-4.25)*2))):0):(i<6?1-smooth(clamp(p-2)):1-smooth(clamp(p*2)));
     const shown=opacity*(p>1&&p<1.5?1-smooth(clamp((p-1)/.32)):1);n.style.opacity=shown.toFixed(3);n.style.visibility=shown<.01?'hidden':'visible';if(i===5){const active=labelPhase===0&&shown>.95;n.tabIndex=active?0:-1;n.setAttribute('aria-hidden',String(!active));n.style.pointerEvents=active?'auto':'none';if(active)n.setAttribute('href','automatizacion-citas/');else n.removeAttribute('href');}
     const energy=i===signalService?sourceEnergy:0;
     n.style.borderColor=energy>0?`rgba(46,196,182,${.29+energy*.65})`:'';
     n.style.backgroundColor=energy>0?`rgba(${Math.round(28+energy*5)},${Math.round(41+energy*28)},${Math.round(43+energy*24)},.90)`:'';
     const half=Math.min(w/2,(widths[i]||100)/2+5);
     n.style.transform=`translate(${clamp(x,half,w-half).toFixed(1)}px,${y.toFixed(1)}px) translate(-50%,-50%)`;
   });
   icons.forEach((icon,i)=>{
     const position=businessPoint(i),energy=i===signalBusiness?businessEnergy:0;
     icon.style.opacity=(1-smooth(clamp(p*1.5))).toFixed(3);
     icon.style.transform=`translate(${position[0].toFixed(1)}px,${position[1].toFixed(1)}px) translate(-50%,-50%) scale(${(1+energy*(compactSignal?.035:.065)).toFixed(3)})`;
     icon.style.color=energy>0?`rgb(${Math.round(166+energy*76)},${Math.round(242+energy*13)},${Math.round(231+energy*21)})`:'';
     icon.style.strokeWidth=energy>0?(3+energy*.65).toFixed(2):'';
   });
   founder.style.opacity=smooth(clamp((p-4.25)*1.6)).toFixed(3);
   stage.style.setProperty('--portrait-reveal',smooth(clamp((p-4.25)*1.6)).toFixed(3));
   signature.style.opacity=smooth(clamp((p-4.5)*2)).toFixed(3);
   if(phase!==closest){caption.textContent=captions[closest];scene.setAttribute('aria-label',descriptions[closest]);stage.dataset.phase=closest;phase=closest;}
   stage.style.setProperty('--threads-gather', (smooth(clamp((p-1.1)/.16))*(1-smooth(clamp((p-1.52)/.18)))).toFixed(3));
   meter.style.width=(p/5*100).toFixed(2)+'%';
 }
 function tick(now){raf=0;if(document.hidden||!visible){last=0;return;}const dt=last?now-last:0;if(last&&dt<32){raf=requestAnimationFrame(tick);return;}last=now;
   const animated=!paused&&!reduced.matches&&!interactionHolds.size;
   if(animated){ambient+=Math.min(dt,70)/1000;if(dt>52)slow++;else slow=Math.max(0,slow-1);if(slow>35&&!lite){lite=true;measure();}}
   if(dirty||animated){draw();dirty=false;}
   if(animated&&!raf)raf=requestAnimationFrame(tick);
 }
 function wake(){if(!raf&&visible&&!document.hidden)raf=requestAnimationFrame(tick);}
 const interactionHolds=new Set();
 function holdNames(reason,hold){if(hold)interactionHolds.add(reason);else interactionHolds.delete(reason);dirty=true;last=0;wake();}
 const serviceLink=nodes[5];
 serviceLink.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')holdNames('hover',true);});
 serviceLink.addEventListener('pointerleave',()=>holdNames('hover',false));
 serviceLink.addEventListener('focus',()=>holdNames('focus',true));
 serviceLink.addEventListener('blur',()=>holdNames('focus',false));
 serviceLink.addEventListener('pointerdown',()=>holdNames('press',true));
 addEventListener('pointerup',()=>holdNames('press',false));
 addEventListener('pointercancel',()=>holdNames('press',false));
 pause.addEventListener('click',()=>{paused=!paused;syncTwinkles();stage.dataset.paused=String(paused);pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?'Reanudar movimiento':'Pausar movimiento';dirty=true;last=0;wake();});
 function motionPreference(){syncTwinkles();pause.hidden=reduced.matches;dirty=true;measureScroll();}
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible){cancelAnimationFrame(raf);raf=0;last=0;}else{dirty=true;wake();}},{threshold:0}).observe(stage);
 document.addEventListener('visibilitychange',()=>{syncTwinkles();if(document.hidden){cancelAnimationFrame(raf);raf=0;last=0;}else{dirty=true;wake();}});
 addEventListener('scroll',measureScroll,{passive:true});addEventListener('resize',measure,{passive:true});reduced.addEventListener('change',motionPreference);
 document.fonts.ready.then(measure);measure();motionPreference();
})();
