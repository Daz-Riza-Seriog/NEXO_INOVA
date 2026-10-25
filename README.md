# NEXO-INNOVA | Simulador gerencial de decisiones

Versión integrada y acumulativa de la herramienta interactiva de NEXO-INNOVA (Lintegra Materials S.A.S.), construida sobre los archivos previamente publicados en el repositorio `NEXO_INOVA` de GitHub Pages.

**Propósito:** permitir variar condiciones de entorno y competencia, actores y vínculos, hipótesis y sensibilidad económica para observar cómo cambia una **recomendación de gestión**, sin confundir una simulación con evidencia obtenida, aprobación empresarial o rentabilidad garantizada.

El proyecto se presenta como **uno solo**, con antecedentes trazables y módulos especializados, y no como una colección de entregables independientes.

## Inicio rápido / actualización del sitio

1. Descomprime `NEXO_INNOVA_SIMULADOR_GERENCIAL.zip`.
2. Abre `index.html` en un navegador moderno (Chrome/Edge/Firefox) o publica estos ocho archivos en la raíz del repositorio `NEXO_INOVA`:
   - `index.html`
   - `style.css`
   - `data.js`
   - `app.js`
   - `strategy.css` **(nuevo)**
   - `strategy.js` **(nuevo)**
   - `README.md`
   - `LICENSE`
3. En GitHub, usa **Add file → Upload files** y confirma los cambios en la rama que publica Pages. Si hay archivos con nombre igual, deben **reemplazar** los anteriores; no debes conservar dos versiones con el mismo nombre.
4. Revisa GitHub Pages en el enlace ya publicado: <https://daz-riza-seriog.github.io/NEXO_INOVA/>. Espera a que se complete el despliegue; si el navegador almacena una versión anterior, fuerza recarga con `Ctrl + F5`.

**Sugerencia:** crea primero una rama de respaldo o descarga el código anterior. El ZIP no realiza cambios automáticamente en tu repositorio. No requiere Node, npm, servidor, cuenta ni API: es HTML + CSS + JavaScript de navegador.

## Navegación del simulador

| Sección | Qué permite hacer |
|---|---|
| 01 Panorama | Revisar el hilo estratégico y abrir módulos relevantes. |
| 02 PESTEL | Cambiar intensidades cualitativas y observar conexiones con H1–H6, responsables y respuestas. |
| 03 Porter | Ajustar las cinco fuerzas (1–5) y contrastar sus presiones contra la valoración de referencia. |
| 04 Delta | Seleccionar un posicionamiento y modificar ponderaciones experimentales de criterios. |
| 05 Actores | Cambiar poder, interés, postura, nivel requerido R e involucramiento E; conservar ND como dato no determinado. |
| 06 Matriz poder–interés | Visualizar cuadrantes y brechas, seleccionar actores, exportar SVG. |
| 07 Supuestos | Ver la **cobertura de vinculación** por H1–H6, independiente de su validez técnica. |
| 08 Canvas | Comparar el modelo documental V0 y la propuesta V2 por nueve bloques, con sus vínculos. |
| 09 Matriz de vínculos | Editar relaciones actor–hipótesis y auditar el cálculo de cobertura. |
| 10 Escenarios | Comparar V0 (no medido), V1 (estimado) y V2 (plan condicionado). |
| 11 Finanzas | Variar iteraciones evitadas, tasa, realización del beneficio y costo adicional en valor presente. |
| 12 BSC | Revisar cuatro perspectivas del Balanced Scorecard y sus indicadores propuestos. |
| 13 Decisión integrada | Modificar el estado **simulado** de validación de H1–H6 y ver una recomendación condicionada. |
| 14 Gates | Marcar hipotéticamente condiciones de avance y redactar una tarjeta de decisión. |

Los módulos 05–10 y 14 reutilizan la arquitectura y datos existentes. Los apartados 02–04 y 11–13 incorporan el diagnóstico estratégico posterior.

## Distinción obligatoria de evidencia

- **Documento / referencia:** decisiones, datos y valoraciones explícitamente reportados en los trabajos académicos. No se modifican por mover controles.
- **Juicio cualitativo / hipótesis:** intensidades PESTEL y Porter, posición Delta propuesta, vinculaciones de actores y otros indicadores exploratorios.
- **Simulación del usuario:** todo ajuste posterior de actores, intensidades, ponderaciones, variables económicas, evidencias o gates. No actualiza reportes empresariales ni equivale a validación.
- **Validación requerida:** actas, aprobaciones, entrevistas, resultados de piloto, VOC, línea base y evaluación económica contrastada.

Ningún cambio de postura o E de un actor convierte automáticamente H1–H6 en hipótesis validadas. En el *Centro de decisión* existe un control **separado** para ensayar qué ocurriría si las pruebas fueran superadas. Todos los estados introducidos allí son hipotéticos.

## Fuentes académicas incorporadas

1. `NEXO_INNOVA_PI2_S1_Alineacion_Ideas_Stakeholders(1).docx`: V0/V1/V2, 13 actores, H1–H6, Canvas, gates y fórmula de cobertura.
2. `PI2_S2_Lintegra_NexoInnova_Revision_Sobre_Original(1).docx` / versión recuperada `PI2_S2_Lintegra_NexoInnova_Revision_Sobre_Original.docx`: PESTEL, Porter, Delta, hipótesis críticas, piloto y sensibilidad económica.
3. Antecedentes del Business Case y evaluación financiera NEXO-INNOVA recogidos en dichos documentos.

Las referencias externas DANE, BanRep, MINCIT, Unión Europea, ISO, SIC, Porter y MIT aparecen en la bibliografía del documento estratégico; no se convierten en certificaciones ni mediciones internas de Lintegra.

### Datos de referencia que no se deben reinterpretar

- Porter (valoración heredada, escala 1–5): **rivalidad 5, compradores 4, sustitutos 4, entrantes 3, proveedores 3**.
- Delta: **solución integral al cliente** como orientación preferente **para prueba**, no estrategia aprobada. Mejor producto se mantiene como atributo base; consolidación del sistema carece de evidencia.
- Cobertura de involucramiento: **V1 ≈ 38,9 %** (13 actores y E estimada), **V2 ≈ 94,6 %** solamente si se implementa el plan. V0 no cuenta con E documentada y **no tiene porcentaje histórico calculable**.
- Finanzas: 36 meses, inversión **valorizada** $21.427.500 COP, tasa **supuesta** 10 % E.A. (no WACC), VPN base **+$256.444**, TIR **10,81 %**, B/C **≈1,012**; a 12 % E.A. el VPN informado es **≈−$364.332**. La mejora de 0,25 iteraciones/desarrollo es un supuesto, no ahorro de caja ejecutado.
- H1–H6 no se han dado por validados; las pruebas y responsables propuestos en los documentos siguen pendientes.

## Fórmula de cobertura (heredada del documento)

Para cada actor *i* se define su brecha `B_i = max(0, R_i - E_i)` y el indicador exploratorio:

`C = 100 × [1 − Σ(P_i × I_i × B_i) / (3 × Σ(P_i × I_i))]`.

Se acota entre 0 y 100. Para una hipótesis se utilizan solo los actores vinculados. **No es una probabilidad de éxito, una medición oficial, un índice de adopción ni una validación técnica.** La actitud ND no se reemplaza por oposición ni neutralidad por defecto.

## Fórmula económica: aproximación experimental, NO flujo oficial

El documento estratégico no proporciona en este archivo todos los flujos por periodo y los supuestos financieros necesarios para un nuevo VAN/VPN exacto, por lo que **no se finge un cálculo financiero completo**.

El módulo de sensibilidad hace una **interpolación local ilustrativa** con los puntos documentados. Su fórmula es:

`VPN* ≈ 256444 + (n × realización − 0.25) × 85481333 − (tasa% − 10) × 310388 − costo_adicional_VP`

Donde:

- `n`: iteraciones potencialmente evitadas por desarrollo (0,10–0,40).
- `realización`: proporción de beneficio alcanzada, introducida entre 40 y 120 %, expresada en fracción para la fórmula.
- `tasa%`: descuento en puntos porcentuales E.A. (ejemplo: 12, no 0,12).
- `costo_adicional_VP`: variación de costo adicional **supuesto** expresado como valor presente en COP.
- `85.481.333`: pendiente aproximada derivada de `256.444 / (0,25 − 0,247)`, donde el umbral 0,247 es **redondeado**.
- `310.388`: variación lineal por punto porcentual obtenida de los dos resultados de VPN informados para tasas de 10 y 12 %.

Esta ecuación **no reconstruye el flujo de caja** y tiene alta incertidumbre. Su comportamiento fuera del entorno local puede ser irrealista; sus resultados se etiquetan **VPN*** para evitar confundirlos con el VPN documentado. No se recalculan TIR o B/C, que permanecen como antecedentes. Si se obtiene el Excel financiero original, sustituir este proxy por la serie anual/mensual contrastada es una mejora prioritaria.

Los tres escenarios **financieros** (0,15 / 0,25 / 0,35) y los tres escenarios de **actores** (V0 / V1 / V2) son independientes y no se combinan mediante causalidades inventadas.

## Regla de recomendación gerencial

La pantalla integra **cuatro chequeos exploratorios**: VPN* indicativamente positivo; cobertura mínima de involucramiento (80 % por defecto, configurable, **no es meta oficial**); H1–H6 con evidencia supuesta superada; y los nueve gates marcados. Nunca produce el mensaje «aprobado por Lintegra».

Cambiar una presión PESTEL, Porter o el ajuste Delta **modifica prioridades y recomendaciones descriptivas**, pero no inventa una ecuación que sume estas valoraciones al VPN. Una situación con VPN* negativo conduce a recomendar no desplegar; una cobertura insuficiente sugiere ajustar vinculaciones; una cobertura alta sin pruebas completas sigue siendo una validación condicionada.

## Guardado, ilustraciones y compatibilidad

- **Guardar JSON** incluye los tres escenarios de actores, matriz de vínculos, reflexión, gates y el estado de los nuevos módulos estratégicos.
- **Importar JSON** admite archivos del artefacto previo con el esquema `nexo-innova-pi2-v1`. Si no contienen el bloque `strategy`, los nuevos módulos toman valores de referencia.
- **Exportación SVG**: matriz de interesados, supuestos, Canvas, PESTEL, Porter, Delta y curva financiera. Puede insertarse en Word conservando nitidez.
- **CSV**: actores, escenarios, BSC y síntesis gerencial.
- **Restablecer** (barra superior): restablece actores del escenario activo; **Restablecer estrategia y finanzas** reinicia controles adicionales. No son equivalentes.

Las modificaciones permanecen en memoria de la página; para conservarlas tras cerrar el navegador debes exportar JSON.

## Privacidad, alcance y limitaciones

El simulador funciona en navegador y no transmite información por una API. GitHub Pages puede publicar el código y los datos del caso. Antes de subir más información, confirma el permiso para divulgar cifras, observaciones operativas, nombres de clientes, formulaciones o información interna.

El código del antiguo artefacto se conserva y se amplía. No se afirma equivalencia con el software de clase. Los modelos nuevos son heurísticos de docencia y análisis, no modelos predictivos calibrados. No se garantiza aprobación empresarial ni beneficios operativos reales sin piloto y soportes.
