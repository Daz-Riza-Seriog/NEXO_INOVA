/* NEXO-INNOVA · Extensión gerencial. Datos basados en el entregable estratégico,
   funciones de sensibilidad explícitamente experimentales, SIN certificación. */
(() => {
'use strict';
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const D=window.NEXO_DATA, base=window.NEXO_DEBUG;
const fmt=(n,dec=0)=>Number(n).toLocaleString('es-CO',{maximumFractionDigits:dec,minimumFractionDigits:dec});
const money=n=>(n<0?'−':'')+'$'+fmt(Math.abs(Math.round(n)));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(v,a,b)=>Math.min(b,Math.max(a,Number(v)||0));
const pFactors=[
 {id:'P',name:'Político',base:3,label:'Media',signal:'Política industrial, comercio e instrumentos sectoriales',detail:'Los cambios de comercio y acceso a insumos pueden afectar costos y criterios de entrada al portafolio. No se presupone efecto específico sobre un producto.',response:'Registrar supuestos de origen e insumos; seguimiento Comercial y Compras.',h:['H6','H5'],actor:'A10',type:'Mixto'},
 {id:'E',name:'Económico',base:5,label:'Alta',signal:'Inflación, tasas y desempeño manufacturero agregado',detail:'Documento: IPC anual 6,29 % (sep. 2026), tasa BanRep 12,25 % (sep. 30) y variación real manufacturera −3,7 % (ago.). Ninguno corresponde al WACC o a la demanda propia de Lintegra.',response:'Revisar costos, tasa de evaluación y sensibilidad financiera con Finanzas.',h:['H5','H3'],actor:'A10',type:'Amenaza'},
 {id:'S',name:'Social/mercado',base:5,label:'Alta',signal:'Necesidades B2B diferenciadas por aplicación',detail:'Calzado, tapicería, deportivo y marroquinería demandan atributos distintos; demanda y aceptación requieren VOC por oportunidad.',response:'Solicitudes, muestras y criterios de aceptación documentados con Comercial y clientes.',h:['H4'],actor:'A11',type:'Oportunidad potencial'},
 {id:'T',name:'Tecnológico',base:5,label:'Alta',signal:'Trazabilidad, gobernanza de datos y aprendizaje',detail:'El proyecto propone registro mínimo y gates adaptativos. La referencia ISO 56001:2024 es un marco externo, no certificación de Lintegra.',response:'Prototipar registro y control de versiones con herramientas existentes.',h:['H3','H1'],actor:'A04',type:'Mixto'},
 {id:'A',name:'Ambiental',base:4,label:'Media-alta',signal:'Ecodiseño y trazabilidad en cadenas de clientes',detail:'El Reglamento (UE) 2024/1781 establece un marco regulatorio; su aplicación concreta depende de actos y productos relevantes, no opera automáticamente sobre cada material colombiano.',response:'Verificar requisitos aplicables por mercado, material y cliente.',h:['H6','H4'],actor:'A09',type:'Mixto'},
 {id:'L',name:'Legal',base:5,label:'Alta',signal:'Confidencialidad, datos personales y propiedad intelectual',detail:'Los registros del proyecto no deben divulgar formulaciones ni acuerdos comerciales. Los requisitos específicos deben revisarse con responsables competentes.',response:'Control de acceso por rol, trazabilidad de cambios y revisión legal pertinente.',h:['H1','H6'],actor:'A01',type:'Amenaza'}
];
const forces=[
 {id:'rivalidad',name:'Rivalidad entre competidores',base:5,mechanism:'Competencia por precio, desempeño, plazo, calidad y flexibilidad; alternativas importadas no cuantificadas.',action:'Priorizar oportunidades que ofrezcan una solución diferenciada, con criterio de cliente y desempeño verificable.',h:['H4','H5']},
 {id:'compradores',name:'Poder de compradores',base:4,mechanism:'Clientes transformadores pueden comparar ofertas y solicitar ajustes de material, plazo y precio.',action:'Incorporar voz del cliente, pruebas de muestra y criterios de aceptación antes de profundizar el desarrollo.',h:['H4']},
 {id:'sustitutos',name:'Amenaza de sustitutos',base:4,mechanism:'Distintas tecnologías o composiciones pueden resolver funciones equivalentes. Varía según aplicación.',action:'Vigilar materiales alternativos y ajustar criterios de desempeño, calidad y sostenibilidad.',h:['H4','H6']},
 {id:'entrantes',name:'Amenaza de nuevos entrantes',base:3,mechanism:'Inversión y know-how dificultan acceso, pero importaciones y nichos especializados son alternativas de entrada.',action:'Registrar aprendizaje técnico y conocimiento crítico sin asumir barreras absolutas.',h:['H3','H1']},
 {id:'proveedores',name:'Poder de proveedores',base:3,mechanism:'Resinas, aditivos y sustratos condicionan precio, suministro y factibilidad técnica.',action:'Incorporar verificación de abastecimiento y sensibilidad de costos antes de producción.',h:['H6','H5']}
];
const strategies=[
 {id:'producto',name:'Mejor producto',technical:5,customer:2,system:1,desc:'Compite en calidad, desempeño y competitividad del material. Es una capacidad necesaria, pero competir solo por precio no aprovecha toda la solución B2B.',gap:'Benchmark verificable de atributos, precio y tiempos frente a alternativas.'},
 {id:'cliente',name:'Solución integral al cliente',technical:4,customer:5,system:2,desc:'Integra VOC, diagnóstico, desarrollo, muestras, prueba y transferencia industrial. Es la orientación preferida para VALIDAR según el documento.',gap:'Validar valor percibido, aceptación, necesidad real y preferencia comercial.'},
 {id:'sistema',name:'Consolidación del sistema',technical:2,customer:3,system:1,desc:'Exigiría efectos de red, plataforma, estándar o complementadores. No hay pruebas de esa posición actual ni se plantea como meta del piloto.',gap:'No hay evidencia de plataforma, estándar dominante o red de complementadores.'}
];
const defaultState=()=>({pestel:Object.fromEntries(pFactors.map(f=>[f.id,f.base])),porter:Object.fromEntries(forces.map(f=>[f.id,f.base])),selectedP:'E',selectedForce:'rivalidad',strategy:'cliente',weights:{technical:30,customer:55,system:15},finance:{iterations:0.25,rate:10,realization:100,extraCost:0},evidence:Object.fromEntries(D.hypotheses.map(h=>[h.id,'pending'])),baselineTarget:80,mode:'explorar'});
let s=defaultState(),lastModel=null;
function statusBadge(){return `<span class="state-flag">SIMULACIÓN · NO EVIDENCIA EJECUTADA</span>`}
function pulse(n){return Array.from({length:5},(_,i)=>`<span class="intensity-segment ${i<n?'on':''}"></span>`).join('')}
function finance(){
  const investment=21427500; // Valorización PI1, no desembolso verificado
  const ref=.25,breakEven=.247,vpn=256444,rateRef=10,rate12Vpn=-364332;
  const slope=vpn/(ref-breakEven); // proxy a partir de umbral REDONDEADO, no flujo oficial
  const slopeRate=(rate12Vpn-vpn)/(12-rateRef);
  const effective=s.finance.iterations*(s.finance.realization/100);
  const approx=vpn+(effective-ref)*slope+(s.finance.rate-rateRef)*slopeRate-s.finance.extraCost;
  return {investment,ref,breakEven,vpn,rateRef,rate12Vpn,slope,slopeRate,effective,approx,
    decisions:approx>0?'Indicativamente positivo':'Indicativamente no positivo',
    disclaimer:'Interpolación local anclada al VPN base y a dos sensibilidades de PI1; la pendiente por iteración usa un umbral ≈0,247 redondeado. No sustituye flujos de caja, TIR, B/C ni WACC aprobados.'};
}
function coverage(){return base.coverage(base.getState())}
function evidencePercent(){return D.hypotheses.filter(h=>s.evidence[h.id]==='simulated').length}
function exposures(){return pFactors.filter(f=>s.pestel[f.id]>=4).sort((a,b)=>s.pestel[b.id]-s.pestel[a.id])}
function pressure(){return forces.filter(f=>s.porter[f.id]>=4)}
function relatedFactors(hid){return pFactors.filter(f=>f.h.includes(hid)&&s.pestel[f.id]>=4)}
function relatedForces(hid){return forces.filter(f=>f.h.includes(hid)&&s.porter[f.id]>=4)}
function strategicScore(st){const w=s.weights;return (st.technical*w.technical+st.customer*w.customer+st.system*w.system)/(w.technical+w.customer+w.system||1)}
function crossLinkH(h){return `<button class="cross-link" data-show-h="${esc(h)}">${esc(h)} ↗</button>`}
function impactBadge(lev){return `<span class="severity ${lev>=5?'max':lev>=4?'high':'mid'}">${lev}/5</span>`}
function selectOptions(opts,current){return opts.map(([v,label])=>`<option value="${esc(v)}" ${String(v)===String(current)?'selected':''}>${esc(label)}</option>`).join('')}
function renderPestel(){
 const controls=$('#pestelControls'), f=pFactors.find(x=>x.id===s.selectedP);
 controls.innerHTML=pFactors.map(x=>`<button class="signal-card ${s.selectedP===x.id?'selected':''}" data-pselect="${x.id}">
 <span class="signal-letter">${x.id}</span><span class="signal-main"><b>${x.name}</b><small>${x.signal}</small><span class="intensity-bar">${pulse(s.pestel[x.id])}</span></span>${impactBadge(s.pestel[x.id])}</button>`).join('');
 $('#pestelAnalysis').innerHTML=`<div class="mini-eyebrow">DIMENSIÓN SELECCIONADA · ${f.id}</div><h3>${f.name}</h3><p>${esc(f.detail)}</p><div class="focus-actions"><div><small>INTENSIDAD EN EL ESCENARIO</small><div class="control-flex"><input aria-label="Intensidad PESTEL ${f.name}" type="range" min="1" max="5" step="1" id="pIntensity" value="${s.pestel[f.id]}"><strong>${s.pestel[f.id]}/5</strong></div></div><div><small>IMPLICACIÓN / RESPUESTA</small><p>${esc(f.response)}</p></div><div><small>HIPÓTESIS / RESPONSABLES QUE REVISAR</small><div class="pill-row">${f.h.map(crossLinkH).join('')}<button class="cross-link" data-show-actor="${f.actor}">Actor ${f.actor} ↗</button></div></div></div><div class="model-note">La clasificación original fue <strong>${f.label}</strong>; cambiar la intensidad modifica el escenario exploratorio, no el documento ni los registros empresariales.</div>`;
 renderExecutiveHome();
}
function radarSvg(){
 const cx=220,cy=210,R=140,n=forces.length;
 const polar=(j,v)=>{const ang=-Math.PI/2+2*Math.PI*j/n;return [cx+Math.cos(ang)*R*v/5,cy+Math.sin(ang)*R*v/5]};
 const polygon=v=>v.map((x,j)=>polar(j,x).map(n=>n.toFixed(1)).join(',')).join(' ');
 let t=`<svg class="strategy-svg" viewBox="0 0 560 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Radar editable de las cinco fuerzas de Porter"><rect width="560" height="420" fill="#112839" rx="14"/>`;
 for(let level=1;level<=5;level++)t+=`<polygon points="${polygon(forces.map(()=>level))}" fill="none" stroke="#426270" stroke-width="${level===5?2:1}"/>`;
 forces.forEach((f,j)=>{const [x,y]=polar(j,5.88);const names=[['Rivalidad'],['Compradores'],['Sustitutos'],['Entrantes'],['Proveedores']];t+=`<text x="${x}" y="${y}" text-anchor="middle" fill="#cbe6df" font-size="15" font-weight="600">${names[j][0]}</text>`});
 t+=`<polygon points="${polygon(forces.map(f=>f.base))}" fill="rgba(239,185,107,.07)" stroke="#d5b37c" stroke-dasharray="5,6" stroke-width="2"/>`;
 t+=`<polygon points="${polygon(forces.map(f=>s.porter[f.id]))}" fill="rgba(102,227,181,.19)" stroke="#79e0b7" stroke-width="3"/>`;
 forces.forEach((f,j)=>{const [x,y]=polar(j,s.porter[f.id]);t+=`<circle cx="${x}" cy="${y}" r="5" fill="#9cffdb" stroke="#092321" stroke-width="2"/>`});
 t+=`<text x="18" y="396" fill="#f1d5a5" font-size="12">--- Valoración documental</text><text x="254" y="396" fill="#97ffcd" font-size="12">━ Escenario editable</text></svg>`;
 return t;
}
function renderPorter(){
 $('#porterRadar').innerHTML=radarSvg();
 $('#porterControls').innerHTML=forces.map(f=>`<div class="force-row ${s.selectedForce===f.id?'selected':''}"><button data-fselect="${f.id}" class="force-name">${f.name}</button><input aria-label="Presión simulada: ${f.name}" type="range" min="1" max="5" step="1" data-force="${f.id}" value="${s.porter[f.id]}"><strong>${s.porter[f.id]}/5</strong></div>`).join('');
 const f=forces.find(x=>x.id===s.selectedForce);
 $('#porterAnalysis').innerHTML=`<div class="mini-eyebrow">FUERZA SELECCIONADA</div><h3>${esc(f.name)}</h3><div class="facts-inline"><div><small>HEREDADA DEL DIAGNÓSTICO</small><strong>${f.base}/5</strong></div><div><small>ENSAYO ACTUAL</small><strong>${s.porter[f.id]}/5</strong></div></div><h4>Mecanismo competitivo</h4><p>${esc(f.mechanism)}</p><h4>Respuesta estratégica</h4><p>${esc(f.action)}</p><div class="focus-actions"><small>HIPÓTESIS QUE DEBERÍAN CONTRASTARSE</small><div class="pill-row">${f.h.map(crossLinkH).join('')}</div></div><div class="model-note">Se compara la misma oferta B2B de materiales recubiertos; el índice no es oficial ni una medición independiente del mercado.</div>`;
}
function deltaSvg(){
 const pts={producto:[260,42],cliente:[56,315],sistema:[466,315]}, active=s.strategy;
 const t=`<svg class="strategy-svg" viewBox="0 0 524 410" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Triángulo de posicionamientos del Modelo Delta"><defs><linearGradient id="deltagrad" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#1a4b4c"/><stop offset="1" stop-color="#112c40"/></linearGradient></defs><rect width="524" height="410" rx="15" fill="#112839"/><polygon points="260,65 80,310 440,310" fill="url(#deltagrad)" stroke="#73998d" stroke-width="2"/><circle cx="260" cy="220" r="52" fill="#173b3f" stroke="#66cba9" stroke-dasharray="4 5"/><text x="260" y="211" text-anchor="middle" font-size="14" fill="#99edcd" font-weight="800">CLIENTE</text><text x="260" y="232" text-anchor="middle" font-size="12" fill="#d5eee4">al centro</text>
 ${strategies.map(st=>{const [x,y]=pts[st.id],chosen=active===st.id;return `<circle cx="${x}" cy="${y}" r="${chosen?18:10}" fill="${chosen?'#9af0c9':'#537a86'}" stroke="${chosen?'#e8fff4':'#8eb7b4'}" stroke-width="3"/><title>${esc(st.name)}</title>`}).join('')}
 <text x="260" y="20" text-anchor="middle" font-size="15" font-weight="750" fill="#ddf4ec">MEJOR PRODUCTO</text><text x="84" y="343" text-anchor="middle" font-size="15" font-weight="750" fill="#ddf4ec">SOLUCIÓN INTEGRAL</text><text x="438" y="343" text-anchor="middle" font-size="15" font-weight="750" fill="#ddf4ec">SISTEMA</text><text x="260" y="390" text-anchor="middle" font-size="12" fill="#9ebebd">Punto destacado = hipótesis de posicionamiento seleccionada</text></svg>`;
 return t;
}
function renderDelta(){
 $('#deltaDiagram').innerHTML=`<div class="mini-eyebrow">POSICIONAMIENTO EXPLORADO</div>${deltaSvg()}<div class="model-note">La alternativa de solución integral al cliente es la orientación preferida en el documento; no se da por aprobada corporativamente.</div>`;
 let scores=strategies.map(st=>({...st,score:strategicScore(st)})).sort((a,b)=>b.score-a.score);
 let chosen=strategies.find(st=>st.id===s.strategy);
 $('#deltaControls').innerHTML=`<div class="mini-eyebrow">SIMULADOR DE PRIORIZACIÓN</div><h3>¿Qué estrategia analizamos?</h3><div class="strategy-selectors">${strategies.map(st=>`<button class="strategy-choice ${s.strategy===st.id?'active':''}" data-strategy="${st.id}"><b>${st.name}</b><span>${fmt(strategicScore(st),2)}/5 · ajuste hipotético</span></button>`).join('')}</div><h4>${chosen.name}</h4><p>${chosen.desc}</p><p><strong>Evidencia faltante: </strong>${chosen.gap}</p><div class="mini-eyebrow weights-title">CRITERIOS Y PONDERACIONES · TOTAL FLEXIBLE</div>${[['technical','Desempeño técnico'],['customer','Cercanía y valor cliente'],['system','Ecosistema y red']].map(([key,label])=>`<div class="weight-row"><label for="dw-${key}">${label}</label><input id="dw-${key}" data-dweight="${key}" type="range" min="0" max="100" step="5" value="${s.weights[key]}"><strong>${s.weights[key]}</strong></div>`).join('')}<div class="model-note">Puntajes de ajuste: producto (${scores.find(x=>x.id==='producto').score.toFixed(2)}), cliente (${scores.find(x=>x.id==='cliente').score.toFixed(2)}), sistema (${scores.find(x=>x.id==='sistema').score.toFixed(2)}). Son una <b>heurística explicativa</b> sin calibración. La alternativa sistema sigue sin soporte empírico aunque su peso se modifique.</div><div class="pill-row">${crossLinkH('H4')}${crossLinkH('H1')}</div>`;
}
const inpRange=(key,label,min,max,step,val,f)=>`<div class="range-field"><label for="ff-${key}">${label}<strong id="fv-${key}">${f(val)}</strong></label><input id="ff-${key}" data-fin="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${val}"></div>`;
function financeCurve(){
 const m=finance(),x0=74,x1=940,yt=48,yb=252;
 const X=i=>x0+(i-.10)/.30*(x1-x0);
 const curve=Array.from({length:31},(_,i)=>{const n=.1+i*.01;return {n,value:m.vpn+(n*s.finance.realization/100-.25)*m.slope+(s.finance.rate-10)*m.slopeRate-s.finance.extraCost}});
 const pointsValue=[...curve.map(v=>v.value),0,m.approx];
 const min=Math.floor((Math.min(...pointsValue)-1e6)/5e6)*5e6;
 const max=Math.ceil((Math.max(...pointsValue)+1e6)/5e6)*5e6;
 const Y=v=>yb-(v-min)/(max-min)*(yb-yt);
 const pts=curve.map(v=>[X(v.n),Y(v.value)]);
 let t=`<svg id="financeDiagram" class="strategy-svg" viewBox="0 0 1040 328" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sensibilidad aproximada del VPN a iteraciones evitadas y tasa"><rect width="1040" height="328" rx="13" fill="#102636"/>`;
 for(let value=min;value<=max;value+=5e6){let y=Y(value);t+=`<line x1="74" y1="${y}" x2="940" y2="${y}" stroke="${value===0?'#edb275':'#385569'}" stroke-dasharray="${value===0?'0':'4 7'}"/><text x="65" y="${y+4}" fill="#b4c8ca" text-anchor="end" font-size="12">${fmt(value/1e6,0)}M</text>`}
 for(const n of [.10,.15,.20,.25,.30,.35,.40]){let x=X(n);t+=`<line x1="${x}" y1="${yt}" x2="${x}" y2="${yb}" stroke="#2b4858"/><text x="${x}" y="${yb+22}" text-anchor="middle" font-size="13" fill="#c1ded8">${fmt(n,2)}</text>`}
 t+=`<polyline fill="none" stroke="#84e5c4" stroke-width="4" points="${pts.map(p=>p.join(',')).join(' ')}"/>`;
 const x=X(s.finance.iterations),y=Y(m.approx),labelY=y<75?y+26:y-17;
 t+=`<line x1="${x}" x2="${x}" y1="${yt}" y2="${yb}" stroke="#f2c58e" stroke-dasharray="4 6"/><circle cx="${x}" cy="${y}" r="8" fill="#fff1ce" stroke="#e2b779" stroke-width="4"/><text x="${x}" y="${labelY}" text-anchor="middle" fill="#ffe7bd" font-size="15" font-weight="800">${money(m.approx)}</text>`;
 t+=`<text x="510" y="311" fill="#d0e5dc" font-size="14" text-anchor="middle">Iteraciones evitadas por desarrollo (escenario)</text></svg>`;
 return t;
}
function renderFinance(){const m=finance(), v=s.finance,anchorColor=m.approx>=0?'good-text':'bad-text';
 $('#financeView').innerHTML=`<div class="finance-summary"><article class="fact-box"><small>VPN BASE DOCUMENTAL · 10% E.A.</small><strong>${money(256444)}</strong><span>HIPÓTESIS 0,25 · NO REALIZADO</span></article><article class="fact-box"><small>VPN INDICATIVO DEL ENSAYO</small><strong class="${anchorColor}">${money(m.approx)}</strong><span>PROXY, NO RECÁLCULO AUDITADO</span></article><article class="fact-box"><small>ITERACIÓN EFECTIVA</small><strong>${fmt(m.effective,3)}</strong><span>AJUSTADA POR REALIZACIÓN DEL BENEFICIO</span></article><article class="fact-box"><small>UMBRAL BASE PI1</small><strong>≈ 0,247</strong><span>REFERENCIA REDONDEADA</span></article></div>
 <div class="strategy-layout finance-section"><div class="panel"><div class="mini-eyebrow">ANÁLISIS WHAT-IF</div><div class="preset-buttons"><button data-preset="conservador" class="btn btn-outline">Conservador · 0,15</button><button data-preset="base" class="btn btn-outline">Base · 0,25</button><button data-preset="favorable" class="btn btn-outline">Favorable · 0,35</button></div>
 ${inpRange('iterations','Iteraciones evitadas/desarrollo',.10,.40,.005,v.iterations,x=>fmt(x,3))}
 ${inpRange('rate','Tasa de descuento exploratoria (% E.A.)',8,14,.25,v.rate,x=>fmt(x,2)+' %')}
 ${inpRange('realization','Realización del beneficio modelado',40,120,5,v.realization,x=>fmt(x)+' %')}
 ${inpRange('extraCost','Costo incremental en valor presente (COP)',0,2000000,50000,v.extraCost,money)}
 <div class="model-note"><b>Parámetros documentados:</b> inversión valorizada PI1 ${money(m.investment)} a 36 meses, VPN base ${money(m.vpn)}, TIR 10,81 %, B/C 1,012. Son antecedentes fijos, no se reestiman con estos controles.</div></div>
 <div class="panel"><div class="mini-eyebrow">CÓMO INTERPRETAR EL MODELO</div><h3>${m.approx>0?'Valor económico indicativamente positivo':'Valor económico indicativamente no positivo'}</h3><p>En este experimento, el VPN aproxima ${money(m.approx)} con una tasa del ${fmt(v.rate,2)} % E.A., ${fmt(v.iterations,3)} iteraciones potencialmente evitadas y ${fmt(v.realization)} % de realización del beneficio.</p><div class="model-note">${esc(m.disclaimer)}</div><h4>Regla visible</h4><code class="formula-inline">VPN* = 256.444 + (n × realización − 0,25) × 85.481.333 − (tasa% − 10) × 310.388 − costo adicional</code><p><small>Los coeficientes aproximados provienen del VPN base, umbral redondeado y comparación a 12 % reportados, no de flujos originales. Solo orientan sensibilidad local; una decisión real requiere el Excel financiero, costos y tasa aprobados por Finanzas.</small></p><div class="pill-row">${crossLinkH('H5')}<button class="cross-link" data-show-actor="A10">Finanzas A10 ↗</button></div></div></div><div class="panel finance-chart"><div class="mini-eyebrow">VPN* APROXIMADO FRENTE A ITERACIONES EVITADAS</div>${financeCurve()}<div class="model-note">La curva se calcula para la tasa, realización y costo del escenario activo; el punto marcado corresponde a la cantidad elegida. Gráfico educativo, no evaluación definitiva.</div></div>`;
}
function renderBsc(){const m=finance(),c=coverage(),ev=evidencePercent(),gates=base.getGates();
 const perspectives=[
 {name:'Financiera',icon:'$',kpi:'VPN* de sensibilidad',value:money(m.approx),status:m.approx>0?'Proyección favorable':'Revisar supuesto económico',note:'No confundir VPN* ilustrativo con VPN aprobado.',h:'H5',metric:'H5 · Valor económico verificado'},
 {name:'Clientes',icon:'◎',kpi:'Evidencia simulada de VOC',value:s.evidence.H4==='simulated'?'Prueba marcada':s.evidence.H4==='review'?'En revisión':'No verificada',status:'H4 · No se infieren ventas',note:'Tres oportunidades piloto no equivalen a tres escenarios financieros.',h:'H4',metric:'% aceptación y VOC documentada'},
 {name:'Procesos internos',icon:'⇆',kpi:'Cobertura de interesados',value:c===null?'N/D':fmt(c,1)+' %',status:'Índice exploratorio, no adopción',note:'H2 requiere manufacturabilidad; H3 exige trazabilidad y dedicación.',h:'H2',metric:'Tiempo oportunidad→decisión; % gates documentados'},
 {name:'Aprendizaje y capacidad',icon:'◈',kpi:'Hipótesis con prueba simulada',value:ev+'/6',status:'Marcadas por usuario, NO auditadas',note:'Aprendizaje, datos, gestión del cambio y capacidad a validar.',h:'H3',metric:'Completitud de datos y adopción del piloto'}
 ];
 $('#bscView').innerHTML=`<div class="bsc-grid">${perspectives.map((p,i)=>`<article class="panel bsc-card"><div class="bsc-top"><span class="bsc-icon">${p.icon}</span><span>0${i+1} · ${p.name}</span></div><div class="mini-eyebrow">${p.kpi}</div><strong class="bsc-number">${esc(p.value)}</strong><p>${p.status}</p><div class="bsc-foot"><small>INDICADOR DE PILOTO PROPUESTO</small><p>${esc(p.metric)}</p><small>${p.note}</small><div class="pill-row">${crossLinkH(p.h)}</div></div></article>`).join('')}</div><div class="panel"><h3>Cómo conectar los indicadores</h3><p>Se recomienda medir línea base y metas de adopción (≥90 %), completitud (≥90 %) y decisiones trazables (100 %) antes de concluir resultados. Estos criterios aparecen en la propuesta académica como puertas de validación, no como logros del piloto.</p><p>Gates señalados por el usuario: <strong>${gates.length}/9</strong>. No representan firmas, reuniones o pruebas ocurridas.</p></div>`;
}
function hypothesisHTML(){return D.hypotheses.map(h=>{
 const v=s.evidence[h.id],fact=relatedFactors(h.id),force=relatedForces(h.id),cov=base.coverage(base.getState(),h.id);
 return `<article class="h-manager-card"><div class="h-manager-top"><div><b>${h.id} · ${esc(h.title)}</b><small>Cobertura de vinculación: ${cov===null?'N/D':fmt(cov,1)+' %'}</small></div><select aria-label="Evidencia simulada ${h.id}" data-evidence="${h.id}" class="input"><option value="pending" ${v==='pending'?'selected':''}>Sin prueba documentada</option><option value="review" ${v==='review'?'selected':''}>Prueba en revisión (ensayo)</option><option value="simulated" ${v==='simulated'?'selected':''}>Suponer prueba superada</option></select></div><p><b>Verificación requerida:</b> ${esc(h.test)}</p><div class="h-signals"><small>${fact.length?`PESTEL: ${fact.map(f=>f.id).join(', ')}`:'PESTEL: sin alerta alta seleccionada'}</small><small>${force.length?`Porter: ${force.map(f=>f.name).join(', ')}`:'Porter: sin alerta alta seleccionada'}</small></div></article>`}).join('')}
function decide(){const m=finance(),c=coverage(),g=base.getGates(),goodEvidence=D.hypotheses.every(h=>s.evidence[h.id]==='simulated'),completeGates=g.length===D.gates.length,cover=c!==null&&c>=s.baselineTarget,positive=m.approx>0;
 let headline,kind,reason;
 if(c===null){kind='warning';headline='No evaluable desde la referencia documental';reason='La versión V0 no registró niveles de vinculación E; no es válido reconstruir una cobertura histórica ni dictaminar el despliegue a partir de este punto de partida.'}
 else if(!positive){kind='negative';headline='No autorizar despliegue';reason='La aproximación económica deja de ser positiva en este escenario. Se debe recalcular el modelo financiero y comprobar ahorro de capacidad antes de comprometer recursos.'}
 else if(s.strategy==='sistema'){kind='warning';headline='Replantear posicionamiento no sustentado';reason='La consolidación del sistema carece de evidencia de plataforma, estándares o red de complementadores. No se recomienda presentarla como posición adoptada, incluso cuando la sensibilidad económica del piloto sea positiva.'}
 else if(!cover){kind='warning';headline='Ajustar la vinculación';reason='La cobertura exploratoria del escenario está por debajo del umbral experimental elegido. Requiere intervención priorizada de actores, sin atribuir resistencia a quienes mantienen postura ND.'}
 else if(!completeGates||!goodEvidence){kind='warning';headline='Avanzar solo a validación condicionada';reason='La interacción y la sensibilidad económica no reemplazan actas, pruebas, datos de piloto, calidad ni aprobación formal. Falta confirmar gates o evidencia.'}
 else {kind='positive';headline='Candidato a revisión de autorización (ensayo)';reason='Todas las condiciones están marcadas únicamente en simulación. En la práctica deben existir soportes, validación del flujo financiero y aprobación empresarial.'}
 return {m,c,goodEvidence,completeGates,cover,positive,headline,kind,reason,gates:g.length};
}
function rankedHypotheses(){return D.hypotheses.map(h=>({h,pressure:relatedFactors(h.id).length+relatedForces(h.id).length,pending:s.evidence[h.id]!=='simulated'})).sort((a,b)=>(b.pressure+Number(b.pending))-(a.pressure+Number(a.pending))).slice(0,3)}
function composeSummary(){const d=decide(),m=finance();return [
'\nDIAGNÓSTICO ESTRATÉGICO (ESCENARIO SIMULADO)',
'PESTEL intenso: '+exposures().map(f=>f.id+'='+s.pestel[f.id]).join(', '),
'Porter alto: '+pressure().map(f=>f.name+'='+s.porter[f.id]).join(' | '),
'Delta seleccionado: '+strategies.find(st=>st.id===s.strategy).name,
'VPN* indicativo: '+money(m.approx)+' | Iteraciones: '+s.finance.iterations+' | Tasa: '+s.finance.rate+' % E.A.',
'Cobertura: '+(d.c===null?'N/D':fmt(d.c,1)+' %')+' | Evidencia simulada '+evidencePercent()+'/6 | Gates '+d.gates+'/9',
'Recomendación automática: '+d.headline+' | '+d.reason,
'Advertencia: interpretaciones y controles de escenario NO equivalen a aprobación, pruebas verificadas o flujos auditados.'
].join('\n')}
function renderManagement(){const d=decide(),v=d.c===null?'N/D':fmt(d.c,1)+' %';
 $('#managementView').innerHTML=`<div class="decision-hero ${d.kind}"><div class="mini-eyebrow">RECOMENDACIÓN AUTOMÁTICA · NO AUTORIZACIÓN</div><h2>${d.headline}</h2><p>${d.reason}</p><div class="decision-pills"><span>VPN* ${money(d.m.approx)}</span><span>Cobertura ${v}</span><span>Pruebas simuladas ${evidencePercent()}/6</span><span>Gates ${d.gates}/9</span></div></div>
 <div class="strategy-layout decision-columns"><div class="panel"><div class="mini-eyebrow">MODIFICAR EVIDENCIAS</div><h3>¿Qué supuestos podemos contrastar?</h3><p>Los selectores representan un <strong>experimento</strong>. No alteran la evidencia declarada en el documento de la Semana 1.</p><div class="h-manager-list">${hypothesisHTML()}</div></div>
 <div class="strategy-stack"><div class="panel"><div class="mini-eyebrow">REGLAS DE DECISIÓN</div><h3>Condiciones auditables</h3><div class="rule-list">
 <div><span class="rule-dot ${d.positive?'yes':'no'}"></span><b>VPN* aproximado positivo</b><small>${d.positive?'Superado en ensayo':'No superado en ensayo'}</small></div>
 <div><span class="rule-dot ${d.cover?'yes':'no'}"></span><b>Cobertura de vinculación ≥ ${s.baselineTarget} %</b><small>Umbral experimental, no meta del curso</small></div>
 <div><span class="rule-dot ${d.goodEvidence?'yes':'no'}"></span><b>H1–H6 con prueba superada</b><small>Marcas simuladas, no expediente</small></div>
 <div><span class="rule-dot ${d.completeGates?'yes':'no'}"></span><b>Nueve gates señalados</b><small>${d.gates}/9 · Revisión en el módulo Gates</small></div></div>
 <label class="threshold-label" for="coverageThreshold">Umbral experimental de cobertura <strong>${s.baselineTarget} %</strong></label><input id="coverageThreshold" type="range" min="40" max="100" step="5" value="${s.baselineTarget}">
 <button class="btn btn-outline" data-go="decisiones">Revisar gates y reflexiones ↗</button></div>
 <div class="panel"><div class="mini-eyebrow">AGENDA DE VALIDACIÓN PRIORIZADA</div><h3>¿Qué revisar primero?</h3><p>Orden exploratorio: cantidad de señales PESTEL/Porter intensas vinculadas y estado de prueba pendiente. No equivale a matriz de riesgos calibrada.</p><div class="rule-list">${rankedHypotheses().map(v=>`<div><span class="rule-dot ${v.pending?'no':'yes'}"></span><b>${v.h.id} · ${esc(v.h.title)}</b><small>${v.pressure} señales de contexto intensas · ${v.pending?'prueba pendiente/hipotética':'prueba supuesta superada'}</small></div>`).join('')}</div></div>
 <div class="panel"><div class="mini-eyebrow">CONTEXTO ESTRATÉGICO</div><p><b>Posicionamiento:</b> ${esc(strategies.find(x=>x.id===s.strategy).name)}.</p><p><b>Señales PESTEL de intensidad 4–5:</b> ${exposures().map(x=>x.id).join(', ')||'ninguna'}.</p><p><b>Fuerzas Porter de presión 4–5:</b> ${pressure().map(x=>x.name).join('; ')||'ninguna'}.</p><p class="model-note">Las amenazas alimentan la agenda de validación; no se suman artificialmente al VPN, a la cobertura ni a la probabilidad de éxito.</p></div>
 <div class="panel"><h3>Gestión del experimento</h3><p>Exporta el escenario desde <b>Guardar JSON</b> (barra superior), incluyendo estos módulos. Se conserva también la posibilidad de importar archivos antiguos del artefacto.</p><button id="resetStrategy" class="btn btn-outline">↺ Restablecer estrategia y finanzas</button></div></div></div>`;
}
function renderExecutiveHome(){const root=$('#executiveHome');if(!root)return;const m=finance(),c=coverage();root.innerHTML=`<div class="executive-title"><div class="mini-eyebrow">VISIÓN EJECUTIVA · EXPERIENCIA INTERACTIVA</div><h3>Cuatro preguntas para decidir mejor</h3></div><div class="executive-cards"><button data-go="entorno"><small>01 · ENTORNO</small><b>${exposures().length} señales intensas</b><span>¿Qué factores externos exigen validación?</span></button><button data-go="porter"><small>02 · COMPETENCIA</small><b>${pressure().length} fuerzas 4–5</b><span>¿Cómo responder a la presión B2B?</span></button><button data-go="delta"><small>03 · POSICIONAMIENTO</small><b>${esc(strategies.find(x=>x.id===s.strategy).name)}</b><span>¿Qué valor propone NEXO-INNOVA?</span></button><button data-go="gerencia"><small>04 · DECISIÓN</small><b>${money(m.approx)} · VPN*</b><span>${c===null?'N/D':fmt(c,1)+' %'} de cobertura exploratoria</span></button></div><div class="model-note">Los valores variables pertenecen a un escenario de simulación. Para lecturas oficiales consultar los documentos académicos y pruebas de empresa.</div>`;}
function renderAll(){renderPestel();renderPorter();renderDelta();renderFinance();renderBsc();renderManagement();renderExecutiveHome()}
function saveText(filename,content,mime='text/plain;charset=utf-8'){const blob=new Blob([content],{type:mime}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500)}
function svgExport(file,svg){saveText(file,svg,'image/svg+xml;charset=utf-8')}
function exportPestel(){let out=`<svg xmlns="http://www.w3.org/2000/svg" width="1060" height="600" viewBox="0 0 1060 600"><rect width="1060" height="600" fill="#102839"/><text x="35" y="54" fill="#e7fff2" font-size="28" font-family="Arial" font-weight="bold">NEXO-INNOVA · Matriz PESTEL</text><text x="35" y="84" fill="#b8d7ce" font-size="15" font-family="Arial">Intensidad cualitativa del escenario · 1–5 · No es medición pública</text>`;
 pFactors.forEach((f,i)=>{const x=i%3*344+35,y=Math.floor(i/3)*215+116;out+=`<rect x="${x}" y="${y}" width="325" height="190" rx="13" fill="#163847" stroke="#396b69"/><text x="${x+18}" y="${y+40}" font-size="27" font-weight="bold" fill="#89e9c6" font-family="Arial">${f.id}</text><text x="${x+61}" y="${y+39}" font-size="19" fill="#e8f8f0" font-family="Arial">${esc(f.name)}</text><text x="${x+20}" y="${y+87}" font-size="35" font-weight="bold" fill="#ffe4ad" font-family="Arial">${s.pestel[f.id]}/5</text><text x="${x+20}" y="${y+130}" font-size="13" fill="#a9c7c4" font-family="Arial">Hipótesis ${f.h.join(' · ')}</text><text x="${x+20}" y="${y+157}" font-size="13" fill="#a9c7c4" font-family="Arial">Base: ${f.label}</text>`});out+=`<text x="35" y="578" font-family="Arial" font-size="13" fill="#aac9c3">Escenario ilustrativo basado en documento académico; conservar trazabilidad de fuentes.</text></svg>`;svgExport('nexo_pestel_simulacion.svg',out)}
function exportPorter(){svgExport('nexo_porter_simulacion.svg',radarSvg())}
function exportDelta(){svgExport('nexo_delta_simulacion.svg',deltaSvg())}
function exportFinance(){svgExport('nexo_sensibilidad_financiera_proxy.svg',financeCurve())}
function csvCell(a){return '"'+String(a??'').replace(/"/g,'""')+'"'}
function exportCSV(which){const f=finance();let rows=which==='bsc'?[['Perspectiva','Indicador','Escenario','Tipo'],['Financiera','VPN indicativo',f.approx,'Proxy no auditado'],['Clientes','H4',s.evidence.H4,'Ensayo'],['Procesos','Cobertura',coverage(),'Índice exploratorio'],['Aprendizaje','Pruebas simuladas',evidencePercent(),'Ensayo']]:[
 ['Concepto','Valor','Naturaleza'],['VPN documental',f.vpn,'Documento PI1'],['VPN proxy',f.approx,'Sensibilidad aproximada'],['Iteraciones',s.finance.iterations,'Escenario'],['Tasa E.A.',s.finance.rate,'Escenario'],['Realización',s.finance.realization,'Escenario'],['Costo incremental',s.finance.extraCost,'Supuesto'],['Posicionamiento',s.strategy,'Simulación'],['Cobertura',coverage(),'Índice exploratorio'],...D.hypotheses.map(h=>[h.id,s.evidence[h.id],'Estado introducido por usuario (simulación)']),...pFactors.map(x=>['PESTEL '+x.id,s.pestel[x.id],'Escenario']),...forces.map(x=>['Porter '+x.name,s.porter[x.id],'Escenario'])];
 saveText(which==='bsc'?'nexo_bsc.csv':'nexo_gerencia.csv','\uFEFF'+rows.map(r=>r.map(csvCell).join(';')).join('\r\n'),'text/csv;charset=utf-8')}
function snapshot(){return JSON.parse(JSON.stringify(s))}
function load(v){if(!v||typeof v!=='object'){s=defaultState();renderAll();return}
 const z=defaultState();for(const f of pFactors)z.pestel[f.id]=clamp(v.pestel?.[f.id]??f.base,1,5);
 for(const f of forces)z.porter[f.id]=clamp(v.porter?.[f.id]??f.base,1,5);
 z.selectedP=pFactors.some(f=>f.id===v.selectedP)?v.selectedP:'E';z.selectedForce=forces.some(f=>f.id===v.selectedForce)?v.selectedForce:'rivalidad';
 z.strategy=strategies.some(x=>x.id===v.strategy)?v.strategy:'cliente';for(const k of Object.keys(z.weights))z.weights[k]=clamp(v.weights?.[k]??z.weights[k],0,100);
 z.finance.iterations=clamp(v.finance?.iterations??.25,.1,.4);z.finance.rate=clamp(v.finance?.rate??10,8,14);z.finance.realization=clamp(v.finance?.realization??100,40,120);z.finance.extraCost=clamp(v.finance?.extraCost??0,0,2e6);
 for(const h of D.hypotheses)z.evidence[h.id]=['pending','review','simulated'].includes(v.evidence?.[h.id])?v.evidence[h.id]:'pending';z.baselineTarget=clamp(v.baselineTarget??80,40,100);
 s=z;renderAll();}
function bind(){
 document.addEventListener('click',e=>{
  const p=e.target.closest('[data-pselect]');if(p){s.selectedP=p.dataset.pselect;renderPestel()}
  const f=e.target.closest('[data-fselect]');if(f){s.selectedForce=f.dataset.fselect;renderPorter()}
  const st=e.target.closest('[data-strategy]');if(st){s.strategy=st.dataset.strategy;renderDelta();renderManagement();renderExecutiveHome()}
  const pres=e.target.closest('[data-preset]');if(pres){const it={conservador:.15,base:.25,favorable:.35}[pres.dataset.preset];s.finance.iterations=it;renderFinance();renderBsc();renderManagement();renderExecutiveHome()}
  if(e.target.id==='resetStrategy'){s=defaultState();renderAll()}
  if(e.target.closest('[data-scenario]')||e.target.closest('#resetButton')||e.target.closest('[data-gate]'))setTimeout(()=>{renderBsc();renderManagement();renderExecutiveHome()},0);
 });
 document.addEventListener('change',e=>{
  const p=e.target.closest('[data-force]');if(p){s.porter[p.dataset.force]=clamp(p.value,1,5);renderPorter();renderManagement();renderExecutiveHome()}
  if(e.target.id==='pIntensity'){s.pestel[s.selectedP]=clamp(e.target.value,1,5);renderPestel();renderManagement();renderExecutiveHome()}
  const dw=e.target.closest('[data-dweight]');if(dw){s.weights[dw.dataset.dweight]=clamp(dw.value,0,100);renderDelta();renderManagement()}
  const ff=e.target.closest('[data-fin]');if(ff){s.finance[ff.dataset.fin]=Number(ff.value);renderFinance();renderBsc();renderManagement();renderExecutiveHome()}
  if(e.target.id==='coverageThreshold'){s.baselineTarget=clamp(e.target.value,40,100);renderManagement()}
  const h=e.target.closest('[data-evidence]');if(h){s.evidence[h.dataset.evidence]=h.value;renderManagement();renderBsc()}
  if(e.target.closest('#actorsBody')||e.target.closest('#linksHost')||e.target.closest('#gatesHost'))setTimeout(()=>{renderManagement();renderBsc();renderExecutiveHome()},0);
 });
 document.addEventListener('input',e=>{
  if(e.target.id==='pIntensity'){const el=e.target.nextElementSibling;if(el)el.textContent=e.target.value+'/5'}
  const dw=e.target.closest('[data-dweight]');if(dw){const el=dw.nextElementSibling;if(el)el.textContent=dw.value}
  const ff=e.target.closest('[data-fin]');if(ff){const key=ff.dataset.fin;const label=$('#fv-'+key);if(label)label.textContent=key==='iterations'?fmt(ff.value,3):key==='rate'?fmt(ff.value,2)+' %':key==='realization'?fmt(ff.value)+' %':money(ff.value)}
  if(e.target.id==='coverageThreshold'){const el=e.target.previousElementSibling?.querySelector('strong');if(el)el.textContent=e.target.value+' %'}
 });
 $('#pestelSVG').addEventListener('click',exportPestel);$('#porterSVG').addEventListener('click',exportPorter);$('#deltaSVG').addEventListener('click',exportDelta);$('#financeSVG').addEventListener('click',exportFinance);
 $('#bscCSV').addEventListener('click',()=>exportCSV('bsc'));$('#strategicCSV').addEventListener('click',()=>exportCSV('all'));
}
window.NEXO_STRATEGY={snapshot,load,finance,decide,composeSummary,getState:()=>s,renderAll};bind();renderAll();
})();
