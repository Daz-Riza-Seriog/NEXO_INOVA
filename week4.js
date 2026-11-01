/* NEXO-INNOVA · Semana 4 · Evaluación económica mensual y análisis de decisiones.
   Base: libro maestro financiero y documento final del Equipo 4, 01-11-2026.
   Los resultados son PROYECCIONES / SUPUESTOS, nunca datos operativos aprobados. */
(() => {
'use strict';
const $ = s => document.querySelector(s);
const fmt = (n,d=0) => Number(n).toLocaleString('es-CO',{minimumFractionDigits:d,maximumFractionDigits:d});
const cop = (n) => `${n<0?'−':n>0?'+':''}$${fmt(Math.abs(Math.round(n)))}`;
const plainCop = (n) => `${n<0?'−':''}$${fmt(Math.abs(Math.round(n)))}`;
const safe = x => String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const PREC = 266779.78, BASE_DEV=15;
const DEFAULT_INV=[3969000,10620000,6838500];
const CASES={
 conservador:{name:'Conservador',iter:.15,capture:[.40,.65,.75],refVPN:-10687601,refIRR:-.2602,refPB:null},
 base:{name:'Base',iter:.25,capture:[.50,.80,.90],refVPN:256444,refIRR:.1081,refPB:35.62},
 favorable:{name:'Favorable',iter:.35,capture:[.60,.90,1.00],refVPN:12944460,refIRR:.5058,refPB:24.22}
};
const newParams = k => ({name:k,iter:CASES[k].iter,capture:[...CASES[k].capture],dev:BASE_DEV,unit:PREC,technical:220000,annual:.10,investment:[...DEFAULT_INV],delay:0,useTech:1,modified:false});
let active='base', params=newParams(active), selectedView='economia4',s4History=[];
const range=(v,low,hi)=>Math.max(low,Math.min(hi,v));
function solveIRR(flows){
 // TIR mensual: intervalo r > -1. En estos flujos hay un solo cambio de signo.
 const npv=r=>flows.reduce((s,f,m)=>s+f/Math.pow(1+r,m),0);
 let lo=-.90, hi=1, flo=npv(lo),fhi=npv(hi);
 if(!Number.isFinite(flo)||!Number.isFinite(fhi)||flo*fhi>0)return null;
 for(let i=0;i<140;i++){const mid=(lo+hi)/2, fm=npv(mid);if(!Number.isFinite(fm))return null;if(fm*flo>0){lo=mid;flo=fm}else{hi=mid;fhi=fm}}
 return Math.pow(1+(lo+hi)/2,12)-1;
}
function evaluate(p){
 const r=Math.pow(1+p.annual,1/12)-1;
 const rawUnit=p.unit-p.technical*(1-p.useTech); // solo se ajusta el costo de oportunidad técnico
 const annualPotential=p.dev*12*p.iter*rawUnit;
 const flows=[], rows=[];
 let cum=0,cumDisc=0,cumBenefits=0,cumInvestment=0,pvBenefits=0,pvInvestment=0,payback=null,paybackSimple=null;
 for(let m=0;m<=36;m++){
   const stage=m-p.delay;
   const tranche=stage>=3&&stage<=12?0:stage>=13&&stage<=24?1:stage>=25&&stage<=36?2:-1;
   const capture=tranche>=0?p.capture[tranche]:0;
   const benefit=annualPotential/12*capture;
   const investment=m<=2?p.investment[m]:0;
   const net=benefit-investment;
   const factor=Math.pow(1+r,m);
   const discounted=net/factor;
   const oldCumDisc=cumDisc, oldCum=cum;
   cum+=net;cumDisc+=discounted;cumBenefits+=benefit;cumInvestment+=investment;
   pvBenefits+=benefit/factor;pvInvestment+=investment/factor;
   if(payback===null&&m>0&&oldCumDisc<0&&cumDisc>=0&&discounted>0)payback=m-1+(-oldCumDisc/discounted);
   if(paybackSimple===null&&m>0&&oldCum<0&&cum>=0&&net>0)paybackSimple=m-1+(-oldCum/net);
   flows.push(net);rows.push({m,tranche,capture,benefit,investment,net,discounted,cum,cumDisc,cumInvestment,cumBenefits});
 }
 return {vpn:cumDisc,irr:solveIRR(flows),bc:pvInvestment>0?pvBenefits/pvInvestment:null,payback,paybackSimple,annualPotential,
 r,pvBenefits,pvInvestment,rows,flows,totalBenefits:cumBenefits,totalInvestment:cumInvestment};
}
const current=()=>evaluate(params);
function par(k){return evaluate(newParams(k))}
function percent(v,d=1){return v==null?'N/C':fmt(v*100,d)+' %'}
function tri(v){return v==null?'No recupera en 36 meses':fmt(v,2)+' meses'}
function verdict(e){return e.vpn>0&&e.irr!==null&&e.irr>params.annual?'VPN marginal o positivo: exige validación y gates':'Sin justificación financiera demostrada con estos supuestos';}
function navView(id){selectedView=id; document.querySelectorAll('.view').forEach(el=>el.classList.toggle('active',el.id==='tab-'+id));document.querySelectorAll('.navlink').forEach(el=>el.classList.toggle('active',el.dataset.tab===id));const b=document.querySelector(`.navlink[data-tab="${id}"]`);if($('#breadcrumbActive'))$('#breadcrumbActive').textContent=b?.textContent.replace(/^\s*\d+/,'').trim().toUpperCase()||'FINANZAS';document.querySelector('.sidebar')?.classList.remove('open');window.scrollTo({top:0,behavior:'instant'})}
const field=(id,label,val,min,max,step,unit='',note='')=>`<label class="s4-field"><span>${safe(label)} ${note?`<i title="${safe(note)}">ⓘ</i>`:''}</span><div><input aria-label="${safe(label)}" type="number" data-s4-input="${id}" min="${min}" max="${max}" step="${step}" value="${val}"><small>${unit}</small></div></label>`;
function panelToolbar(){return `<div class="s4-toolbar"><div class="s4-presets" role="group" aria-label="Escenarios financieros">${Object.keys(CASES).map(k=>`<button class="s4-btn s4-preset ${k===active?'on':''}" data-s4-case="${k}" aria-pressed="${k===active}">${CASES[k].name}</button>`).join('')}</div><div class="s4-tool-actions"><button class="s4-btn" data-s4-reset>Restablecer escenario</button><button class="s4-btn" data-s4-export="json">Exportar JSON S4</button><label class="s4-btn s4-import">Importar JSON S4<input type="file" accept=".json,application/json" data-s4-import hidden></label></div></div>`}
function kpi(label,val,sub,style=''){return `<div class="s4-kpi ${style}"><small>${safe(label)}</small><strong>${val}</strong><span>${sub}</span></div>`}
function makeSVG(data,w=1040,h=280,mode='curves'){
 const pad={left:66,right:23,top:28,bottom:38};const W=w-pad.left-pad.right,H=h-pad.top-pad.bottom;
 const vals=mode==='s'?data.rows.flatMap(x=>[x.cumInvestment,x.cumBenefits]):data.rows.flatMap(x=>[x.cum,x.cumDisc]);
 const min=Math.min(0,...vals),max=Math.max(...vals,1);const dif=max-min||1;
 const x=m=>pad.left+W*m/36,y=v=>pad.top+H-(v-min)/dif*H;
 const lines=mode==='s'?[['#f0c94a','cumInvestment','Inversión acumulada'],['#40c4aa','cumBenefits','Beneficio acumulado']]:[['#7abff3','cum','Neto acumulado'],['#f0c94a','cumDisc','Neto acumulado descontado']];
 const path=k=>data.rows.map((r,i)=>`${i?'L':'M'}${x(r.m).toFixed(1)},${y(r[k]).toFixed(1)}`).join(' ');
 const axes=[0, .25,.5,.75,1].map(t=>{const v=min+(max-min)*t;return `<line x1="${pad.left}" y1="${y(v)}" x2="${w-pad.right}" y2="${y(v)}" stroke="#42536c" opacity=".45"/><text x="${pad.left-8}" y="${y(v)+4}" font-size="12" fill="#9badbd" text-anchor="end">${fmt(v/1e6,1)}</text>`}).join('');
 return `<svg class="s4-plot" role="img" aria-label="${mode==='s'?'Curvas acumuladas de inversión y beneficios':'Curva J, acumulado neto y acumulado descontado'}" viewBox="0 0 ${w} ${h}"><rect x="0" y="0" width="${w}" height="${h}" rx="10" fill="#0c1f31"/><text x="${pad.left}" y="18" fill="#b9cddd" font-size="12">Millones COP</text>${axes}${[0,6,12,18,24,30,36].map(m=>`<text x="${x(m)}" y="${h-12}" text-anchor="middle" font-size="12" fill="#c0d0dc">${m}</text>`).join('')}<text x="${w-pad.right}" y="${h-10}" font-size="11" fill="#91a9b9">Mes</text>${min<0&&max>0?`<line x1="${pad.left}" y1="${y(0)}" x2="${w-pad.right}" y2="${y(0)}" stroke="#d09a89" stroke-dasharray="4 5"/>`:''}${lines.map(([color,key])=>`<path d="${path(key)}" fill="none" stroke="${color}" stroke-width="3.2" stroke-linejoin="round"/>`).join('')}</svg><div class="s4-legend">${lines.map(([color,,name])=>`<span><b style="background:${color}"></b>${safe(name)}</span>`).join('')}</div>`;
}
function scenarioSummary(){const baselines=Object.keys(CASES).map(k=>({k,...par(k)}));return `<div class="s4-table-wrap"><table class="s4-table"><thead><tr><th>Escenario documental</th><th>Iter./des.</th><th>Captura años 1 / 2 / 3</th><th>Beneficio 36m</th><th>VPN (COP)</th><th>TIR E.A.</th><th>Payback descontado</th><th>B/C</th></tr></thead><tbody>${baselines.map(d=>`<tr class="${d.k===active?'selected':''}"><td><button class="s4-textbtn" data-s4-case="${d.k}">${CASES[d.k].name}</button></td><td>${fmt(CASES[d.k].iter,2)}</td><td>${CASES[d.k].capture.map(x=>percent(x,0)).join(' / ')}</td><td>${plainCop(d.totalBenefits)}</td><td class="${d.vpn>=0?'plus':'minus'}">${cop(d.vpn)}</td><td>${percent(d.irr,2)}</td><td>${tri(d.payback)}</td><td>${fmt(d.bc,2)}</td></tr>`).join('')}</tbody></table></div><p class="s4-small">Las filas originales siempre conservan los parámetros del Excel, incluso si cambias el escenario activo. Esto evita contaminar las referencias del entregable.</p>`}
function renderFinancial(){const el=$('#s4-main');if(!el)return;const r=current();
 el.innerHTML=`${panelToolbar()}<div class="s4-eyebrow">MODELO ECONÓMICO · SIMULACIÓN ACADÉMICA</div><h2>Del modelo estratégico al flujo de caja</h2><p class="s4-lead">La intervención propuesta busca disminuir iteraciones evitables en un proceso de I+D; no supone nuevas ventas ni recortes de nómina. Se evalúan 37 posiciones mensuales (0–36), con inversión en los meses 0, 1 y 2 y reconocimiento gradual a partir del mes 3.</p><div class="s4-summaryline">Caso activo: <strong>${CASES[active].name}${params.modified?' · ajustado (no corresponde al escenario original)':''}</strong> · tasa mensual equivalente ${percent(r.r,6)} · todos los importes en COP nominales del ejercicio.</div>
 <div class="s4-kpis">${kpi('VPN a 36 meses',cop(r.vpn),`A una tasa de ${percent(params.annual,1)} E.A.`,r.vpn>=0?'good':'bad')}${kpi('TIR efectiva anual',percent(r.irr,2),'Comparar con tasa de oportunidad',r.irr!==null&&r.irr>params.annual?'good':'bad')}${kpi('Payback descontado',tri(r.payback),'Si no cruza cero, no recupera en 36 meses')}${kpi('Relación B/C',fmt(r.bc,3),'VP beneficios / VP inversión')}${kpi('Beneficio reconocido 36m',plainCop(r.totalBenefits),'Beneficios valorizados, no ingresos de caja')}${kpi('Inversión económica',plainCop(r.totalInvestment),'Incluye tiempo y recursos internos valorizados')}</div>
 <div class="s4-twocol"><article class="s4-panel"><div class="s4-panelhead"><h3>Palancas de simulación</h3><span>Valores editables · escenario activo</span></div><div class="s4-formgrid">${field('iter','Iteraciones evitadas por desarrollo',fmt(params.iter,2).replace(',','.'),0,.8,.01,'iter./des.','Escenario base: 0,25; no es un resultado medido.')}${field('dev','Desarrollos elegibles por mes',params.dev,0,300,1,'des./mes')}${field('unit','Valor económico por iteración',params.unit.toFixed(2),0,10000000,.01,'COP/iter.','Costo técnico y materiales + indirectos. Evitar mezclar costo sombra con ahorro de caja.')}${field('tech','Componente técnico dentro del costo unitario',params.technical,0,params.unit,1000,'COP/iter.')}${field('annual','Tasa de descuento efectiva anual',fmt(params.annual*100,2).replace(',','.'),0,100,.25,'% E.A.','10 % es TIO supuesta, no WACC medido.')}${field('delay','Retraso de inicio de beneficios',params.delay,0,12,1,'meses','Desplaza el calendario de captura sin ampliar horizonte de 36 meses.')}${field('useTech','Aprovechamiento económico de las horas técnicas',fmt(params.useTech*100,0),0,150,5,'%','100 % significa valorizar todas las horas supuestamente liberadas.')}</div><div class="s4-split"><div><h4>Captura anual del beneficio</h4><p>Tramos: meses 3–12, 13–24 y 25–36.</p><div class="s4-formgrid">${params.capture.map((v,i)=>field(`cap${i+1}`,`Año ${i+1}`,fmt(v*100,0),0,150,5,'%')).join('')}</div></div><div><h4>Desembolso y Curva S</h4><p>La reserva se reconoce en el presupuesto económico.</p><div class="s4-formgrid">${params.investment.map((v,i)=>field(`inv${i}`,`Mes ${i}`,v,0,100000000,50000,'COP')).join('')}</div></div></div></article>
 <article class="s4-panel"><div class="s4-panelhead"><h3>Lectura para decisión</h3><span>Calcular ≠ aprobar</span></div><div class="s4-chain"><div>Actores / Canvas</div><b>→</b><div>PESTEL / Delta</div><b>→</b><div>BSC / OKR</div><b>→</b><div>Iteraciones + captura</div><b>→</b><div>VPN / decisión</div></div><div class="s4-decision"><strong>${r.vpn<0?'VPN negativo: revisar hipótesis o alcance':r.vpn<1000000?'VPN apenas positivo: margen de seguridad mínimo':'VPN positivo condicionado a evidencia'}</strong><p>${verdict(r)}. La tasa, las horas liberadas y la captura de beneficios requieren sustento de Finanzas, I+D y Producción. Ninguna simulación marca un gate como aprobado.</p></div><div class="s4-facts"><div><small>Beneficio potencial anual</small><strong>${plainCop(r.annualPotential)}</strong></div><div><small>Valor presente de beneficios</small><strong>${plainCop(r.pvBenefits)}</strong></div><div><small>Valor presente de la inversión</small><strong>${plainCop(r.pvInvestment)}</strong></div><div><small>Iteraciones evitables/año</small><strong>${fmt(params.dev*12*params.iter,2)}</strong></div></div><div class="s4-explain"><b>Fórmulas:</b> beneficio anual = desarrollos/mes × 12 × iteraciones evitadas/desarrollo × costo por iteración; beneficio mensual = beneficio anual × captura del tramo / 12. VPN = Σ(beneficioₜ − inversiónₜ)/(1 + rₘ)ᵗ, con rₘ = (1 + TIO E.A.)^(1/12) − 1. La TIR mensual se anualiza efectivamente.</div></article></div>
 <article class="s4-panel"><div class="s4-panelhead"><h3>Curva J · flujo neto acumulado</h3><span>${r.payback===null?'Sin recuperación descontada en el horizonte':`Cruce descontado en mes ${fmt(r.payback,2)}`}</span></div>${makeSVG(r,1000,280,'curves')}</article>
 <article class="s4-panel"><h3>Curva S · inversión reconocida vs. beneficio acumulado</h3>${makeSVG(r,1000,245,'s')}<p class="s4-small">La Curva S describe acumulados económicos. No sustituye un flujo efectivo de tesorería ni implica que el tiempo liberado se convierta automáticamente en caja.</p></article>
 <article class="s4-panel"><div class="s4-panelhead"><h3>Comparación documental de los tres escenarios</h3><button class="s4-btn" data-s4-export="comparativa">Exportar CSV</button></div>${scenarioSummary()}</article>
 <article class="s4-panel"><div class="s4-panelhead"><h3>Auditoría mensual completa (37 posiciones)</h3><button class="s4-btn" data-s4-export="flujo">Exportar flujo CSV</button></div><div class="s4-table-wrap s4-scroll"><table class="s4-table"><thead><tr><th>Mes</th><th>Captura</th><th>Inversión</th><th>Beneficio</th><th>Flujo neto</th><th>VP neto</th><th>Acum. VP neto</th></tr></thead><tbody>${r.rows.map(a=>`<tr><td>${a.m}</td><td>${percent(a.capture,0)}</td><td>${plainCop(a.investment)}</td><td>${plainCop(a.benefit)}</td><td class="${a.net<0?'minus':'plus'}">${cop(a.net)}</td><td>${cop(a.discounted)}</td><td class="${a.cumDisc<0?'minus':'plus'}">${cop(a.cumDisc)}</td></tr>`).join('')}</tbody></table></div></article>`;
 renderSensitivity();renderDecision();
}
function comparisons(){
 const baseline=par('base');const p=newParams('base');
 const trials=[
 ['TIO: 10 % → 12 % E.A.','annual',()=>{p.annual=.12},'Finanzas · tasa comparable al riesgo'],
 ['Reducción: 0,25 → 0,20 iter./des.','iter',()=>{p.iter=.20},'I+D/Producción · recuento de retrabajos'],
 ['Volumen: 15 → 12 des./mes','dev',()=>{p.dev=12},'Planeación · elegibilidad y volumen real'],
 ['Inversión: incremento del 10 %','investment',()=>{p.investment=DEFAULT_INV.map(x=>x*1.1)},'Finanzas · inversión total y contingencia'],
 ['Adopción: retraso de 3 meses','delay',()=>{p.delay=3},'Proyecto · inicio real de captura'],
 ['Horas útiles: 90 % del valor técnico','useTech',()=>{p.useTech=.9},'I+D/Finanzas · reasignación verificable']
 ];
 return trials.map(([name,k,patch,proof])=>{const q=newParams('base');if(k==='annual')q.annual=.12;if(k==='iter')q.iter=.20;if(k==='dev')q.dev=12;if(k==='investment')q.investment=DEFAULT_INV.map(x=>x*1.1);if(k==='delay')q.delay=3;if(k==='useTech')q.useTech=.9;const out=evaluate(q);return {name,k,proof,vpn:out.vpn,delta:out.vpn-baseline.vpn}})
}
function sensitivityHeatmap(){const r=par('base'),npv=p=>evaluate(p).vpn;
 const rows=[.15,.20,.25,.30,.35],cols=[.70,.85,1,1.14,1.30];
 return `<div class="s4-table-wrap"><table class="s4-table s4-heat"><thead><tr><th>Iter. evitadas \ factor captura</th>${cols.map(v=>`<th>${percent(v,0)}</th>`).join('')}</tr></thead><tbody>${rows.map(v=>`<tr><th>${fmt(v,2)}</th>${cols.map(f=>{const p=newParams('base');p.iter=v;p.capture=p.capture.map(x=>x*f);const z=npv(p);const color=z>5000000?'heat4':z>0?'heat3':z>-5000000?'heat2':'heat1';return `<td class="${color} ${v===.25&&f===1?'focus':''}" title="VPN: ${plainCop(z)}">${z>0?'+':''}${fmt(z/1e6,1)}</td>`}).join('')}</tr>`).join('')}</tbody></table></div><p class="s4-small">Los porcentajes de columna son <b>multiplicadores del beneficio base</b> (no porcentaje de adopción ni probabilidad). Una celda altera dos variables de estrés; los escenarios originales varían las rampas y las iteraciones conjuntamente.</p>`;
}
function renderSensitivity(){const el=$('#s4-sens');if(!el)return;const b=par('base'),tests=comparisons(),max=Math.max(...tests.map(x=>Math.abs(x.delta)),1);
 const t=(label,v)=>`<div class="s4-tornado-row"><span>${safe(label)}</span><div class="s4-track"><i style="width:${100*Math.abs(v)/max}%;background:${v<0?'#e08d91':'#40c9ab'}"></i></div><strong class="${v<0?'minus':'plus'}">${cop(v)}</strong></div>`;
 const reqIter= b.pvInvestment/(b.pvBenefits/.25);const reqCapture=b.pvInvestment/b.pvBenefits;
 el.innerHTML=`${panelToolbar()}<div class="s4-eyebrow">SENSIBILIDAD Y ROBUSTEZ</div><h2>¿Qué tendría que cumplirse para sostener el VPN?</h2><p class="s4-lead">Las pruebas individuales mantienen constantes las demás variables del escenario base. El mapa de calor perturba simultáneamente iteraciones evitadas y multiplicador de captura, sin asignar probabilidades.</p><div class="s4-breakgrid">${kpi('Punto de equilibrio técnico',fmt(reqIter,4)+' iter./des.','Con rampa y costos del caso base')}${kpi('Captura económica mínima',percent(reqCapture,2),'Del beneficio base previsto')}${kpi('Colchón del VPN base',plainCop(b.vpn),'Es solo el 1,21 % del VP de inversión')}</div><div class="s4-twocol"><article class="s4-panel"><h3>Tornado · efecto en VPN frente al base</h3>${tests.map(x=>t(x.name,x.delta)).join('')}<div class="s4-legend"><span><b style="background:#e08d91"></b>Reducción del VPN respecto al base</span></div><p class="s4-small">Caso de adopción retrasada: se desplaza explícitamente la rampa completa 3 meses sin ampliar el horizonte; esta regla es visible y reproducible. No se sustituye por un valor precargado.</p></article><article class="s4-panel"><h3>Ensayos de sensibilidad y evidencia requerida</h3><div class="s4-table-wrap"><table class="s4-table"><thead><tr><th>Variable</th><th>VPN resultado</th><th>Fuente para contrastar</th></tr></thead><tbody>${tests.map(x=>`<tr><td>${safe(x.name)}</td><td class="${x.vpn<0?'minus':'plus'}">${cop(x.vpn)}</td><td>${safe(x.proof)}</td></tr>`).join('')}</tbody></table></div><button class="s4-btn" data-s4-export="tornado">Exportar pruebas CSV</button></article></div><article class="s4-panel"><h3>Mapa de calor · VPN en millones de COP</h3>${sensitivityHeatmap()}</article><article class="s4-panel"><h3>Cómo leer el umbral financiero</h3><p><b>0,25 iteraciones evitadas y 85 % de captura relativa:</b> el VPN es negativo; <b>0,30 iteraciones y 85 %:</b> el VPN puede pasar a positivo. El cambio de signo no verifica los supuestos. El mapa es una familia de simulaciones, no una predicción probabilística.</p><p class="s4-small">La prueba «horas útiles al 90 %» aplica el recorte únicamente a los COP 220.000 técnicos dentro del costo unitario, conservando costos de materiales/otros. Es distinto de reducir el beneficio total al 90 %.</p></article>`;
}
const TRACE=[
 ['H1','Gobierno y patrocinio','Inicio y calendario de inversión','G0','Acta de gobierno, RACI, autoridad de ejecución'],
 ['H2','Producción','Reducción técnicamente posible de iteraciones','G1','Manufacturabilidad validada, causas de retrabajo'],
 ['H3','Datos y capacidad','Volumen elegible, costo, horas útiles','G0 → G3','Línea base comparable y horas reasignadas a trabajos valiosos'],
 ['H4','Cliente y VOC','Pertinencia y universo de oportunidades','G1','VOC, criterios de aceptación, selección de tres oportunidades'],
 ['H5','Beneficio económico','Factor captura, TIO y VPN','G2 → G3','Costeo ratificado, estrés y dictamen de Finanzas'],
 ['H6','Calidad y suministro','Iteraciones, tiempos y costos no previstos','G1 → G3','Verificación de calidad y abastecimiento']
];
function renderDecision(){const el=$('#s4-trace');if(!el)return;const r=current();el.innerHTML=`<div class="s4-eyebrow">TRAZABILIDAD ECONÓMICA / SEMANA 4</div><h2>Hipótesis → variable → evidencia → gate → decisión</h2><p class="s4-lead">La conexión entre módulos es conceptual: un ajuste financiero no valida de manera automática el KPI F1, ni un gate declarado «simulado» equivale a una autorización.</p><div class="s4-panel"><div class="s4-table-wrap"><table class="s4-table"><thead><tr><th>Hipótesis</th><th>Vínculo financiero</th><th>Puerta</th><th>Fuente pendiente de verificación</th></tr></thead><tbody>${TRACE.map(([h,n,v,g,doc])=>`<tr><td><b>${h}</b> · ${n}</td><td>${v}</td><td>${g}</td><td>${doc}</td></tr>`).join('')}</tbody></table></div></div><div class="s4-twocol"><article class="s4-panel"><h3>Puertas G0–G3</h3><div class="s4-gates"><div><b>G0 · Preparación</b><span>Autoridad y línea base; no iniciar sin datos mínimos.</span></div><div><b>G1 · Pertinencia</b><span>VOC, calidad, manufacturabilidad y suministro.</span></div><div><b>G2 · Validación económica</b><span>Finanzas ratifica tasa, inversión y beneficios, con tensión adversa.</span></div><div><b>G3 · Cierre del piloto</b><span>Comparar tres oportunidades con base; decidir continuar, ajustar o detener.</span></div></div></article><article class="s4-panel"><h3>Dictamen condicionado con los ajustes actuales</h3><div class="s4-decision"><strong class="${r.vpn<0?'minus':''}">VPN ${cop(r.vpn)}</strong><p>${r.vpn>0?'La valoración económica estimada puede justificar investigación adicional, pero no la implementación automática.':'Los supuestos actuales no sustentan una recomendación financiera de escalamiento.'}</p></div><h4>Vínculos con los módulos ya existentes</h4><div class="s4-linkbar"><button class="s4-btn" data-s4-go="supuestos">H1–H6</button><button class="s4-btn" data-s4-go="bsc3">10 KPI</button><button class="s4-btn" data-s4-go="okr3">4 OKR</button><button class="s4-btn" data-s4-go="traz3">G0–G3</button><button class="s4-btn" data-s4-go="piloto3">Tres oportunidades</button></div><p class="s4-small">En la versión independiente los botones a módulos anteriores están inhabilitados. En el Artifact integrado llevan a las secciones originales.</p></article></div><article class="s4-panel"><h3>Fuente, supuestos y límites de decisión</h3><p>Datos de referencia: presupuesto COP 21.427.500; 15 desarrollos/mes; 0,50 iteraciones adicionales/desarrollo antes de intervenir; reducción base de 0,25; COP 266.779,78/iteración, de los cuales COP 220.000 son tiempo técnico; tasa de oportunidad 10 % E.A. (supuesto). Inversión: meses 0, 1 y 2. Captura: meses 3–12, 13–24 y 25–36. El beneficio se valoriza como uso alternativo de capacidad y costos evitables, no como ahorro de salarios.</p><p class="s4-small">Trazabilidad: «NEXO_INNOVA_Libro_Maestro_Financiero(1).xlsx» y «PI2_S4_NEXO_INNOVA_Evaluacion_Financiera_Revision_Argumentada(1).docx». Cada cálculo de la interfaz es local y no altera el Excel maestro. Mantenemos separados los escenarios financieros (conservador/base/favorable), los estados del modelo (V0/V1/V2) y las tres oportunidades de piloto.</p></article>`;
}
function csv(rows){return '\uFEFF'+rows.map(r=>r.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(';')).join('\r\n')}
function save(name,content,mime){const link=document.createElement('a');const u=URL.createObjectURL(new Blob([content],{type:mime}));link.href=u;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(u),600)}
function exportKind(type){if(type==='json'){save('NEXO_INNOVA_S4_estado.json',JSON.stringify({schema:'nexo-innova-week4-v1',exportedAt:new Date().toISOString(),scenario:active,params,notice:'Simulación no aprobada, no medición empresarial.'},null,2),'application/json;charset=utf-8');return}
 let rows=[];
 if(type==='comparativa')rows=[['Escenario','Iteraciones por desarrollo','Captura año 1','Captura año 2','Captura año 3','VPN COP','TIR E.A.','Payback descontado meses','B/C','Beneficios 36 meses'],...Object.keys(CASES).map(k=>{const x=par(k);return [k,CASES[k].iter,...CASES[k].capture,x.vpn,x.irr,x.payback??'Sin recuperación',x.bc,x.totalBenefits]})];
 if(type==='flujo'){const x=current();rows=[['Mes','Captura tramo','Inversión COP','Beneficio COP','Flujo neto COP','VP flujo COP','Flujo acumulado COP','VP acumulado COP'],...x.rows.map(z=>[z.m,z.capture,z.investment,z.benefit,z.net,z.discounted,z.cum,z.cumDisc])];}
 if(type==='tornado')rows=[['Prueba','VPN COP','Variación VPN COP','Evidencia'],...comparisons().map(x=>[x.name,x.vpn,x.delta,x.proof])];
 if(rows.length)save(`NEXO_INNOVA_S4_${type}.csv`,csv(rows),'text/csv;charset=utf-8');
}
function load(v){if(!v||typeof v!=='object')return;const k=CASES[v.scenario]?v.scenario:'base';const clean=newParams(k);const p=v.params||{};
 for(const name of ['iter','dev','unit','technical','annual','delay','useTech'])if(Number.isFinite(+p[name]))clean[name]=Number(p[name]);
 if(Array.isArray(p.capture)&&p.capture.length===3&&p.capture.every(n=>Number.isFinite(+n)))clean.capture=p.capture.map(Number);
 if(Array.isArray(p.investment)&&p.investment.length===3&&p.investment.every(n=>Number.isFinite(+n)))clean.investment=p.investment.map(Number);
 clean.iter=range(clean.iter,0,.8);clean.dev=range(clean.dev,0,300);clean.unit=range(clean.unit,0,1e7);clean.technical=range(clean.technical,0,clean.unit);clean.annual=range(clean.annual,0,1);clean.delay=range(Math.round(clean.delay),0,12);clean.useTech=range(clean.useTech,0,1.5);clean.capture=clean.capture.map(x=>range(x,0,1.5));clean.investment=clean.investment.map(x=>range(x,0,1e8));clean.modified=JSON.stringify({...clean,modified:false})!==JSON.stringify(newParams(k));active=k;params=clean;renderAll();}
function updateField(id,value){if(value===''||!Number.isFinite(Number(value)))return;const v=Number(value);
 if(id==='iter')params.iter=range(v,0,.8);else if(id==='dev')params.dev=range(v,0,300);else if(id==='unit'){params.unit=range(v,0,1e7);params.technical=Math.min(params.technical,params.unit)}else if(id==='tech')params.technical=range(v,0,params.unit);else if(id==='annual')params.annual=range(v/100,0,1);else if(id==='delay')params.delay=range(Math.round(v),0,12);else if(id==='useTech')params.useTech=range(v/100,0,1.5);else if(/^cap[1-3]$/.test(id))params.capture[+id.slice(-1)-1]=range(v/100,0,1.5);else if(/^inv[0-2]$/.test(id))params.investment[+id.slice(-1)]=range(v,0,1e8);
 params.modified=true;renderAll();
}
function renderAll(){renderFinancial()}
function ensure(){const nav=$('#navigation'),main=$('.content')||$('main');if(!nav||!main)return false;if($('#tab-economia4'))return true;
 const links=[['economia4','18','Modelo financiero'],['sensibilidad4','19','Tornado y mapa de calor'],['decision4','20','Evidencia y decisión']];
 for(const [id,n,txt] of links){const b=document.createElement('button');b.className='navlink';b.dataset.tab=id;b.innerHTML=`<span>${n}</span> ${txt}`;nav.append(b)}
 const html=`<section id="tab-economia4" class="view s4-view" aria-labelledby="s4-heading"><div id="s4-main"></div></section><section id="tab-sensibilidad4" class="view s4-view" aria-label="Sensibilidad del modelo financiero"><div id="s4-sens"></div></section><section id="tab-decision4" class="view s4-view" aria-label="Trazabilidad y decisiones financieras"><div id="s4-trace"></div></section>`;
 main.insertAdjacentHTML('beforeend',html);
 const home=$('#tab-inicio .action-strip');if(home)home.insertAdjacentHTML('afterend','<div class="s4-entry"><span>NOVEDAD · EVALUACIÓN FINANCIERA</span><strong>Semana 4: 37 flujos, VPN/TIR, Curva S y J, sensibilidad y gates</strong><p>La actualización recalcula los tres escenarios del libro maestro. No confundir estados V0–V2 ni tres oportunidades piloto con estos escenarios financieros.</p><button class="s4-btn" type="button" data-s4-go="economia4">Abrir modelo financiero ↗</button></div>');
 const old=$('#tab-finanzas .section-header');if(old)old.insertAdjacentHTML('afterend','<div class="s4-entry"><span>LECTURA HEREDADA</span><p>Esta sección presenta la sensibilidad exploratoria anterior. Para los cálculos mensuales oficiales del entregable de Semana 4 y los tres escenarios del libro maestro, utiliza el módulo actualizado.</p><button class="s4-btn" data-s4-go="economia4">Ir al modelo financiero actualizado ↗</button></div>');
 return true;
}
if(!ensure()){console.warn('NEXO S4: no se encontró la estructura base.');return;}
window.NEXO_WEEK4={snapshot:()=>JSON.parse(JSON.stringify({scenario:active,params})),load,render:renderAll,evaluate,CASES};
renderAll();
// El app.js heredado escucha navegación con delegación; en el HTML independiente añadimos esa escucha aquí.
if(document.body.classList.contains('s4-standalone')){$('#navigation').addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(b)navView(b.dataset.tab)});navView('economia4');}
document.addEventListener('click', e=>{
 const b=e.target.closest('[data-s4-case],[data-s4-reset],[data-s4-export],[data-s4-go]');if(!b)return;
 if(b.dataset.s4Case){active=b.dataset.s4Case;params=newParams(active);renderAll();return;}
 if(b.hasAttribute('data-s4-reset')){params=newParams(active);renderAll();return;}
 if(b.dataset.s4Export){exportKind(b.dataset.s4Export);return;}
 if(b.dataset.s4Go){if($('#tab-'+b.dataset.s4Go))navView(b.dataset.s4Go);else alert('Esta sección se visualiza en el Artifact integrado con las semanas anteriores.');}
});
document.addEventListener('change',async e=>{
 const fileInput=e.target.closest('[data-s4-import]');
 if(fileInput){try{const file=fileInput.files?.[0];if(!file)return;if(file.size>2000000)throw Error('Archivo mayor a 2 MB');const data=JSON.parse(await file.text());if(data.schema!=='nexo-innova-week4-v1')throw Error('Esquema incompatible');load({scenario:data.scenario,params:data.params});}catch(err){alert('No fue posible importar el JSON S4: '+err.message)}finally{fileInput.value=''}return;}
 const n=e.target.closest('[data-s4-input]');if(n)updateField(n.dataset.s4Input,n.value);
});
})();
