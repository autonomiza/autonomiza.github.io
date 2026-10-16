# Autonomiza

Web estática de soluciones digitales para pymes. Versión aprobada por Iván el 16/10/2026: escena continua, proporciones móviles compactas, fondo casi negro uniforme, ocho servicios conectados y respuesta secuencial del negocio.

## Implementación

index.html carga escena.css, demostraciones.css, factura.css y proporcion.css. escena.js transforma el mismo canvas entre esfera, tareas, agenda, factura, método y retrato. demostraciones.js coordina los ejemplos ficticios. Las luces usan interpolación continua; un único reloj controla flotación, luces de la esfera y respuesta. Los destellos de fondo usan animaciones CSS de opacidad, con pausa compartida. Pausa, movimiento reducido y suspensión cuando no se ve la escena. No hay nuevas dependencias externas.

En ordenador los servicios quedan hacia fuera y flotan sin cambiar su orden. En móvil conservan sus posiciones; el efecto de respuesta es más discreto. La cabecera y la escena ocupan menos altura en vertical, con pausa en una esquina. Acento oficial #2EC4B6; etiquetas de esfera en tono claro #A6F2E7; fondo #090B0C.

El retrato utiliza los píxeles originales con una máscara alfa para ocultar el fondo blanco. Se conservan CNAME, verificación Google, contacto y textos legales sin 2A. Los ejemplos no envían mensajes, contabilizan facturas ni realizan pagos.

## Validación y reversión

Prueba local revisada en móvil y ordenador; aprobación visual de Iván. Sintaxis, pausa y retirada del efecto al cambiar de escena comprobadas; sin medición de FPS en dispositivos físicos. La comprobación pública se registra en la coordinación del proyecto después del despliegue.

Versión pública anterior: 51f0299f6dd7cfa74a04bb51c212537848247a6c. Si aparecen fallos de lectura, navegación o animación que impidan usar la web, revertir este despliegue mediante un commit nuevo, preservando el historial.

## Fondo aprobado el16/10/2026

Trama regular32px en toda la página, con brillo decreciente de derecha a izquierda. En móvil empieza junto al borde derecho. Estrellas finas de cuatro puntas, posiciones aleatorias separadas112/180px, máximo6/12puntos móvil/ordenador y brillo sostenido3–3,8s. La esfera excluye los puntos del fondo y los nuevos destellos; conserva sus propias órbitas y conexiones luminosas. La exclusión se adapta al tamaño y al retorno con scroll. Sin bibliotecas nuevas. Movimiento reducido oculta las estrellas; pausa y pestaña oculta detienen su animación.

Esta versión sustituye la pública51f0299 con autorización expresa de Iván; será la base para próximos trabajos de contenido. El enlace de prueba local se conserva.
