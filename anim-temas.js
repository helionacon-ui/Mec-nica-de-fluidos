/* Mecánica de Fluidos: una animación por tema */
(function(){var M=window.MANIM;if(!M)return;var U=M.util,C=M.C,nf=U.nf,lerp=U.lerp,ease=U.ease,seg=U.seg,clamp=U.clamp,RG=U.RG,W=640;
function parts(D,n,t,fx,fy,col,sp){for(var k=0;k<n;k++){var s=((t*(sp||0.25)+k/n)%1);var p=fx(s,k);D.dot(p[0],p[1],3.6,col||C.m,0.85);}}

/* T1 viscosidad: flujo de Couette */
M.reg('mf-t1',M.base({title:'Viscosidad: flujo de Couette',H:520,dur:16,caps:[[5,'Fluido entre dos placas: la de abajo fija y la de arriba movida a velocidad U. El fluido se pega a las paredes (condición de no deslizamiento).'],[11,'El perfil de velocidad es lineal: cada capa arrastra a la de debajo por rozamiento interno, la <b>viscosidad</b>.'],[99,'Ley de Newton de la viscosidad: <i>τ = μ·du/dy = μU/h</i>. Hace falta esa tensión en la placa superior para mantenerla en movimiento.']]},
 function(D,t){var y0=140,y1=360,x0=70,x1=570,U0=lerp(0.2,1,U.pp(t,16));D.rect(x0,y0-14,x1-x0,14,C.g,RG(C.g,.4),2);D.rect(x0,y1,x1-x0,14,C.mut,RG(C.mut,.4),2);D.arrow(x1-80,y0-28,x1-80+60*U0,y0-28,C.g,2.6);D.text('U',x1-70+60*U0,y0-22,{it:true,s:18,c:C.g});
  for(var k=0;k<8;k++){var yy=y1-(k+0.5)/8*(y1-y0),v=U0*(k+0.5)/8;for(var j=0;j<6;j++){var x=x0+((t*v*120+j*90)%(x1-x0));D.dot(x,yy,4,C.f,0.85);}}
  var px=150;D.line(px,y0,px,y1,C.ax,1.2);D.line(px,y1,px+180*U0,y0,C.m,2.4);for(var k2=1;k2<8;k2++){var yy2=y1-k2/8*(y1-y0);D.arrow(px,yy2,px+180*U0*k2/8,yy2,C.m,1.4);}
  D.text('τ = μ·U/h = '+nf(U0,2)+'·μ/h',W/2,440,{it:true,s:22,a:'center',c:C.m});}));

/* T2 manómetro en U */
M.reg('mf-t2',M.base({title:'Fluidostática: manómetro en U',H:540,dur:16,caps:[[5,'Un manómetro de mercurio conecta un depósito a presión con la atmósfera.'],[11,'En el mismo fluido y a la misma altura la presión es igual. Igualando presiones en la superficie inferior del mercurio se obtiene la del depósito.'],[99,'<i>p − p_atm = ρ<sub>Hg</sub>·g·Δh</i>: cada mm de desnivel de mercurio son 133 Pa. Si la presión baja de la atmosférica, el desnivel se invierte.']]},
 function(D,t){var dp=lerp(-30,60,U.pp(t,16)),dh=dp/133.3*1000/10,cx1=220,cx2=360,yb=420,ym=300;
  D.rect(60,140,120,120,C.w,RG(C.f,.15),2);D.text('p',120,205,{it:true,s:22,a:'center',c:C.f});D.line(180,200,cx1,200,C.w,2);
  D.path([[cx1-12,200],[cx1-12,yb],[cx2+12,yb],[cx2+12,120]],C.w,2);D.path([[cx1+12,200],[cx1+12,yb-24],[cx2-12,yb-24],[cx2-12,120]],C.w,2);
  var hl=ym+dh/2,hr=ym-dh/2;D.rect(cx1-11,hl,22,yb-hl,null,RG(C.mut,.8));D.rect(cx2-11,hr,22,yb-hr,null,RG(C.mut,.8));D.rect(cx1-11,yb-24,cx2-cx1+22,24,null,RG(C.mut,.8));
  D.line(cx1+30,hl,cx2+40,hl,C.hl,1.2,[4,4]);D.line(cx2+20,hr,cx2+40,hr,C.hl,1.2);D.arrow(cx2+40,hl,cx2+40,hr,C.hl,2);D.text('Δh',cx2+48,(hl+hr)/2,{it:true,s:17,c:C.hl});
  D.text('p − p_{atm} = '+nf(dp,1)+' kPa',W/2,470,{it:true,s:21,a:'center',c:C.m});D.text('Δh = Δp/(ρ_{Hg}·g) = '+nf(dp/133.3*1000,0)+' mm de Hg',W/2,504,{it:true,s:19,a:'center'});}));

/* T3 fuerza sobre una compuerta */
M.reg('mf-t3',M.base({title:'Fuerza hidrostática sobre una compuerta',H:540,dur:16,caps:[[5,'El agua sube y empuja sobre una compuerta vertical de 1 m de ancho. La presión crece linealmente con la profundidad: <i>p = ρgh</i>.'],[11,'La fuerza resultante es el área del triángulo de presiones: <i>F = ρg·h²/2</i> por metro de ancho.'],[99,'No actúa en el centro sino a <b>2/3 de la profundidad</b> (centro de presiones), porque abajo la presión es mayor.']]},
 function(D,t){var h=lerp(0.3,3,ease(seg(t,1,14))),s=100,xg=330,yb=420;D.rect(xg,yb-3.2*s,14,3.2*s,C.w,RG(C.mut,.5),2);D.rect(90,yb-h*s,xg-90,h*s,null,RG(C.f,.25));D.line(90,yb-h*s,xg,yb-h*s,C.f,2);D.line(80,yb,600,yb,C.mut,2);
  var px=xg+14,k=50;D.path([[px,yb-h*s],[px+h*k,yb],[px,yb]],C.m,2,RG(C.m,.2));for(var y=0.25;y<h;y+=0.35)D.arrow(px+y*k,yb-h*s+y*s,px,yb-h*s+y*s,C.m,1.2);
  var F=9.81*h*h/2,yc=yb-h*s+2/3*h*s;D.arrow(px+h*k+60,yc,px+2,yc,C.g,3.4);D.text('F',px+h*k+66,yc+5,{it:true,s:18,c:C.g});
  D.text('h = '+nf(h,2)+' m    F = ρgh²/2 = '+nf(F,1)+' kN/m    a '+nf(2*h/3,2)+' m de la superficie',W/2,480,{it:true,s:18,a:'center',c:C.m});}));

/* T4 líneas de corriente alrededor de un cilindro */
M.reg('mf-t4',M.campo({title:'Cinemática: flujo alrededor de un cilindro',H:540,dur:20,ax:{xr:[-3,3],yr:[-1.8,1.8],xt:[],yt:[],xl:'',yl:''},h:320,nx:20,ny:11,fm:1.5,step:0.008,np:40,
 field:function(x,y){var r2=x*x+y*y;if(r2<1)return [0,0];var r4=r2*r2;return [1-(x*x-y*y)/r4,-2*x*y/r4];},sink:function(x,y){return x*x+y*y<1.02;},
 extra:function(D,A){var c=A.X(1)-A.X(0);D.dot(A.X(0),A.Y(0),c,C.mut);D.ring(A.X(0),A.Y(0),c,C.w,2);[0,Math.PI].forEach(function(a){D.dot(A.X(Math.cos(a)),A.Y(0),5,C.hl);});},
 read:function(){return ['flujo potencial: corriente uniforme + doblete','puntos de remanso (amarillo): velocidad nula'];},
 caps:[[7,'Las partículas siguen las <b>líneas de corriente</b> (en flujo estacionario coinciden con las trayectorias).'],[14,'Delante y detrás del cilindro hay puntos de <b>remanso</b> (velocidad nula). Arriba y abajo la velocidad es el doble de la del infinito.'],[99,'Es el modelo ideal sin viscosidad. En el flujo real la capa límite se desprende detrás del cilindro y aparece una estela.']]}));

/* T5 continuidad en una tubería convergente */
M.reg('mf-t5',M.base({title:'Conservación de la masa: tubería convergente',H:520,dur:16,caps:[[5,'Un líquido incompresible pasa de una tubería ancha a una estrecha. El caudal que entra tiene que ser el que sale.'],[11,'Ecuación de continuidad: <i>Q = A₁V₁ = A₂V₂</i>. Si el área se reduce a la mitad, la velocidad se duplica.'],[99,'En gases (compresibles) se conserva el gasto másico <i>ρAV</i>, no el caudal volumétrico.']]},
 function(D,t){var cy=260,H1=80,H2=40,xa=60,xb=260,xc=380,xd=580;var hw=function(x){return x<xb?H1:(x<xc?lerp(H1,H2,(x-xb)/(xc-xb)):H2);};
  var top=[],bot=[];for(var x=xa;x<=xd;x+=5){top.push([x,cy-hw(x)]);bot.push([x,cy+hw(x)]);}D.path(top,C.w,2.4);D.path(bot,C.w,2.4);
  for(var row=-3;row<=3;row++){for(var k=0;k<5;k++){var s=((t*0.12+k/5)%1),xx=xa,acc=0;var dist=s*820;var x=xa;while(dist>0&&x<xd){var v=H1/hw(x);x+=4*v;dist-=4;}D.dot(x,cy+row/3.4*hw(x),4,C.m,0.85);}}
  D.text('A₁, V₁',160,cy-H1-14,{it:true,s:17,a:'center',c:C.f});D.text('A₂ = A₁/2,  V₂ = 2V₁',480,cy-H2-14,{it:true,s:17,a:'center',c:C.f});D.text('Q = A₁V₁ = A₂V₂',W/2,420,{it:true,s:22,a:'center',c:C.m,bold:true});}));

/* T6 chorro contra una placa */
M.reg('mf-t6',M.base({title:'Cantidad de movimiento: chorro sobre una placa',H:520,dur:16,caps:[[5,'Un chorro horizontal de caudal Q y velocidad V choca contra una placa plana y se desvía 90°.'],[11,'La placa quita al fluido toda su cantidad de movimiento horizontal. Por acción y reacción, el fluido empuja la placa con <i>F = ρ·Q·V</i>.'],[99,'Es el principio de las turbinas Pelton: si en lugar de desviar 90° se invierte el chorro (180°), la fuerza se duplica, <i>2ρQV</i>.']]},
 function(D,t){var V=lerp(5,15,U.pp(t,16)),Q=0.002*V,F=1000*Q*V,cy=260,xp=440;D.rect(50,cy-14,60,28,C.mut,RG(C.mut,.4),2);D.rect(xp,cy-130,16,260,C.w,RG(C.w,.2),2);
  for(var k=0;k<14;k++){var s=((t*V*0.03+k/14)%1),d=s*(xp-110+140);var x,y;if(d<xp-110){x=110+d;y=cy+(k%3-1)*6;}else{var e=d-(xp-110);x=xp-6-(k%3)*3;y=cy+(k%2?1:-1)*e;}D.dot(x,y,4,C.f,0.9);}
  D.arrow(xp+16,cy,xp+16+Math.min(150,F*0.25),cy,C.g,3.4);D.text('F',xp+24+Math.min(150,F*0.25),cy-8,{it:true,s:18,c:C.g});
  D.text('V = '+nf(V,1)+' m/s    Q = '+nf(Q*1000,1)+' L/s    F = ρQV = '+nf(F,0)+' N',W/2,440,{it:true,s:20,a:'center',c:C.m});}));

/* T7 tubo de Venturi */
M.reg('mf-t7',M.base({title:'Bernoulli: el tubo de Venturi',H:540,dur:16,caps:[[5,'En el estrechamiento la velocidad aumenta (continuidad). Según Bernoulli, si aumenta la energía cinética, disminuye la presión.'],[11,'Los tubos piezométricos lo muestran: el líquido sube menos en la garganta.'],[99,'<i>p₁ − p₂ = ½ρ(V₂² − V₁²)</i>. Midiendo esa diferencia de alturas se calcula el caudal: es un caudalímetro sin piezas móviles.']]},
 function(D,t){var V1=lerp(0.5,2,U.pp(t,16)),V2=4*V1,dh=(V2*V2-V1*V1)/(2*9.81),cy=360,h1=170;
  var hw=function(x){return x<200?50:(x<300?lerp(50,25,(x-200)/100):(x<340?25:(x<460?lerp(25,50,(x-340)/120):50)));};var top=[],bot=[];for(var x=50;x<=590;x+=5){top.push([x,cy-hw(x)]);bot.push([x,cy+hw(x)]);}D.path(top,C.w,2.4);D.path(bot,C.w,2.4);
  [[120,0],[320,dh],[520,0.15*dh]].forEach(function(q,i){var x=q[0],top0=cy-hw(x),lvl=cy-h1+q[1]*25;D.rect(x-8,110,16,top0-110,C.w,null,1.6);D.rect(x-7,lvl,14,top0-lvl,null,RG(C.f,.5));});
  for(var k=0;k<20;k++){var s=((t*0.1*V1+k/20)%1),x2=50+s*540;D.dot(x2,cy+((k%5)-2)/2.4*hw(x2),3.5,C.m,0.85);}
  D.text('V₂ = 4V₁ = '+nf(V2,1)+' m/s     Δh = (V₂² − V₁²)/2g = '+nf(dh,2)+' m',W/2,470,{it:true,s:19,a:'center',c:C.m});}));

/* T8 Hagen–Poiseuille */
M.reg('mf-t8',M.base({title:'Flujo laminar en un tubo: perfil parabólico',H:520,dur:16,caps:[[5,'Flujo laminar plenamente desarrollado en un tubo (Hagen-Poiseuille). Las partículas del centro van más rápido que las de la pared.'],[11,'Resolviendo Navier-Stokes el perfil es una parábola: <i>u(r) = u<sub>máx</sub>(1 − r²/R²)</i>, con <i>u<sub>máx</sub> = 2·V<sub>media</sub></i>.'],[99,'El caudal es <i>Q = πR⁴Δp/(8μL)</i>: duplicar el radio multiplica el caudal por 16 con la misma caída de presión.']]},
 function(D,t){var cy=250,R=90,x0=60,x1=580;D.line(x0,cy-R,x1,cy-R,C.w,3);D.line(x0,cy+R,x1,cy+R,C.w,3);D.line(x0,cy,x1,cy,C.mut,1,[6,4]);
  for(var j=-6;j<=6;j++){var r=j/6.5,u=1-r*r;for(var k=0;k<4;k++){var x=x0+((t*u*90+k*130)%(x1-x0));D.dot(x,cy+r*R,3.8,C.f,0.85);}}
  var px=150;D.line(px,cy-R,px,cy+R,C.ax,1.2);var p=[];for(var y=-R;y<=R;y+=4){var rr=y/R;p.push([px+120*(1-rr*rr),cy+y]);}D.path(p,C.m,2.6);for(var y2=-R+15;y2<R;y2+=25){var rr2=y2/R;D.arrow(px,cy+y2,px+120*(1-rr2*rr2),cy+y2,C.m,1.2);}
  D.text('u(r) = u_{máx}·(1 − r²/R²)      Q = πR⁴Δp/(8μL)',W/2,420,{it:true,s:20,a:'center',c:C.m});}));

/* T9 número de Reynolds */
M.reg('mf-t9',M.base({title:'Análisis dimensional: el número de Reynolds',H:520,dur:18,caps:[[6,'Experimento de Reynolds: un hilo de colorante en el centro del tubo. Con <i>Re</i> bajo el hilo se mantiene recto: flujo <b>laminar</b>.'],[12,'Al aumentar la velocidad, a partir de <i>Re ≈ 2300</i> aparecen ondulaciones (transición) y el colorante empieza a mezclarse.'],[99,'Por encima de ≈ 4000 el flujo es <b>turbulento</b>. <i>Re = ρVD/μ</i> compara fuerzas de inercia con viscosas; dos flujos con el mismo Re son semejantes.']]},
 function(D,t){var Re=lerp(500,6000,ease(seg(t,1,16))),cy=230,x0=70,x1=570;D.line(x0,cy-70,x1,cy-70,C.w,3);D.line(x0,cy+70,x1,cy+70,C.w,3);
  var amp=Re<2300?0:Math.min(1,(Re-2300)/2500),p=[];for(var x=x0;x<=x1;x+=3){var s=(x-x0)/(x1-x0),wob=amp*s*(30*Math.sin(x*0.06-t*6)+18*Math.sin(x*0.17+t*4)*amp);p.push([x,cy+clamp(wob,-65,65)]);}D.path(p,C.g,3);
  if(amp>0.6){for(var k=0;k<60;k++){var xx=x0+250+((k*37)%250),yy=cy+((k*53)%130)-65;D.dot(xx,yy,2.5,C.g,0.4*amp);}}
  D.text('Re = ρVD/μ = '+nf(Re,0),W/2,370,{it:true,s:24,a:'center',c:C.m,bold:true});D.text(Re<2300?'laminar':(Re<4000?'transición':'turbulento'),W/2,408,{s:20,a:'center',c:Re<2300?C.ok:(Re<4000?C.hl:C.bad),bold:true});}));

/* T10 tobera convergente-divergente */
function AofM(Mm){var g=1.4;return 1/Mm*Math.pow((2/(g+1))*(1+(g-1)/2*Mm*Mm),(g+1)/(2*(g-1)));}
function MofA(ar,sup){var lo=sup?1:0.01,hi=sup?5:1;for(var i=0;i<60;i++){var m=(lo+hi)/2;var v=AofM(m);if(sup?(v<ar):(v>ar))lo=m;else hi=m;}return (lo+hi)/2;}
M.reg('mf-t10',M.base({title:'Tobera convergente-divergente',H:560,dur:16,caps:[[5,'En flujo subsónico, al estrecharse el conducto el gas se acelera. En la garganta se alcanza Mach 1 (tobera bloqueada).'],[11,'En la parte divergente, si la presión de salida es suficientemente baja, el flujo <b>supersónico</b> sigue acelerándose al ensancharse: lo contrario que en subsónico.'],[99,'Relación área-Mach: <i>dA/A = (M² − 1)·dV/V</i>. Así funcionan las toberas de cohetes y turbinas de vapor.']]},
 function(D,t){var Ar=function(x){return x<0.4?1+1.2*Math.pow((x-0.4)/0.4,2):1+2.0*Math.pow((x-0.4)/0.6,2);};var cy=170,x0=70,w=500;var top=[],bot=[];for(var s=0;s<=1;s+=0.01){var a=Ar(s)*26;top.push([x0+s*w,cy-a]);bot.push([x0+s*w,cy+a]);}D.path(top,C.w,2.4);D.path(bot,C.w,2.4);
  var B=U.axes(D,{xr:[0,1],yr:[0,3],xt:[0.4],xf:function(){return 'garganta';},yt:[1,2,3],yd:0,xl:'x',yl:'Mach'},{x:x0,y:270,w:w,h:180,grid:true}),xm=lerp(0,1,ease(seg(t,1,14)));
  var p=[];for(var s2=0;s2<=xm;s2+=0.01)p.push([B.X(s2),B.Y(MofA(Ar(s2),s2>0.4))]);D.path(p,C.m,2.8);D.line(B.X(0),B.Y(1),B.X(1),B.Y(1),C.hl,1.2,[5,4]);
  var Mx=MofA(Ar(xm),xm>0.4);D.dot(B.X(xm),B.Y(Mx),6,C.m);D.dot(x0+xm*w,cy,7,Mx>1?C.bad:C.f);
  D.text('M = '+nf(Mx,2)+(Mx<0.99?'  subsónico':(Mx<1.01?'  sónico':'  supersónico')),W/2,500,{it:true,s:21,a:'center',c:C.m,bold:true});}));
M.reg('mf-t7b',M.base({title:'Vaciado de un depósito: Torricelli',H:580,dur:18,caps:[[6,'Aplicando Bernoulli entre la superficie libre y el orificio, la velocidad de salida es <i>v = √(2gh)</i>, como en una caída libre desde la altura h.'],[12,'Al bajar el nivel, baja la velocidad: el depósito se vacía cada vez más despacio. Por continuidad, <i>A·dh/dt = −a·√(2gh)</i>.'],[99,'Integrando, √h baja linealmente con el tiempo. Tiempo total: <i>t = (A/a)·√(2h₀/g)</i>.']]},
 function(D,t){var h0=2,Aa=400,T=Aa*Math.sqrt(2*h0/9.81),tt=seg(t,1,16)*T,sh=Math.sqrt(h0)-tt/Aa*Math.sqrt(9.81/2),h=Math.max(0,sh*sh),v=Math.sqrt(2*9.81*h),x0=70,y0=110,Hp=220,S=Hp/h0;
  D.rect(x0,y0,150,Hp+10,C.ax,null,2.4);D.rect(x0+2,y0+Hp+8-h*S,146,h*S,null,RG(C.f,.45));D.line(x0+150,y0+Hp-4,x0+160,y0+Hp-4,C.ax,2.4);
  var p=[];for(var k=0;k<=20;k++){var tx=k*0.03,px=x0+160+v*tx*45,py=y0+Hp-4+0.5*9.81*tx*tx*45;p.push([px,py]);}if(h>0.01)D.path(p,C.f,3,null,0.8);
  var A=U.axes(D,{xr:[0,T*1.05],yr:[0,2.2],xt:[Math.round(T/4),Math.round(T/2),Math.round(3*T/4),Math.round(T)],yt:[1,2],xd:0,yd:0,xl:'t (s)',yl:'h (m)'},{x:340,y:120,w:260,h:240,grid:true});
  U.plotf(D,A,function(s){if(s>tt)return NaN;var q=Math.sqrt(h0)-s/Aa*Math.sqrt(9.81/2);return q>0?q*q:0;},C.m,2.6);
  U.readout(D,['h = '+nf(h,2)+' m    v = √(2gh) = '+nf(v,2)+' m/s','A/a = 400    tiempo total = '+nf(T,0)+' s'],460);}));
})();
