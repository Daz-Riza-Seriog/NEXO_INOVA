/* NEXO-INNOVA — Semana 3 · BSC, OKR y validación; complemento no destructivo.
   Los valores de las fichas son PROPUESTAS ACADÉMICAS; los registros creados en
   esta interfaz son SIMULACIONES, nunca mediciones institucionales. */
(() => {
'use strict';
const $ = s => document.querySelector(s);
const safe = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = (v,d=1) => Number(v).toLocaleString('es-CO',{minimumFractionDigits:d,maximumFractionDigits:d});
const currency = n => (n < 0 ? '−' : '+') + '$' + Math.abs(Math.round(n)).toLocaleString('es-CO');
const kpis = [
 {id:'A1',p:'Aprendizaje',title:'Roles críticos ratificados',unit:'%',type:'fraction',f:'100 × roles RACI aprobados / roles críticos',target:'100 % antes del piloto',why:'Actas y RACI firmados; no basta elaborar la matriz.',h:['H1'],kr:['O4-KR1']},
 {id:'A2',p:'Aprendizaje',title:'Usuarios habilitados',unit:'%',type:'fraction',f:'100 × usuarios con prueba aprobada / usuarios previstos',target:'100 % antes de utilizar el flujo',why:'Prueba práctica de usuario por rol.',h:['H3'],kr:['O4-KR2']},
 {id:'P1',p:'Procesos',title:'Tiempo hasta decisión',unit:'días',type:'number',f:'Mediana de días entre recepción de oportunidad y decisión',target:'Disminuir respecto de una línea base comparable',why:'Fechas verificables de inicio y decisión. No inventar mediana.',h:['H3'],kr:['O4-KR3']},
 {id:'P2',p:'Procesos',title:'Iteraciones evitables por caso',unit:'iter./caso',type:'fraction',f:'Retrabajos evitables registrados / casos desarrollados',target:'Reducir frente a línea base; 0,25 es supuesto económico',why:'Clasificar causas; evitar contar ajustes necesarios como retrabajos.',h:['H3'],kr:['O4-KR3']},
 {id:'P3',p:'Procesos',title:'Gates documentados',unit:'%',type:'fraction',f:'100 × gates con evidencia / gates aplicables',target:'100 %; sin excepciones injustificadas',why:'Decisión, fecha, autoridad, criterios y versión.',h:['H1','H2'],kr:['O2-KR1','O2-KR3']},
 {id:'P4',p:'Procesos',title:'Factibilidad técnica firmada',unit:'%',type:'fraction',f:'100 × verificaciones aprobadas / verificaciones requeridas',target:'100 % de verificaciones aplicables',why:'Calidad, Producción y Compras cuando corresponda.',h:['H2','H6'],kr:['O2-KR2']},
 {id:'C1',p:'Clientes',title:'Oportunidades con VOC',unit:'%',type:'fraction',f:'100 × casos con VOC / casos piloto evaluados',target:'3/3 casos con necesidad y criterio documentados',why:'VOC = voz del cliente. No equivale a aceptación.',h:['H4'],kr:['O1-KR1','O1-KR3']},
 {id:'C2',p:'Clientes',title:'Aceptación de primera muestra',unit:'%',type:'fraction',f:'100 × primeras muestras aceptadas / primeras evaluadas',target:'≥ 2/3 (66,7 %) · umbral académico NO aprobado',why:'Aceptación firmada y línea base antes de ratificar la meta.',h:['H4'],kr:['O1-KR2']},
 {id:'F1',p:'Financiera',title:'VPN del piloto',unit:'COP',type:'number',f:'Σ FCₜ /(1+r)ᵗ − inversión inicial',target:'VPN > 0 con tasa ratificada y escenario adverso',why:'Cargar resultado desde flujo auditado, no calcular desde un KPI aislado.',h:['H5'],kr:['O3-KR1','O3-KR3']},
 {id:'F2',p:'Financiera',title:'Beneficio comprobable',unit:'%',type:'fraction',f:'100 × beneficio monetizable soportado / beneficio reconocido',target:'100 % del beneficio reconocido tiene soporte',why:'No convertir horas liberadas en dinero sin monetización real o reasignación comprobable.',h:['H5'],kr:['O3-KR2']}
];
const okrs = [
 {id:'O4',title:'Adopción y aprendizaje',subtitle:'Capacidades y registros mínimos que realmente se utilizan.',p:'Aprendizaje',krs:[
  ['KR1','100 % de roles críticos con RACI ratificada','A1','Acta de gobierno'],
  ['KR2','100 % de usuarios piloto con prueba aprobada','A2','Evidencia de formación y prueba'],
  ['KR3','3 casos con bitácora y lecciones aprendidas','P1 · P2','Registro de decisiones y aprendizajes']]},
 {id:'O2',title:'Gobierno sin burocracia',subtitle:'Decidir más rápido sin omitir validaciones necesarias.',p:'Procesos',krs:[
  ['KR1','100 % de gates críticos documentados','P3','Registro y aprobación'],
  ['KR2','100 % de verificaciones técnicas firmadas','P4','Checklist técnico'],
  ['KR3','0 excepciones de gate sin autorización','P3','Registro de excepciones']]},
 {id:'O1',title:'Pertinencia para el cliente',subtitle:'Priorizar necesidades externas verificables.',p:'Clientes',krs:[
  ['KR1','3 oportunidades con VOC y necesidades verificables','C1','Ficha VOC / Comercial'],
  ['KR2','≥ 2 de 3 primeras muestras aceptadas *','C2','Acta de muestra / cliente'],
  ['KR3','1 protocolo Comercial–I+D con criterios de aceptación','C1 · C2','Acuerdo de pruebas']]},
 {id:'O3',title:'Rentabilidad defendible',subtitle:'Atribuir solo beneficios realmente soportados.',p:'Financiera',krs:[
  ['KR1','1 revisión financiera ratificada','F1','Acta de Finanzas'],
  ['KR2','100 % de beneficios reconocidos y respaldados','F2','Conciliación beneficio/costo'],
  ['KR3','1 dictamen VPN > 0 con estrés adverso documentado','F1','Escenarios y firma']]}
];
const hypotheses = [
 {id:'H1',title:'Gobierno y gates',desc:'Patrocinio formal, autoridad RACI y escalamiento documentado.',kpi:'A1 · P3',okr:'O2 · O4',who:'Dirección + I+D',g:'G0'},
 {id:'H2',title:'Producción',desc:'Manufacturabilidad, traspaso y cero bypass técnico.',kpi:'P3 · P4',okr:'O2',who:'Producción + Calidad',g:'G1'},
 {id:'H3',title:'Datos y capacidad',desc:'Línea base auditada y costo razonable del registro.',kpi:'P1 · P2 · A2',okr:'O4',who:'Gestor + I+D / analista',g:'G0 / G3'},
 {id:'H4',title:'Cliente y VOC',desc:'Tres oportunidades con problema y criterio de cliente contrastable.',kpi:'C1 · C2',okr:'O1',who:'Comercial + cliente',g:'G1 / G3'},
 {id:'H5',title:'Beneficio económico',desc:'Costo evitable, horas realmente utilizables, inversión y sensibilidad.',kpi:'F1 · F2',okr:'O3',who:'Finanzas + I+D',g:'G2'},
 {id:'H6',title:'Calidad y suministro',desc:'Requisitos críticos, insumos y abastecimiento viables.',kpi:'P4',okr:'O2',who:'Calidad + Compras + Producción',g:'G1'}
];
const gates = [
 {id:'G0',name:'Preparar',condition:'Patrocinio, RACI, acuerdos I+D–Producción, fuentes y línea base definidos.',authority:'Dirección, I+D y Producción',stop:'No iniciar piloto sin autoridad y datos mínimos.'},
 {id:'G1',name:'Diseñar',condition:'VOC y criterios de cliente; calidad, factibilidad y abastecimiento verificables.',authority:'Comercial, Calidad y Compras',stop:'No avanzar con incumplimientos técnicos o críticos.'},
 {id:'G2',name:'Autorizar inversión',condition:'VPN > 0 con tasa ratificada, costos completos, escenario adverso y mitigación registrados.',authority:'Finanzas y Dirección',stop:'El VPN base cercano a cero NO autoriza despliegue.'},
 {id:'G3',name:'Evaluar piloto',condition:'Tres casos con evidencia trazable: C1/C2, P1–P4, A1/A2, F1/F2 y aprendizajes.',authority:'Equipo multifuncional',stop:'Sin evidencias reales, la decisión sigue pendiente.'}
];
const financial=[{label:'Conservador',n:0.15,v:-10690000},{label:'Base',n:0.25,v:256444},{label:'Favorable',n:0.35,v:12940000}];
const fresh=()=>({values:Object.fromEntries(kpis.map(k=>[k.id,{a:null,b:null}])),kr:Object.fromEntries(okrs.flatMap(o=>o.krs.map(([id])=>[o.id+'-'+id,{status:'pendiente',note:''}]))),gate:Object.fromEntries(gates.map(g=>[g.id,'pendiente'])),cases:Array.from({length:3},(_,i)=>({id:'P'+(i+1),name:'',voc:'no_medida',sample:'no_medida',note:''}))});
let state=fresh();
function download(file,body,type='text/plain;charset=utf-8') { const a=document.createElement('a'),u=URL.createObjectURL(new Blob([body],{type}));a.href=u;a.download=file;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1200); }
function csv(s) {return '\uFEFF'+s.map(row=>row.map(x=>'"'+String(x??'').replace(/"/g,'""')+'"').join(';')).join('\r\n')}
function value(k){const x=state.values[k.id];if(!x||x.a===null||x.a===''||!Number.isFinite(Number(x.a)))return null;
 if(k.type==='number')return Number(x.a);
 if(x.b===null||x.b===''||!Number.isFinite(Number(x.b))||Number(x.b)<=0)return null;
 return (k.unit==='iter./caso'?1:100)*Number(x.a)/Number(x.b);}
function vtext(k){const v=value(k);return v===null?'NO MEDIDO':k.unit==='COP'?currency(v):fmt(v,k.unit==='iter./caso'?2:1)+' '+k.unit}
function pill(s){return s==='simulado'?'<span class="w3-tag amber">Supuesto simulado</span>':s==='revision'?' <span class="w3-tag">En revisión</span>':'<span class="w3-tag muted">Sin evidencia</span>'}
function renderBsc(){const host=$('#w3-bsc');if(!host)return;
 const names=[['Aprendizaje','01','Capacidades'],['Procesos','02','Decisiones trazables'],['Clientes','03','Valor para cliente'],['Financiera','04','Valor económico']];
 host.innerHTML=`<div class="w3-causal">${names.map((a,i)=>`<div class="w3-causal-step"><b>${a[1]} · ${a[0]}</b><small>${a[2]}</small></div>${i<3?'<span aria-hidden="true">→</span>':''}`).join('')}</div>
 <div class="w3-statement"><b>Principio metodológico:</b> el BSC expresa una <em>hipótesis causal</em> —no prueba que capacitación produzca ventas o VPN positivo. Las metas corresponden a un piloto académico de tres oportunidades y todos los datos introducidos aquí son ensayos locales.</div>
 ${names.map(([p])=>`<section class="w3-group"><h3>${p} <small>${kpis.filter(k=>k.p===p).map(k=>k.id).join(' · ')}</small></h3><div class="w3-kpi-grid">${kpis.filter(k=>k.p===p).map(k=>`<article class="w3-kpi" data-card="${k.id}"><div class="w3-kpi-id">${k.id} ${k.unit==='COP'?'· COP':''}</div><h4>${safe(k.title)}</h4><div class="w3-kpi-value ${value(k)===null?'empty':''}">${vtext(k)}</div><div class="w3-field"><label>${k.type==='number'?'Valor de prueba (simulado)':'Numerador (simulado)'}<input type="number" step="any" data-kval="${k.id}" data-part="a" placeholder="Sin dato" value="${state.values[k.id].a??''}" /></label>${k.type==='fraction'?`<label>Denominador <input type="number" step="any" min="0.000001" data-kval="${k.id}" data-part="b" placeholder="Sin dato" value="${state.values[k.id].b??''}" /></label>`:''}</div><p class="w3-muted"><b>Fórmula:</b> ${safe(k.f)}</p><p class="w3-target">Meta propuesta: ${safe(k.target)}</p><p class="w3-muted">Evidencia: ${safe(k.why)} · ${k.h.join('/')} · ${k.kr.join('/')}</p></article>`).join('')}</div></section>`).join('')}
 <div class="w3-statement"><b>Referencia financiera documental, separada de los registros simulados:</b> inversión valorizada COP $21.427.500; tasa supuesta 10 % E.A.; VPN base +$256.444; TIR 10,81 %; B/C ≈ 1,012. No equivalen a resultados del piloto.</div>`;
}
function renderOkr(){const host=$('#w3-okr');if(!host)return;
 host.innerHTML=`<div class="w3-statement">Cuatro objetivos y doce resultados clave. <b>No se asigna un cumplimiento global</b>: una KR con estado “simulado” no demuestra que ocurrió. * El umbral de 2/3 primeras muestras aceptadas es académico y requiere aprobación.</div>
 ${okrs.map(o=>`<article class="w3-okr"><div class="w3-okr-head"><span>${o.id} · ${o.p}</span><h3>${safe(o.title)}</h3><p>${safe(o.subtitle)}</p></div><div class="w3-kr-grid">${o.krs.map(([id,title,bsc,proof])=>{const key=o.id+'-'+id,t=state.kr[key];return `<div class="w3-kr"><div class="w3-kr-top"><b>${id}</b>${pill(t.status)}</div><h4>${safe(title)}</h4><small>BSC ${safe(bsc)} · ${safe(proof)}</small><label>Estado de ensayo<select data-kr-status="${key}"><option value="pendiente" ${t.status==='pendiente'?'selected':''}>Sin evidencia</option><option value="revision" ${t.status==='revision'?'selected':''}>En revisión</option><option value="simulado" ${t.status==='simulado'?'selected':''}>Simulado, NO validado</option></select></label><label>Nota de simulación<textarea data-kr-note="${key}" maxlength="350" rows="2" placeholder="Prueba que sería necesaria…">${safe(t.note)}</textarea></label></div>`}).join('')}</div></article>`).join('')}`;
}
function renderTraz(){const host=$('#w3-traz');if(!host)return;
 host.innerHTML=`<div class="w3-statement">Cada fila une hipótesis ↔ KPI ↔ OKR ↔ validador ↔ gate. <b>Asignar un responsable no constituye su aceptación o firma.</b> H1–H3 habilitan el piloto; H4 prueba pertinencia; H5 sustenta economía; H6 impone veto técnico.</div><div class="w3-table-wrap"><table class="w3-table"><thead><tr><th>Hipótesis</th><th>KPI</th><th>OKR</th><th>Valida</th><th>Gate</th></tr></thead><tbody>${hypotheses.map(h=>`<tr><td><b>${h.id} · ${safe(h.title)}</b><small>${safe(h.desc)}</small></td><td>${h.kpi}</td><td>${h.okr}</td><td>${safe(h.who)}</td><td><b>${h.g}</b></td></tr>`).join('')}</tbody></table></div>
 <h3>Puertas de decisión G0–G3</h3><div class="w3-gate-grid">${gates.map(g=>`<article class="w3-gate"><strong>${g.id} · ${g.name}</strong><p>${safe(g.condition)}</p><small><b>Autoridad:</b> ${safe(g.authority)}</small><label>Estado didáctico<select data-gate-s3="${g.id}"><option value="pendiente" ${state.gate[g.id]==='pendiente'?'selected':''}>Pendiente</option><option value="revision" ${state.gate[g.id]==='revision'?'selected':''}>Revisión simulada</option><option value="simulado" ${state.gate[g.id]==='simulado'?'selected':''}>Supongamos cumplido (sin prueba)</option></select></label><div class="w3-warning">${safe(g.stop)}</div></article>`).join('')}</div><div class="w3-statement"><b>Regla de salida:</b> avanzar, ajustar o detener requiere evidencias reales, actas y autoridad; en esta versión ningún cambio en controles declara un gate aprobado.</div>`;
}
function renderPilot(){const host=$('#w3-pilot');if(!host)return;
 host.innerHTML=`<div class="w3-statement"><b>Tres oportunidades ≠ tres escenarios económicos.</b> Aquí los tres casos del piloto permanecen <b>sin identificar</b> hasta introducir datos. No son proyectos reales cargados; son fichas de simulación preparadas para una futura captura estructurada (por ejemplo, AppSheet).</div>
 <div class="w3-pilot-grid">${state.cases.map((c,i)=>`<article class="w3-case"><div class="w3-kpi-id">CASO ${i+1} / 3</div><label>Oportunidad (nombre ficticio para prueba)<input type="text" maxlength="100" data-case="${i}" data-casefield="name" value="${safe(c.name)}" placeholder="Caso sin definir" /></label><label>VOC documentada<select data-case="${i}" data-casefield="voc">${[['no_medida','No medida'],['pendiente','En revisión'],['simulada','Sí, hipotéticamente']].map(([v,l])=>`<option value="${v}" ${c.voc===v?'selected':''}>${l}</option>`).join('')}</select></label><label>Primera muestra<select data-case="${i}" data-casefield="sample">${[['no_medida','No evaluada'],['pendiente','En revisión'],['aceptada_sim','Aceptada (simulada)'],['rechazada_sim','Rechazada (simulada)']].map(([v,l])=>`<option value="${v}" ${c.sample===v?'selected':''}>${l}</option>`).join('')}</select></label><label>Nota de ensayo<textarea rows="3" maxlength="350" data-case="${i}" data-casefield="note" placeholder="Criterio, responsable, evidencia pendiente…">${safe(c.note)}</textarea></label></article>`).join('')}</div>
 <div class="w3-scenario-row">${financial.map(f=>`<article><small>${f.label} · ${fmt(f.n,2)} iter. evitadas</small><strong class="${f.v>=0?'w3-good':'w3-bad'}">${currency(f.v)} COP</strong><div class="w3-finbar"><span style="width:${Math.max(2,Math.round(Math.abs(f.v)/12940000*100))}%;background:${f.v>=0?'#2fa690':'#c96767'}"></span></div></article>`).join('')}</div><p class="w3-muted">VPN de sensibilidad documental: conservador −10,69 M; base +0,256 M; favorable +12,94 M COP. Los valores corresponden al modelo, no a los tres casos. El supuesto de 0,247 iteraciones está cerca del punto de equilibrio y requiere revisión con flujo completo.</p>
 <h3>Ruta de aprendizaje verificable</h3><div class="w3-route"><div><b>01 · Preparación</b><p>Definir denominadores, casos y comparadores; RACI y fuentes.</p></div><div><b>02 · Piloto</b><p>VOC, primera muestra, causas de iteración, registros y costos reales.</p></div><div><b>03 · Dictamen</b><p>Comparación con línea base, auditoría de datos y decisión multifuncional.</p></div></div>`;
}
function render(){renderBsc();renderOkr();renderTraz();renderPilot()}
function snapshot(){return JSON.parse(JSON.stringify(state))}
function load(v){const clean=fresh();if(v && typeof v==='object'){
 for(const k of kpis){const o=v.values?.[k.id];if(o){for(const part of ['a','b']){const val=o[part];clean.values[k.id][part]=(val!==''&&val!==null&&Number.isFinite(Number(val)))?Number(val):null}}}
 for(const [id,t] of Object.entries(clean.kr)){const x=v.kr?.[id];if(x){t.status=['pendiente','revision','simulado'].includes(x.status)?x.status:'pendiente';t.note=String(x.note??'').slice(0,350)}}
 for(const g of gates){const val=v.gate?.[g.id];clean.gate[g.id]=['pendiente','revision','simulado'].includes(val)?val:'pendiente'}
 if(Array.isArray(v.cases))clean.cases.forEach((c,i)=>{const x=v.cases[i]||{};c.name=String(x.name??'').slice(0,100);c.note=String(x.note??'').slice(0,350);c.voc=['no_medida','pendiente','simulada'].includes(x.voc)?x.voc:'no_medida';c.sample=['no_medida','pendiente','aceptada_sim','rechazada_sim'].includes(x.sample)?x.sample:'no_medida'});
 }state=clean;render()}
function ensureUI(){const nav=$('#navigation'),old=nav?.querySelector('[data-tab="bsc"]'),before=$('#tab-gerencia');if(!nav||!old||!before)return false;
 old.dataset.tab='bsc3';old.innerHTML='<span>12</span> BSC · 10 KPI';
 const items=[['okr3','13','OKR · 12 KR'],['traz3','14','Hipótesis y gates'],['piloto3','15','Bitácora piloto']];let el=old;
 for(const [id,n,l] of items){el.insertAdjacentHTML('afterend',`<button class="navlink" data-tab="${id}"><span>${n}</span> ${l}</button>`);el=el.nextElementSibling}
 const mg=nav.querySelector('[data-tab="gerencia"]');if(mg){mg.querySelector('span').textContent='16'}const d=nav.querySelector('[data-tab="decisiones"]');if(d){d.querySelector('span').textContent='17'}
 const main=`<section id="tab-bsc3" class="view w3-view" aria-label="BSC de diez KPI"><div class="section-header"><div><span class="section-index">12 / MEDICIÓN PROPUESTA</span><h2>BSC · 10 indicadores verificables</h2><p>Las cuatro perspectivas de la estrategia se expresan en indicadores con fórmulas, metas académicas y necesidad de evidencia.</p></div><button class="btn btn-outline" data-export-s3="kpi">↓ KPI CSV</button></div><div id="w3-bsc"></div></section>
 <section id="tab-okr3" class="view w3-view" aria-label="Objetivos y resultados clave"><div class="section-header"><div><span class="section-index">13 / OBJETIVOS Y RESULTADOS CLAVE</span><h2>Cuatro OKR · doce KR</h2><p>Adopción → procesos → clientes → rentabilidad. Cada resultado requiere evidencia propia, no solo un estado de avance.</p></div><button class="btn btn-outline" data-export-s3="kr">↓ KR CSV</button></div><div id="w3-okr"></div></section>
 <section id="tab-traz3" class="view w3-view" aria-label="Trazabilidad de hipótesis y gates"><div class="section-header"><div><span class="section-index">14 / GOBERNANZA Y TRAZABILIDAD</span><h2>H1–H6 → KPI/OKR → G0–G3</h2><p>Red de condiciones verificables con responsables, fuentes y veto por criticidad.</p></div><button class="btn btn-outline" data-export-s3="trace">↓ Matriz CSV</button></div><div id="w3-traz"></div></section>
 <section id="tab-piloto3" class="view w3-view" aria-label="Bitácora de piloto y sensibilidad"><div class="section-header"><div><span class="section-index">15 / RUTA DE VALIDACIÓN</span><h2>Tres oportunidades · tres escenarios distintos</h2><p>Ficha didáctica de captura de casos y referencia financiera documental. Sin evidencia real de ejecución.</p></div><div><button class="btn btn-outline" data-export-s3="pilot">↓ Piloto CSV</button> <button class="btn btn-outline" data-export-s3="json">↓ JSON Semana 3</button> <label class="btn btn-outline w3-import">↑ Importar JSON S3 <input id="w3-import" type="file" accept=".json,application/json" hidden /></label></div></div><div id="w3-pilot"></div></section>`;
 before.insertAdjacentHTML('beforebegin',main);return true;}
function exportS3(type){if(type==='json'){download('nexo_innova_semana3_estado.json',JSON.stringify({schema:'nexo-innova-week3-v1',exportedAt:new Date().toISOString(),week3:snapshot(),notice:'Ensayo académico; no mediciones ni autorizaciones empresariales.'},null,2),'application/json;charset=utf-8');return}
 let rows=[];
 if(type==='kpi')rows=[['Código','Perspectiva','Indicador','Unidad','Fórmula','Meta propuesta','Estado','Valor simulado','Numerador o valor','Denominador','Hipótesis'],...kpis.map(k=>[k.id,k.p,k.title,k.unit,k.f,k.target,value(k)===null?'No medido':'Simulado',value(k)??'',state.values[k.id].a??'',state.values[k.id].b??'',k.h.join(' / ')])];
 if(type==='kr')rows=[['Objetivo','Resultado clave','Meta académica','BSC asociado','Evidencia','Estado didáctico','Nota'],...okrs.flatMap(o=>o.krs.map(([id,t,b,p])=>[o.id,id,t,b,p,state.kr[o.id+'-'+id].status,state.kr[o.id+'-'+id].note]))];
 if(type==='trace')rows=[['Hipótesis','Título','Validación necesaria','KPI','OKR','Validador','Gate'],...hypotheses.map(h=>[h.id,h.title,h.desc,h.kpi,h.okr,h.who,h.g])];
 if(type==='pilot')rows=[['Caso','Identificador de oportunidad (simulado)','VOC','Primera muestra','Nota'],...state.cases.map(c=>[c.id,c.name,c.voc,c.sample,c.note])];
 if(rows.length)download('nexo_innova_s3_'+type+'.csv',csv(rows),'text/csv;charset=utf-8');}
async function importS3(file){if(!file)return;try{if(file.size>2000000)throw Error('Archivo demasiado grande');const data=JSON.parse(await file.text());if(data.schema!=='nexo-innova-week3-v1'||!data.week3)throw Error('Esquema no reconocido');load(data.week3)}catch(e){alert('No se pudo importar el estado Semana 3: '+e.message)}}
if(!ensureUI()){console.warn('NEXO Semana 3: no se encontró la estructura del Artifact base');return}
window.NEXO_WEEK3={snapshot,load,render,kpis,okrs,hypotheses,gates};render();
document.addEventListener('input',e=>{const input=e.target.closest('[data-kval]');if(!input)return;const k=input.dataset.kval,part=input.dataset.part;const v=input.value;state.values[k][part]=v===''?null:Number(v);const card=input.closest('.w3-kpi'),def=kpis.find(x=>x.id===k);if(card&&def){const out=card.querySelector('.w3-kpi-value');out.textContent=vtext(def);out.classList.toggle('empty',value(def)===null)}});
document.addEventListener('change',e=>{if(e.target.matches('[data-kr-status]')){state.kr[e.target.dataset.krStatus].status=e.target.value;renderOkr()}
 if(e.target.matches('[data-gate-s3]')){state.gate[e.target.dataset.gateS3]=e.target.value;renderTraz()}
 if(e.target.matches('[data-case]')){state.cases[Number(e.target.dataset.case)][e.target.dataset.casefield]=e.target.value}
 if(e.target.id==='w3-import'){importS3(e.target.files[0]);e.target.value=''}});
document.addEventListener('input',e=>{if(e.target.matches('[data-kr-note]'))state.kr[e.target.dataset.krNote].note=e.target.value;if(e.target.matches('[data-case]'))state.cases[Number(e.target.dataset.case)][e.target.dataset.casefield]=e.target.value});
document.addEventListener('click',e=>{const b=e.target.closest('[data-export-s3]');if(b)exportS3(b.dataset.exportS3)});
})();
