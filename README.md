# Autonomiza · propuesta de web

Sitio estático para explicar las soluciones digitales de Autonomiza desde los problemas del negocio. La portada conecta diez capacidades con cuatro símbolos de actividad; el resto incluye ejemplos seleccionables, cálculo local del tiempo dedicado, método, presentación de Iván, preguntas frecuentes y contacto directo.

La revisión está en `codex/web-revision-2026-10-12`, en el PR borrador existente. Publicación pendiente de aprobación.

## Funcionamiento

`index.html` y `revision.css` forman la página. `esfera.js` conserva los destellos sobre una única capa canvas y la pausa conjunta de la animación. `experiencia.js` cambia los ejemplos y calcula minutos × repeticiones × días / 60, sin enviar datos ni atribuir el total a un ahorro conseguido. WhatsApp solo se abre por decisión del visitante.

Las imágenes optimizadas de `assets/` son composiciones aprobadas como dirección visual por Iván; no son prueba de oficinas, clientes o proyectos reales. Los ejemplos están identificados como ilustrativos. El sitio no utiliza un chatbot conectado ni envía solicitudes por sí mismo.

## Validación de la propuesta

Se revisaron las vistas de escritorio, tableta y móvil; la selección de ejemplos, las preguntas frecuentes, los límites del cálculo y la pausa/reanudación. Se comprobó la sintaxis de los scripts, los recursos, las anclas e IDs y la ausencia de errores de JavaScript observados en el navegador integrado. La prueba física de esta versión en Chrome y Edge de Iván sigue pendiente.

La plantilla y el generador local se conservan en el proyecto de Autonomiza, fuera de este checkout. La exportación portátil incluye las fuentes, imágenes, estilos y scripts para revisión en otro equipo.
