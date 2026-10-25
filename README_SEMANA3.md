# NEXO-INNOVA | Extensión Semana 3 — BSC / OKR / Gates

## Qué incluye

Esta actualización agrega **cuatro vistas interactivas nuevas** al Artifact acumulativo:

- **12 · BSC — 10 KPI.** Fichas A1–A2, P1–P4, C1–C2, F1–F2, fórmulas, metas y campos de ensayo sin datos iniciales; los valores faltantes se muestran «NO MEDIDO».
- **13 · OKR — 12 KR.** Cuatro objetivos (O4 adopción, O2 gobierno, O1 clientes, O3 rentabilidad) con evidencia requerida y estados separados «sin evidencia / en revisión / simulado».
- **14 · Hipótesis y gates.** Red H1–H6 ↔ KPI ↔ OKR ↔ responsable ↔ G0–G3 y condiciones de bloqueo por calidad, abastecimiento y finanzas.
- **15 · Bitácora de piloto.** Tres oportunidades sin identificación inicial, ruta preparación–piloto–dictamen y escenario financiero documental, *separado* de los tres casos.

Los apartados de semanas previas se conservan. Los gráficos y valores financieros son **modelados, no medidos**. El umbral de aceptación 2 de 3 muestras es académico y no aprobado por la empresa.

## Opciones para integrar sin alterar lo publicado

**Recomendada: generador de versión completa.**

1. Extraer el ZIP de esta entrega en Windows.
2. En Windows, ejecutar con doble clic `ACTUALIZAR_EN_WINDOWS.cmd` (si Python 3 está instalado); de forma alternativa, abrir una terminal en la carpeta.
3. Ejecutar `py -3 aplicar_actualizacion.py` (o `python aplicar_actualizacion.py`). Necesita conexión a Internet y una instalación básica de Python 3; descarga el código **público** actual desde GitHub, crea una copia local, integra esta extensión y genera un ZIP publicable.
4. Abrir `NEXO_INNOVA_S3_PUBLICAR/index.html` en Edge/Chrome para comprobar el resultado.
5. Subir el contenido del ZIP `NEXO_INNOVA_S3_PUBLICAR.zip` a la **raíz** del repositorio `Daz-Riza-Seriog/NEXO_INOVA`. Recomendada una rama de respaldo antes de reemplazar los archivos. GitHub Pages no se modifica hasta que decidas publicar.

Si ya tienes una carpeta local con los ocho archivos anteriores, ejecuta `py -3 aplicar_actualizacion.py --origen "RUTA_A_LA_CARPETA"` y no será necesario descargar desde GitHub.

**Alternativa manual (sin Python):**

1. Agrega `week3.js` y `week3.css` a la raíz del repositorio.
2. En `index.html`, justo después de `<link rel="stylesheet" href="strategy.css" />`, agrega `<link rel="stylesheet" href="week3.css" />`.
3. En `index.html`, justo después de `<script defer src="strategy.js"></script>`, agrega `<script defer src="week3.js"></script>`.
4. Para que el botón **Guardar/Importar JSON** *general* incluya también la nueva información, en `app.js` reemplaza la cadena `strategy:window.NEXO_STRATEGY?.snapshot?.()||null,reflection:` por `strategy:window.NEXO_STRATEGY?.snapshot?.()||null,week3:window.NEXO_WEEK3?.snapshot?.()||null,reflection:` y la cadena `window.NEXO_STRATEGY?.load?.(data.strategy);toast(` por `window.NEXO_STRATEGY?.load?.(data.strategy);window.NEXO_WEEK3?.load?.(data.week3);toast(`.
5. Si omites el paso 4, la pantalla Bitácora tiene exportación/importación independiente **JSON Semana 3**. No se modificará el JSON general.

## Validación y controles de interpretación

- **No se cargan resultados reales ni se alteran las hipótesis H1–H6 originales.** Los diez KPI empiezan sin medición.
- En el cuadro BSC, los campos numéricos son para **simular** y comprobar la fórmula. Los estados de KR/gate nunca se denominan «aprobados».
- La mediana real de P1 y el VPN de F1 deben venir de fuentes auditables. Esta app permite introducir un resultado de ensayo, pero no reconstruye sus datos originales.
- El VPN +COP 256.444, TIR 10,81 %, B/C ≈ 1,012, inversión COP 21.427.500 y sensibilidad −10,69 M / +12,94 M corresponden al modelo académico heredado con tasa supuesta 10 % E.A.
- Las primeras muestras aceptadas en 2/3 casos son un umbral académico preliminar sujeto a ratificación; tres casos del piloto no son los escenarios conservador/base/favorable.
- Cuando se utilice con datos empresariales, exigir permisos, controles de acceso, aprobación y trazabilidad; GitHub Pages estático no reemplaza un sistema de registros oficial.

## Portabilidad a AppSheet (aún NO ejecutada)

Los objetos `kpis`, `okrs`, `hypotheses`, `gates` y `cases` tienen códigos únicos. Para la fase posterior, es posible normalizar Google Sheets en tablas: `Oportunidades`, `Mediciones`, `KPI`, `Objetivos`, `ResultadosClave`, `Hipotesis`, `Gates`, `Evidencias`, `UsuariosRoles`. AppSheet aportaría captura multiusuario y registros persistentes, pero la lógica de gráficos altamente personalizados del simulador HTML/JS **no se convierte automáticamente**. Una alternativa híbrida deja el simulador en GitHub Pages y usa AppSheet para captura y trazabilidad de evidencias, mediante integración diseñada explícitamente.

Fuente principal: `PI2_S3_NEXO_INNOVA_BSC_OKR.docx` — documento final, Equipo 4, Proyecto Integrador 2, 2026. Los contenidos propuestos no implican resultados operativos.
