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
  var buttons = Array.from(document.querySelectorAll('[data-case]'));
  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      var data = examples[button.dataset.case];
      if (!data) return;
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
