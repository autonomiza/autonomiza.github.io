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
