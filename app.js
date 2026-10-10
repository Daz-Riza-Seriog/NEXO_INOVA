/* NEXO-INNOVA · aplicación estática sin dependencias ni transmisión de datos. */
(() => {
'use strict';
const D=window.NEXO_DATA;
const $=sel=>document.querySelector(sel), $$=sel=>Array.from(document.querySelectorAll(sel));
const deep=o=>JSON.parse(JSON.stringify(o));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=(v,lo,hi)=>Math.min(hi,Math.max(lo,Number(v)||0));
const pct=x=>x==null?'N/D':`${x.toFixed(1).replace('.',',')}%`;
const statusNames={D:'Débil / no validado', AC:'Apoyo cualitativo', VC:'Validación condicionada', V0:'Supuesto PI1'};
const initialLinks=()=>Object.fromEntries(D.hypotheses.map(h=>[h.id,D.actors.filter(a=>a.hypotheses.includes(h.id)).map(a=>a.id)]));
const scenarioDefaults=key=>({
 actors:D.actors.filter(a=>key!=='v0'||!a.addedInPI2).map(a=>({...deep(a),attitude:key==='v0'?null:a.attitude,e:key==='v0'?null:key==='v1'?a.e1:a.e2})),
 links:initialLinks(),
 edited:false, evidenceSimulation:[],
});
let active='v1', tab='inicio',selectedActor='A08',selectedH='H2',selectedBlock='actividades',canvasVersion='v0',compareSaved=null;
let states={v0:scenarioDefaults('v0'),v1:scenarioDefaults('v1'),v2:scenarioDefaults('v2')};
let checkedGates=[];
const state=()=>states[active];
const visibleActors=s=>s.actors;
const isHistoric=()=>active==='v0';
const actor=(id,s=state())=>s.actors.find(x=>x.id===id);
const linksFor=(h,s=state())=>(s.links[h]||[]).filter(id=>!!actor(id,s));
function gap(a){return a.e===null?null:Math.max(0,a.required-a.e)}
function coverage(s, h=null){
 if(!s.actors.length||s.actors.every(a=>a.e===null))return null;
 const aa=h?s.actors.filter(a=>linksFor(h,s).includes(a.id)):s.actors;
 if(!aa.length)return null;
 let denom=0, penalty=0;
 for(const a of aa){const w=a.power*a.interest;denom+=w;penalty+=w*(gap(a)??0)}
 return denom?Math.max(0,Math.min(100,100*(1-penalty/(3*denom)))):null;
}
function statusFor(h){return active==='v0'?'V0':active==='v1'?h.v1:h.v2}
const statusTag=code=>`<span class="tag ${code==='AC'?'green':code==='VC'?'amber':''}">${esc(statusNames[code]||code)}</span>`;
let toastTimer;
function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2600)}
function setTab(t){if(!document.getElementById('tab-'+t))return;tab=t;$$('.view').forEach(e=>e.classList.toggle('active',e.id==='tab-'+t));$$('.navlink').forEach(e=>e.classList.toggle('active',e.dataset.tab===t));const b=$(`.navlink[data-tab="${t}"]`);$('#breadcrumbActive').textContent=b?.textContent.replace(/^\s*\d+/,'').trim().toUpperCase()||t.toUpperCase();window.scrollTo({top:0,behavior:'instant'});$('.sidebar').classList.remove('open')}
function setScenario(k){if(!states[k])return;active=k;canvasVersion=k==='v2'?'v2':'v0';render();toast(k==='v2'?'Escenario V2: metas, no acciones ejecutadas':D.scenarioMeta[k].short)}
function updateMetrics(){
 const c=coverage(state());$('#coverageMetric').textContent=pct(c);$('#coverageDelta').textContent=active==='v0'?'sin medición':active==='v1'?'E estimada':'E* propuesta';$('#coverageBar').style.width=(c||0)+'%';
 const g=state().actors.filter(a=>gap(a)>0);$('#gapMetric').textContent=active==='v0'?'N/D':`${g.length}/${state().actors.length}`;$('#gapSub').textContent=active==='v0'?'PI1 no registró niveles E':g.length?'Actores con brecha pendiente':'Sin brechas modeladas';
 $('#scenarioTag').textContent=active==='v0'?'REFERENCIA HISTÓRICA':active==='v1'?'CONDICIÓN ESTIMADA':'META NO EJECUTADA';$('#scenarioModified').hidden=!state().edited;
 $$('.scenario-btn').forEach(b=>b.classList.toggle('active',b.dataset.scenario===active));
 $('#scenarioExplanation').innerHTML=`<strong>${esc(D.scenarioMeta[active].title)}.</strong> ${esc(D.scenarioMeta[active].desc)} <span style="color:#f4c995">Ningún cambio de controles equivale a prueba técnica o aprobación corporativa.</span>`;
}
function selectOpts(current,options,disabled=false){return options.map(([val,label])=>`<option value="${esc(val)}" ${String(current)===String(val)?'selected':''}>${esc(label)}</option>`).join('')}
function selector(id,field,value,opts,disabled){return `<select aria-label="${esc(field)} del actor ${esc(id)}" data-field="${field}" data-id="${id}" ${disabled?'disabled':''}>${selectOpts(value,opts)}</select>`}
function renderActors(){
 const s=state(), search=($('#actorSearch')?.value||'').toLowerCase().trim(),fl=$('#gapFilter')?.value||'all';
 const list=s.actors.filter(a=>(a.id+' '+a.name+' '+a.role).toLowerCase().includes(search)).filter(a=>fl==='all'||(fl==='gap'&&gap(a)>0)||(fl==='unknown'&&a.attitude===null));
 const scale5=[1,2,3,4,5].map(i=>[i,''+i]),scale4=[1,2,3,4].map(i=>[i,''+i]),scaleE=[0,1,2,3,4].map(i=>[i,i+' · '+['Sin gestionar','Informar','Consultar','Involucrar','Colaborar'][i]]), scaleA=[[null,'ND · Sin evaluar'],[-2,'−2 · Oposición activa'],[-1,'−1 · Oposición pasiva'],[0,'0 · Neutral verificada'],[1,'+1 · Apoyo pasivo'],[2,'+2 · Apoyo activo']];
 $('#actorsBody').innerHTML=list.map(a=>`<tr><td class="actor-name"><strong><span class="actor-id">${a.id}</span>${esc(a.name)}</strong><small>${esc(a.role)}</small></td><td>${selector(a.id,'power',a.power,scale5,isHistoric())}</td><td>${selector(a.id,'interest',a.interest,scale5,isHistoric())}</td><td>${selector(a.id,'attitude',a.attitude,scaleA,isHistoric())}</td><td>${selector(a.id,'required',a.required,scale4,isHistoric())}</td><td>${isHistoric()?'<span class="tag">No registrado</span>':selector(a.id,'e',a.e,scaleE,false)}</td><td>${gap(a)==null?'<span class="tag">N/D</span>':`<span class="gap-chip ${gap(a)===0?'zero':''}">${gap(a)}</span>`}</td><td><button class="action-link" data-show-actor="${a.id}">Ver</button></td></tr>`).join('');
 $('#actorCount').textContent=`${list.length} de ${s.actors.length} actores`;
 renderActorDetail();
}
function renderActorDetail(){const a=actor(selectedActor);if(!a){$('#actorDetail').innerHTML='';return}const linked=D.hypotheses.filter(h=>linksFor(h.id).includes(a.id));
 $('#actorDetail').innerHTML=`<div class="detail-card"><div class="mini-eyebrow">FICHA DE VINCULACIÓN · ${a.id}</div><h3>${esc(a.name)} <span class="tag ${a.attitude===null?'amber':a.attitude>=1?'green':'rose'}">${a.attitude===null?'Postura ND':a.attitude>0?'Apoyo':a.attitude<0?'Adversa (simulación)':'Neutral (simulación)'}</span></h3><p><b>¿Por qué involucrarlo?</b> ${esc(a.why)}</p><div class="detail-columns"><div><small>VÍNCULO NECESARIO</small><p>${esc(a.actions)}</p></div><div><small>EVIDENCIA MÍNIMA</small><p>${esc(a.proof)}</p></div><div><small>ROL / TRAZABILIDAD</small><p>${esc(a.role)}. <b>P/I:</b> ${a.power}/${a.interest}; <b>R:</b> ${a.required}; <b>E:</b> ${a.e===null?'N/D':a.e}.</p></div></div><div class="pill-row">${linked.map(h=>`<button class="small-pill" style="cursor:pointer" data-show-h="${h.id}">${h.id} · ${esc(h.title)}</button>`).join('')}</div><p><small>Fuente del estado: ${esc(a.source)}. Los valores modificados localmente son escenarios de ensayo.</small></p></div>`;
}
function mapSVG(){
 const s=state(),actors=s.actors, W=900,H=590,left=95,right=826,top=72,bottom=506;
 const X=i=>left+(i-1)*(right-left)/4,Y=i=>bottom-(i-1)*(bottom-top)/4;
 let groups={};actors.forEach(a=>{const k=a.power+'|'+a.interest;(groups[k]||=[]).push(a.id)});
 const sx=X(3.5),sy=Y(3.5);
 let out=`<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Matriz poder interés NEXO INNOVA" viewBox="0 0 ${W} ${H}" style="width:100%;font-family:Segoe UI,Arial,sans-serif;background:#112c3a;border-radius:12px"><title>Matriz poder interés ${active.toUpperCase()}</title>`;
 out+=`<rect x="${left}" y="${top}" width="${sx-left}" height="${sy-top}" fill="#26373f" opacity=".65"/><rect x="${sx}" y="${top}" width="${right-sx}" height="${sy-top}" fill="#17433b" opacity=".68"/><rect x="${left}" y="${sy}" width="${sx-left}" height="${bottom-sy}" fill="#102838"/><rect x="${sx}" y="${sy}" width="${right-sx}" height="${bottom-sy}" fill="#24343d" opacity=".8"/>`;
 for(let v=1;v<=5;v++){out+=`<line x1="${X(v)}" x2="${X(v)}" y1="${top}" y2="${bottom}" stroke="#355361" opacity=".55"/><line y1="${Y(v)}" y2="${Y(v)}" x1="${left}" x2="${right}" stroke="#355361" opacity=".55"/><text x="${X(v)}" y="${bottom+25}" fill="#a7c5c8" text-anchor="middle" font-size="13">${v}</text><text x="${left-19}" y="${Y(v)+4}" fill="#a7c5c8" text-anchor="end" font-size="13">${v}</text>`}
 out+=`<line x1="${sx}" y1="${top}" x2="${sx}" y2="${bottom}" stroke="#92b9aa" stroke-width="1.8" stroke-dasharray="6 5"/><line x1="${left}" y1="${sy}" x2="${right}" y2="${sy}" stroke="#92b9aa" stroke-width="1.8" stroke-dasharray="6 5"/>`;
 [['MANTENER SATISFECHOS',left+12,top+21],['GESTIONAR DE CERCA',sx+14,top+21],['MONITOREAR',left+12,sy+25],['CONSULTAR / INVOLUCRAR',sx+14,sy+25]].forEach(e=>out+=`<text x="${e[1]}" y="${e[2]}" fill="#92b7ae" font-size="12" font-weight="800" letter-spacing=".8">${e[0]}</text>`);
 out+=`<text x="${(left+right)/2}" y="${H-15}" font-size="16" font-weight="700" fill="#d0e1e0" text-anchor="middle">INTERÉS →</text><text x="24" y="${(bottom+top)/2}" font-size="16" font-weight="700" fill="#d0e1e0" text-anchor="middle" transform="rotate(-90 24 ${(bottom+top)/2})">PODER →</text>`;
 for(const a of actors){const same=groups[a.power+'|'+a.interest],idx=same.indexOf(a.id),n=same.length;const ring=n>1?Math.min(32,12+5*n):0,angle=(2*Math.PI*idx/n)-Math.PI/2;const dx=n===1?0:Math.cos(angle)*ring,dy=n===1?0:Math.sin(angle)*ring;
 const r=18, x=X(a.interest)+dx,y=Y(a.power)+dy;const col=a.attitude===null?'#829ba8':a.attitude<0?'#e58b9a':a.attitude===0?'#93b5ca':'#6cdbb2';const stroke=gap(a)>0?'#ffc17e':'#2c605c'; const weight=gap(a)>0?4:1.6;
 out+=`<g class="matrix-node" data-map-actor="${a.id}" tabindex="0" role="button" aria-label="${esc(a.id+' '+a.name)}"><title>${esc(a.id+' · '+a.name+' | P='+a.power+' I='+a.interest+' | Postura '+(a.attitude===null?'ND':a.attitude)+' | Brecha '+(gap(a)??'N/D'))}</title><circle class="node-circle" cx="${x}" cy="${y}" r="${selectedActor===a.id?r+4:r}" fill="${col}" stroke="${selectedActor===a.id?'#ffffff':stroke}" stroke-width="${selectedActor===a.id?4:weight}"/><text x="${x}" y="${y+4}" text-anchor="middle" font-size="10" font-weight="900" fill="#082a2c">${a.id.replace('A','')}</text></g>`;
 }
 out+='</svg>';return out;
}
function renderMap(){ $('#matrixHost').innerHTML=mapSVG();const a=actor(selectedActor);$('#mapDetailTitle').textContent=a?`${a.id} · ${a.name}`:'Selecciona un actor';$('#mapDetailText').textContent=a?a.why:'Selecciona un círculo para consultar el actor.';$('#mapDetailStats').innerHTML=a?`<div class="pill-row"><span class="small-pill">Poder ${a.power}/5</span><span class="small-pill">Interés ${a.interest}/5</span><span class="small-pill">Postura ${a.attitude==null?'ND':a.attitude}</span><span class="small-pill">Brecha ${gap(a)==null?'N/D':gap(a)}</span></div>`:'';$('#mapJumpActor').disabled=!a;
 const quad=[['Gestionar de cerca',a=>a.power>=4&&a.interest>=4],['Mantener satisfecho',a=>a.power>=4&&a.interest<4],['Consultar / involucrar',a=>a.power<4&&a.interest>=4],['Monitorear',a=>a.power<4&&a.interest<4]];
 $('#quadrants').innerHTML=quad.map(([title,fn])=>`<div><strong>${title}</strong><small>${state().actors.filter(fn).map(a=>a.id).join(' · ')||'Sin actores registrados'}</small></div>`).join('');
}
function renderH(){const currentH=D.hypotheses.find(h=>h.id===selectedH)||D.hypotheses[0];
 $('#hypothesisGrid').innerHTML=D.hypotheses.map(h=>{const c=coverage(state(),h.id),code=statusFor(h);return `<button class="h-card ${h.id===selectedH?'active':''}" data-select-h="${h.id}"><div class="h-top"><span class="h-id">${h.id} / 06</span>${statusTag(code)}</div><span class="h-title">${esc(h.title)}</span><span class="h-subtitle">${esc(h.subtitle)}</span><span class="h-progress-meta">Cobertura de vinculación <b>${pct(c)}</b></span><div class="bartrack"><span style="width:${c||0}%"></span></div><span class="h-tail">${linksFor(h.id).length} actores vinculados · Consulta condiciones →</span></button>`}).join('');
 const h=currentH,code=statusFor(h);const links=linksFor(h.id);
 $('#hypothesisDetail').innerHTML=`<div class="mini-eyebrow">${h.id} / HIPÓTESIS SELECCIONADA</div><h3>${esc(h.title)} ${statusTag(code)}</h3><p class="h-detail-explainer"><b>Enunciado:</b> ${esc(h.claim)}</p><div class="evidence-grid"><div><small>EVIDENCIA DISPONIBLE</small><p>${esc(h.evidence)}</p></div><div><small>BRECHA DE VALIDACIÓN</small><p>${esc(h.weakness)}</p></div><div><small>ACCIÓN PROPUESTA</small><p>${esc(h.action)}</p></div><div><small>PRUEBA REQUERIDA</small><p>${esc(h.test)}</p></div></div><b style="font-size:12px">Actores vinculados</b><div class="pill-row" style="margin-top:10px">${links.map(id=>`<button class="small-pill" data-show-actor="${id}" style="cursor:pointer">${id} · ${esc(actor(id)?.name)}</button>`).join('')||'<span class="tag amber">Sin vínculos configurados</span>'}</div>`;
}
const columnHtml=(ids)=>`<div class="canvas-column ${ids.length>1?'split':''}">${ids.map(id=>blockHtml(id)).join('')}</div>`;
function blockHtml(id){const b=D.canvas[id],hyp=D.hypotheses.filter(h=>h.blocks.includes(id));return `<button class="canvas-block ${selectedBlock===id?'active':''}" data-block="${id}"><h4>${esc(b.name)}</h4><p>${esc(b[canvasVersion])}</p><div class="canvas-markers">${hyp.map(h=>`<span>${h.id}</span>`).join('')}</div></button>`}
function renderCanvas(){ $('#canvasVersion').value=canvasVersion;
 $('#canvasHost').innerHTML=columnHtml(['socios'])+columnHtml(['actividades','recursos'])+columnHtml(['propuesta'])+columnHtml(['relaciones','canales'])+columnHtml(['segmentos'])+`<div class="canvas-footer-row">${blockHtml('costos')}${blockHtml('ingresos')}</div>`;
 const b=D.canvas[selectedBlock], related=D.hypotheses.filter(h=>h.blocks.includes(selectedBlock)),ids=[...new Set(related.flatMap(h=>linksFor(h.id)))];
 $('#canvasDetail').innerHTML=`<div class="mini-eyebrow">TRAZABILIDAD DEL BLOQUE SELECCIONADO</div><h3>${esc(b.name)}</h3><p><b>Razón del ajuste:</b> ${esc(D.canvasDiff[selectedBlock])}</p><div class="canvas-diff-grid"><div><small>V0 · PI1 DOCUMENTAL</small><p>${esc(b.v0)}</p></div><div><small>V2 · PI2 PROPUESTO</small><p>${esc(b.v2)}</p></div></div><div class="mini-eyebrow">HIPÓTESIS QUE SOSTIENEN EL BLOQUE</div><div class="pill-row" style="margin:9px 0">${related.map(h=>`<button class="small-pill" data-show-h="${h.id}" style="cursor:pointer">${h.id} · ${esc(h.title)}</button>`).join('')}</div><div class="mini-eyebrow">ACTORES QUE PUEDEN CONTRASTARLO</div><div class="pill-row" style="margin-top:9px">${ids.map(id=>`<button class="small-pill" data-show-actor="${id}" style="cursor:pointer">${id}</button>`).join('')||'Sin vínculos activos'}</div><p><small>La relación bloque–hipótesis proviene de la interpretación del documento; los vínculos actor–hipótesis son editables para probar decisiones.</small></p>`;
}
function renderLinks(){let hd=`<table class="data-table links-table"><thead><tr><th>Actor (P × I)</th>${D.hypotheses.map(h=>`<th title="${esc(h.title)}">${h.id}</th>`).join('')}<th>Total</th></tr></thead><tbody>`;
 for(const a of state().actors){let total=0;hd+=`<tr><td><span class="actor-id">${a.id}</span>${esc(a.name)} <small>· ${a.power*a.interest}</small></td>`;for(const h of D.hypotheses){let flag=linksFor(h.id).includes(a.id);total+=Number(flag);hd+=`<td><input class="link-check" type="checkbox" aria-label="Vincular ${a.id} con ${h.id}" data-link-h="${h.id}" data-link-actor="${a.id}" ${flag?'checked':''} ${isHistoric()?'disabled':''}></td>`}hd+=`<td><b>${total}</b></td></tr>`}hd+='</tbody></table>';$('#linksHost').innerHTML=hd;
 const old=$('#auditSelect')?.value||'global';const options=[['global','Todos los actores'],...D.hypotheses.map(h=>[h.id,h.id+' · '+h.title])];
 $('#audit').innerHTML=`<label style="font-size:12px;color:#a7c5c7">Detalle de cálculo <select id="auditSelect" class="input" style="margin:8px 0">${selectOpts(old,options)}</select></label><div id="auditDetail"></div>`;renderAudit();
}
function renderAudit(){let chosen=$('#auditSelect')?.value||'global';let actors=chosen==='global'?state().actors:state().actors.filter(a=>linksFor(chosen).includes(a.id));let den=0,num=0;
 let rows=actors.map(a=>{let w=a.power*a.interest,g=gap(a),wg=g==null?null:w*g;den+=w;num+=wg||0;return `<tr><td>${a.id} · ${esc(a.name)}</td><td>${a.power}×${a.interest}=${w}</td><td>${a.required}</td><td>${a.e===null?'N/D':a.e}</td><td>${g==null?'N/D':g}</td><td>${wg==null?'N/D':wg}</td></tr>`}).join('');
 let cc=chosen==='global'?coverage(state()):coverage(state(),chosen);
 $('#auditDetail').innerHTML=`<div class="table-scroller"><table><thead><tr><th>Actor</th><th>P×I</th><th>R</th><th>E</th><th>Brecha</th><th>Exposición ponderada</th></tr></thead><tbody>${rows}</tbody><tfoot><tr><td colspan="5">Σ(P×I) = ${den} · Σ(P×I×brecha) = ${state().actors.every(a=>a.e===null)?'N/D':num}</td><td>${pct(cc)}</td></tr></tfoot></table></div><p><small>R se estableció de manera diferenciada por autoridad y rol conforme al plan académico; no se recalcula automáticamente desde P/I/A. ${active==='v0'?'No hay E documentado en PI1.':''}</small></p>`;
}
function renderComparison(){const v1=scenarioDefaults('v1'),v2=scenarioDefaults('v2');let v1c=coverage(v1),v2c=coverage(v2),cur=coverage(state());const mode=state().edited?`<div class="compare-card current"><small>SIMULACIÓN ACTIVA · ${active.toUpperCase()}</small><strong>${pct(cur)}</strong><p>Ediciones exploratorias realizadas en la pantalla actual.</p></div>`:'';
 const cards=`<div class="compare-top"><div class="compare-card ${active==='v0'?'current':''}"><small>V0 · PI1 · DOCUMENTAL</small><strong>N/D</strong><p>Canvas original y 12 actores; E no registrado. No se reconstruyen porcentajes retrospectivos.</p></div><div class="compare-card ${active==='v1'?'current':''}"><small>V1 · PI2 · CONDICIÓN ESTIMADA</small><strong>${pct(v1c)}</strong><p>Con tres apoyos cualitativos y brechas de involucramiento aún abiertas.</p></div><div class="compare-card ${active==='v2'?'current':''}"><small>V2 · PI2 · PLAN CONDICIONAL</small><strong>${pct(v2c)}</strong><p>Metas E* definidas; resultado hipotético si se ejecutan las acciones.</p></div></div>`;
 let table=`<div class="table-scroller"><table class="compare-h-table"><thead><tr><th>Hipótesis</th><th>V0 · PI1</th><th>V1 · diagnóstico</th><th>V2 · propuesta</th>${state().edited?'<th>Ensayo actual</th>':''}<th>Prueba aún pendiente</th></tr></thead><tbody>`;
 for(const h of D.hypotheses){const c1=coverage(v1,h.id),c2=coverage(v2,h.id), c=coverage(state(),h.id);let cell=(n,code)=>`<b>${pct(n)}</b><div class="tinybar"><span style="width:${n||0}%"></span></div><small style="color:#aabfc6">${esc(code)}</small>`;
 table+=`<tr><td><b>${h.id}</b> · ${esc(h.title)}</td><td><span class="tag">No medido</span></td><td>${cell(c1,h.v1)}</td><td>${cell(c2,h.v2)}</td>${state().edited?`<td>${cell(c,'Simulación')}</td>`:''}<td style="max-width:330px;color:#bacbd0">${esc(h.test)}</td></tr>`;
 }
 table+='</tbody></table></div>';
 $('#comparisonHost').innerHTML=`<div class="comparison-layout">${cards}${mode}<div class="bottom-hint" style="margin-top:12px">Diferencia proyectada V1 → V2: <b style="color:#9fe9cb">+${(v2c-v1c).toFixed(1).replace('.',',')} puntos</b> de cobertura, NO puntos de validez técnica ni probabilidad de éxito.</div>${table}</div>`;
}
function renderGates(){$('#gatesHost').innerHTML=D.gates.map((g,i)=>`<label class="gate-item"><input type="checkbox" data-gate="${i}" ${checkedGates.includes(i)?'checked':''}/><span><b>${esc(g.label)}</b><small>${esc(g.detail)}</small></span><span class="small-pill">${g.code}</span></label>`).join('');const n=checkedGates.length,total=D.gates.length;
 $('#gateResult').innerHTML=`<b>Simulación: ${n} / ${total} condiciones marcadas.</b> ${n===total?'El ensayo cumple todas las condiciones listadas, pero NO demuestra que estén cumplidas en la empresa ni concede autorización.':'No se recomendaría escalar sin los soportes faltantes, particularmente la autorización formal y los resultados del piloto.'}`;
}
function render(){updateMetrics();renderActors();renderMap();renderH();renderCanvas();renderLinks();renderComparison();renderGates()}
const pick=(id)=>{selectedActor=id;renderActorDetail();renderMap()};
function resetCurrent(){states[active]=scenarioDefaults(active);if(selectedActor==='A13'&&active==='v0')selectedActor='A08';render();toast('Valores originales del escenario restaurados')}
function saveText(name,content,mime='text/plain;charset=utf-8'){const a=document.createElement('a');const url=URL.createObjectURL(new Blob([content],{type:mime}));a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000)}
function csv(rows){return '\uFEFF'+rows.map(row=>row.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(';')).join('\r\n')}
function saveActorsCSV(){saveText(`nexo_innova_actores_${active}.csv`,csv([['ID','Interesado','P','I','Actitud (ND=sin evidencia)','R','E','Brecha','H vinculadas','Acción propuesta','Evidencia'],...state().actors.map(a=>[a.id,a.name,a.power,a.interest,a.attitude==null?'ND':a.attitude,a.required,a.e==null?'N/D':a.e,gap(a)??'N/D',D.hypotheses.filter(h=>linksFor(h.id).includes(a.id)).map(h=>h.id).join(', '),a.actions,a.proof])]),'text/csv;charset=utf-8')}
function saveComparisonCSV(){const vv1=scenarioDefaults('v1'),vv2=scenarioDefaults('v2');saveText('nexo_innova_comparacion.csv',csv([['Hipótesis','V0 cobertura','V1 cobertura','V1 evidencia','V2 cobertura (meta)','V2 evidencia','Prueba pendiente'],...D.hypotheses.map(h=>[h.id,'N/D',pct(coverage(vv1,h.id)),h.v1,pct(coverage(vv2,h.id)),h.v2,h.test]),['Global','N/D',pct(coverage(vv1)),'Estimado',pct(coverage(vv2)),'Condicionado','No implica aprobación']]),'text/csv;charset=utf-8')}
function saveState(){const result={schema:'nexo-innova-pi2-v1', exportedAt:new Date().toISOString(),scenario:active,states,checkedGates,reflection:$('#reflection').value,notice:'Los valores son escenarios didácticos; NO constituyen validación ni aprobación corporativa.'};saveText(`nexo_innova_escenario_${active}.json`,JSON.stringify(result,null,2),'application/json;charset=utf-8');toast('Archivo JSON generado en tu dispositivo')}
async function importState(file){if(!file)return;try{if(file.size>2_000_000)throw Error('El archivo excede 2 MB');const data=JSON.parse(await file.text());if(data.schema!=='nexo-innova-pi2-v1'||!data.states)throw Error('El JSON no pertenece a este simulador');for(const k of ['v0','v1','v2']){const imported=data.states[k];if(!imported||!Array.isArray(imported.actors)||typeof imported.links!=='object')throw Error('Faltan datos del escenario '+k);const base=scenarioDefaults(k);for(const a of base.actors){const given=imported.actors.find(x=>x.id===a.id);if(!given)continue;a.power=num(given.power,1,5);a.interest=num(given.interest,1,5);a.required=num(given.required,1,4);a.e=k==='v0'?null:num(given.e,0,4);a.attitude=k==='v0'||given.attitude===null?null:num(given.attitude,-2,2)}for(const h of D.hypotheses){if(Array.isArray(imported.links[h.id]))base.links[h.id]=[...new Set(imported.links[h.id].filter(id=>base.actors.some(a=>a.id===id)))];}base.edited=!!imported.edited;states[k]=base;}active=states[data.scenario]?data.scenario:'v1';selectedActor=active==='v0'?'A08':'A08';checkedGates=Array.isArray(data.checkedGates)?data.checkedGates.filter(i=>Number.isInteger(i)&&i>=0&&i<D.gates.length):[];$('#reflection').value=String(data.reflection||'').slice(0,3000);canvasVersion=active==='v2'?'v2':'v0';render();toast('Escenario importado y restaurado')}catch(e){toast('No se pudo importar: '+e.message)}finally{$('#importInput').value=''}}
function exportSVG(filename,markup){if(!markup.includes('xmlns='))markup=markup.replace('<svg','<svg xmlns="http://www.w3.org/2000/svg"');saveText(filename,markup,'image/svg+xml;charset=utf-8');toast('Figura SVG lista para insertar en Word')}
function cleanSVG(svg){const styles=`<style>.matrix-node{cursor:pointer}.matrix-node:hover circle{stroke-width:4}text{font-family:Segoe UI,Arial,sans-serif}</style>`;return svg.replace(/(<svg\b[^>]*>)/,'$1'+styles)}
function exportMap(){exportSVG(`nexo_matriz_poder_interes_${active}.svg`,cleanSVG(mapSVG()))}
function svgText(str,x,y,sz=14,weight=400,color='#d9eee6',anchor='start'){return `<text x="${x}" y="${y}" font-family="Segoe UI,Arial,sans-serif" font-size="${sz}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}">${esc(str)}</text>`}
function wrap(s,max=44){let out=[],line='';for(const word of String(s).split(/\s+/)){if((line+' '+word).trim().length>max&&line){out.push(line);line=word}else line+=(line?' ':'')+word}if(line)out.push(line);return out}
function exportHypotheses(){let out=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 610" width="980" height="610"><rect width="980" height="610" fill="#112737"/>`+svgText('NEXO-INNOVA · Cobertura de vinculación por hipótesis',35,55,26,800,'#e5f8ec')+svgText(`${D.scenarioMeta[active].title} · Cobertura de actores, NO validez técnica`,35,87,15,400,'#a9c8c5');D.hypotheses.forEach((h,i)=>{const y=135+i*68,c=coverage(state(),h.id),code=statusFor(h);out+=svgText(h.id+' · '+h.title,35,y,16,700,'#c4e7dc')+`<rect x="390" y="${y-17}" rx="8" width="410" height="21" fill="#29475a"/><rect x="390" y="${y-17}" rx="8" width="${4.1*(c||0)}" height="21" fill="#54c5a4"/>`+svgText(pct(c),826,y,16,750,'#e4fff4')+svgText(code==='V0'?'Sin evaluar':statusNames[code],35,y+22,12,400,'#dcbf8e')});out+=svgText('Fórmula exploratoria de cobertura. Los valores V2 son metas condicionadas, no resultados verificados.',35,574,12,400,'#9fb8bf')+'</svg>';exportSVG(`nexo_solidez_hipotesis_${active}.svg`,out)}
function exportCanvas(){const width=1150,blocks=[['socios',24,125,205,385],['actividades',239,125,205,188],['recursos',239,323,205,187],['propuesta',454,125,230,385],['relaciones',694,125,205,188],['canales',694,323,205,187],['segmentos',909,125,217,385],['costos',24,522,550,155],['ingresos',584,522,542,155]];
 let out=`<svg xmlns="http://www.w3.org/2000/svg" width="1150" height="730" viewBox="0 0 1150 730"><rect width="1150" height="730" fill="#0c2230"/>`+svgText('NEXO-INNOVA · Business Model Canvas',27,48,28,800,'#e9fff1')+svgText(`${canvasVersion==='v0'?'V0 · PI1 documental':'V2 · PI2 propuesta condicionada'} | Los códigos señalan hipótesis relacionadas`,27,78,16,400,'#a7cdc0');
 for(const [id,x,y,w,h] of blocks){const b=D.canvas[id],related=D.hypotheses.filter(t=>t.blocks.includes(id)).map(t=>t.id).join(' · ');out+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" stroke="#477a78" fill="#183c43"/>`+svgText(b.name.toUpperCase(),x+13,y+28,14,800,'#9af1d2');const max=Math.floor((w-25)/7.5);let lines=wrap(b[canvasVersion],max);lines.slice(0,Math.max(2,Math.floor((h-97)/22))).forEach((line,i)=>out+=svgText(line,x+13,y+58+i*22,14,400,'#e1eee9'));out+=svgText(related,x+13,y+h-15,12,700,'#8edcbd')}
 out+=svgText('Fuente: actualización del Canvas del entregable Semana 1 · Modelo sin nueva unidad de ingresos',27,705,12,400,'#a5bbb9')+'</svg>';exportSVG(`nexo_canvas_${canvasVersion}.svg`,out)}
function copyReflection(){const text=composeReport();if(navigator.clipboard?.writeText){navigator.clipboard.writeText(text).then(()=>toast('Análisis copiado al portapapeles')).catch(()=>copyFallback(text))}else copyFallback(text)}
function copyFallback(text){const t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.top='-9999px';document.body.appendChild(t);t.select();try{document.execCommand('copy');toast('Análisis copiado')}catch{toast('Utiliza la descarga TXT para conservarlo')}t.remove()}
function composeReport(){return `NEXO-INNOVA | PI2 · Semana 1\nEscenario: ${D.scenarioMeta[active].title}${state().edited?' (simulación modificada)':''}\nCobertura ponderada (indicador exploratorio): ${pct(coverage(state()))}\nActores con brecha: ${state().actors.filter(a=>gap(a)>0).length}\nHipótesis: ${D.hypotheses.map(h=>h.id+' '+pct(coverage(state(),h.id))+' / '+statusNames[statusFor(h)]).join(' | ')}\nCondiciones de gate seleccionadas SOLO EN SIMULACIÓN: ${checkedGates.length}/${D.gates.length}\n\nReflexión del equipo:\n${$('#reflection').value||'(Sin diligenciar)'}\n\nADVERTENCIA: Los valores V1 son estimaciones; V2 es plan condicionado. No constituyen aprobación empresarial, validación experimental ni evaluación financiera actualizada.`}
function bind(){
 $('#navigation').addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(b)setTab(b.dataset.tab)});
 $('#menuButton').addEventListener('click',()=>$('.sidebar').classList.toggle('open'));
 $('#scenarioButtons').addEventListener('click',e=>{const b=e.target.closest('[data-scenario]');if(b)setScenario(b.dataset.scenario)});
 document.addEventListener('click',e=>{
   const go=e.target.closest('[data-go]');if(go){if(go.dataset.setScenario)setScenario(go.dataset.setScenario);setTab(go.dataset.go)}
   const aa=e.target.closest('[data-show-actor]');if(aa){pick(aa.dataset.showActor);setTab('actores')}
   const ah=e.target.closest('[data-show-h]');if(ah){selectedH=ah.dataset.showH;renderH();setTab('supuestos')}
   const h=e.target.closest('[data-select-h]');if(h){selectedH=h.dataset.selectH;renderH()}
   const block=e.target.closest('[data-block]');if(block){selectedBlock=block.dataset.block;renderCanvas()}
   const ma=e.target.closest('[data-map-actor]');if(ma){pick(ma.dataset.mapActor)}
 });
 $('#matrixHost').addEventListener('keydown',e=>{const a=e.target.closest('[data-map-actor]');if(a&&(e.key==='Enter'||e.key===' ')){e.preventDefault();pick(a.dataset.mapActor)}});
 $('#actorsBody').addEventListener('change',e=>{const select=e.target.closest('[data-field]');if(!select||isHistoric())return;const a=actor(select.dataset.id),field=select.dataset.field;if(!a)return;a[field]=field==='attitude'?(select.value==='null'?null:num(select.value,-2,2)):num(select.value,field==='e'?0:1,field==='required'?4:5);state().edited=true;render()});
 $('#actorSearch').addEventListener('input',renderActors);$('#gapFilter').addEventListener('change',renderActors);
 $('#canvasVersion').addEventListener('change',e=>{canvasVersion=e.target.value;renderCanvas()});
 $('#linksHost').addEventListener('change',e=>{const inp=e.target.closest('[data-link-h]');if(!inp)return;const h=inp.dataset.linkH,id=inp.dataset.linkActor;const current=state().links[h]||[];state().links[h]=inp.checked?[...new Set([...current,id])]:current.filter(x=>x!==id);state().edited=true;render()});
 $('#audit').addEventListener('change',e=>{if(e.target.id==='auditSelect')renderAudit()});
 $('#resetButton').addEventListener('click',resetCurrent);$('#resetLinks').addEventListener('click',()=>{state().links=initialLinks();state().edited=true;render();toast('Vínculos del documento restablecidos')});
 $('#exportButton').addEventListener('click',saveState);$('#importInput').addEventListener('change',e=>importState(e.target.files[0]));
 $('#actorsCSV').addEventListener('click',saveActorsCSV);$('#comparisonCSV').addEventListener('click',saveComparisonCSV);$('#downloadMatrix').addEventListener('click',exportMap);$('#downloadAssumptions').addEventListener('click',exportHypotheses);$('#downloadCanvas').addEventListener('click',exportCanvas);
 $('#mapJumpActor').addEventListener('click',()=>{if(actor(selectedActor)){renderActorDetail();setTab('actores')}});
 $('#gatesHost').addEventListener('change',e=>{const input=e.target.closest('[data-gate]');if(!input)return;const n=+input.dataset.gate;checkedGates=input.checked?[...new Set([...checkedGates,n])]:checkedGates.filter(x=>x!==n);renderGates()});$('#clearGates').addEventListener('click',()=>{checkedGates=[];renderGates()});
 $('#copyReflection').addEventListener('click',copyReflection);$('#downloadReport').addEventListener('click',()=>saveText('nexo_innova_reflexion.txt',composeReport()));
}
window.NEXO_DEBUG={coverage,scenarioDefaults,getState:()=>state(),getActive:()=>active,setScenario,setTab};
bind();render();setTab('inicio');
})();
