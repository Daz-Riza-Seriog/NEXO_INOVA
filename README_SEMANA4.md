# NEXO-INNOVA | Artifact acumulativo · actualización Semana 4

**Base académica:** `NEXO_INNOVA_Libro_Maestro_Financiero(1).xlsx` y `PI2_S4_NEXO_INNOVA_Evaluacion_Financiera_Revision_Argumentada(1).docx` (entregables definitivos, 01/11/2026). Implementación local sin conexión a base de datos ni servidores. **No son resultados reales, aprobaciones ni presupuesto financiero corporativo.**

## Archivos entregados

- `NEXO_INNOVA_S4_Laboratorio_Independiente.html`: abre con doble clic. Es el modelo de Semana 4 completo como laboratorio autónomo, listo para explorar.
- `week4.js` + `week4.css`: extensión para **agregar** las secciones 18, 19 y 20 al Artifact acumulativo de las semanas 1–3.
- `integrar_semana4.py` y `ACTUALIZAR_SEMANA4_WINDOWS.cmd`: generador de **carpeta y ZIP publicables** sin alterar el repositorio remoto. El generador conserva el código anterior.

## Actualización integrada (recomendada)

1. Extrae el ZIP de este kit en un directorio de tu PC con Python 3.
2. Ejecuta `ACTUALIZAR_SEMANA4_WINDOWS.cmd`. Se descargará la versión pública actual de `Daz-Riza-Seriog/NEXO_INOVA` (rama `main`) y se añadirán los dos módulos. El generador produce `NEXO_INNOVA_S4_PUBLICAR/` y `NEXO_INNOVA_S4_PUBLICAR.zip`.
3. Si la versión que deseas conservar **no está publicada** en GitHub, usa primero tus archivos locales de Semana 3: `py -3 integrar_semana4.py --origen "C:\\ruta\\Artifact_Semana3"`.
4. Abre `NEXO_INNOVA_S4_PUBLICAR/index.html` en Edge o Chrome. Verifica las vistas antiguas y las nuevas. El resultado no depende del HTML del profesor.
5. Si deseas actualizar GitHub Pages, **haz una copia o rama de respaldo**, sube a la **raíz** del repositorio los archivos del ZIP y realiza el commit. El kit **no realiza publicaciones por sí solo**.

### Integración manual alternativa

Copia `week4.js` y `week4.css` a la raíz del repositorio. En `index.html`, agrega `<link rel="stylesheet" href="week4.css" />` tras la hoja `week3.css` y `<script defer src="week4.js"></script>` después de `week3.js`. La extensión inserta automáticamente tres pestañas; conserva las anteriores sin sobrescribirlas. Para que el botón **Guardar/Importar JSON** general también incluya Semana 4, añade en `app.js` las llamadas `window.NEXO_WEEK4?.snapshot?.()` y `window.NEXO_WEEK4?.load?.(data.week4)` junto a las de `NEXO_WEEK3`. El generador automático ya incorpora esa modificación.

## Funciones nuevas

**18 · Modelo financiero**: conserva tres escenarios originales con datos separados. Recalcula 37 períodos mensuales, beneficios, inversiones, VPN, TIR E.A., beneficio/costo y payback descontado. Permite modificar tasa de descuento, reducción de iteraciones, volumen elegible, costo unitario, aprovechamiento del tiempo técnico, inversión, capturas y demora de beneficios. Visualiza Curva J (flujo acumulado) y Curva S (inversión y beneficio acumulados). Exporta flujo mensual CSV y estado JSON.

**19 · Sensibilidad**: tornado (una variable a la vez), mapa de calor 5×5 (iteraciones × multiplicador de captura) y puntos de equilibrio de iteraciones y captura. Muestra evidencia necesaria para validar cada parámetro. Una demora de tres meses desplaza expresamente toda la rampa dentro de un horizonte fijo de 36 meses; **esta convención puede producir un resultado distinto a la tabla de estrés del documento cuando aquella utilice otra regla temporal**. No se reemplazan ni corrigen en silencio los resultados de la fuente.

**20 · Evidencia y decisión**: enlaza H1–H6 → entradas de flujo → G0–G3 → fuentes para validar; vínculos directos a indicadores, OKR, hipótesis y piloto. No cambia automáticamente sus estados.

## Referencias numéricas verificadas con el modelo mensual

| Caso | Iteraciones evitadas/desarrollo | Captura años 1/2/3 | VPN COP | TIR E.A. | Payback descontado |
|---|---:|---|---:|---:|---|
| Conservador | 0,15 | 40/65/75 % | −10.687.601 | −26,02 % | No recupera |
| Base | 0,25 | 50/80/90 % | +256.444 | 10,81 % | 35,62 meses |
| Favorable | 0,35 | 60/90/100 % | +12.944.460 | 50,58 % | 24,22 meses |

*Parámetros invariables de referencia:* 15 desarrollos elegibles/mes; costo por iteración COP 266.779,78, incluido COP 220.000 de capacidad técnica; inversión COP 21.427.500 distribuida en meses 0: 3.969.000; 1: 10.620.000; 2: 6.838.500; TIO 10 % E.A. = 0,797414 % mensual, horizonte 36 meses. Captura en meses 3–12, 13–24 y 25–36. Las cifras de referencia se reproducen al ejecutar los cálculos en JavaScript (no son imágenes ni números estáticos sobreimpresos).

**Limitaciones:** el costo técnico es económico/sombra, no un ahorro automático de nómina. Se necesita evidencia de horas reutilizadas en trabajo valioso; una tasa de descuento no ratificada no es el WACC corporativo. No se modelan inflación, impuestos, ventas incrementales ni valor residual. La contingencia se incluye como costo prudente. Los porcentajes del mapa de calor son multiplicadores del valor del beneficio base, no porcentajes reales de adopción ni probabilidades.

El flujo económico de 37 meses es distinto de los períodos del presupuesto de la Curva S. Nunca se mezclan: (a) las versiones estratégicas V0/V1/V2, (b) las tres oportunidades del piloto y (c) los escenarios conservador/base/favorable.

## Control de calidad

Prueba sugerida: al abrir el laboratorio autónomo, seleccionar **Base**. Debe mostrar VPN +$256.444, TIR 10,81 % E.A., payback 35,62 meses y B/C 1,012. Cambiar a **Conservador** debe mostrar VPN negativo y sin recuperación en 36 meses. Editar una captura anual debe recalcular el flujo y el VPN; **Restablecer** revierte los valores del caso seleccionado. El botón Exportar flujo CSV entrega 37 filas de datos (meses 0 a 36).

**Licencias y fuente:** este kit es un complemento original de código para el repositorio del usuario, no una redistribución del código del HTML de la clase. El HTML del profesor se analizó como referencia conceptual y funcional (tipos de visualizaciones y trazabilidad), sin copiar su diseño completo ni sus casos ajenos a NEXO-INNOVA.
