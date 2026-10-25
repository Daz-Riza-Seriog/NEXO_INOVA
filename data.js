/*
 * NEXO-INNOVA · Proyecto Integrador 2 · Semana 1
 * Los datos están adaptados del documento académico de alineación de Canvas e interesados.
 * P/I se conservan de PI1 para A01–A12; A13 es estimación explícita.
 * ND significa postura NO determinada; no significa neutralidad ni rechazo.
 * E es estimado en V1; E* en V2 es META, no acción ejecutada.
 */
'use strict';
window.NEXO_DATA = {
  meta: {
    project: 'NEXO-INNOVA', organization: 'Lintegra Materials S.A.S.',
    course: 'Proyecto Integrador · Análisis acumulativo', date: '10 de octubre de 2026',
    subtitle: 'Alineación del Canvas, supuestos críticos y gestión de interesados',
    source: 'NEXO_INNOVA_PI2_S1_Alineacion_Ideas_Stakeholders(1).docx',
    financial: {vpnBase: 256444, bcBase: 1.012, iteraciones: 0.25, desarrollosMensuales: 15}
  },
  scenarioMeta: {
    v0: {short:'Modelo documental', title:'V0 · Línea base documental', desc:'Canvas y matriz original de 12 actores. No hay medición registrada de la vinculación: no se calcula una cobertura histórica.'},
    v1: {short:'Condición estimada', title:'V1 · Condición actual estimada', desc:'Trece actores. Tres apoyos reportados; otras posturas no determinadas y niveles E estimados como hipótesis de trabajo.'},
    v2: {short:'Plan condicionado', title:'V2 · Plan de vinculación propuesto', desc:'Metas E* condicionadas a acuerdos, participación y evidencias. No representan actividades ejecutadas ni aprobación empresarial.'}
  },
  actors: [
    {id:'A01', name:'Presidencia', role:'Patrocinio, recursos y autorización', why:'Su decisión puede habilitar el mandato y acotar inversiones; el respaldo verbal no equivale a sponsor formal.', power:5,interest:5,attitude:2,source:'Conversación reportada', required:4,e1:2,e2:4, actions:'Taller de alcance, límites presupuestales y puertas de decisión.', proof:'Acta de patrocinio, gates y decisión firmada.', hypotheses:['H1','H5']},
    {id:'A02', name:'Gerencias generales', role:'Gobernanza y articulación entre unidades', why:'Deben reconocer responsables, autoridad de decisión y escalamiento sin sustituir áreas técnicas.', power:5,interest:5,attitude:null,source:'Por consultar',required:3,e1:1,e2:3,actions:'Acordar RACI, autoridades, escalamiento y decisiones por gate.',proof:'RACI y registro de acuerdos aprobados.',hypotheses:['H1','H2']},
    {id:'A03', name:'Innovación / jefe de I+D', role:'Dueño funcional del diseño y pruebas', why:'Conecta la evaluación con el portafolio y puede liberar dedicación técnica; apoyo reportado, no autorización operativa total.',power:5,interest:5,attitude:2,source:'Conversación reportada',required:4,e1:2,e2:4,actions:'Cocrear criterios, fichas mínimas, indicadores y gobierno del piloto.',proof:'Flujo AS-IS/TO-BE, criterios y línea base documentada.',hypotheses:['H1','H2','H3','H5']},
    {id:'A04',name:'Gestores de proyecto',role:'Seguimiento, entregables y calidad de datos',why:'Custodian trazabilidad de oportunidades, responsables y decisiones; sin ellos no se puede auditar el modelo.',power:4,interest:5,attitude:null,source:'Por consultar',required:3,e1:1,e2:3,actions:'Diseñar fichas, fuentes, repositorio y seguimiento de gates.',proof:'Fichas completas y control de versiones.',hypotheses:['H1','H3','H5']},
    {id:'A05',name:'Diseño / liderazgo comercial',role:'Valor para el cliente y priorización',why:'Contrasta la propuesta de valor con señales de mercado y puede cuestionar prioridades desconectadas del negocio.',power:5,interest:5,attitude:null,source:'Por consultar',required:3,e1:1,e2:3,actions:'Definir criterios VOC y seleccionar oportunidades piloto.',proof:'Priorización firmada con criterios de cliente.',hypotheses:['H4']},
    {id:'A06',name:'Líderes comerciales',role:'Captura de necesidades del mercado B2B',why:'Aportan clientes, muestras, urgencias y datos que convierten ideas técnicas en oportunidades contrastables.',power:4,interest:5,attitude:null,source:'Por consultar',required:3,e1:1,e2:3,actions:'Estandarizar entrevistas, solicitud y criterio de aceptación.',proof:'Fichas de voz del cliente y evidencias de solicitud.',hypotheses:['H4']},
    {id:'A07',name:'Áreas técnicas y desarrollo',role:'Formulación, laboratorio y escalamiento',why:'Pueden confirmar factibilidad, recursos y reprocesos; la metodología no sustituye el criterio profesional.',power:4,interest:5,attitude:null,source:'Por consultar',required:3,e1:1,e2:3,actions:'Cocrear gates de factibilidad, registro de ensayo y datos mínimos.',proof:'Ensayos y responsables técnicos asignados.',hypotheses:['H2','H3','H5','H6']},
    {id:'A08',name:'Producción',role:'Manufacturabilidad, planta y escalamiento',why:'Existe fricción operativa I+D–Producción; NO se ha verificado oposición a NEXO-INNOVA. Participación temprana evita gates inviables.',power:4,interest:5,attitude:null,source:'Postura no determinada (riesgo operativo)',required:4,e1:1,e2:3,actions:'Entrevista sin culpabilizar; codiseño de gate y mecanismo de discrepancias.',proof:'Acuerdos de manufacturabilidad, escalamiento y discrepancias.',hypotheses:['H2','H6']},
    {id:'A09',name:'Calidad',role:'Conformidad, aceptación y controles',why:'Verifica que la validación de oportunidades contemple ensayos, criterios y restricciones relevantes.',power:3,interest:4,attitude:null,source:'Por consultar',required:2,e1:1,e2:2,actions:'Acordar checklist mínimo y criterio de liberación técnica.',proof:'Checklist técnico/legal por oportunidad piloto.',hypotheses:['H6']},
    {id:'A10',name:'Finanzas / Planeación',role:'Costos, capacidad y sensibilidad financiera',why:'El VPN y el B/C originales son marginales; su contraste es condición para respaldar escalamiento.',power:3,interest:3,attitude:null,source:'Por consultar',required:2,e1:1,e2:2,actions:'Recalcular horas, costos, reducción de iteraciones y retornos.',proof:'Modelo económico contrastado y disponibilidad confirmada.',hypotheses:['H3','H5']},
    {id:'A11',name:'Clientes representativos',role:'VOC, muestras y aceptación B2B',why:'La aceptación del cliente no se infiere desde I+D: se valida con solicitudes y criterios verificables.',power:2,interest:5,attitude:null,source:'Por consultar',required:2,e1:1,e2:2,actions:'Entrevistas focales y codiseño selectivo por caso.',proof:'Solicitud, prueba de muestra y criterio de aceptación.',hypotheses:['H4']},
    {id:'A12',name:'Equipo integrador',role:'Diseño y documentación académica',why:'Articula el análisis y evidencia metodológica, pero no decide por Lintegra ni sustituye responsables internos.',power:3,interest:5,attitude:2,source:'Equipo promotor académico (no sponsor)',required:3,e1:3,e2:3,actions:'Documentar hipótesis, responsables, validaciones y cambios PI1→PI2.',proof:'Versiones, matriz de trazabilidad y acuerdos del curso.',hypotheses:['H1','H3']},
    {id:'A13',name:'Asesor externo / socio',role:'Conocimiento experto e influencia societaria',why:'El apoyo verbal y experiencia directiva son habilitadores; poder 4/5 es estimación y su mandato formal debe ratificarse.',power:4,interest:5,attitude:2,source:'Conversación reportada; P/I estimado',required:4,e1:2,e2:3,actions:'Acordar consultoría, alcance, autoridad y participación por gate.',proof:'Mandato, rol formal y registro de acuerdos.',hypotheses:['H1','H5'], addedInPI2:true}
  ],
  hypotheses: [
    {id:'H1', title:'Gobernanza y adopción', subtitle:'Gates sin sustituir juicio experto', claim:'Es viable adoptar reglas, responsables y puertas de decisión sin sustituir el juicio experto.', blocks:['actividades','propuesta','recursos'], evidence:'Apoyo verbal de Presidencia, jefe I+D y asesor externo; no equivale a autorización.', weakness:'Falta patrocinio formal, RACI y mandato para gates.', action:'Taller directivo; definición de sponsor, autoridad y criterios de excepción.', test:'Acta de patrocinio, roles y autorización de gates.', v1:'AC',v2:'VC'},
    {id:'H2',title:'Interfaz I+D–Producción',subtitle:'Escalamiento y factibilidad compartida',claim:'Producción participará en validación técnica, factibilidad y escalamiento de oportunidades.',blocks:['actividades','recursos','socios'],evidence:'Se reportan desacuerdos operativos previos; no hay prueba de rechazo al proyecto.',weakness:'Sin acuerdo de criterios ni intervención estructurada de planta.',action:'Codiseñar el gate de manufacturabilidad y un protocolo de discrepancias.',test:'Prueba de manufacturabilidad, acuerdos firmados y registro de discrepancias.',v1:'D',v2:'VC'},
    {id:'H3',title:'Datos y capacidad',subtitle:'Trazabilidad utilizable en el piloto',claim:'Existen o podrán habilitarse datos trazables y horas disponibles para el piloto.',blocks:['recursos','actividades','costos'],evidence:'La disponibilidad no se ha verificado en la fuente.',weakness:'Fuentes, campos obligatorios, responsables y dedicación por confirmar.',action:'Fichas mínimas, control de datos y horas por rol.',test:'Al menos 90% de campos críticos completos y disponibilidad confirmada.',v1:'D',v2:'VC'},
    {id:'H4',title:'Voz del cliente / mercado',subtitle:'Priorización por necesidad real',claim:'La voz del cliente permitirá priorizar oportunidades con mercado verificable.',blocks:['segmentos','relaciones','canales','propuesta'],evidence:'En la fuente aún no se documenta VOC validada para el piloto.',weakness:'Falta selección documentada y criterio de aceptación de cliente.',action:'Entrevistas, criterios de selección y muestras con clientes B2B.',test:'Solicitud, muestra y criterio de aceptación documentados.',v1:'D',v2:'VC'},
    {id:'H5',title:'Beneficio económico',subtitle:'0,25 iteraciones evitadas (supuesto)',claim:'Se podrían evitar 0,25 iteraciones por desarrollo, con beneficios netos.',blocks:['costos','ingresos','propuesta','actividades'],evidence:'PI1 modeló el ahorro; VPN base $256.444, B/C 1,012. No es ahorro observado.',weakness:'Rentabilidad marginal, costo por iteración y comparador real pendientes.',action:'Finanzas acuerda métricas y contrasta el piloto frente a una línea base.',test:'Comparador real, VPN actualizado >0 y B/C actualizado >1.',v1:'D',v2:'VC'},
    {id:'H6',title:'Calidad y suministro',subtitle:'Gates con condiciones de viabilidad',claim:'Calidad, suministros y cumplimiento se integrarán a gates proporcionales.',blocks:['socios','actividades','recursos'],evidence:'Checklists técnicos, legales y suministro pendientes de formalizar.',weakness:'Rol de Compras aún no aparece individualizado entre los 13 actores.',action:'Incluir Calidad, desarrollo y compras según criticidad, sin inflar comités.',test:'Checklist legal/técnico y disponibilidad de insumos por caso.',v1:'D',v2:'VC'}
  ],
  canvas: {
    socios:{name:'Socios clave',v0:'Proveedores de materias primas, tecnología y logística; clientes para codesarrollo; laboratorios.',v2:'Proveedores según criticidad y plazo de suministro; clientes piloto con VOC; asesor externo como consultor sujeto a mandato.'},
    actividades:{name:'Actividades clave',v0:'Vigilancia de tendencias; I+D y ensayos; evaluación de iniciativas; producción; calidad y comercialización.',v2:'Captura VOC → filtro inicial → priorización → gates proporcionales → ensayo/transferencia → aprendizaje.'},
    recursos:{name:'Recursos clave',v0:'Capacidad y flexibilidad productiva; conocimiento experto; infraestructura y relaciones B2B.',v2:'Capacidad I+D/planta con responsables; repositorio controlado, línea base y facilitación entre áreas.'},
    propuesta:{name:'Propuesta de valor',v0:'Materiales sintéticos B2B a medida; NEXO-INNOVA ordena evaluación, priorización, gobernanza y seguimiento.',v2:'Mejor selección y coordinación de oportunidades B2B, con decisiones trazables y evidencia de cliente, factibilidad y valor; sin sustituir juicio experto.'},
    relaciones:{name:'Relaciones con clientes',v0:'Relación consultiva B2B, codesarrollo, muestras y VOC.',v2:'Codesarrollo con evidencia, respuesta a feedback y acuerdos interfuncionales.'},
    canales:{name:'Canales',v0:'Fuerza comercial, visitas técnicas, muestras y comunicación digital.',v2:'Equipo comercial, visitas, ensayos y trazabilidad digital con herramientas existentes.'},
    segmentos:{name:'Segmentos de clientes',v0:'Calzado, marroquinería, tapicería, aplicaciones deportivas y transformadores.',v2:'Mismos mercados B2B: calzado, marroquinería, tapicería, deportivo y transformadores; pilotos seleccionados.'},
    costos:{name:'Estructura de costos',v0:'Materias primas, planta, mano de obra, I+D, ensayos, calidad, logística y sistemas.',v2:'Costo operativo existente + horas valorizadas, capacitación y piloto sujeto a aprobación; gate costo-beneficio.'},
    ingresos:{name:'Fuentes de ingresos',v0:'Ventas B2B de materiales por referencia y volumen; el modelo NEXO-INNOVA no tiene ingresos propios.',v2:'Ingresos B2B actuales. Beneficios indirectos esperados: menor iteración y capacidad liberada, aún por comprobar.'}
  },
  canvasDiff: {
    socios:'De aliados generales a aliados con criticidad, plazos y rol explícito del piloto.',
    actividades:'De lista de actividades funcionales a flujo con gates y trazabilidad de decisiones.',
    recursos:'De recursos agregados a capacidad, roles, fuentes y línea base verificables.',
    propuesta:'De mejora prometida a selección sustentada por VOC, factibilidad y evidencia.',
    relaciones:'Del codesarrollo genérico a compromisos de feedback y aceptación documentados.',
    canales:'Se conserva la ruta B2B y se hace visible la trazabilidad digital sin nuevo software.',
    segmentos:'No se inventan nuevos mercados; se seleccionan pilotos representativos.',
    costos:'Las horas, capacitación y límites de presupuesto se convierten en condición de gate.',
    ingresos:'No se adjudican ingresos nuevos: se exige comprobar ahorro indirecto antes de escalar.'
  },
  gates:[
    {label:'Patrocinio formal y mandato de la organización',detail:'Acta aprobada; sponsor, autoridad y limitaciones presupuestales definidos.',code:'H1'},
    {label:'Acuerdo de manufacturabilidad I+D–Producción',detail:'Gate conjunto y protocolo de discrepancias con responsables.',code:'H2'},
    {label:'Adopción del piloto ≥90%',detail:'Indicador de uso real validado en muestra definida; no solo asistencia.',code:'H1'},
    {label:'Datos críticos completos ≥90%',detail:'Fuentes, calidad de datos y disponibilidad de horas confirmadas.',code:'H3'},
    {label:'Decisiones relevantes 100% trazables',detail:'Registro de decisiones y aprobaciones por gate.',code:'H3'},
    {label:'Validación VOC y aceptación de piloto',detail:'Solicitud, muestra o prueba y criterio de aceptación del cliente.',code:'H4'},
    {label:'VPN recalculado >0 y B/C >1',detail:'Comparador real; reducir 0,25 iteraciones sigue siendo hipótesis.',code:'H5'},
    {label:'Riesgos y requisitos técnicos controlados',detail:'Checklists legales, calidad, suministro y controles alto/crítico.',code:'H6'},
    {label:'Aprobación final empresarial documentada',detail:'Firma de la autoridad designada antes de escalamiento.',code:'H1'}
  ]
};
