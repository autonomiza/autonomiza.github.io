# Autonomiza · propuesta de web

Sitio estático para explicar las soluciones digitales de Autonomiza desde los problemas del negocio. La portada conecta diez capacidades con cuatro símbolos de actividad; el resto incluye ejemplos seleccionables, cálculo local del tiempo dedicado, método, presentación de Iván, preguntas frecuentes y contacto directo.

La revisión está en `codex/web-revision-2026-10-12`, en el PR borrador existente. Publicación pendiente de aprobación.

La dirección visual del 13 de octubre conserva la portada aprobada y alterna el carbón de marca con una superficie menta: situaciones abiertas y recorrido horizontal en escritorio, cálculo con resultado destacado, pizarra amplia con el rostro corregido elegido y presentación personal con la fotografía del escritorio. En móvil los recorridos pasan a una secuencia vertical. El cierre de contacto se conserva por decisión de Iván. Las composiciones anteriores permanecen en el archivo local del proyecto para comparación.

## Funcionamiento

`index.html` y `revision.css` forman la página. `esfera.js` conserva los destellos sobre una única capa canvas y la pausa conjunta de la animación. `experiencia.js` cambia los ejemplos y calcula minutos × repeticiones × días / 60, sin enviar datos ni atribuir el total a un ahorro conseguido. WhatsApp solo se abre por decisión del visitante.

Las imágenes optimizadas de `assets/` son composiciones aprobadas como dirección visual por Iván; no son prueba de oficinas, clientes o proyectos reales. Los ejemplos están identificados como ilustrativos. El sitio no utiliza un chatbot conectado ni envía solicitudes por sí mismo.

## Validación de la propuesta

Se revisaron las vistas de escritorio, tableta y móvil; la selección de ejemplos, las preguntas frecuentes, los límites del cálculo y la pausa/reanudación. Se comprobó la sintaxis de los scripts, los recursos, las anclas e IDs y la ausencia de errores de JavaScript observados en el navegador integrado. La prueba física de esta versión en Chrome y Edge de Iván sigue pendiente.

La plantilla y el generador local se conservan en el proyecto de Autonomiza, fuera de este checkout. La exportación portátil incluye las fuentes, imágenes, estilos y scripts para revisión en otro equipo.

Revisión vigente: `Autonomiza - Propuesta visual - 2026-10-13.html`. Fuentes y recursos locales; sin dependencias de terceros añadidas. El JavaScript de esfera y ejemplos se mantiene idéntico a la versión estable anterior. La nueva foto es `assets/ivan-pizarra-rostro-fiel.webp`; la anterior se conserva.
