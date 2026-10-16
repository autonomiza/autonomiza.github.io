# Autonomiza

Web estática de soluciones digitales para pymes. Versión aprobada por Iván el 16/10/2026: escena continua, proporciones móviles compactas, fondo casi negro uniforme, ocho servicios conectados y respuesta secuencial del negocio.

## Implementación

index.html carga escena.css, demostraciones.css, factura.css y proporcion.css. escena.js transforma el mismo canvas entre esfera, tareas, agenda, factura, método y retrato. demostraciones.js coordina los ejemplos ficticios. Las luces usan interpolación continua; un único reloj controla flotación, destellos y respuesta. Pausa, movimiento reducido y suspensión cuando no se ve la escena. No hay nuevas dependencias externas.

En ordenador los servicios quedan hacia fuera y flotan sin cambiar su orden. En móvil conservan sus posiciones; el efecto de respuesta es más discreto. La cabecera y la escena ocupan menos altura en vertical, con pausa en una esquina. Acento oficial #2EC4B6; etiquetas de esfera en tono claro #A6F2E7; fondo #090B0C.

El retrato utiliza los píxeles originales con una máscara alfa para ocultar el fondo blanco. Se conservan CNAME, verificación Google, contacto y textos legales sin 2A. Los ejemplos no envían mensajes, contabilizan facturas ni realizan pagos.

## Validación y reversión

Prueba local revisada en móvil y ordenador; aprobación visual de Iván. Sintaxis, pausa y retirada del efecto al cambiar de escena comprobadas; sin medición de FPS en dispositivos físicos. La comprobación pública se registra en la coordinación del proyecto después del despliegue.

Versión pública anterior: 565df749e705f723a5cf82e3e349b4168d36373a. Si aparecen fallos de lectura, navegación o animación que impidan usar la web, revertir este despliegue mediante un commit nuevo, preservando el historial.
