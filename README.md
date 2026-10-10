# NEXO-INNOVA — Laboratorio interactivo PI2 (Semana 1)

Artefacto estático y **autónomo** para el proyecto NEXO-INNOVA de Lintegra Materials S.A.S. Permite explicar y explorar el cambio del Business Model Canvas, la condición de las hipótesis H1–H6 y la gestión de 13 stakeholders mediante una matriz Poder–Interés.

> Versión académica / independiente. **No constituye aprobación organizacional, resultados de ensayos, ni certificación de solidez financiera**. La interfaz y el código son una implementación independiente inspirada en la dinámica didáctica de la clase. No se ha incluido código, logotipos ni contenido protegido del artefacto original del profesor.

## Empezar en el navegador

Abre `index.html` directamente en Chrome, Edge o Firefox. También se puede publicar con GitHub Pages. No necesita Node, npm, API, base de datos, Internet ni claves privadas.

### Publicar en GitHub Pages

1. Crea **un repositorio nuevo** (por ejemplo, `NEXO_INNOVA_PI2`). **No sobrescribas** necesariamente el repositorio del ejemplo de cardanol; puedes conservar ambos.
2. Extrae el ZIP. En GitHub selecciona `Add file → Upload files` y sube **los seis archivos** en la raíz, no la carpeta contenedora.
3. Confirma los cambios (`Commit changes`).
4. En `Settings → Pages → Build and deployment`, elige `Deploy from a branch`, rama `main`, carpeta `/(root)`; guarda los cambios.
5. Usa el enlace de Pages que GitHub genere. Si usas la misma cuenta, el sitio normalmente queda bajo el dominio GitHub Pages de tu usuario, pero verifica la URL real.

**Advertencia sobre divulgación**: GitHub Pages puede hacer públicamente accesibles los datos del caso. Antes de publicarlos, valida si el nombre de la empresa, la información económica o las observaciones sobre coordinación interáreas requieren autorización o anonimización institucional. No hay nombres personales en el ejemplo; sí aparecen cargos, datos de PI1 y hallazgos sensibles del análisis.

## Cómo presentar el artefacto

- **Panorama**: por qué los tres escenarios no son tres negocios nuevos.
- **Actores**: modifica P, I, postura (ND está permitido), R y E; muestra justificación y prueba exigible.
- **Mapa Poder–Interés**: cuadrantes por corte P≥4 e I≥4. **V1 y V2 mantienen las coordenadas originales**, salvo que un usuario simule un cambio.
- **Solidez de supuestos**: separa la cobertura exploratoria de interesados de la validación real de H1–H6.
- **Business Model Canvas**: nueve bloques con V0 y V2; selección de bloque → diferencias, hipótesis y actores.
- **Vínculos**: matriz actor–hipótesis editable y desglose de fórmula auditable.
- **Comparación**: V0 no medido, V1 estimado y V2 propuesto; diferencia de cobertura y pruebas faltantes.
- **Decisión**: lista de gates y tarjeta de salida. Marcar un gate solo significa «supongamos que se cumple».

### Exportar ilustraciones para el informe Word

En las secciones Matriz, Supuestos y Canvas usa **«↓ Exportar SVG»**. El archivo vectorial se puede insertar en Microsoft Word moderno como imagen sin perder nitidez. También puedes utilizar las capturas PNG incluidas como entregables complementarios.

### Exportaciones de datos

- **Guardar JSON**: conserva todos los escenarios, ediciones, vínculos y reflexión, en el equipo local.
- **Importar JSON**: recupera ese trabajo. Importa solo archivos de confianza; el formato se valida y los datos numéricos se acotan.
- **CSV**: tabla de actores y comparación de escenarios con separador `;` apropiado para muchas configuraciones regionales de Excel.
- **Resumen TXT**: un párrafo de evidencia y reflexión para la sustentación.

La información se procesa localmente en el navegador. No se sube a ninguna API.

## Trazabilidad de los datos

Fuente académica prioritaria: documento entregable `NEXO_INNOVA_PI2_S1_Alineacion_Ideas_Stakeholders(1).docx`, **Equipo 4, Proyecto Integrador 2, 10/10/2026**; antecedente Business Case PI1 y sus 12 interesados.

**V0 — PI1 documental**: Canvas original de nueve bloques, matriz de doce interesados, **sin E documentado**; por tanto, no se calcula un porcentaje histórico.

**V1 — PI2 diagnóstico**: se agregan A13 y tres apoyos cualitativos reportados para A01, A03, A13. El poder e interés provienen de PI1 salvo A13 (estimación). La postura de Producción y otros actores es **ND**. Niveles E restantes se estiman con prudencia; no equivalen a entrevistas verificadas.

**V2 — PI2 plan**: propone intensidades E* y pruebas por hipótesis; **no documenta que tales acciones ya ocurrieron**. No se transforma automáticamente ND en apoyo. La autoridad de A13 y toda asignación presupuestal requieren formalización.

### Fórmula académica utilizada (cobertura de involucramiento)

Para cada interesado i:

```
Brechaᵢ = max(0, Rᵢ − Eᵢ)
Cobertura = 100 × [1 − Σ(Pᵢ × Iᵢ × Brechaᵢ)/(3 × Σ(Pᵢ × Iᵢ))]
```

- P e I: escalas de 1 a 5; R y E: intensidad de 1 a 4, E también admite cero en análisis de sensibilidad.
- R es **meta fijada por rol y autoridad en el documento**, no una inferencia algorítmica automática a partir de actitud.
- La fórmula de cobertura es un **índice exploratorio del equipo**, no la fórmula de «solidez de supuestos» del artefacto de clase ni una probabilidad.
- V1 con 13 interesados y niveles estimados: **38,9/100**.
- V2 si las metas E* se ejecutaran: **94,6/100**.
- Por hipótesis se repite la misma cuenta únicamente con actores vinculados; el resultado es un **indicador propio de cobertura por hipótesis**, no la robustez técnica ni comercial de esa hipótesis.
- Clasificaciones cualitativas del entregable: **AC** (apoyo cualitativo), **D** (débil/no validada), **VC** (validación condicionada). V2 usa VC, pero eso no significa «validada».

A08 (Producción) tiene P/I = 4/5 y meta E*=3 frente a R=4. La brecha restante de 1 no se borra artificialmente. H2 exige una prueba de manufacturabilidad y acuerdos operativos, no solo interacción.

H5: evitar 0,25 iteraciones por desarrollo es una hipótesis financiera; VPN base PI1 $256.444 y B/C 1,012, pendientes de contrastar. No puede escalarse automáticamente por mejorar la cobertura.

## Estructura de archivos

```
NEXO_INNOVA_PI2/
├── index.html  # Estructura y navegación por 8 secciones
├── style.css   # Estética y diseño adaptable
├── data.js     # 13 actores, seis hipótesis, nueve bloques, gates
├── app.js      # Estado, cálculo, visualización e import/export
├── README.md   # Uso, modelo, advertencias y publicación
└── LICENSE     # Licencia MIT del código independiente
```

## Personalización segura

En `data.js` actualiza los nombres, roles, pruebas, valores P/I/R/E y los nueve textos del Canvas. Para incorporar nuevas hipótesis, actualiza sus relaciones (`hypotheses`/`actors[].hypotheses`) y sus referencias de bloques. `app.js` calcula dinámicamente con los actores presentes en cada escenario. Las decisiones de la organización deben mantenerse fuera del simulador hasta contar con la autorización y evidencia correspondiente.

### Responsabilidad académica

Se distingue información documentada, conversación reportada, estimación y propuesta. Las categorías, porcentajes y gráficos de este artefacto sirven para estudiar el efecto de la vinculación; la validación de los supuestos debe verificarse por separado.
