/* Figuras interactivas de Mecánica de Fluidos. Vanilla JS + canvas. */
(function(){
const C = {};
function paleta(el){const cs=getComputedStyle(el);const v=n=>cs.getPropertyValue(n).trim();
  C.bg=v('--surface')||'#fff';C.grid=v('--line')||'#d5dcd9';C.text=v('--fg')||'#16211d';C.muted=v('--muted')||'#56635e';
  C.a=v('--tc')||v('--accent')||'#b4232f';C.b=v('--warn')||'#b8730c';C.c=v('--c6')||'#2c8a52';C.d=v('--c5')||'#c43d63';C.e=v('--c4')||'#b8730c';C.f=v('--c2')||'#3a63c4';}
const F=n=>Number.isInteger(n)?String(n):(Math.abs(n)<1e-9?'0':n.toFixed(2).replace('.',','));

function build(el, spec){
  el.classList.add('sim-box');paleta(el);
  const ctrls=document.createElement('div'); ctrls.className='ctrl sim-ctrls';
  const cv=document.createElement('canvas'); cv.width=spec.w||640; cv.height=spec.h||360; cv.className='sim-cv';
  const out=document.createElement('div'); out.className='readout sim-out';
  el.append(ctrls,cv,out);
  const st={};
  (spec.sliders||[]).forEach(s=>{st[s.k]=s.v;const lab=document.createElement('label');const sp=document.createElement('span');sp.textContent=`${s.l}: ${F(s.v)} ${s.u||''}`;
    const inp=document.createElement('input');inp.type='range';inp.min=s.min;inp.max=s.max;inp.step=s.step||0.01;inp.value=s.v;
    inp.oninput=()=>{st[s.k]=parseFloat(inp.value);sp.textContent=`${s.l}: ${F(st[s.k])} ${s.u||''}`;draw();};lab.append(sp,inp);ctrls.append(lab);});
  (spec.selects||[]).forEach(s=>{st[s.k]=s.v;const lab=document.createElement('label');const sp=document.createElement('span');sp.textContent=s.l;
    const sel=document.createElement('select');s.opts.forEach(o=>{const op=document.createElement('option');op.value=o[0];op.textContent=o[1];if(o[0]===s.v)op.selected=true;sel.append(op);});
    sel.onchange=()=>{st[s.k]=sel.value;draw();};lab.append(sp,sel);ctrls.append(lab);});
  const g=cv.getContext('2d');
  const api={st,cv,g,out,W:cv.width,H:cv.height,
    clear(){paleta(el);g.fillStyle=C.bg;g.fillRect(0,0,cv.width,cv.height);},
    txt(s,x,y,col,sz,al){g.fillStyle=col||C.text;g.font=(sz||13)+'px system-ui';g.textAlign=al||'left';g.fillText(s,x,y);},
    arrow(x1,y1,x2,y2,col,wd){g.strokeStyle=g.fillStyle=col;g.lineWidth=wd||2.5;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();const a=Math.atan2(y2-y1,x2-x1),L=10;g.beginPath();g.moveTo(x2,y2);g.lineTo(x2-L*Math.cos(a-0.4),y2-L*Math.sin(a-0.4));g.lineTo(x2-L*Math.cos(a+0.4),y2-L*Math.sin(a+0.4));g.closePath();g.fill();},
    line(x1,y1,x2,y2,col,wd,dash){g.strokeStyle=col;g.lineWidth=wd||1.5;g.setLineDash(dash||[]);g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.setLineDash([]);},
    circ(x,y,r,col,fill){g.beginPath();g.arc(x,y,r,0,Math.PI*2);if(fill){g.fillStyle=col;g.fill();}else{g.strokeStyle=col;g.lineWidth=2;g.stroke();}},
    html(h){out.innerHTML=h;},
    // sistema de ejes cartesiano
    axes(cx,cy,u,xmin,xmax,ymin,ymax){for(let i=Math.ceil(xmin);i<=xmax;i++)api.line(cx+i*u,cy-ymax*u,cx+i*u,cy-ymin*u,C.grid,1);for(let j=Math.ceil(ymin);j<=ymax;j++)api.line(cx+xmin*u,cy-j*u,cx+xmax*u,cy-j*u,C.grid,1);api.line(cx+xmin*u,cy,cx+xmax*u,cy,C.muted,1.5);api.line(cx,cy-ymax*u,cx,cy-ymin*u,C.muted,1.5);}
  };
  function draw(){spec.draw(api);}
  draw(); return api;
}
const SIMS={};

/* ---- Mecánica de Fluidos: figuras interactivas ---- */
const NQ=x=>{const r=Math.round(x*1000)/1000;return (Math.abs(r-Math.round(r))<1e-9?String(Math.round(r)):r.toFixed(3).replace(/0+$/,'')).replace('.',',');};
const N0=x=>(Math.abs(x)<0.5?0:x).toFixed(0);
const N1=x=>(Math.abs(x)<5e-2?0:x).toFixed(1).replace('.',',');
const N2=x=>(Math.abs(x)<5e-3?0:x).toFixed(2).replace('.',',');
const N3=x=>(Math.abs(x)<5e-4?0:x).toFixed(3).replace('.',',');
const G=9.81;
const ticks=(max,n)=>{const raw=max/n,p=Math.pow(10,Math.floor(Math.log10(raw))),c=[1,2,2.5,5,10].find(k=>k*p>=raw)*p;const o=[];for(let v=c;v<=max*1.0001;v+=c)o.push(v);return o;};
const Rbox=(a,x,y,w,h,col,fill)=>{if(fill){a.g.fillStyle=col;a.g.globalAlpha=0.14;a.g.fillRect(x,y,w,h);a.g.globalAlpha=1;}
  a.g.strokeStyle=col;a.g.lineWidth=2;a.g.strokeRect(x,y,w,h);};
const curve=(a,pts,col,wd,dash)=>{a.g.strokeStyle=col;a.g.lineWidth=wd||2;a.g.setLineDash(dash||[]);a.g.beginPath();
  pts.forEach((p,i)=>i?a.g.lineTo(p[0],p[1]):a.g.moveTo(p[0],p[1]));a.g.stroke();a.g.setLineDash([]);};
const fillPoly=(a,pts,col,al)=>{a.g.fillStyle=col;a.g.globalAlpha=al||0.18;a.g.beginPath();
  pts.forEach((p,i)=>i?a.g.lineTo(p[0],p[1]):a.g.moveTo(p[0],p[1]));a.g.closePath();a.g.fill();a.g.globalAlpha=1;};

/* T1 · Viscosidad: perfil entre placas y fluidos no newtonianos */
SIMS.viscosidad=el=>build(el,{w:680,h:370,
 sliders:[{k:'mu',v:0.12,min:0.001,max:1,step:0.001,l:'Viscosidad μ',u:'Pa·s'},
  {k:'V',v:6.28,min:0.2,max:15,step:0.1,l:'Velocidad de la placa',u:'m/s'},
  {k:'e',v:0.1,min:0.02,max:2,step:0.02,l:'Huelgo e',u:'mm'},
  {k:'A',v:300,min:50,max:1000,step:10,l:'Área de contacto',u:'cm²'}],
 selects:[{k:'tipo',v:'newt',l:'Tipo de fluido',opts:[['newt','Newtoniano'],['pseudo','Pseudoplástico (n = 0,6)'],['dila','Dilatante (n = 1,5)'],['bing','Plástico de Bingham']]}],
 draw(a){a.clear();const s=a.st;
  const e=s.e/1000, A=s.A/1e4;
  const grad=s.V/e, tau=s.mu*grad, F=tau*A, P=F*s.V;
  // perfil de velocidad
  const ox=60,oy=290,W=230,H=190;
  a.g.fillStyle=C.grid;a.g.fillRect(ox-10,oy,W+20,10);a.g.fillRect(ox-10,oy-H-10,W+20,10);
  a.txt('placa móvil  V = '+N2(s.V)+' m/s',ox,oy-H-18,C.a,11);
  a.txt('placa fija',ox,oy+26,C.muted,11);
  a.arrow(ox+W*0.5,oy-H-16,ox+W*0.5+40,oy-H-16,C.a,2);
  const n={newt:1,pseudo:0.6,dila:1.5,bing:1}[s.tipo];
  for(let k=0;k<=10;k++){const y=k/10;
    let u = s.tipo==='bing' ? (y<0.2?0:(y-0.2)/0.8) : Math.pow(y,1/n);
    const px=ox+u*W, py=oy-y*H;
    a.arrow(ox,py,px,py,C.f,1.6);}
  const pp=[];for(let k=0;k<=40;k++){const y=k/40;
    let u = s.tipo==='bing' ? (y<0.2?0:(y-0.2)/0.8) : Math.pow(y,1/n);
    pp.push([ox+u*W,oy-y*H]);}
  curve(a,pp,C.a,2.5);
  a.txt('u(y)',ox+W+6,oy-H*0.5,C.a,12);
  // grafica tau - gradiente
  const bx=400,by=290,BW=235,BH=190;
  a.line(bx,by,bx+BW,by,C.muted,1.5);a.line(bx,by-BH-10,bx,by+6,C.muted,1.5);
  a.txt('τ',bx+4,by-BH-16,C.text,12);a.txt('du/dy',bx+BW-36,by+22,C.muted,11);
  [['newt',1,C.a],['pseudo',0.6,C.c],['dila',1.5,C.f],['bing',1,C.b]].forEach(([t,nn,col])=>{
    const p=[];for(let k=0;k<=40;k++){const x=k/40;
      let yv = t==='bing' ? 0.25+0.65*x : Math.pow(x,nn);
      p.push([bx+x*BW,by-yv*BH*0.85]);}
    curve(a,p,col,t===s.tipo?3:1.4,t===s.tipo?[]:[4,3]);});
  a.txt('newtoniano',bx+BW*0.62,by-BH*0.60,C.a,10);
  a.txt('pseudoplástico',bx+6,by-BH*0.80,C.c,10);
  a.txt('dilatante',bx+BW*0.60,by-BH*0.28,C.f,10);
  a.txt('Bingham',bx+6,by-BH*0.30,C.b,10);
  a.html(`Ley de Newton τ = μ·du/dy con un huelgo de ${NQ(s.e)} mm: el perfil es <b>lineal</b> y du/dy = V/e = <b>${N0(grad)} s⁻¹</b>.<br>
  τ = <b>${N0(tau)} Pa</b> ⇒ F = τ·A = <b>${N1(F)} N</b> sobre ${NQ(s.A)} cm², y la potencia disipada en rozamiento es <b>${N0(P)} W</b>.<br>
  ${s.tipo==='newt'?'Un fluido <b>newtoniano</b> da una recta por el origen: μ es su pendiente y no depende del esfuerzo.':s.tipo==='bing'?'Un <b>plástico de Bingham</b> (pasta de dientes, lodo) no fluye hasta superar un esfuerzo umbral: por eso el perfil tiene una zona que se mueve en bloque.':s.tipo==='pseudo'?'Un <b>pseudoplástico</b> (pintura, sangre, kétchup) se vuelve menos viscoso al agitarlo: la curva se dobla hacia abajo.':'Un <b>dilatante</b> (maicena en agua, arenas movedizas) se espesa al agitarlo: la curva se dobla hacia arriba.'}
  <span class="hint">Fíjate en que todo va dividido por el huelgo: reducirlo a la mitad duplica el esfuerzo y la potencia disipada. Y en que μ aparece multiplicando, por eso un aceite frío (μ alta) hace que el motor cueste más de arrancar.</span>`);}});

/* T2 · Manómetro en U */
SIMS.manometro=el=>build(el,{w:680,h:390,
 sliders:[{k:'p',v:450,min:-90,max:600,step:5,l:'Presión medida (manométrica)',u:'kPa'},
  {k:'dm',v:13.6,min:0.8,max:14,step:0.1,l:'Densidad relativa del líquido manométrico',u:''},
  {k:'h',v:1.5,min:0,max:200,step:0.5,l:'Altura h de la rama',u:'cm'}],
 selects:[{k:'fl',v:'aire',l:'Fluido medido',opts:[['aire','Aire (1,2 kg/m³)'],['agua','Agua (1000 kg/m³)'],['aceite','Aceite (900 kg/m³)']]}],
 draw(a){a.clear();const s=a.st;
  const rf={aire:1.2,agua:1000,aceite:900}[s.fl];
  const rm=s.dm*1000, p=s.p*1000, h=s.h/100;
  const H=(p-rf*G*h)/((rm-rf)*G);
  const Hs=p/(rm*G);
  const cx=180,base=330,wU=110,top=90;
  const esc=Math.min(170/Math.max(Math.abs(H),0.01),400);
  const dH=Math.max(-150,Math.min(150,H*esc));
  const xi=cx-wU/2, xd=cx+wU/2, tub=14;
  // tubo en U: dos ramas verticales y un semicirculo inferior
  const R=wU/2;
  a.g.strokeStyle=C.muted;a.g.lineWidth=2;
  [[-1],[1]].forEach(([sg])=>{
    [-tub/2,tub/2].forEach(d=>{a.line(cx+sg*R+d,top,cx+sg*R+d,base,C.muted,2);});});
  [R-tub/2,R+tub/2].forEach(r=>{a.g.beginPath();a.g.arc(cx,base,r,0,Math.PI,false);a.g.stroke();});
  // liquido manometrico
  const nivI=base-60, nivD=nivI-dH;
  a.g.fillStyle=C.b;a.g.globalAlpha=.35;
  a.g.fillRect(cx-R-tub/2+1,Math.min(nivI,base),tub-2,Math.max(base-nivI,0));
  a.g.fillRect(cx+R-tub/2+1,Math.min(nivD,base),tub-2,Math.max(base-nivD,0));
  a.g.globalAlpha=1;
  a.g.strokeStyle=C.b;a.g.lineWidth=tub-2;a.g.globalAlpha=.35;
  a.g.beginPath();a.g.arc(cx,base,R,0,Math.PI,false);a.g.stroke();
  a.g.globalAlpha=1;a.g.lineWidth=2;
  a.line(xi-26,nivI,xd+30,nivI,C.c,1.5,[4,3]);
  a.line(xd-26,nivD,xd+30,nivD,C.b,1.5,[4,3]);
  a.arrow(xd+30,nivI,xd+30,nivD,C.a,2);
  a.txt('H = '+N3(H)+' m',xd+36,(nivI+nivD)/2+4,C.a,12);
  a.txt('p = '+NQ(s.p)+' kPa',xi-30,top-10,C.f,12);
  a.txt('atmósfera',xd-24,top-10,C.muted,11);
  a.txt('i',xi+12,nivI-6,C.muted,11);a.txt('d',xd+12,nivI-6,C.muted,11);
  a.txt('misma cota ⇒ misma presión',xi-30,nivI+20,C.c,10);
  // panel
  const bx=400,by=80;
  a.txt('Recorrido del manómetro',bx,by-18,C.text,12);
  a.txt('p_i = p + ρ_f·g·(h+H)',bx,by+6,C.f,12);
  a.txt('p_d = p_a + ρ_m·g·H',bx,by+30,C.b,12);
  a.txt('p_i = p_d  ⇒',bx,by+56,C.c,12);
  a.txt('H = (p − ρ_f g h)/((ρ_m−ρ_f) g)',bx,by+80,C.a,12);
  a.txt('= '+N3(H)+' m = '+N1(H*100)+' cm',bx,by+106,C.a,13);
  a.txt('Si se desprecia el fluido medido:',bx,by+140,C.muted,11);
  a.txt('H ≈ '+N3(Hs)+' m  (error '+N3(Math.abs(H-Hs)/Math.max(Math.abs(H),1e-9)*100)+' %)',bx,by+162,C.muted,11);
  a.txt('ρ_m = '+N0(rm)+' kg/m³   ρ_f = '+N1(rf)+' kg/m³',bx,by+194,C.muted,11);
  a.html(`Regla única: dos puntos a la <b>misma cota dentro del mismo fluido continuo</b> tienen la misma presión. Recorriendo cada rama y sumando ρgh al bajar:<br>
  H = (p − ρ_f·g·h)/((ρ_m − ρ_f)·g) = <b>${N3(H)} m</b> = ${N1(H*100)} cm de líquido manométrico.<br>
  ${rf<10?'Con un <b>gas</b> en la rama de medida, su columna pesa tan poco que despreciarla cambia el resultado un '+N3(Math.abs(H-Hs)/Math.max(Math.abs(H),1e-9)*100)+' %: por eso se desprecia casi siempre, pero conviene justificarlo.':'Con un <b>líquido</b> en la rama de medida su columna sí cuenta: despreciarla daría '+N3(Hs)+' m, un '+N1(Math.abs(H-Hs)/Math.max(Math.abs(H),1e-9)*100)+' % de error. Y fíjate en que la diferencia de densidades (ρ_m − ρ_f) es la que manda.'}
  <span class="hint">Baja la densidad del líquido manométrico y verás que H se dispara: por eso el mercurio (d = 13,6) se usa para presiones altas y el agua o el aceite para diferencias pequeñas, donde interesa que la lectura sea grande.</span>`);}});

/* T3 · Fuerza hidrostática sobre compuerta plana */
SIMS.compuerta=el=>build(el,{w:680,h:380,
 sliders:[{k:'h1',v:0,min:0,max:6,step:0.1,l:'Profundidad del borde superior',u:'m'},
  {k:'L',v:3,min:0.5,max:6,step:0.1,l:'Altura de la compuerta',u:'m'},
  {k:'b',v:2,min:0.5,max:6,step:0.1,l:'Anchura',u:'m'},
  {k:'ang',v:90,min:20,max:90,step:1,l:'Inclinación',u:'°'},
  {k:'d',v:1,min:0.7,max:13.6,step:0.1,l:'Densidad relativa del líquido',u:''}],
 draw(a){a.clear();const s=a.st;
  const rho=s.d*1000, sa=Math.sin(s.ang*Math.PI/180);
  const A=s.L*s.b;
  const y1=s.h1/sa, y2=y1+s.L, yG=(y1+y2)/2, hG=yG*sa;
  const F=rho*G*hG*A;
  const IG=s.b*Math.pow(s.L,3)/12;
  const ycp=yG+IG/(yG*A), hcp=ycp*sa;
  const e=ycp-yG;
  // dibujo
  const ox=60,sy=60,esc=Math.min(230/Math.max(y2*sa,1),70);
  a.line(ox-20,sy,ox+330,sy,C.f,2);
  a.txt('superficie libre',ox-16,sy-8,C.f,11);
  fillPoly(a,[[ox-20,sy],[ox+330,sy],[ox+330,sy+290],[ox-20,sy+290]],C.f,0.10);
  const x1=ox+60, yy1=sy+s.h1*esc;
  const dx=s.L*Math.cos(s.ang*Math.PI/180)*esc, dy=s.L*sa*esc;
  const x2=x1+dx, yy2=yy1+dy;
  a.line(x1,yy1,x2,yy2,C.a,5);
  a.circ(x1,yy1,5,C.d,true);a.txt('eje',x1+8,yy1+16,C.d,10);
  // distribucion de presiones (perpendicular a la compuerta)
  const nx=sa, ny=-Math.cos(s.ang*Math.PI/180);
  const pmax=rho*G*(s.h1+s.L*sa);
  const pe=110/Math.max(pmax,1);
  const p1=rho*G*s.h1*pe, p2=pmax*pe;
  fillPoly(a,[[x1,yy1],[x1+nx*p1,yy1+ny*p1],[x2+nx*p2,yy2+ny*p2],[x2,yy2]],C.b,0.3);
  a.line(x1+nx*p1,yy1+ny*p1,x2+nx*p2,yy2+ny*p2,C.b,2);
  a.txt(N0(pmax/1000)+' kPa',x2+nx*p2+6,yy2+ny*p2+4,C.b,11);
  // punto de aplicacion
  const t=(ycp-y1)/s.L;
  const xc=x1+dx*t, yc=yy1+dy*t;
  a.arrow(xc+nx*70,yc+ny*70,xc,yc,C.c,3);
  a.circ(xc,yc,5,C.c,true);
  a.txt('F = '+N1(F/1000)+' kN',xc+nx*76,yc+ny*76+4,C.c,12);
  const tg=(yG-y1)/s.L, xg=x1+dx*tg, yg=yy1+dy*tg;
  a.circ(xg,yg,4,C.muted,true);a.txt('G',xg-16,yg+4,C.muted,10);
  // panel
  const bx=430,by=80;
  a.txt('h_G = '+N2(hG)+' m',bx,by,C.muted,12);
  a.txt('A = '+N2(A)+' m²',bx,by+24,C.muted,12);
  a.txt('F = ρ g h_G A = '+N1(F/1000)+' kN',bx,by+52,C.c,13);
  a.txt('I_G = b·L³/12 = '+N3(IG)+' m⁴',bx,by+82,C.muted,12);
  a.txt('y_cp = y_G + I_G/(y_G A)',bx,by+106,C.a,12);
  a.txt('y_cp − y_G = '+N3(e)+' m',bx,by+130,C.a,12);
  a.txt('profundidad del c.p. = '+N2(hcp)+' m',bx,by+154,C.a,12);
  a.txt('momento en el eje = '+N1(F*(ycp-y1)/1000)+' kN·m',bx,by+184,C.b,12);
  a.html(`Compuerta de ${NQ(s.L)} × ${NQ(s.b)} m inclinada ${N0(s.ang)}°, con el borde superior a ${NQ(s.h1)} m: F = ρ·g·h_G·A = <b>${N1(F/1000)} kN</b>.<br>
  El centro de presiones cae <b>${N3(e)} m por debajo</b> del centro de gravedad (medido sobre la compuerta), a ${N2(hcp)} m de profundidad.<br>
  ${s.h1<0.01?'Con el borde superior en la superficie, la distribución es <b>triangular</b> y el c.p. está exactamente a 2/3 de la altura: '+N2(hcp)+' m de '+NQ(s.L)+' m.':'Al hundir la compuerta la distribución se vuelve <b>trapecial</b> y el c.p. se acerca al centro de gravedad: ahora la separación es de sólo '+N3(e)+' m.'}
  <span class="hint">Hunde la compuerta con el primer control: la fuerza crece de forma lineal, pero la excentricidad I_G/(y_G·A) <b>disminuye</b>, porque la presión se reparte cada vez más uniformemente. En el límite de gran profundidad, el c.p. tiende al centro de gravedad.</span>`);}});

/* T4 · Cinemática: líneas de corriente y aceleración */
SIMS.cinematica=el=>build(el,{w:680,h:420,
 sliders:[{k:'a',v:2,min:-3,max:3,step:0.1,l:'Parámetro a',u:'s⁻¹'},
  {k:'px',v:2,min:-3,max:3,step:0.1,l:'Punto x',u:'m'},
  {k:'py',v:1,min:-3,max:3,step:0.1,l:'Punto y',u:'m'}],
 selects:[{k:'campo',v:'remanso',l:'Campo de velocidades',opts:[['remanso','u = a·x, v = −a·y (remanso)'],['corte','u = a·y, v = 0 (cortante)'],['vortice','torbellino libre'],['fuente','fuente radial']]}],
 draw(a){a.clear();const s=a.st;
  const cx=200,cy=220,u=55;
  const vel=(x,y)=>{
    if(s.campo==='remanso')return [s.a*x,-s.a*y];
    if(s.campo==='corte')return [s.a*y,0];
    const r2=x*x+y*y||1e-6;
    if(s.campo==='vortice')return [-s.a*y/r2,s.a*x/r2];
    return [s.a*x/r2,s.a*y/r2];};
  // rejilla de vectores
  for(let i=-3;i<=3;i++)for(let j=-3;j<=3;j++){
    if(!i&&!j&&s.campo!=='remanso'&&s.campo!=='corte')continue;
    const [vx,vy]=vel(i,j);const m=Math.hypot(vx,vy)||1e-9;
    const L=Math.min(22,6+m*3.2);
    a.arrow(cx+i*u,cy-j*u,cx+i*u+vx/m*L,cy-j*u-vy/m*L,C.grid,1.4);}
  a.line(cx-3.4*u,cy,cx+3.4*u,cy,C.muted,1.2);a.line(cx,cy-3.4*u,cx,cy+3.4*u,C.muted,1.2);
  // lineas de corriente (integracion)
  const semillas=[];
  [-2.5,-1.6,-0.8,0.8,1.6,2.5].forEach(x0=>{semillas.push([x0,2.6]);semillas.push([x0,-2.6]);});
  [-2.6,2.6].forEach(x0=>{[-1.6,-0.8,0.8,1.6].forEach(y0=>semillas.push([x0,y0]));});
  semillas.forEach(([x0,y0])=>{
    let x=x0,y=y0;const p=[[cx+x*u,cy-y*u]];
    for(let k=0;k<700;k++){const [vx,vy]=vel(x,y);const m=Math.hypot(vx,vy);if(!isFinite(m)||m<1e-6)break;
      x+=vx/m*0.02;y+=vy/m*0.02;if(Math.abs(x)>3.4||Math.abs(y)>3.4)break;p.push([cx+x*u,cy-y*u]);}
    if(p.length>3)curve(a,p,C.f,1.8);});
  // punto y vectores
  const [vx,vy]=vel(s.px,s.py);
  let ax,ay;
  if(s.campo==='remanso'){ax=s.a*s.a*s.px;ay=s.a*s.a*s.py;}
  else if(s.campo==='corte'){ax=0;ay=0;}
  else {const h=1e-4;const [v1x,v1y]=vel(s.px+h,s.py),[v0x,v0y]=vel(s.px-h,s.py),[w1x,w1y]=vel(s.px,s.py+h),[w0x,w0y]=vel(s.px,s.py-h);
    ax=vx*(v1x-v0x)/(2*h)+vy*(w1x-w0x)/(2*h); ay=vx*(v1y-v0y)/(2*h)+vy*(w1y-w0y)/(2*h);}
  const px=cx+s.px*u, py=cy-s.py*u;
  a.circ(px,py,5,C.a,true);
  const mv=Math.hypot(vx,vy)||1e-9, ma=Math.hypot(ax,ay)||1e-9;
  a.arrow(px,py,px+vx/mv*46,py-vy/mv*46,C.a,2.5);a.txt('v',px+vx/mv*52,py-vy/mv*52,C.a,12);
  if(ma>1e-6){a.arrow(px,py,px+ax/ma*40,py-ay/ma*40,C.b,2.5);a.txt('a',px+ax/ma*46,py-ay/ma*46,C.b,12);}
  // panel
  const bx=430,by=90;
  a.txt('En el punto ('+NQ(s.px)+', '+NQ(s.py)+'):',bx,by-16,C.text,12);
  a.txt('u = '+N2(vx)+' m/s',bx,by+8,C.a,12);
  a.txt('v = '+N2(vy)+' m/s',bx,by+30,C.a,12);
  a.txt('|v| = '+N2(Math.hypot(vx,vy))+' m/s',bx,by+52,C.a,12);
  a.txt('a_x = '+N2(ax)+' m/s²',bx,by+84,C.b,12);
  a.txt('a_y = '+N2(ay)+' m/s²',bx,by+106,C.b,12);
  a.txt('(toda convectiva: ∂v/∂t = 0)',bx,by+128,C.muted,11);
  const div = s.campo==='remanso'?0:(s.campo==='corte'?0:(s.campo==='fuente'?0:0));
  const rot = s.campo==='corte'?-s.a:0;
  a.txt('∇·v = '+N2(div)+'  ⇒ '+(Math.abs(div)<1e-9?'incompresible':'con fuente'),bx,by+162,C.c,12);
  a.txt('ω_z = '+N2(rot)+'  ⇒ '+(Math.abs(rot)<1e-9?'irrotacional':'rotacional'),bx,by+184,C.c,12);
  a.html(`${s.campo==='remanso'?'Campo de <b>punto de remanso</b>: u = a·x, v = −a·y. Las líneas de corriente son hipérbolas x·y = cte.':s.campo==='corte'?'Campo <b>cortante</b>: u = a·y. Las líneas de corriente son rectas horizontales, pero el flujo <b>es rotacional</b> (ω_z = −a): las partículas giran sobre sí mismas aunque vayan en línea recta.':s.campo==='vortice'?'<b>Torbellino libre</b>: las partículas describen círculos y, sin embargo, el flujo es <b>irrotacional</b> salvo en el centro. Es el modelo de un remolino de desagüe.':'<b>Fuente radial</b>: el fluido sale del origen por igual en todas direcciones y la velocidad cae como 1/r.'}<br>
  En el punto marcado: v = (${N2(vx)}, ${N2(vy)}) m/s y a = (${N2(ax)}, ${N2(ay)}) m/s².<br>
  El campo <b>no depende del tiempo</b>, así que la aceleración local es nula y todo lo que ves es <b>aceleración convectiva</b>: la partícula se acelera porque se mueve a una zona donde la velocidad es distinta.
  <span class="hint">Éste es el punto que más cuesta del tema: flujo estacionario no significa sin aceleración. Mueve el punto hacia el origen y verás cómo la aceleración se anula ahí, donde el campo es uniforme (nulo).</span>`);}});

/* T5 · Conservación de masa: bifurcación y depósito */
SIMS.masa=el=>build(el,{w:680,h:360,
 sliders:[{k:'DA',v:150,min:50,max:400,step:5,l:'D_A',u:'mm'},
  {k:'DB',v:300,min:50,max:400,step:5,l:'D_B',u:'mm'},
  {k:'DC',v:100,min:20,max:300,step:5,l:'D_C',u:'mm'},
  {k:'DD',v:50,min:20,max:300,step:5,l:'D_D',u:'mm'},
  {k:'vB',v:0.6,min:0.1,max:5,step:0.1,l:'Velocidad en B',u:'m/s'},
  {k:'vC',v:2.7,min:0.1,max:10,step:0.1,l:'Velocidad en C',u:'m/s'}],
 draw(a){a.clear();const s=a.st;
  const A=d=>Math.PI*Math.pow(d/1000,2)/4;
  const Q=s.vB*A(s.DB), vA=Q/A(s.DA), QC=s.vC*A(s.DC), QD=Q-QC, vD=QD/A(s.DD);
  const esc=110/Math.max(s.DA,s.DB,s.DC,s.DD);
  const y0=170;
  const tubo=(x,w,d,col,lab,v)=>{const hh=d*esc;
    a.g.fillStyle=col;a.g.globalAlpha=.18;a.g.fillRect(x,y0-hh/2,w,hh);a.g.globalAlpha=1;
    a.g.strokeStyle=col;a.g.lineWidth=2;a.g.strokeRect(x,y0-hh/2,w,hh);
    a.txt(lab,x+w/2,y0-hh/2-8,col,12,'center');
    a.txt(N2(v)+' m/s',x+w/2,y0+hh/2+18,C.muted,11,'center');
    a.arrow(x+w*0.25,y0,x+w*0.75,y0,col,2);};
  tubo(40,130,s.DA,C.a,'A  Ø'+N0(s.DA),vA);
  tubo(170,130,s.DB,C.f,'B  Ø'+N0(s.DB),s.vB);
  // bifurcacion
  const hC=s.DC*esc,hD=s.DD*esc;
  a.g.strokeStyle=C.c;a.g.lineWidth=2;
  a.g.fillStyle=C.c;a.g.globalAlpha=.18;a.g.fillRect(320,y0-70-hC/2,120,hC);a.g.globalAlpha=1;a.g.strokeRect(320,y0-70-hC/2,120,hC);
  a.txt('C  Ø'+N0(s.DC),380,y0-70-hC/2-8,C.c,12,'center');a.txt(N2(s.vC)+' m/s',380,y0-70+hC/2+18,C.muted,11,'center');
  a.arrow(350,y0-70,410,y0-70,C.c,2);
  a.g.strokeStyle=C.b;a.g.fillStyle=C.b;a.g.globalAlpha=.18;a.g.fillRect(320,y0+70-hD/2,120,hD);a.g.globalAlpha=1;a.g.strokeRect(320,y0+70-hD/2,120,hD);
  a.txt('D  Ø'+N0(s.DD),380,y0+70-hD/2-8,C.b,12,'center');a.txt(N2(vD)+' m/s',380,y0+70+hD/2+18,C.muted,11,'center');
  a.arrow(350,y0+70,410,y0+70,C.b,2);
  a.line(300,y0,320,y0-70,C.muted,2);a.line(300,y0,320,y0+70,C.muted,2);
  // panel
  const bx=470,by=90;
  a.txt('Q = v_B·A_B = '+N3(Q*1000)+' L/s',bx,by,C.f,12);
  a.txt('Q_A = Q_B ⇒ v_A = '+N2(vA)+' m/s',bx,by+26,C.a,12);
  a.txt('Q_C = '+N3(QC*1000)+' L/s',bx,by+56,C.c,12);
  a.txt('Q_D = Q − Q_C = '+N3(QD*1000)+' L/s',bx,by+78,C.b,12);
  a.txt('v_D = '+N2(vD)+' m/s',bx,by+100,C.b,13);
  if(QD<0)a.txt('¡Q_D negativo! entra por D',bx,by+128,C.warn||C.b,12);
  a.html(`Régimen permanente e incompresible ⇒ se conserva el <b>caudal</b>: Q = v·A, con A = πD²/4.<br>
  Q = ${N3(Q*1000)} L/s en A y B ⇒ v_A = <b>${N2(vA)} m/s</b>. En la bifurcación, Q = Q_C + Q_D ⇒ Q_D = ${N3(QD*1000)} L/s y <b>v_D = ${N2(vD)} m/s</b>.<br>
  ${QD<0?'<b>Atención:</b> con estos datos sale caudal negativo en D, lo que significa que por D <b>entraría</b> fluido en lugar de salir. El enunciado sería incoherente.':'La velocidad en D es '+N1(vD/s.vC)+' veces la de C porque su diámetro es menor: el área va con D².'}
  <span class="hint">Lo único que hay que vigilar es qué tramos están <b>en serie</b> (mismo caudal) y cuáles <b>en paralelo</b> (los caudales se suman). Prueba a igualar D_C y D_D: el caudal se reparte por igual sólo si además las velocidades lo permiten.</span>`);}});

/* T6 · Impulso: fuerza sobre un codo */
SIMS.impulso=el=>build(el,{w:680,h:360,
 sliders:[{k:'ang',v:90,min:0,max:180,step:5,l:'Ángulo del codo',u:'°'},
  {k:'D1',v:100,min:20,max:300,step:5,l:'Diámetro de entrada',u:'mm'},
  {k:'D2',v:70,min:20,max:300,step:5,l:'Diámetro de salida',u:'mm'},
  {k:'v1',v:6,min:0.5,max:30,step:0.5,l:'Velocidad de entrada',u:'m/s'},
  {k:'p1',v:200,min:0,max:800,step:10,l:'Presión de entrada (man.)',u:'kPa'}],
 selects:[{k:'fl',v:'agua',l:'Fluido',opts:[['agua','Agua (1000 kg/m³)'],['aire','Aire (1,2 kg/m³)']]}],
 draw(a){a.clear();const s=a.st;
  const rho=s.fl==='agua'?1000:1.2;
  const A1=Math.PI*Math.pow(s.D1/1000,2)/4, A2=Math.PI*Math.pow(s.D2/1000,2)/4;
  const v2=s.v1*A1/A2, Gm=rho*A1*s.v1;
  // Bernoulli sin perdidas para p2
  const p2=s.p1*1000+0.5*rho*(s.v1*s.v1-v2*v2);
  const th=s.ang*Math.PI/180;
  const Fx=Gm*(v2*Math.cos(th)-s.v1)-s.p1*1000*A1+p2*A2*Math.cos(th);
  const Fy=Gm*(v2*Math.sin(th))+p2*A2*Math.sin(th);
  const F=Math.hypot(Fx,Fy);
  // dibujo
  const cx=190,cy=230,Lb=110;
  const e1=Math.max(6,s.D1*0.18), e2=Math.max(6,s.D2*0.18);
  a.g.strokeStyle=C.muted;a.g.lineWidth=2;
  a.g.fillStyle=C.f;a.g.globalAlpha=.16;a.g.fillRect(cx-Lb,cy-e1/2,Lb,e1);a.g.globalAlpha=1;a.g.strokeRect(cx-Lb,cy-e1/2,Lb,e1);
  a.g.save();a.g.translate(cx,cy);a.g.rotate(-th);
  a.g.fillStyle=C.c;a.g.globalAlpha=.16;a.g.fillRect(0,-e2/2,Lb,e2);a.g.globalAlpha=1;a.g.strokeStyle=C.muted;a.g.strokeRect(0,-e2/2,Lb,e2);a.g.restore();
  a.arrow(cx-Lb+10,cy,cx-30,cy,C.f,2.5);
  a.txt('v₁ = '+N1(s.v1)+' m/s',cx-Lb,cy-e1/2-10,C.f,11);
  a.txt('p₁ = '+N0(s.p1)+' kPa',cx-Lb,cy+e1/2+20,C.f,11);
  a.arrow(cx+30*Math.cos(th),cy-30*Math.sin(th),cx+(Lb-10)*Math.cos(th),cy-(Lb-10)*Math.sin(th),C.c,2.5);
  a.txt('v₂ = '+N1(v2)+' m/s',cx+Lb*Math.cos(th)*0.8+8,cy-Lb*Math.sin(th)*0.8-10,C.c,11);
  // fuerza sobre el contorno
  const mf=Math.hypot(Fx,Fy)||1e-9;
  const sc=Math.min(110/Math.max(mf,1),0.08);
  a.arrow(cx,cy,cx+Fx*sc,cy-Fy*sc,C.a,3);
  a.txt('F = '+N0(F)+' N',cx+Fx*sc*0.9-6,cy-Fy*sc*0.9-10,C.a,12);
  a.circ(cx,cy,4,C.muted,true);
  // panel
  const bx=400,by=60;
  a.txt('G = ρ·A₁·v₁ = '+N3(Gm)+' kg/s',bx,by,C.muted,12);
  a.txt('v₂ = v₁·A₁/A₂ = '+N1(v2)+' m/s',bx,by+24,C.c,12);
  a.txt('p₂ (Bernoulli) = '+N0(p2/1000)+' kPa',bx,by+48,C.f,12);
  a.txt('Σ F_x = G(v₂cosθ − v₁) − p₁A₁ + p₂A₂cosθ',bx,by+82,C.muted,11);
  a.txt('F_x = '+N0(Fx)+' N',bx,by+106,C.a,12);
  a.txt('F_y = '+N0(Fy)+' N',bx,by+128,C.a,12);
  a.txt('|F| = '+N0(F)+' N',bx,by+152,C.a,13);
  const pres=Math.abs(s.p1*1000*A1)+Math.abs(p2*A2), mom=Math.abs(Gm*s.v1)+Math.abs(Gm*v2);
  a.txt('presión '+N0(pres)+' N  vs  cantidad de mov. '+N0(mom)+' N',bx,by+184,C.muted,11);
  a.html(`Codo de ${N0(s.ang)}° con reducción de ${N0(s.D1)} a ${N0(s.D2)} mm: v₂ = v₁·A₁/A₂ = <b>${N1(v2)} m/s</b> y G = <b>${N3(Gm)} kg/s</b>.<br>
  Balance de impulso por componentes (presiones manométricas) ⇒ F_x = ${N0(Fx)} N, F_y = ${N0(Fy)} N, <b>|F| = ${N0(F)} N</b> sobre el contorno.<br>
  Peso relativo de cada término: fuerzas de <b>presión ${N0(pres)} N</b> frente a flujo de <b>cantidad de movimiento ${N0(mom)} N</b>. ${pres>mom*2?'Aquí mandan claramente las presiones: olvidarlas sería el error del problema.':pres<mom/2?'Aquí manda el flujo de cantidad de movimiento, porque la presión es baja.':'Ambos términos son del mismo orden.'}
  <span class="hint">Cambia el fluido a aire y verás que la fuerza se desploma: con la misma velocidad, la cantidad de movimiento es 800 veces menor. Y pon el codo a 180° (una U): las dos contribuciones se suman y la fuerza es máxima.</span>`);}});

/* T7 · Bernoulli: línea de energía y piezométrica */
SIMS.bernoulli=el=>build(el,{w:680,h:390,
 sliders:[{k:'z1',v:20,min:0,max:40,step:0.5,l:'Cota del depósito',u:'m'},
  {k:'z2',v:2,min:0,max:40,step:0.5,l:'Cota de salida',u:'m'},
  {k:'L',v:200,min:10,max:1000,step:10,l:'Longitud de tubería',u:'m'},
  {k:'D',v:150,min:25,max:500,step:5,l:'Diámetro',u:'mm'},
  {k:'f',v:0.025,min:0.008,max:0.08,step:0.001,l:'Factor de fricción f',u:''},
  {k:'HB',v:0,min:0,max:40,step:1,l:'Altura de bomba',u:'m'}],
 draw(a){a.clear();const s=a.st;
  const D=s.D/1000, A=Math.PI*D*D/4;
  // salida libre: z1 + HB = z2 + v2/2g + f L/D v2/2g
  const dz=s.z1-s.z2+s.HB;
  const coef=(1+s.f*s.L/D)/(2*G);
  const v=dz>0?Math.sqrt(dz/coef):0;
  const Q=v*A, hv=v*v/(2*G), hf=s.f*s.L/D*hv;
  const Hmax=Math.max(s.z1+s.HB,s.z2)+2;
  const ox=60,oy=320,W=420,H=230, Y=h=>oy-h/Hmax*H;
  a.line(ox,oy,ox+W+10,oy,C.muted,1.5);a.line(ox,Y(Hmax),ox,oy,C.muted,1.5);
  ticks(Hmax,5).forEach(h=>{a.line(ox,Y(h),ox+W,Y(h),C.grid,1);a.txt(N0(h),ox-6,Y(h)+4,C.muted,10,'right');});
  a.txt('m',ox-6,Y(Hmax)-6,C.muted,10,'right');
  // deposito y tuberia
  const xd=ox+10, xb=ox+W*0.25, xs=ox+W*0.95;
  fillPoly(a,[[ox,Y(s.z1)],[xd+40,Y(s.z1)],[xd+40,oy],[ox,oy]],C.f,0.18);
  a.line(ox,Y(s.z1),xd+40,Y(s.z1),C.f,2);
  a.txt('depósito',ox+4,Y(s.z1)-8,C.f,11);
  curve(a,[[xd+40,Y(s.z1)],[xd+40,Y(s.z2)],[xs,Y(s.z2)]],C.muted,4);
  a.txt('salida libre',xs-70,Y(s.z2)+22,C.muted,11);
  if(s.HB>0){a.circ(xb,Y(s.z2),10,C.b,false);a.txt('B',xb,Y(s.z2)+4,C.b,11,'center');}
  // lineas
  const LE1=s.z1, LE2=s.z2+hv;
  const xB1=xb, LEa=s.z1, LEb=s.z1+s.HB;
  curve(a,[[ox,Y(LE1)],[xd+40,Y(LE1)],[xB1,Y(LE1-hf*(xB1-xd-40)/(xs-xd-40))]],C.a,2.5);
  curve(a,[[xB1,Y(LE1-hf*(xB1-xd-40)/(xs-xd-40)+s.HB)],[xs,Y(LE2)]],C.a,2.5);
  if(s.HB>0)a.line(xB1,Y(LE1-hf*(xB1-xd-40)/(xs-xd-40)),xB1,Y(LE1-hf*(xB1-xd-40)/(xs-xd-40)+s.HB),C.b,2.5);
  curve(a,[[xd+40,Y(LE1-hv)],[xB1,Y(LE1-hv-hf*(xB1-xd-40)/(xs-xd-40))]],C.c,2,[5,4]);
  curve(a,[[xB1,Y(LE1-hv-hf*(xB1-xd-40)/(xs-xd-40)+s.HB)],[xs,Y(s.z2)]],C.c,2,[5,4]);
  a.txt('línea de energía',ox+W*0.33,Y(LE1)-10,C.a,11);
  a.txt('línea piezométrica',ox+W*0.33,Y(LE1-hv)+16,C.c,11);
  a.arrow(xs+6,Y(LE2),xs+6,Y(s.z2),C.b,1.6);
  a.txt('v²/2g = '+N2(hv)+' m',xs+14,Y((LE2+s.z2)/2)+4,C.b,10);
  // panel
  const bx=510,by=70;
  a.txt('v = '+N2(v)+' m/s',bx,by,C.a,12);
  a.txt('Q = '+N1(Q*1000)+' L/s',bx,by+24,C.a,13);
  a.txt('v²/2g = '+N2(hv)+' m',bx,by+50,C.b,12);
  a.txt('h_f = '+N2(hf)+' m',bx,by+74,C.c,12);
  a.txt('Δz = '+N1(s.z1-s.z2)+' m',bx,by+98,C.muted,12);
  if(s.HB>0)a.txt('H_B = '+N0(s.HB)+' m',bx,by+122,C.b,12);
  a.txt('Re ≈ '+N0(v*D/1e-6),bx,by+152,C.muted,11);
  a.html(`Bernoulli generalizado entre la superficie del depósito y la salida libre:<br>
  z₁ + H_B = z₂ + v²/2g + f·(L/D)·v²/2g ⇒ <b>v = ${N2(v)} m/s</b> y <b>Q = ${N1(Q*1000)} L/s</b>.<br>
  Reparto de la energía disponible (${N1(s.z1-s.z2+s.HB)} m): <b>${N2(hv)} m</b> se quedan como energía cinética y <b>${N2(hf)} m</b> se pierden por fricción (${N0(hf/Math.max(hf+hv,1e-9)*100)} %).<br>
  ${s.HB>0?'La bomba introduce un <b>salto hacia arriba</b> en la línea de energía: es el único punto donde la LE puede subir.':'Sin bomba, la línea de energía <b>sólo puede bajar</b>: cada metro que pierde es fricción.'}
  <span class="hint">La línea piezométrica va siempre v²/2g por debajo de la de energía. Si en algún punto cayera por debajo del eje de la tubería, allí habría <b>depresión</b> y riesgo de cavitación: alarga la tubería o estrecha el diámetro y verás cómo se acerca.</span>`);}});

/* T8 · Flujo laminar: perfil de Poiseuille y pérdida de carga */
SIMS.laminar=el=>build(el,{w:680,h:380,
 sliders:[{k:'D',v:25,min:5,max:200,step:1,l:'Diámetro',u:'mm'},
  {k:'Q',v:0.8,min:0.01,max:20,step:0.01,l:'Caudal',u:'L/s'},
  {k:'mu',v:0.08,min:0.0005,max:1,step:0.0005,l:'Viscosidad μ',u:'Pa·s'},
  {k:'rho',v:900,min:600,max:1200,step:10,l:'Densidad',u:'kg/m³'},
  {k:'L',v:50,min:1,max:500,step:1,l:'Longitud',u:'m'}],
 draw(a){a.clear();const s=a.st;
  const D=s.D/1000, R=D/2, A=Math.PI*R*R, Q=s.Q/1000;
  const vm=Q/A, Re=s.rho*vm*D/s.mu;
  const lam=Re<2300;
  const f= lam? 64/Re : 0.316/Math.pow(Re,0.25);
  const hf=f*s.L/D*vm*vm/(2*G), dp=s.rho*G*hf, P=dp*Q;
  // perfil
  const cx=175,cy=190,RR=85,LL=140;
  a.g.strokeStyle=C.muted;a.g.lineWidth=2;
  a.g.strokeRect(cx-LL,cy-RR,LL*2,RR*2);
  a.g.fillStyle=C.f;a.g.globalAlpha=.10;a.g.fillRect(cx-LL,cy-RR,LL*2,RR*2);a.g.globalAlpha=1;
  a.line(cx-LL,cy,cx+LL,cy,C.grid,1,[5,4]);
  const umax= lam? 2*vm : vm*1.22;
  const esc=110/Math.max(umax,1e-6);
  const pp=[];
  for(let k=-20;k<=20;k++){const y=k/20;
    const u= lam? umax*(1-y*y) : umax*Math.pow(1-Math.abs(y),1/7);
    pp.push([cx+u*esc,cy+y*RR]);
    if(k%2===0)a.arrow(cx,cy+y*RR,cx+u*esc,cy+y*RR,C.a,1.4);}
  curve(a,pp,C.a,2.5);
  a.txt(lam?'perfil parabólico (laminar)':'perfil turbulento (ley 1/7)',cx-LL,cy-RR-12,C.a,12);
  a.txt('u_máx = '+N2(umax)+' m/s',cx+umax*esc+10,cy-10,C.a,11);
  a.txt('ū = '+N2(vm)+' m/s',cx-LL+6,cy+RR+20,C.muted,11);
  // barra de regimen
  const bx=400,by=70;
  a.txt('Número de Reynolds',bx,by-14,C.text,12);
  const BW=230;
  const px=Math.min(1,Math.log10(Math.max(Re,10))/5);
  a.g.fillStyle=C.c;a.g.globalAlpha=.25;a.g.fillRect(bx,by,BW*Math.log10(2300)/5,18);a.g.globalAlpha=1;
  a.g.fillStyle=C.b;a.g.globalAlpha=.25;a.g.fillRect(bx+BW*Math.log10(4000)/5,by,BW*(1-Math.log10(4000)/5),18);a.g.globalAlpha=1;
  a.g.strokeStyle=C.muted;a.g.lineWidth=1;a.g.strokeRect(bx,by,BW,18);
  a.line(bx+BW*px,by-6,bx+BW*px,by+24,C.a,2.5);
  a.txt('laminar',bx+4,by+32,C.c,10);a.txt('turbulento',bx+BW-56,by+32,C.b,10);
  a.txt('Re = '+N0(Re),bx+BW*px,by+48,C.a,12,'center');
  a.txt('f = '+(lam?'64/Re = ':'0,316/Re^0,25 = ')+N3(f),bx,by+78,C.f,12);
  a.txt('h_f = f·(L/D)·ū²/2g = '+N2(hf)+' m',bx,by+104,C.c,12);
  a.txt('Δp = '+N1(dp/1000)+' kPa',bx,by+130,C.a,13);
  a.txt('potencia = Δp·Q = '+N0(P)+' W',bx,by+156,C.b,12);
  if(lam){a.txt('Hagen-Poiseuille: Δp = 128μLQ/(πD⁴)',bx,by+190,C.muted,11);
  a.txt('= '+N1(128*s.mu*s.L*Q/(Math.PI*Math.pow(D,4))/1000)+' kPa',bx,by+210,C.muted,11);}
  a.html(`Re = ρūD/μ = <b>${N0(Re)}</b> ⇒ régimen <b>${lam?'laminar':'turbulento'}</b>, con ū = ${N2(vm)} m/s y u_máx = <b>${N2(umax)} m/s</b> (${lam?'exactamente 2ū':'sólo un 22 % más que la media: el perfil turbulento es mucho más plano'}).<br>
  f = ${N3(f)} ⇒ h_f = <b>${N2(hf)} m</b> y Δp = <b>${N1(dp/1000)} kPa</b>; la potencia de bombeo necesaria es ${N0(P)} W.<br>
  ${lam?'En laminar, la ley de Hagen-Poiseuille da el mismo resultado: Δp = 128μLQ/(πD⁴) = '+N1(128*s.mu*s.L*Q/(Math.PI*Math.pow(D,4))/1000)+' kPa ✓. La pérdida es <b>proporcional al caudal</b>.':'En turbulento ya no hay solución exacta: f se obtiene de Moody o de correlaciones, y la pérdida crece casi con el <b>cuadrado</b> del caudal.'}
  <span class="hint">Sube el diámetro un poco y observa el efecto: en laminar Δp va con 1/D⁴, así que pasar de 25 a 30 mm reduce la pérdida a menos de la mitad. Baja la viscosidad (aceite caliente) y verás cómo el régimen salta a turbulento.</span>`);}});

/* T9 · Semejanza modelo-prototipo */
SIMS.adimensional=el=>build(el,{w:680,h:330,
 sliders:[{k:'esc',v:25,min:2,max:100,step:1,l:'Escala del prototipo (1:n)',u:''},
  {k:'vp',v:10,min:1,max:80,step:0.5,l:'Velocidad del prototipo',u:'m/s'},
  {k:'Lp',v:100,min:1,max:300,step:1,l:'Longitud del prototipo',u:'m'},
  {k:'Fm',v:12,min:0.1,max:200,step:0.1,l:'Fuerza medida en el modelo',u:'N'}],
 selects:[{k:'cri',v:'fr',l:'Criterio de semejanza',opts:[['fr','Froude (superficie libre)'],['re','Reynolds (sin superficie libre)']]}],
 draw(a){a.clear();const s=a.st;
  const lam=1/s.esc, Lm=s.Lp*lam;
  const vm = s.cri==='fr' ? s.vp*Math.sqrt(lam) : s.vp/lam;
  const Frp=s.vp/Math.sqrt(G*s.Lp), Rep=s.vp*s.Lp/1e-6;
  const Frm=vm/Math.sqrt(G*Lm), Rem=vm*Lm/1e-6;
  const kF = s.cri==='fr' ? Math.pow(s.esc,3) : 1;
  const Fp=s.Fm*kF;
  const kt = s.cri==='fr' ? 1/Math.sqrt(s.esc) : 1/(s.esc*s.esc);
  // dibujo prototipo y modelo
  const draw1=(x,y,L,lab,col,v)=>{const w=L,h=L*0.3;
    fillPoly(a,[[x,y],[x+w,y],[x+w-h*0.4,y+h],[x+h*0.4,y+h]],col,0.25);
    a.g.strokeStyle=col;a.g.lineWidth=2;a.g.beginPath();a.g.moveTo(x,y);a.g.lineTo(x+w,y);a.g.lineTo(x+w-h*0.4,y+h);a.g.lineTo(x+h*0.4,y+h);a.g.closePath();a.g.stroke();
    a.line(x-20,y,x+w+20,y,C.f,1.5);
    a.txt(lab,x,y-12,col,12);
    const xa=Math.max(x+w+14,250);a.arrow(xa,y-10,xa+Math.min(40,v*3),y-10,col,2);
    a.txt(N2(v)+' m/s',xa+2,y-20,col,10);};
  draw1(50,110,190,'Prototipo  L = '+N1(s.Lp)+' m',C.a,s.vp);
  draw1(50,240,Math.max(190*lam*5,30),'Modelo  L = '+N2(Lm)+' m',C.c,vm);
  // panel
  const bx=330,by=70;
  a.txt('Escala 1:'+N0(s.esc)+'   ('+(s.cri==='fr'?'Froude':'Reynolds')+')',bx,by-16,C.text,12);
  a.txt('v_m = v_p·'+(s.cri==='fr'?'√λ':'1/λ')+' = '+N2(vm)+' m/s',bx,by+8,C.c,12);
  a.txt('Fr prototipo = '+N3(Frp)+'   modelo = '+N3(Frm),bx,by+36,s.cri==='fr'?C.a:C.muted,11);
  a.txt('Re prototipo = '+Rep.toExponential(2)+'   modelo = '+Rem.toExponential(2),bx,by+58,s.cri==='re'?C.a:C.muted,11);
  a.txt('F_p = F_m · '+N0(kF)+' = '+N1(Fp/1000)+' kN',bx,by+92,C.b,13);
  a.txt('escala de tiempos: t_m = t_p · '+(kt<0.01?kt.toExponential(2):N3(kt)),bx,by+120,C.muted,12);
  a.txt('1 hora de prototipo → '+(60*kt<1?N2(60*kt*60)+' s':N1(60*kt)+' min')+' de ensayo',bx,by+142,C.muted,12);
  const txt = s.cri==='fr'
    ? 'Para igualar <b>Reynolds</b> a la vez haría falta v_m = '+N0(s.vp*s.esc)+' m/s: imposible. Por eso en barcos se iguala Froude y la fricción se corrige aparte (<b>semejanza incompleta</b>).'
    : 'Para igualar <b>Froude</b> a la vez haría falta v_m = '+N2(s.vp*Math.sqrt(lam))+' m/s, muy distinta. Con el mismo fluido y la misma gravedad, Re y Fr no se pueden igualar a la vez.';
  a.html(`Semejanza por <b>${s.cri==='fr'?'número de Froude':'número de Reynolds'}</b> a escala 1:${N0(s.esc)}:<br>
  v_modelo = <b>${N2(vm)} m/s</b>; la fuerza escala con ${s.cri==='fr'?'λ³':'1 (igual fuerza)'} ⇒ F_prototipo = <b>${N1(Fp/1000)} kN</b>.<br>
  ${txt}<br>
  <span class="hint">Con Froude: longitudes λ, velocidades y tiempos √λ, fuerzas λ³ y potencias λ^3,5. Un ensayo de 12 minutos a escala 1:25 representa una hora de navegación real.</span>`);}});

/* T10 · Tobera convergente y convergente-divergente */
SIMS.tobera=el=>build(el,{w:680,h:430,
 sliders:[{k:'p0',v:189.3,min:100,max:800,step:1,l:'Presión del depósito p₀',u:'kPa'},
  {k:'T0',v:318,min:250,max:800,step:1,l:'Temperatura T₀',u:'K'},
  {k:'pb',v:100,min:10,max:400,step:1,l:'Contrapresión p_b',u:'kPa'},
  {k:'Dt',v:40,min:5,max:120,step:1,l:'Diámetro de garganta',u:'mm'},
  {k:'De',v:45,min:5,max:200,step:1,l:'Diámetro de salida',u:'mm'}],
 draw(a){a.clear();const s=a.st;
  const ga=1.4,R=287;
  const At=Math.PI*Math.pow(s.Dt/1000,2)/4, Ae=Math.PI*Math.pow(s.De/1000,2)/4;
  const rel=Ae/At, cd=s.De>s.Dt+0.5;
  const pcrit=s.p0/Math.pow((ga+1)/2,ga/(ga-1));
  const bloq=s.pb<=pcrit+1e-9;
  const Gmax=At*s.p0*1000*Math.sqrt(ga/(R*s.T0))*Math.pow((ga+1)/2,-(ga+1)/(2*(ga-1)));
  const Mfrom=(r,sup)=>{const f=M=>(1/M)*Math.pow((2/(ga+1))*(1+(ga-1)/2*M*M),(ga+1)/(2*(ga-1)))-r;
    let lo=sup?1.0001:1e-4, hi=sup?6:0.9999;
    for(let i=0;i<200;i++){const mid=(lo+hi)/2; if(f(lo)*f(mid)<=0)hi=mid; else lo=mid;}
    return (lo+hi)/2;};
  const pr=M=>Math.pow(1+(ga-1)/2*M*M,-ga/(ga-1));
  let Ms=1,Mb=1,padap=0,pbloq=0;
  if(cd){Ms=Mfrom(rel,true);Mb=Mfrom(rel,false);padap=s.pb/pr(Ms);pbloq=s.pb/pr(Mb);}
  // Mach de salida y gasto segun regimen
  const Msub=r=>{ // Mach subsonico que da esa relacion de presiones
    const x=Math.pow(r,(ga-1)/ga)-1; return x<=0?0:Math.sqrt(2/(ga-1)*x);};
  const Gsub=(A,pOut)=>{const M=Msub(s.p0/pOut);const T=s.T0/(1+(ga-1)/2*M*M);
    const v=M*Math.sqrt(ga*R*T), rho=pOut*1000/(R*T); return rho*A*v;};
  let Me, Gm, regimen;
  if(!cd){
    if(bloq){Me=1;Gm=Gmax;regimen='bloqueada';}
    else {Me=Msub(s.p0/s.pb);Gm=Gsub(At,s.pb);regimen='subsónica';}
  } else {
    if(s.p0>=pbloq-1e-9){ Gm=Gmax;
      if(Math.abs(s.p0-padap)<1){Me=Ms;regimen='adaptada';}
      else if(s.p0>padap){Me=Ms;regimen='subexpandida';}
      else {Me=Mb;regimen='bloqueada, con onda de choque en el divergente';}
    } else { Me=Msub(s.p0/s.pb); Gm=Gsub(Ae,s.pb); regimen='subsónica (actúa como venturi)'; }
  }
  // dibujo de la tobera
  const ox=50,cy=140,Lt=250;
  const k=45/Math.max(s.Dt,s.De);
  const rt=Math.max(10,s.Dt*k), re=Math.max(10,s.De*k), r0=Math.max(rt,re)*1.7;
  const perf=x=>{ // x de 0 a 1
    if(!cd) return r0+(rt-r0)*x;
    return x<0.6? r0+(rt-r0)*(x/0.6) : rt+(re-rt)*((x-0.6)/0.4);};
  const up=[],dn=[];
  for(let k=0;k<=60;k++){const x=k/60;up.push([ox+x*Lt,cy-perf(x)]);dn.push([ox+x*Lt,cy+perf(x)]);}
  curve(a,up,C.muted,2.5);curve(a,dn,C.muted,2.5);
  fillPoly(a,up.concat(dn.slice().reverse()),C.f,0.12);
  a.line(ox-30,cy-r0,ox,cy-r0,C.muted,2);a.line(ox-30,cy+r0,ox,cy+r0,C.muted,2);
  a.txt('p₀ = '+N1(s.p0)+' kPa',ox-30,cy-r0-26,C.f,12);
  a.txt('T₀ = '+N0(s.T0)+' K',ox-30,cy-r0-8,C.muted,11);
  a.txt('p_b = '+N1(s.pb)+' kPa',ox+Lt-10,cy-r0-26,C.b,12);
  const xg=cd?0.6:1;
  a.line(ox+xg*Lt,cy-perf(xg)-10,ox+xg*Lt,cy+perf(xg)+10,bloq?C.a:C.grid,2,[4,3]);
  a.txt(bloq?'garganta M = 1':'M < 1',ox+xg*Lt,cy-r0-8,bloq?C.a:C.muted,11,'center');
  // curva de presion
  const oy2=390,H2=150,X=x=>ox+x*Lt;
  a.line(ox,oy2,ox+Lt,oy2,C.muted,1.5);a.line(ox,oy2-H2-8,ox,oy2+4,C.muted,1.5);
  a.txt('p/p₀',ox-8,oy2-H2-8,C.text,11,'right');
  const pp=[];
  const sonica = (!cd && bloq) || (cd && Gm>=Gmax-1e-9);
  for(let k=0;k<=60;k++){const x=k/60; const rr=Math.max(Math.pow(perf(x)/rt,2),1.0001);
    let M;
    if(sonica){ M = (x<=xg)? Mfrom(rr,false) : (cd? (Me>1?Mfrom(rr,true):Mfrom(rr,false)) : 1); }
    else { const rrE=Math.max(Math.pow(perf(x)/ (cd?re:rt),2),1.0001);
           M = Me/Math.max(rrE,1e-6); }
    pp.push([X(x),oy2-pr(Math.max(Math.min(M,6),1e-3))*H2]);}
  curve(a,pp,C.a,2.5);
  [0,0.25,0.5,0.75,1].forEach(v=>{a.line(ox-4,oy2-v*H2,ox+Lt,oy2-v*H2,C.grid,1);a.txt(NQ(v),ox-8,oy2-v*H2+4,C.muted,9,'right');});
  a.line(ox,oy2-pr(1)*H2,ox+Lt,oy2-pr(1)*H2,C.b,1.5,[5,4]);
  a.txt('p*/p₀ = 0,528',ox+Lt-4,oy2-pr(1)*H2-8,C.b,10,'right');
  a.line(ox,oy2-s.pb/s.p0*H2,ox+Lt,oy2-s.pb/s.p0*H2,C.c,1.5,[3,3]);
  a.txt('p_b/p₀ = '+N3(s.pb/s.p0),ox+4,oy2-s.pb/s.p0*H2+(Math.abs(s.pb/s.p0-pr(1))<0.04?16:-8),C.c,10);
  // panel
  const bx=360,by=60;
  a.txt('p₀/p_b = '+N3(s.p0/s.pb)+'   (crítica 1,893)',bx,by,C.muted,12);
  a.txt(bloq?'GARGANTA SÓNICA: tobera bloqueada':'Flujo subsónico en toda la tobera',bx,by+26,bloq?C.a:C.c,12);
  a.txt('A_t = '+N3(At*1e4)+' cm²'+(cd?'   A_e/A_t = '+N3(rel):''),bx,by+54,C.muted,12);
  a.txt('Gasto = '+N3(Gm)+' kg/s',bx,by+82,C.b,13);
  a.txt(regimen,bx,by+126,C.muted,11);
  if(bloq)a.txt('(máximo: no sube aunque baje p_b)',bx,by+104,C.muted,11);
  if(cd){a.txt('Salida: M_sub = '+N3(Mb)+'   M_sup = '+N3(Ms),bx,by+158,C.f,12);
    a.txt('p₀ de bloqueo justo = '+N1(pbloq)+' kPa',bx,by+182,C.c,12);
    a.txt('p₀ de tobera adaptada = '+N1(padap)+' kPa',bx,by+204,C.a,12);}
  a.html(`${cd?'Tobera <b>convergente-divergente</b>':'Tobera <b>convergente</b>'} con garganta de ${N0(s.Dt)} mm${cd?' y salida de '+N0(s.De)+' mm (A_e/A_t = '+N3(rel)+')':''}.<br>
  p₀/p_b = <b>${N3(s.p0/s.pb)}</b> frente a la relación crítica <b>1,893</b> ⇒ ${bloq?'la garganta alcanza <b>M = 1</b> y la tobera está <b>bloqueada</b>':'el flujo es subsónico en toda la tobera'}. Gasto = <b>${N3(Gm)} kg/s</b>.<br>
  ${bloq?'Bajar más la contrapresión <b>no aumenta el gasto</b>: sólo p₀ y T₀ (y el área de garganta) lo deciden.':'Mientras no se alcance la relación crítica, el gasto <b>sí</b> depende de la contrapresión.'}
  ${cd?'<br>Con esta relación de áreas, la salida admite M = '+N3(Mb)+' (subsónica, p₀ = '+N1(pbloq)+' kPa) o M = '+N3(Ms)+' (supersónica adaptada, p₀ = '+N1(padap)+' kPa). Entre ambas presiones aparece una <b>onda de choque</b> dentro del divergente.':''}
  <span class="hint">Prueba a bajar p_b por debajo del valor de bloqueo: la curva de presión en la garganta se queda clavada en 0,528·p₀ y el gasto no se mueve. Ése es el resultado que más se pregunta del tema.</span>`);}});

document.querySelectorAll('[data-sim]').forEach(el=>{const f=SIMS[el.dataset.sim];if(f)f(el);});
})();
