/* ====================================================================
   VISOR 3D DEL CUERPO (Progreso) — músculos reales pintados por volumen.
   Modelo: Z-Anatomy (CC BY-SA 4.0), derivado de BodyParts3D (DBCLS). Adaptado:
   solo los músculos que usa VEXX + esqueleto en tono neutro, simplificado.
   Render: three.js (MIT), alojado en ./vendor/three. Si no hay WebGL o falla la
   carga, la app sigue mostrando el mapa 2D de siempre.
   ==================================================================== */
const B3={p:null,S:null};
const B3_BONE=0xEEEAF5, B3_OTHER=0xE8E2F1;
function b3Webgl(){ try{ const c=document.createElement("canvas"); return !!(window.WebGLRenderingContext&&(c.getContext("webgl2")||c.getContext("webgl"))); }catch(e){ return false; } }
function b3Load(){
  if(B3.p) return B3.p;
  B3.p=(async()=>{
    if(!b3Webgl()) throw new Error("sin WebGL");
    const T=await import("./vendor/three/three.module.min.js");
    const {GLTFLoader}=await import("./vendor/three/GLTFLoader.js");
    const {DRACOLoader}=await import("./vendor/three/DRACOLoader.js");
    const dr=new DRACOLoader(); dr.setDecoderPath("./vendor/three/draco/");
    const gl=new GLTFLoader(); gl.setDRACOLoader(dr);
    const [g,joints]=await Promise.all([gl.loadAsync("./models/cuerpo.glb"), fetch("./models/joints.json").then(r=>r.json()).catch(()=>({}))]);
    B3.S=b3Build(T,g,joints); return B3.S;
  })().catch(e=>{ B3.p=null; throw e; });
  return B3.p;
}
function b3Build(T,g,joints){
  const el=document.createElement("div"); el.className="b3d";
  el.innerHTML=`<canvas></canvas><div class="b3d-btns"><button data-a="front">Frente</button><button data-a="back">Espalda</button><button data-a="spin" title="Girar solo">⟳</button></div><div class="b3d-tip" hidden></div><div class="b3d-hint">Arrastra para girar · toca un músculo</div>`;
  const canvas=el.querySelector("canvas");
  const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:"low-power"});
  renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
  const scene=new T.Scene(), cam=new T.PerspectiveCamera(26,1,0.05,50);
  scene.add(new T.HemisphereLight(0xffffff,0xb9aedd,0.62));
  const key=new T.DirectionalLight(0xffffff,1.25); key.position.set(1.6,2.2,3); scene.add(key);
  const rim=new T.DirectionalLight(0xd9ccff,0.55); rim.position.set(-3,1.5,-2.5); scene.add(rim);
  const fill=new T.DirectionalLight(0xffffff,0.2); fill.position.set(-2,0.5,3); scene.add(fill);
  const root=new T.Group(); scene.add(root);
  const meshes={}, mats={};
  g.scene.traverse(o=>{ if(!o.isMesh) return; const k=o.name.replace(/^mk_/,"").replace(/_\d+$/,"").replace(/\.\d+$/,"");
    o.geometry.computeVertexNormals();
    mats[k]=new T.MeshStandardMaterial({color:k==="hueso"?B3_BONE:B3_OTHER,roughness:k==="hueso"?0.85:0.58,metalness:0});
    o.material=mats[k]; o.userData.k=k; meshes[k]=o; });
  const box=new T.Box3().setFromObject(g.scene), size=box.getSize(new T.Vector3());
  g.scene.position.y=-size.y/2; root.add(g.scene);
  // marcadores de articulación (sprites que miran siempre a la cámara)
  const tex=(col,dash)=>{ const c=document.createElement("canvas"); c.width=c.height=64; const x=c.getContext("2d");
    x.beginPath(); x.arc(32,32,22,0,7); x.fillStyle=dash?"rgba(255,255,255,.55)":col; x.globalAlpha=dash?1:.9; x.fill(); x.globalAlpha=1;
    x.lineWidth=dash?3:4; x.strokeStyle=dash?"#9C8CD6":"#fff"; if(dash) x.setLineDash([5,4]); x.stroke(); const t=new T.CanvasTexture(c); t.colorSpace=T.SRGBColorSpace; return t; };
  const texOff=tex("#fff",true), texLvl=[null,...(typeof PAIN_COL!=="undefined"?PAIN_COL.slice(1):["#FF9F0A","#FF6B00","#FF3B30"]).map(c=>tex(c,false))];
  const markers={};
  Object.entries(joints).forEach(([id,p])=>{
    const m=new T.Sprite(new T.SpriteMaterial({map:texOff,depthTest:false,transparent:true})); m.renderOrder=20;
    const back=(id==="espalda_alta"||id==="lumbar"); m.position.set(p[0],p[1]-size.y/2,p[2]+(back?-0.075:0)); m.userData={id,back};
    m.visible=false; root.add(m); markers[id]=m; });
  const S={T,el,canvas,renderer,scene,cam,root,meshes,mats,markers,size,texOff,texLvl,rot:0,vel:0,drag:false,auto:false,tw:null,raf:0,ev:{},opts:{},H:size.y,
    ray:new T.Raycaster(),tip:el.querySelector(".b3d-tip")};
  S.kick=()=>{ if(!S.raf) S.raf=requestAnimationFrame(()=>b3Frame(S)); };
  // ---- interacción ----
  let sx=0,sy=0,moved=0,lastX=0;
  canvas.addEventListener("pointerdown",e=>{ S.drag=true; S.tw=null; S.auto=false; b3Btns(S); sx=lastX=e.clientX; sy=e.clientY; moved=0; S.vel=0; try{ canvas.setPointerCapture(e.pointerId); }catch(_){} });
  canvas.addEventListener("pointermove",e=>{ if(!S.drag) return; const dx=e.clientX-lastX; lastX=e.clientX; moved=Math.max(moved,Math.abs(e.clientX-sx)+Math.abs(e.clientY-sy)); S.rot+=dx*0.011; S.vel=dx*0.011; S.kick(); });
  const up=e=>{ if(!S.drag) return; S.drag=false; if(moved<7) b3Tap(S,e); S.kick(); };
  canvas.addEventListener("pointerup",up); canvas.addEventListener("pointercancel",()=>{ S.drag=false; });
  canvas.addEventListener("dblclick",()=>b3Go(S,0));
  el.querySelectorAll(".b3d-btns button").forEach(b=>b.addEventListener("click",()=>{ const a=b.dataset.a;
    if(a==="front") b3Go(S,0); else if(a==="back") b3Go(S,Math.PI); else { S.auto=!S.auto; S.tw=null; b3Btns(S); S.kick(); } }));
  if(window.ResizeObserver) new ResizeObserver(()=>b3Size(S)).observe(el);
  return S;
}
function b3Btns(S){ const b=S.el.querySelector('[data-a="spin"]'); if(b) b.classList.toggle("on",!!S.auto); }
function b3Go(S,to){ S.auto=false; b3Btns(S); const w=a=>Math.atan2(Math.sin(a),Math.cos(a)); S.tw={from:S.rot,to:S.rot+w(to-S.rot),t0:performance.now(),dur:520}; S.vel=0; S.kick(); }
function b3Size(S){
  const w=S.el.clientWidth||320, h=S.el.clientHeight||440; if(!w||!h) return;
  S.renderer.setSize(w,h,false); S.cam.aspect=w/h; S.cam.updateProjectionMatrix();
  const t=Math.tan(S.cam.fov*Math.PI/360), dH=(S.H*0.56)/t, dW=(0.78*0.62)/(t*S.cam.aspect);
  S.cam.position.set(0,0,Math.max(dH,dW)); S.cam.lookAt(0,0,0); S.kick();
}
function b3Frame(S){
  S.raf=0; if(!S.el.isConnected) return;
  let active=false;
  if(S.tw){ const k=Math.min(1,(performance.now()-S.tw.t0)/S.tw.dur), e=1-Math.pow(1-k,3); S.rot=S.tw.from+(S.tw.to-S.tw.from)*e; if(k>=1) S.tw=null; else active=true; }
  else if(!S.drag){ if(S.auto){ S.rot+=0.012; active=true; } else if(Math.abs(S.vel)>0.0006){ S.rot+=S.vel; S.vel*=0.93; active=true; } else S.vel=0; }
  else active=true;
  S.root.rotation.y=S.rot;
  const backv=Math.cos(S.rot)<-0.05;
  Object.values(S.markers).forEach(m=>{ const on=m.userData.on; m.visible=!!on&&(m.userData.back?backv:true); });
  S.renderer.render(S.scene,S.cam);
  if(active) S.kick();
}
function b3Hex(k,S){
  if(k==="hueso") return B3_BONE; if(k==="otros") return B3_OTHER;
  const v=S.ev[k]||0, o=S.opts;
  return muscleColorBy(v,o.mode==="ton"?{mode:"ton",max:S.max}:{});
}
function b3Paint(S){
  S.max=Math.max(1,...Object.values(S.ev||{}));
  Object.keys(S.mats).forEach(k=>{ if(k==="hueso"||k==="otros") return; S.mats[k].color.set(b3Hex(k,S)); });
  const act=(typeof activePains==="function")?activePains():{}, tap=!!S.opts.painTap;
  Object.entries(S.markers).forEach(([id,m])=>{ const p=act[id], on=tap||!!p; m.userData.on=on;
    m.material.map=p?S.texLvl[p.lvl]:S.texOff; const sc=p?0.07+p.lvl*0.012:0.06; m.scale.set(sc,sc,1); m.material.needsUpdate=true; });
  S.el.classList.toggle("b3d-pain",tap); S.tip.hidden=true; S.kick();
}
function b3Tap(S,e){
  const r=S.canvas.getBoundingClientRect(), px=e.clientX-r.left, py=e.clientY-r.top;
  const ndc=new S.T.Vector2(px/r.width*2-1,-(py/r.height)*2+1), v3=new S.T.Vector3();
  if(S.opts.painTap){   // ¿tocó una articulación?
    let best=null,bd=26; Object.values(S.markers).forEach(m=>{ if(!m.visible) return; m.getWorldPosition(v3); v3.project(S.cam); const sx=(v3.x*0.5+0.5)*r.width, sy=(-v3.y*0.5+0.5)*r.height, d=Math.hypot(sx-px,sy-py); if(d<bd){ bd=d; best=m; } });
    if(best){ if(typeof openPainLog==="function") openPainLog(best.userData.id); return; }
  }
  S.ray.setFromCamera(ndc,S.cam);
  const hit=S.ray.intersectObjects(Object.values(S.meshes),false)[0];
  if(!hit){ S.tip.hidden=true; return; }
  const k=hit.object.userData.k; let txt;
  if(k==="hueso") txt="Esqueleto"; else if(k==="otros") txt="Otros músculos (no se cuentan)";
  else { const v=S.ev[k]||0, lbl=(typeof SUBLABEL!=="undefined"&&SUBLABEL[k])||k; txt=`<b>${lbl}</b> · `+(S.opts.mode==="ton"?`${nfmt(fromKg(v))} ${unit()} efectivos`:`${r1(v)} series efect.`); }
  S.tip.innerHTML=txt; S.tip.hidden=false; clearTimeout(S.tipT); S.tipT=setTimeout(()=>{ S.tip.hidden=true; },3200);
}
/* monta el visor dentro de `host`; devuelve una promesa (rechaza si no hay WebGL o falla la carga) */
function body3dMount(host,ev,opts){
  const go=S=>{ S.ev=ev||{}; S.opts=opts||{}; host.innerHTML=""; host.appendChild(S.el); b3Size(S); b3Paint(S); return true; };
  return B3.S?Promise.resolve(go(B3.S)):b3Load().then(go);
}
function body3dLegendHTML(mode){
  const cols=["#E2DBF1","#D2C2F4","#B79CF0","#9466E8","#7C3AED","#5B21B6"], labs=mode==="ton"?["0","bajo","","medio","","alto"]:["0","≤4","≤8","≤12","≤16","17+"];
  return `<div class="b3d-legend" id="b3Legend" hidden>${cols.map((c,i)=>`<span><i style="background:${c}"></i>${labs[i]}</span>`).join("")}</div>`;
}
