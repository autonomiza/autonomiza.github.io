/* The same invoice renderer as the home page, visible only when on screen. */
(()=>{
 'use strict';
 const frame=document.querySelector('.invoice-stage'),button=document.querySelector('#invoice-pause'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const work=frame.querySelector('#demo-work'),tokens=[...work.querySelectorAll('.invoice-token')],canvas=document.createElement('canvas');
 canvas.className='invoice-connections';canvas.setAttribute('aria-hidden','true');work.prepend(canvas);
 const ctx=canvas.getContext('2d');let routes=[],width=0,height=0;
 const curve=(r,t)=>{const s=1-t;return [s*s*s*r[0][0]+3*s*s*t*r[1][0]+3*s*t*t*r[2][0]+t*t*t*r[3][0],s*s*s*r[0][1]+3*s*s*t*r[1][1]+3*s*t*t*r[2][1]+t*t*t*r[3][1]];};
 function measure(){
  const origin=work.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,2);width=origin.width;height=origin.height;
  canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);
  const rect=el=>{const r=el.getBoundingClientRect();return{x:r.x-origin.x,y:r.y-origin.y,width:r.width,height:r.height};};
  const paper=rect(work.querySelector('.paper-document')),record=rect(work.querySelector('.data-record')),inbox=rect(work.querySelector('.inbox-line'));
  const sources=[...work.querySelectorAll('.invoice-source')].map(rect),rows=[...work.querySelectorAll('.invoice-row')].map(rect);
  routes=rows.map((row,i)=>{const compact=matchMedia('(max-width:700px)').matches,A=compact?[inbox.x+inbox.width*.84,inbox.y+inbox.height]:[paper.x+paper.width,sources[i].y+sources[i].height/2],B=compact?[record.x+record.width,row.y+row.height/2]:[record.x,row.y+row.height/2],mid=compact?Math.min(width-2,record.x+record.width+10):(A[0]+B[0])/2;return[A,[mid,A[1]],[mid,B[1]],B];});
 }
 function connections(){
  ctx.clearRect(0,0,width,height);
  const progress=window.invoiceVisual?.progress||[0,0,0,0];
  routes.forEach((r,i)=>{const u=progress[i],moving=u>0&&u<1&&!reduced.matches;
   ctx.beginPath();ctx.moveTo(...r[0]);ctx.bezierCurveTo(...r[1],...r[2],...r[3]);ctx.lineWidth=1.3;ctx.strokeStyle=moving?'rgba(46,196,182,.8)':'rgba(46,196,182,.18)';ctx.stroke();
   if(moving){const q=curve(r,u*u*(3-2*u)),half=tokens[i].offsetWidth/2;tokens[i].style.transform=`translate(${Math.max(half+2,Math.min(width-half-2,q[0]))}px,${q[1]}px) translate(-50%,-50%)`;}
   tokens[i].style.opacity=moving?String(Math.min(1,u*8,(1-u)*8)):0;
  });
 }
 let shown=false,paused=false,last=0,time=0,raf=0,done=false;
 function paint(now){
  raf=0;if(!shown||document.hidden){last=0;return;}
  if(last&&now-last<32){raf=requestAnimationFrame(paint);return;}
  const dt=last?Math.min(1,(now-last)/1000):0;last=now;
  if(!paused)time+=dt;
  window.renderDemonstration(3,time,paused,reduced.matches);
  connections();
  done=document.querySelector('[data-invoice-count]').textContent==='4'&&work.dataset.step==='3';
  if(done){button.disabled=true;button.textContent='Demostración completada';}
  if(!done&&!paused&&!reduced.matches)raf=requestAnimationFrame(paint);
 }
 function wake(){if(!raf&&shown&&!document.hidden)raf=requestAnimationFrame(paint);}
 button.addEventListener('click',()=>{paused=!paused;button.setAttribute('aria-pressed',String(paused));button.textContent=paused?'Reanudar demostración':'Pausar demostración';last=0;wake();});
 new IntersectionObserver(entries=>{shown=entries[0].isIntersecting;last=0;if(shown)wake();else{cancelAnimationFrame(raf);raf=0;}},{threshold:.15}).observe(frame);
 document.addEventListener('visibilitychange',()=>{last=0;if(document.hidden){cancelAnimationFrame(raf);raf=0;}else wake();});
 reduced.addEventListener('change',()=>{last=0;wake();});
 new ResizeObserver(()=>{measure();connections();}).observe(frame);
 document.fonts.ready.then(()=>{measure();connections();});
})();
