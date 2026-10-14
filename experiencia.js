/* Ejemplos ilustrativos y cálculo local. Ningún dato se envía desde esta página. */
(function () {
  'use strict';
  var examples = {
    repeticion: {
      type: 'Una solicitud, de principio a fin',
      title: 'Un correo no debería convertirse en cinco tareas.',
      description: 'Llega una solicitud. Alguien copia los datos, comprueba qué falta, prepara una respuesta y recuerda hacer el seguimiento.',
      steps: [
        ['Llega la solicitud', 'Se recoge en un único registro.', '↙'],
        ['Se comprueba lo importante', 'Si falta un dato, se pide antes de avanzar.', '◇'],
        ['Tú revisas la propuesta', 'La decisión y la aprobación siguen contigo.', '✓'],
        ['El seguimiento tiene continuidad', 'Se registra el envío y se prepara el próximo aviso.', '↗']
      ],
      result: 'Que tu equipo dedique su atención a resolver la solicitud y cada paso tenga un responsable.',
      criterion: 'La IA puede ayudar a preparar un borrador. Las reglas y la revisión humana deciden qué sale de tu negocio.'
    },
    informacion: {
      type: 'Del pedido a una visión compartida',
      title: 'Saber qué pasa sin perseguir a todo el equipo.',
      description: 'El pedido llega por correo, su estado está en una hoja y los cambios se hablan por chat. Para dar una respuesta, primero hay que reconstruir la historia.',
      steps: [
        ['Un pedido, una referencia', 'La solicitud y sus documentos quedan vinculados.', '↙'],
        ['Las herramientas comparten el estado', 'Se conectan las que permiten intercambiar datos.', '⇄'],
        ['La excepción llega a quien la resuelve', 'Si falta algo o cambia un plazo, se avisa al responsable.', '◇'],
        ['El equipo ve la misma situación', 'Un panel muestra qué está pendiente y el siguiente paso.', '✓']
      ],
      result: 'Encontrar una respuesta en el proceso, sin buscar en cuatro sitios ni depender de la memoria de alguien.',
      criterion: 'Antes de conectar nada, comprobamos los permisos, los datos disponibles y qué sistema debe ser la referencia.'
    },
    atencion: {
      type: 'Una cancelación, otra oportunidad',
      title: 'Un hueco libre puede tener otra oportunidad.',
      description: 'Se cancela una cita. Empiezan las llamadas para reorganizar la agenda mientras el equipo sigue atendiendo a quienes ya están allí.',
      steps: [
        ['Se detecta el hueco', 'La agenda informa de la cancelación.', '↙'],
        ['Se ofrece a quien puede aprovecharlo', '«Se ha quedado libre una cita a las 16:00. ¿Te viene bien?»', '↗'],
        ['Llega una aceptación', '«Sí, me viene bien.» Se comprueba que siga disponible.', '✓'],
        ['La agenda refleja la nueva cita', 'Se confirma al paciente y se avisa al equipo.', '⇄']
      ],
      result: 'Menos llamadas para reorganizar la agenda y una nueva oportunidad para ese hueco.',
      criterion: 'El resultado depende de la disponibilidad y la respuesta de los pacientes. Las consultas que requieren criterio se derivan al equipo.'
    },
    web: {
      type: 'De una visita a una solicitud útil',
      title: 'Una web también puede trabajar contigo.',
      description: 'Alguien visita tu web, no acaba de entender lo que haces y te manda una consulta sin los datos que necesitas. El trabajo empieza otra vez por teléfono.',
      steps: [
        ['Entiende qué puedes hacer por él', 'Un recorrido claro muestra tu propuesta y ejemplos.', '↙'],
        ['Encuentra el siguiente paso', 'El contacto encaja con lo que necesita preguntar.', '↗'],
        ['La solicitud llega con contexto', 'Se recoge lo necesario, sin pedir datos de más.', '◇'],
        ['El proceso sigue dentro del negocio', 'La consulta se registra y llega a la persona adecuada.', '✓']
      ],
      result: 'Una web que explique tu negocio y facilite el trabajo que viene después de cada visita.',
      criterion: 'Diseño, contenido y conexiones se plantean juntos. Los resultados se miden después; no prometemos ventas por cambiar una página.'
    }
  };
  var before = {
    repeticion: [['Una petición entre otros veinte correos.','Hay que abrirla, leerla y averiguar quién se va a encargar.'],['Otra vez los mismos datos.','Copias la información a una hoja. Falta un dato y toca volver a escribir.'],['El borrador espera un hueco.','Alguien tiene que reunir la información y redactar la respuesta desde cero.'],['¿Nos acordaremos de seguirla?','La propuesta se envía, pero el próximo aviso depende de la memoria.']],
    informacion: [['El pedido empieza por correo.','Sus documentos y referencias quedan repartidos entre mensajes.'],['Cada herramienta cuenta una parte.','La hoja tiene una fecha y el chat anuncia un cambio distinto.'],['La incidencia se descubre al preguntar.','El equipo pierde tiempo reconstruyendo lo que ha pasado.'],['Hay que consultar a tres personas.','Para responder al cliente, alguien reúne las piezas una a una.']],
    atencion: [['La cancelación deja un hueco.','El equipo sigue atendiendo y nadie ha empezado a reorganizar la agenda.'],['Comienza la ronda de llamadas.','Hay que buscar quién podría venir e interrumpir otras tareas para contactar.'],['Una respuesta entre varias conversaciones.','Se necesita comprobar que otra persona no haya ocupado ya el hueco.'],['Queda avisar y actualizar.','La nueva cita aún tiene que reflejarse en la agenda del equipo.']],
    web: [['No se entiende bien qué ofreces.','La visita recorre páginas, pero no encuentra una respuesta a su situación.'],['El contacto no orienta.','Solo hay un formulario genérico, igual para cualquier consulta.'],['Falta lo necesario para responder.','Hay que pedir por teléfono el contexto que no recogió la web.'],['Una consulta más en el buzón.','Asignar un responsable y dar continuidad vuelve a ser una tarea manual.']]
  };
  var shortSteps = {repeticion:['Recibir','Comprobar','Preparar','Seguir'],informacion:['Recoger','Conectar','Resolver','Consultar'],atencion:['Detectar','Ofrecer','Comprobar','Confirmar'],web:['Entender','Contactar','Recoger','Continuar']};
  var objectLabels = {repeticion:'Solicitud',informacion:'Pedido',atencion:'Cita',web:'Consulta'};
  var selectedCase='repeticion', selectedStep=0, connected=false;
  var demo=document.getElementById('case-demo'),route=document.getElementById('demo-route');
  var reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  var stepButtons=[];
  if(demo){
    for(var i=0;i<4;i++){
      var stepButton=document.createElement('button');stepButton.type='button';stepButton.dataset.step=i;
      stepButton.innerHTML='<span class="demo-stop" aria-hidden="true"></span><span class="demo-stop-label"></span>';
      stepButton.addEventListener('click',function(){selectedStep=Number(this.dataset.step);renderDemo(true);});
      route.appendChild(stepButton);stepButtons.push(stepButton);
    }
    demo.hidden=false;document.getElementById('case-flow').hidden=true;
    demo.querySelectorAll('[data-mode]').forEach(function(control){control.addEventListener('click',function(){connected=this.dataset.mode==='after';renderDemo(true);});});
    document.getElementById('demo-connect').addEventListener('click',function(){connected=!connected;renderDemo(true);});
    document.getElementById('demo-next').addEventListener('click',function(){selectedStep=(selectedStep+1)%4;renderDemo(true);});
    renderDemo(false);
  }
  function renderDemo(animate){
    if(!demo)return;
    var data=examples[selectedCase],step=connected?data.steps[selectedStep]:before[selectedCase][selectedStep];
    demo.dataset.mode=connected?'after':'before';
    demo.querySelectorAll('[data-mode]').forEach(function(control){control.setAttribute('aria-pressed',String((control.dataset.mode==='after')===connected));});
    stepButtons.forEach(function(control,index){
      control.setAttribute('aria-pressed',String(index===selectedStep));
      control.querySelector('.demo-stop').textContent=index+1;
      control.querySelector('.demo-stop-label').textContent=shortSteps[selectedCase][index];
    });
    document.getElementById('demo-step-status').textContent='Paso '+(selectedStep+1)+' de 4 · '+(connected?'Con el proceso conectado':'Con el atasco');
    document.getElementById('demo-step-title').textContent=step[0];document.getElementById('demo-step-copy').textContent=step[1];
    document.getElementById('demo-object-label').textContent=objectLabels[selectedCase];
    document.getElementById('demo-mark').setAttribute('d',connected?'M59 70l6 6 11-13':'M67 61v11m0 6v1');
    document.getElementById('demo-connect').innerHTML=connected?'Volver a ver el atasco <span aria-hidden="true">↶</span>':'Conectar este proceso <span aria-hidden="true">↗</span>';
    document.getElementById('demo-next').innerHTML=selectedStep===3?'Volver al primer paso <span aria-hidden="true">↶</span>':'Siguiente paso <span aria-hidden="true">→</span>';
    if(animate&&!reducedMotion.matches){
      var detail=document.getElementById('demo-detail');
      if(detail.animate){detail.getAnimations().forEach(function(a){a.cancel();});detail.animate([{opacity:.35,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:260,easing:'ease-out'});}
    }
  }
  var buttons = Array.from(document.querySelectorAll('[data-case]'));
  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      var data = examples[button.dataset.case];
      if (!data) return;
      selectedCase=button.dataset.case;selectedStep=0;renderDemo(true);
      buttons.forEach(function (item) {
        var selected = item === button;
        item.classList.toggle('is-selected', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      ['type', 'title', 'description', 'result', 'criterion'].forEach(function (key) {
        document.getElementById('case-' + key).textContent = data[key];
      });
      var flow = document.getElementById('case-flow');
      flow.dataset.case = button.dataset.case;
      flow.replaceChildren();
      data.steps.forEach(function (step, index) {
        var item = document.createElement('li');
        var number = document.createElement('span');
        number.className = 'flow-index'; number.textContent = index + 1;
        var copy = document.createElement('div');
        var title = document.createElement('strong'); title.textContent = step[0];
        var description = document.createElement('p'); description.textContent = step[1];
        copy.append(title, description);
        var symbol = document.createElement('span');
        symbol.className = 'flow-symbol'; symbol.setAttribute('aria-hidden', 'true'); symbol.textContent = step[2];
        item.append(number, copy, symbol); flow.appendChild(item);
      });
    });
  });

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
