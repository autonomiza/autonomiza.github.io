(function(){
var hero=document.querySelector('.sphere-hero'),button=document.querySelector('.motion-toggle'),sphere=hero.querySelector('.sphere-svg'),links=hero.querySelector('.capability-links'),caps=Array.from(hero.querySelectorAll('.capability')),ns='http://www.w3.org/2000/svg',reduced=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width:900px)'),visible=true,frame=0,rotation=0,lastTick=null,signalTime=0;
function el(tag,attrs,parent){var n=document.createElementNS(ns,tag);Object.keys(attrs).forEach(function(k){n.setAttribute(k,attrs[k]);});parent.appendChild(n);return n;}
var pairs=caps.map(function(cap,i){var group=el('g',{'data-capability':cap.classList[1],mask:'url(#business-link-absorption)'},links),base=el('path',{class:'cap-connection'},group),dock=el('circle',{class:'cap-dock',r:2.5},group);return {cap:cap,paths:[base],dock:dock,index:i};});

var signalCanvas=document.createElement('canvas');signalCanvas.className='signal-canvas';signalCanvas.setAttribute('aria-hidden','true');links.insertAdjacentElement('afterend',signalCanvas);var signalCtx=signalCanvas.getContext('2d');
function drawSignals(rect,center,radius){
if(!signalCtx)return;
var ratio=Math.min(window.devicePixelRatio||1,2),w=Math.round(rect.width*ratio),h=Math.round(rect.height*ratio);
if(signalCanvas.width!==w||signalCanvas.height!==h){signalCanvas.width=w;signalCanvas.height=h;}
signalCtx.setTransform(ratio,0,0,ratio,0,0);signalCtx.clearRect(0,0,rect.width,rect.height);
if(reduced.matches)return;
var ctx=signalCtx;ctx.globalCompositeOperation='source-over';ctx.lineCap='round';ctx.lineJoin='round';
pairs.forEach(function(pair){
var phase=signalTime+pair.index*2800,windowPhase=(phase%28000)/28000,alpha=windowPhase<=.18?1:windowPhase<.20?( .20-windowPhase)/.02:0;
if(alpha<=0)return;
var path=pair.paths[0],length=path.getTotalLength();if(!length)return;
var start=(phase%13000)/13000,finish=start+.07;
function segment(from,to){
ctx.beginPath();var count=18;
for(var j=0;j<=count;j++){var p=path.getPointAtLength((from+(to-from)*j/count)*length);if(j===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);}
ctx.globalAlpha=alpha*.35;ctx.strokeStyle='#2ec4b6';ctx.lineWidth=7;ctx.shadowColor='#2ec4b6';ctx.shadowBlur=8;ctx.stroke();
ctx.globalAlpha=alpha;ctx.strokeStyle='#91ffee';ctx.lineWidth=2;ctx.shadowBlur=4;ctx.stroke();
}
segment(start,Math.min(finish,1));if(finish>1)segment(0,finish-1);
});
ctx.shadowBlur=0;ctx.globalAlpha=1;ctx.globalCompositeOperation='destination-out';var fade=ctx.createRadialGradient(center.x,center.y,radius*.62,center.x,center.y,radius);fade.addColorStop(0,'rgba(0,0,0,1)');fade.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=fade;ctx.beginPath();ctx.arc(center.x,center.y,radius,0,Math.PI*2);ctx.fill();ctx.globalCompositeOperation='source-over';
}

function draw(){
hero.querySelectorAll('.business-type').forEach(function(icon){var a=(Number(icon.getAttribute('data-angle'))+rotation)*Math.PI/180,compact=hero.clientWidth<480,r=compact?50:78;icon.setAttribute('transform','translate('+(1080+r*Math.cos(a))+' '+(445+r*Math.sin(a))+') scale('+(compact?.85:1)+')');});
var viewBox=mobile.matches?'640 80 840 730':'0 0 1440 900';if(sphere.getAttribute('viewBox')!==viewBox)sphere.setAttribute('viewBox',viewBox);
var grid=hero.querySelector('.sphere-grid');grid.setAttribute('transform','rotate('+rotation+' 1080 445)');
var rect=hero.getBoundingClientRect(),base=sphere.getScreenCTM();if(!base||!rect.width)return;
var radians=rotation*Math.PI/180,cos=Math.cos(radians),sin=Math.sin(radians),ox=1080*(1-cos)+445*sin,oy=445*(1-cos)-1080*sin,matrix={a:base.a*cos+base.c*sin,b:base.b*cos+base.d*sin,c:base.c*cos-base.a*sin,d:base.d*cos-base.b*sin,e:base.e+base.a*ox+base.c*oy,f:base.f+base.b*ox+base.d*oy};
links.setAttribute('viewBox','0 0 '+rect.width+' '+rect.height);
function point(x,y){return {x:matrix.a*x+matrix.c*y+matrix.e,y:matrix.b*x+matrix.d*y+matrix.f};}
var center=point(1080,445),area=links.querySelector('.absorption-area'),absorb=links.querySelector('.absorption-center');area.setAttribute('width',rect.width);area.setAttribute('height',rect.height);absorb.setAttribute('cx',center.x-rect.left);absorb.setAttribute('cy',center.y-rect.top);absorb.setAttribute('r',130*Math.hypot(matrix.a,matrix.b));var angles=[-145,-65,-165,-15,178,30,125,70,145,-90];
pairs.forEach(function(pair){var box=pair.cap.getBoundingClientRect(),angle=angles[pair.index]*Math.PI/180,mesh=[[280,150],[152,280],[280,225],[226,280],[280,70],[68,280],[280,225],[226,280],[280,150],[152,280]][pair.index],target=point(1080+mesh[0]*Math.cos(angle),445+mesh[1]*Math.sin(angle)),end=point(1080+mesh[0]*Math.cos(angle+Math.PI*1.25),445+mesh[1]*Math.sin(angle+Math.PI*1.25)),cx=box.left+box.width/2,cy=box.top+box.height/2,dx=target.x-cx,dy=target.y-cy,t=Math.min((box.width/2)/Math.max(Math.abs(dx),.001),(box.height/2)/Math.max(Math.abs(dy),.001)),x=cx+dx*t-rect.left,y=cy+dy*t-rect.top,tx=target.x-rect.left,ty=target.y-rect.top,bend=(pair.index%2?1:-1)*Math.min(38,Math.hypot(tx-x,ty-y)*.22),d='M '+x+' '+y+' C '+(x+(tx-x)*.35)+' '+(y+(ty-y)*.12+bend)+' '+(x+(tx-x)*.75)+' '+(y+(ty-y)*.8-bend)+' '+tx+' '+ty;
d+=' A '+(mesh[0]*Math.hypot(matrix.a,matrix.b))+' '+(mesh[1]*Math.hypot(matrix.c,matrix.d))+' '+(Math.atan2(matrix.b,matrix.a)*180/Math.PI)+' 1 1 '+(end.x-rect.left)+' '+(end.y-rect.top);
var businesses=hero.querySelectorAll('.business-type'),business=businesses[pair.index%businesses.length],businessBox=business.getBoundingClientRect(),bx=businessBox.left+businessBox.width/2,by=businessBox.top+businessBox.height/2,ex=end.x,ey=end.y,vx=ex-bx,vy=ey-by,edge=Math.min((businessBox.width/2)/Math.max(Math.abs(vx),.001),(businessBox.height/2)/Math.max(Math.abs(vy),.001)),nucleusX=bx+vx*edge-rect.left,nucleusY=by+vy*edge-rect.top,endX=ex-rect.left,endY=ey-rect.top;
d+=' C '+(endX+(nucleusX-endX)*.42)+' '+endY+' '+(endX+(nucleusX-endX)*.72)+' '+nucleusY+' '+nucleusX+' '+nucleusY;
pair.paths.forEach(function(path){path.setAttribute('d',d);});pair.dock.setAttribute('cx',tx);pair.dock.setAttribute('cy',ty);
});
drawSignals(rect,{x:center.x-rect.left,y:center.y-rect.top},130*Math.hypot(matrix.a,matrix.b));
}
function active(){return visible&&!reduced.matches&&!hero.classList.contains('motion-paused');}
function tick(time){frame=0;if(lastTick!==null){var delta=time-lastTick;signalTime+=delta;rotation=(rotation+delta*360/110000)%360;}lastTick=time;draw();if(active())frame=requestAnimationFrame(tick);else lastTick=null;}
function refresh(){draw();if(active()&&!frame)frame=requestAnimationFrame(tick);else if(!active()){if(frame)cancelAnimationFrame(frame);frame=0;lastTick=null;}}
button.addEventListener('click',function(){var paused=hero.classList.toggle('motion-paused');button.setAttribute('aria-pressed',String(paused));button.textContent=paused?'Reanudar animación':'Pausar animación';refresh();});
new ResizeObserver(refresh).observe(hero);
new IntersectionObserver(function(entries){visible=entries[0].isIntersecting;refresh();}).observe(hero);
reduced.addEventListener('change',refresh);mobile.addEventListener('change',refresh);
document.addEventListener('visibilitychange',function(){visible=!document.hidden;refresh();});
if(document.fonts)document.fonts.ready.then(refresh);refresh();
})();
