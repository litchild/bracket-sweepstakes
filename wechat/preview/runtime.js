/* Browser review adapter for the real WXML and page controllers, not a WeChat runtime. */
(async function(){
  'use strict';
  const bundle=await(await fetch('/bundle.json')).json(),cache={},pages={},tabs=bundle.config.tabBar.list;
  const phone=document.getElementById('phone'),content=document.getElementById('mini-content');
  const stack=[];let current=null,renderPending=false,callbacks=[];
  document.getElementById('mini-global').textContent=bundle.globalCss;
  function normalized(p){const out=[];p.split('/').forEach(k=>{if(k==='..')out.pop();else if(k&&k!=='.')out.push(k);});return out.join('/');}
  function load(file){
    file=normalized(file);if(!file.endsWith('.js'))file+='.js';if(cache[file])return cache[file].exports;
    const module={exports:{}};cache[file]=module;
    if(!bundle.modules[file])throw Error('Missing native module '+file);
    const localRequire=p=>load(normalized(file.split('/').slice(0,-1).join('/')+'/'+p));
    new Function('module','exports','require','wx','Page','App',bundle.modules[file])(module,module.exports,localRequire,wx,register,()=>{});
    return module.exports;
  }
  function register(definition){
    const instance={data:JSON.parse(JSON.stringify(definition.data||{})),setData(patch,cb){Object.assign(this.data,patch);if(cb)callbacks.push(cb.bind(this));schedule();}};
    Object.entries(definition).forEach(([k,v])=>{if(typeof v==='function')instance[k]=v.bind(instance);});
    pages[loadingPath]=instance;
  }
  let loadingPath='';
  function open(url,push){
    if(current&&current.instance.onHide)current.instance.onHide();
    const [p,query='']=url.replace(/^\//,'').split('?'),isTab=tabs.some(t=>t.pagePath===p);
    if(push&&current)stack.push(current);else if(isTab)stack.length=0;
    let instance=pages[p];
    if(!instance||!isTab){loadingPath=p;delete cache[p+'.js'];load(p+'.js');instance=pages[p];instance.onLoad&&instance.onLoad(Object.fromEntries(new URLSearchParams(query)));}
    current={path:p,instance,isTab};document.getElementById('screen-title').textContent=titleFor(p);
    instance.onShow&&instance.onShow();render();window.scrollTo(0,0);
  }
  function titleFor(p){return ({home:'Bracket Sweepstakes',explore:'Teams & regions',bracket:'My bracket',crowd:'Crowd',standings:'Standings',learn:'Fan camp',profile:'Team profile',archive:'Past brackets',clip:'NCAA moments'})[p.split('/')[1]];}
  function schedule(){if(!renderPending){renderPending=true;requestAnimationFrame(()=>{renderPending=false;render();});}}
  function expression(source,scope){try{return new Function('s','with(s){return ('+source+')}')(scope);}catch(e){throw Error('WXML expression '+source+': '+e.message);}}
  function value(source,scope){if(source===null)return true;if(typeof source!=='string')return source;const parts=Array.from(source.matchAll(/{{([\s\S]*?)}}/g));if(parts.length===1&&parts[0][0]===source)return expression(parts[0][1],scope);return source.replace(/{{([\s\S]*?)}}/g,(_,s)=>{const v=expression(s,scope);return v===null||v===undefined?'':String(v);});}
  function children(nodes,scope,parent,key){
    let chain=false,matched=false;
    nodes.forEach((node,i)=>{
      if(node.text!==undefined){if(node.text.trim())parent.append(document.createTextNode(value(node.text,scope)));return;}
      const a=node.attrs||{},hasIf=Object.hasOwn(a,'wx:if'),hasElse=Object.hasOwn(a,'wx:else');
      if(hasIf){chain=true;matched=!!value(a['wx:if'],scope);if(!matched)return;}
      else if(hasElse){if(!chain||matched)return;matched=true;}
      else if(!a['wx:for']){chain=false;matched=false;}
      append(node,scope,parent,key+'.'+i);
    });
  }
  function append(node,scope,parent,key){
    const a=node.attrs||{};
    if(a['wx:for']){
      const list=value(a['wx:for'],scope)||[],copy={...node,attrs:{...a}};delete copy.attrs['wx:for'];
      Array.from(list).forEach((item,i)=>{const child=Object.create(scope);child[a['wx:for-item']||'item']=item;child[a['wx:for-index']||'index']=i;append(copy,child,parent,key+'.'+i);});return;
    }
    if(node.tag==='template'||node.tag==='import')return;
    const tags={view:'div',text:'span',image:'img','scroll-view':'div',picker:'select'};
    const el=document.createElement(tags[node.tag]||node.tag);
    if(node.tag==='scroll-view')el.classList.add('wx-scroll');
    const dynamic={};Object.entries(a).forEach(([k,v])=>{if(!k.startsWith('wx:'))dynamic[k]=value(v,scope);});
    Object.entries(dynamic).forEach(([k,v])=>{
      if(k.startsWith('bind')||k.startsWith('catch')||['range','value','open-type','canvas-id','mode'].includes(k))return;
      if(k==='class'){String(v||'').split(/\s+/).filter(Boolean).forEach(c=>el.classList.add(c));return;}
      if(k==='src')v=v&&v.startsWith('/')?'/mini'+v:v;
      if(k==='disabled'){el.disabled=!!v;return;}
      if(v!==undefined&&v!==null&&v!==false)el.setAttribute(k,String(v));
    });
    if(node.tag==='image')el.dataset.mode=dynamic.mode||'scaleToFill';
    if(node.tag==='canvas'){el.id=dynamic['canvas-id'];el.width=current.instance.data.mapWidth;el.height=current.instance.data.mapHeight;}
    if(node.tag==='progress'){el.max=100;el.value=Number(dynamic.percent)||0;}
    if(node.tag==='input'){el.value=dynamic.value||'';el.dataset.focusKey=key;}
    if(node.tag==='picker'){
      (dynamic.range||[]).forEach((label,i)=>{const option=document.createElement('option');option.value=i;option.textContent=label;el.append(option);});el.value=dynamic.value||0;
      el.setAttribute('aria-label','Archive year');
    }else children(node.children||[],scope,el,key);
    Object.entries(dynamic).forEach(([k,handler])=>{
      if(!k.startsWith('bind')&&!k.startsWith('catch'))return;
      const eventName=k.replace(/^(bind|catch):?/,''),domEvent={tap:'click',input:'input',change:'change',touchstart:'pointerdown',error:'error'}[eventName]||eventName;
      el.addEventListener(domEvent,event=>{
        if(k.startsWith('catch'))event.stopPropagation();
        const fn=current.instance[handler];if(!fn)return;
        const rect=el.getBoundingClientRect(),detail={value:el.value};
        fn({currentTarget:{dataset:{...el.dataset}},target:{dataset:{...event.target.dataset}},detail,touches:[{x:event.clientX-rect.left,y:event.clientY-rect.top}]});
      });
    });
    if(dynamic['open-type']==='share')el.addEventListener('click',()=>{const share=current.instance.onShareAppMessage&&current.instance.onShareAppMessage();wx.showModal({title:'WeChat share',content:'In WeChat this shares “'+(share?share.title:'Bracket Sweepstakes')+'”. The development preview does not send a message.'});});
    parent.append(el);
  }
  function render(){
    if(!current)return;
    const width=phone.clientWidth;document.documentElement.style.setProperty('--rpx',width/750+'px');
    const active=document.activeElement,focus=active&&active.dataset.focusKey,selection=focus?[active.selectionStart,active.selectionEnd]:null;
    document.getElementById('mini-screen').textContent=bundle.styles[current.path+'.wxss']||'';
    content.replaceChildren();children(bundle.templates[current.path+'.wxml'].children,current.instance.data,content,'root');
    const nav=document.getElementById('native-tabs');nav.replaceChildren();nav.style.display=current.isTab?'flex':'none';phone.style.paddingBottom=current.isTab?'85px':'0';
    tabs.forEach(t=>{const active=t.pagePath===current.path,b=document.createElement('button'),img=document.createElement('img');b.className=active?'active':'';b.setAttribute('aria-label',t.text);img.src='/mini/'+(active?t.selectedIconPath:t.iconPath);img.alt='';b.append(img,document.createTextNode(t.text));b.onclick=()=>open('/'+t.pagePath,false);nav.append(b);});
    document.getElementById('back').hidden=!stack.length;
    if(focus){const target=content.querySelector('[data-focus-key="'+focus+'"]');if(target){target.focus({preventScroll:true});target.setSelectionRange(selection[0],selection[1]);}}
    if(!current.instance._ready){current.instance._ready=true;current.instance.onReady&&current.instance.onReady();}
    const queue=callbacks;callbacks=[];queue.forEach(cb=>cb());
    if(current.instance.drawMap)current.instance.drawMap();
  }
  const wx={
    getStorageSync:key=>JSON.parse(localStorage.getItem('wx-preview:'+key)||'null'),
    setStorageSync:(key,value)=>localStorage.setItem('wx-preview:'+key,JSON.stringify(value)),
    getWindowInfo:()=>({windowWidth:phone.clientWidth}),
    getSystemInfoSync:()=>({windowWidth:phone.clientWidth}),
    switchTab:o=>open(o.url,false),navigateTo:o=>open(o.url,true),
    pageScrollTo:o=>window.scrollTo({top:o.scrollTop||0,behavior:'instant'}),
    setNavigationBarTitle:o=>{document.getElementById('screen-title').textContent=o.title;},vibrateShort(){},
    showToast:o=>{const t=document.getElementById('toast');t.textContent=o.title;t.style.display='block';setTimeout(()=>{t.style.display='none';},2300);},
    showModal:o=>{const d=document.getElementById('modal');document.getElementById('modal-title').textContent=o.title;document.getElementById('modal-content').textContent=o.content||'';document.getElementById('confirm').onclick=()=>{d.close();o.success&&o.success({confirm:true,cancel:false});};document.getElementById('cancel').onclick=()=>{d.close();o.success&&o.success({confirm:false,cancel:true});};d.showModal();},
    setClipboardData:o=>{navigator.clipboard.writeText(o.data).then(()=>wx.showToast({title:'Link copied'}),()=>wx.showModal({title:'Official source',content:o.data}));},
    createVideoContext:id=>({stop(){const video=document.getElementById(id);if(video)video.pause();}}),
    createCanvasContext(id){
      const canvas=document.getElementById(id);if(!canvas)return new Proxy({},{get:()=>()=>{}});
      const ctx=canvas.getContext('2d');ctx.setTransform(1,0,0,1,0,0);
      const wrapper={setFillStyle:v=>{ctx.fillStyle=v;},setStrokeStyle:v=>{ctx.strokeStyle=v;},setLineWidth:v=>{ctx.lineWidth=v;},setTextAlign:v=>{ctx.textAlign=v;},setFontSize:v=>{ctx.font='700 '+v+'px Arial,sans-serif';},draw(){}};
      for(const name of ['clearRect','scale','beginPath','moveTo','lineTo','closePath','fill','stroke','fillText'])wrapper[name]=(...args)=>ctx[name](...args);
      return wrapper;
    }
  };
  document.getElementById('back').onclick=()=>{if(current.instance.onUnload)current.instance.onUnload();const back=stack.pop();if(back){current=back;document.getElementById('screen-title').textContent=titleFor(current.path);current.instance.onShow&&current.instance.onShow();render();window.scrollTo(0,0);}};
  window.addEventListener('resize',()=>{if(current&&current.instance.onResize)current.instance.onResize({size:{windowWidth:phone.clientWidth}});schedule();});
  const initial=new URLSearchParams(location.search).get('page');open('/pages/'+(initial||'home')+'/index',false);
})().catch(error=>{console.error(error);document.getElementById('mini-content').textContent='Preview error: '+error.message;});
