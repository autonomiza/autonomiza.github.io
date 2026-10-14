(function () {
  var form = document.getElementById('time-form');
  var minutes = document.getElementById('task-minutes');
  var repeats = document.getElementById('task-repeats');
  var days = document.getElementById('task-days');
  var format = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  function calculate() {
    var m = Number(minutes.value), r = Number(repeats.value), d = Number(days.value);
    var valid = Number.isInteger(d) && d >= 1 && d <= 31;
    days.setAttribute('aria-invalid', String(!valid));
    document.getElementById('days-error').hidden = valid;
    if (!valid) {
      days.setAttribute('aria-describedby', 'days-error');
      document.getElementById('hours-result').textContent = '—';
      document.getElementById('days-result').textContent = 'Completa los días para ver el resultado.';
      document.getElementById('time-bar').style.width = '0%';
      document.getElementById('calculation-note').textContent = 'Introduce entre 1 y 31 días de trabajo al mes para calcular el tiempo dedicado.';
      document.getElementById('time-contact').href = '#time-form';
      return;
    }
    days.removeAttribute('aria-describedby');
    var hours = m * r * d / 60;
    document.getElementById('minutes-value').textContent = m + ' min';
    document.getElementById('repeats-value').textContent = r + (r === 1 ? ' vez' : ' veces');
    minutes.setAttribute('aria-valuetext', m + ' minutos');
    repeats.setAttribute('aria-valuetext', r + (r === 1 ? ' vez al día' : ' veces al día'));
    document.getElementById('hours-result').textContent = format.format(hours);
    document.getElementById('days-result').textContent = 'Equivale a ' + format.format(hours / 8) + ' jornadas de 8 horas.';
    document.getElementById('time-bar').style.width = Math.min(hours / 176 * 100, 100) + '%';
    document.getElementById('calculation-note').textContent = m + (m === 1 ? ' minuto × ' : ' minutos × ') + r + (r === 1 ? ' vez × ' : ' veces × ') + d + (d === 1 ? ' día' : ' días') + ' ÷ 60. Es tiempo dedicado, no una promesa de ahorro: habrá que estudiar qué parte se puede recuperar.';
    document.getElementById('time-contact').href = 'https://wa.me/34745041754?text=' + encodeURIComponent('Hola Iván, quiero contarte una tarea de mi negocio que ocupa unos ' + m + ' minutos y repito ' + r + ' veces al día, ' + d + ' días al mes. Me gustaría ver cómo mejorarla.');
  }
  form.addEventListener('input', calculate);
  form.addEventListener('submit', function (event) { event.preventDefault(); calculate(); });
  calculate();
})();

(function(){
  var story=document.querySelector('.organic-story');if(!story)return;
  var stage=story.querySelector('.organic-stage'),world=story.querySelector('.organic-world'),routes=story.querySelector('.thread-routes');
  var chapters=Array.from(story.querySelectorAll('.organic-chapter')),marks=Array.from(story.querySelectorAll('.organic-reading span'));
  var reduced=matchMedia('(prefers-reduced-motion: reduce)'),pause=story.querySelector('.organic-pause'),visible=false,frame=0,paused=false,current=-1,ambient=0,last=0,elapsed=0,curves=[],order=0;
  var icons={mail:'M3 5h26v20H3z M3 6l13 10L29 6',data:'M5 4h22v24H5z M10 10h12 M10 16h12 M10 22h7',doc:'M7 3h13l6 6v20H7z M20 3v7h6 M12 16h9 M12 22h9',person:'M16 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M5 29v-3a11 8 0 0 1 22 0v3',send:'M3 15L29 3 20 29l-6-11-11-3z M14 18L29 3',time:'M16 29a13 13 0 1 0 0-26 13 13 0 0 0 0 26z M16 8v9l7 4'};
  var data=[
    ['mail','Una solicitud','Por responder','Recibida',[250,100,-13],[110,160,0]],
    ['data','Los datos','Falta información','Completos',[560,210,12],[360,160,0]],
    ['doc','La propuesta','Copiar otra vez','Preparada',[180,325,-9],[610,160,0]],
    ['person','Tu revisión','¿Quién lo mira?','Tú decides',[470,385,8],[610,430,0]],
    ['send','La respuesta','¿Se ha enviado?','Enviada',[90,145,10],[360,430,0]],
    ['time','El seguimiento','Que no se olvide','Próximo paso',[215,490,-7],[110,430,0]]
  ];
  var nodes=data.map(function(d,i){var n=document.createElement('div');n.className='organic-task task-'+i;n.innerHTML='<div class="task-float"><div class="task-paper"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"><path d="'+icons[d[0]]+'"/></svg><span class="task-kind">'+d[1]+'</span><strong class="task-state">'+d[2]+'</strong><div class="task-detail"><i></i><i></i></div><span class="task-check">✓</span></div></div>';world.appendChild(n);return n;});
  var lines=data.slice(1).map(function(_,i){var n=document.createElementNS('http://www.w3.org/2000/svg','path');n.setAttribute('class','thread-route');routes.appendChild(n);return n;});
  var packets=[0,1,2].map(function(){var dot=document.createElement('span');dot.className='organic-packet';world.appendChild(dot);return dot;});
  var clamp=function(x){return Math.max(0,Math.min(1,x));},ease=function(x){x=clamp(x);return x*x*(3-2*x);},mix=function(a,b,t){return a+(b-a)*t;};
  function staticMode(){return reduced.matches||innerHeight<520;}
  function paint(){
    frame=0;
    var rect=story.getBoundingClientRect(),distance=story.offsetHeight-innerHeight;
    var progress=clamp((100-rect.top)/Math.max(1,distance-220));
    var stable=staticMode(),t=stable?1:ease((progress-.10)/.72);
    order=t;story.style.setProperty('--order',t.toFixed(3));story.style.setProperty('--scatter',(1-t).toFixed(3));story.style.setProperty('--reveal',clamp((t-.78)/.22).toFixed(3));
    story.classList.toggle('organic-static',stable);story.classList.toggle('is-ordered',t>.65);
    var poses=data.map(function(d,i){var local=stable?1:ease((progress-.08-i*.025)/.68),a=d[4],b=d[5];var p=[mix(a[0],b[0],local),mix(a[1],b[1],local)];nodes[i].style.transform='translate3d('+(p[0]-86)+'px,'+(p[1]-58)+'px,0) rotate('+mix(a[2],b[2],local)+'deg)';nodes[i].style.setProperty('--done',local>.65?1:0);nodes[i].querySelector('.task-state').textContent=local>.65?d[3]:d[2];return p;});
    lines.forEach(function(line,i){var a=poses[i],b=poses[i+1],bend=(i%2?1:-1)*mix(270,0,t),middle=(a[0]+b[0])/2;
      // Horizontal links soften into a single downward turn at the review step.
      var c1=[middle+bend,a[1]-bend],c2=[middle-bend,b[1]+bend];
      if(i===2){c1=[mix(c1[0],700,t),mix(c1[1],a[1],t)];c2=[mix(c2[0],700,t),mix(c2[1],b[1],t)];}
      curves[i]=[a,c1,c2,b];
      line.setAttribute('d','M'+a.join(' ')+' C'+c1.join(' ')+' '+c2.join(' ')+' '+b.join(' '));
    });
    var chapter=stable?2:progress<.32?0:progress<.71?1:2;
    if(chapter!==current){current=chapter;chapters.forEach(function(n,i){n.classList.toggle('is-current',i===chapter);if(!stable)n.setAttribute('aria-hidden',String(i!==chapter));else n.removeAttribute('aria-hidden');});marks.forEach(function(n,i){n.classList.toggle('is-current',i===chapter);});story.querySelector('.organic-status').textContent=['Demasiados hilos sueltos.','Cada pieza encuentra su sitio.','Un recorrido claro, de principio a fin.'][chapter];}
    story.dataset.chapter=chapter;story.dataset.progress=progress.toFixed(3);
  }
  function request(){if(!frame&&visible)frame=requestAnimationFrame(paint);}
  function resize(){var width=stage.clientWidth,height=stage.clientHeight;world.style.setProperty('--scene-scale',Math.min(width/720,height/600));current=-1;paint();suspension();}
  function animate(time){
    ambient=0;if(!visible||document.hidden||paused||staticMode()){last=0;return;}
    if(!last)last=time;
    if(time-last>=40){elapsed+=Math.min(time-last,80);last=time;
      packets.forEach(function(dot,i){var f=((elapsed/13000+i/3)%1)*5,segment=Math.floor(f),t=f-segment,u=1-t,c=curves[segment];if(!c)return;var x=u*u*u*c[0][0]+3*u*u*t*c[1][0]+3*u*t*t*c[2][0]+t*t*t*c[3][0],y=u*u*u*c[0][1]+3*u*u*t*c[1][1]+3*u*t*t*c[2][1]+t*t*t*c[3][1];dot.style.transform='translate3d('+(x-4)+'px,'+(y-4)+'px,0)';dot.style.opacity=order>.1?Math.min(1,order+.25):.3;});
    }
    ambient=requestAnimationFrame(animate);
  }
  function suspension(){var running=visible&&!document.hidden&&!paused&&!staticMode();story.classList.toggle('organic-running',running);if(running&&!ambient)ambient=requestAnimationFrame(animate);else if(!running){cancelAnimationFrame(ambient);ambient=0;last=0;}}
  new IntersectionObserver(function(entries){visible=entries[0].isIntersecting;suspension();request();},{rootMargin:'100px'}).observe(story);
  new ResizeObserver(resize).observe(stage);
  addEventListener('scroll',request,{passive:true});addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',function(){suspension();if(!document.hidden)request();});
  reduced.addEventListener('change',function(){resize();suspension();});
  pause.hidden=false;pause.addEventListener('click',function(){paused=!paused;pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?'Reanudar movimiento':'Pausar movimiento';story.classList.toggle('organic-paused',paused);suspension();});
  story.classList.add('organic-enhanced');resize();
})();
