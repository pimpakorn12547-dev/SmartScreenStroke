"use strict";
const ASSETS = {
  "balance1": "assets/balance1.png",
  "eyes1": "assets/eyes1.png",
  "face1": "assets/face1.png",
  "arms1": "assets/arms1.png",
  "speech1": "assets/speech1.png",
  "time1": "assets/time1.png",
  "blur1": "assets/blur1.png",
  "half1": "assets/half1.png",
  "double1": "assets/double1.png",
  "mascot1": "assets/mascot1.png",
  "mascot2": "assets/mascot2.png",
  "mascot3": "assets/mascot3.png",
  "nitFull": "assets/nitFull.png",
  "nitIcon": "assets/nitIcon.png",
  "logoNit": "assets/logoNit.png",
  "kmutt": "assets/kmutt.png",
  "mediatech": "assets/mediatech.png"
};

/* ============================ DATA ============================ */
const BEFAST = [
  {letter:'B',word:'Balance',thai:'การทรงตัว',mascot:'balance1'},
  {letter:'E',word:'Eyes',thai:'การมองเห็น',mascot:'eyes1'},
  {letter:'F',word:'Face',thai:'ใบหน้า',mascot:'face1'},
  {letter:'A',word:'Arms',thai:'แขน',mascot:'arms1'},
  {letter:'S',word:'Speech',thai:'การพูด',mascot:'speech1'},
  {letter:'T',word:'Time',thai:'เวลา',mascot:'time1'},
];
const DISCLAIMER = 'สื่อนี้จัดทำเพื่อให้ความรู้เท่านั้น ไม่ใช่เครื่องมือวินิจฉัยทางการแพทย์ หากสงสัยอาการโรคหลอดเลือดสมอง โทร 1669 ทันที';

/* ============================ HELPERS ============================ */
const app = document.getElementById('app');
function h(tag, props, ...kids){
  const e=document.createElement(tag);
  if(props) for(const k in props){
    if(k==='style') Object.assign(e.style,props[k]);
    else if(k==='class') e.className=props[k];
    else if(k.startsWith('on')&&typeof props[k]==='function') e.addEventListener(k.slice(2).toLowerCase(),props[k]);
    else if(k==='html') e.innerHTML=props[k];
    else if(props[k]!=null) e.setAttribute(k,props[k]);
  }
  for(const kid of kids.flat()){ if(kid==null||kid===false) continue; e.append(kid.nodeType?kid:document.createTextNode(kid)); }
  return e;
}
const ICON = {
  back:'<svg width="22" height="22" viewBox="0 0 18 18" fill="none"><path d="M11 4L6 9l5 5" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  next:'<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M6 3l7 6-7 6" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  play:'<svg width="26" height="26" viewBox="0 0 26 26" fill="#fff"><path d="M8 5l14 8-14 8V5z"/></svg>',
  cam:'📷', mic:'🎤',
};
function logo(size){
  size=size||44;
  return h('div',{style:{width:size+'px',height:size+'px',borderRadius:'50%',background:'#fff',flexShrink:0,
    display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 8px rgba(0,0,0,.25)',padding:Math.round(size*0.11)+'px'}},
    h('img',{src:ASSETS.nitIcon,alt:'สถาบันประสาทวิทยา',style:{width:'100%',height:'100%',objectFit:'contain'}}));
}
function header(title, sub, onBack){
  return h('div',{class:'hdr'},
    onBack? h('button',{class:'back-btn',onclick:onBack,html:ICON.back}) : h('div',{style:{width:'46px'}}),
    h('div',{class:'hdr-title'}, h('b',null,title), sub&&h('span',null,sub)),
    logo(46)
  );
}

/* ============================ MEDIA MANAGER ============================ */
let _stream=null, _raf=0, _audio=null, _recorder=null;
function stopAll(){
  if(_raf){ cancelAnimationFrame(_raf); _raf=0; }
  if(_stream){ _stream.getTracks().forEach(t=>t.stop()); _stream=null; }
  if(_recorder&&_recorder.state!=='inactive'){ try{_recorder.stop();}catch(e){} _recorder=null; }
  if(_audio){ try{_audio.close();}catch(e){} _audio=null; }
}
async function getCam(constraints){
  const s=await navigator.mediaDevices.getUserMedia(constraints);
  _stream=s; return s;
}

/* ============================ ROUTER ============================ */
const state={screen:0, detail:null};
const SCREENS={};
function go(screen){ stopAll(); state.screen=screen; render(); }
function openDetail(i){ stopAll(); state.detail=i; state.screen='detail'; render(); }
function render(){
  stopAll();
  app.innerHTML='';
  let node;
  if(state.screen===0) node=SCREENS.splash();
  else if(state.screen===1) node=SCREENS.video();
  else if(state.screen===2) node=SCREENS.intro();
  else if(state.screen===3) node=SCREENS.menu();
  else if(state.screen==='detail') node=SCREENS.detail(state.detail);
  app.append(node);
}

/* ============================ SPLASH ============================ */
SCREENS.splash=function(){
  const s=h('div',{class:'screen',style:{background:'linear-gradient(175deg,#1B3B9B,#0d2266)'}});
  const body=h('div',{class:'grow',style:{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-between',position:'relative',overflow:'hidden',padding:'18px 0 16px'}});
  const logoRow=h('div',{style:{display:'flex',alignItems:'center',justifyContent:'center',gap:'16px',background:'#fff',borderRadius:'18px',padding:'12px 20px',boxShadow:'0 6px 20px rgba(0,0,0,.25)',zIndex:2}},
    h('img',{src:ASSETS.nitFull,alt:'สถาบันประสาทวิทยา',style:{height:'46px',objectFit:'contain'}}),
    h('div',{style:{width:'1px',height:'34px',background:'#dfe3f0'}}),
    h('img',{src:ASSETS.kmutt,alt:'KMUTT',style:{height:'46px',objectFit:'contain'}}),
    h('div',{style:{width:'1px',height:'34px',background:'#dfe3f0'}}),
    h('img',{src:ASSETS.mediatech,alt:'Media Technology',style:{height:'34px',objectFit:'contain'}})
  );
  body.append(
    h('div',{class:'deco',style:{top:'-60px',right:'-60px',width:'220px',height:'220px',background:'rgba(245,131,31,.08)'}}),
    h('div',{class:'deco',style:{bottom:'-40px',left:'-40px',width:'180px',height:'180px',background:'rgba(245,131,31,.06)'}}),
    logoRow,
    h('div',{style:{textAlign:'center',zIndex:2}},
      h('div',{class:'font-n',style:{fontSize:'46px',fontWeight:900,color:'#fff',lineHeight:1.02,letterSpacing:'1px'}},'SMART SCREEN'),
      h('div',{class:'font-n',style:{fontSize:'46px',fontWeight:900,color:'#F5831F',lineHeight:1.02,letterSpacing:'1px'}},'STROKE'),
      h('div',{style:{fontSize:'20px',fontWeight:700,color:'#fff',marginTop:'10px',letterSpacing:'.5px'}},'รู้ก่อน รอดกว่า')
    ),
    h('div',{style:{display:'flex',alignItems:'flex-end',justifyContent:'center',width:'100%',zIndex:2}},
      h('img',{src:ASSETS.mascot3,alt:'',style:{width:'118px',transform:'rotate(-5deg) translateY(10px)',marginRight:'-16px',filter:'drop-shadow(0 6px 18px rgba(0,0,0,.28))'}}),
      h('img',{src:ASSETS.mascot1,alt:'',style:{width:'212px',zIndex:3,filter:'drop-shadow(0 12px 32px rgba(0,0,0,.38))'}}),
      h('img',{src:ASSETS.mascot2,alt:'',style:{width:'118px',transform:'rotate(5deg) translateY(10px)',marginLeft:'-16px',filter:'drop-shadow(0 6px 18px rgba(0,0,0,.28))'}})
    ),
    h('div',{style:{display:'flex',flexDirection:'column',alignItems:'center',gap:'10px',zIndex:2}},
      h('button',{onclick:()=>go(1),html:ICON.play,style:{width:'76px',height:'76px',borderRadius:'50%',background:'#F5831F',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 0 10px rgba(245,131,31,.15),0 8px 28px rgba(245,131,31,.45)'}}),
      h('div',{style:{color:'rgba(255,255,255,.6)',fontSize:'15px'}},'แตะเพื่อเริ่มต้น')
    )
  );
  s.append(body, h('div',{class:'disc',style:{fontSize:'12px'}},'⚠️ '+DISCLAIMER));
  return s;
};

/* ============================ VIDEO ============================ */
SCREENS.video=function(){
  const s=h('div',{class:'screen',style:{background:'linear-gradient(175deg,#2D4099,#20306f)'}});
  const vid=h('video',{src:'BEFAST.mp4',controls:'true',playsinline:'true',preload:'metadata',
    style:{width:'100%',maxHeight:'54vh',borderRadius:'20px',background:'#000',boxShadow:'0 10px 30px rgba(0,0,0,.4)'}});
  vid.addEventListener('error',()=>{ fallback.style.display='flex'; vid.style.display='none'; });
  const fallback=h('div',{style:{display:'none',flexDirection:'column',alignItems:'center',gap:'10px',padding:'26px',background:'#0d2266',borderRadius:'20px'}},
    h('img',{src:ASSETS.mascot1,style:{width:'96px'}}),
    h('div',{class:'pill'},'ไม่พบไฟล์ BEFAST.mp4 — วางไฟล์วิดีโอไว้ในโฟลเดอร์เดียวกับ index.html'));
  s.append(
    header('วิดีโอแนะนำ','โรคหลอดเลือดสมอง B.E.F.A.S.T',()=>go(0)),
    h('div',{class:'grow',style:{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'0 18px',gap:'12px'}},
      vid, fallback,
      h('div',{class:'pill',style:{background:'rgba(245,131,31,.14)'}},'กดเล่นเพื่อดูวิดีโอแนะนำสัญญาณเตือนโรคหลอดเลือดสมอง')
    ),
    h('div',{style:{padding:'10px 18px calc(34px + env(safe-area-inset-bottom))'}},
      h('button',{class:'btn',style:{minHeight:'56px',fontSize:'17px'},onclick:()=>{try{vid.pause();}catch(e){} go(2);},html:'เรียนรู้สัญญาณ B.E.F.A.S.T '+ICON.next})
    )
  );
  return s;
};

/* ============================ INTRO ============================ */
SCREENS.intro=function(){
  const s=h('div',{class:'screen',style:{background:'linear-gradient(175deg,#1B3B9B,#0d2266)'}});
  const stat=(n,l)=>h('div',{style:{flex:1,background:'#1B3B9B',color:'#fff',borderRadius:'14px',padding:'12px 8px',textAlign:'center'}},
    h('div',{style:{fontSize:'22px',fontWeight:800,color:'#F5831F'},class:'font-n'},n),
    h('div',{style:{fontSize:'10px',marginTop:'2px',opacity:.85,lineHeight:1.3}},l));
  const card=(ic,orange,t,d)=>h('div',{class:'card symptom'},
    h('div',{class:'ic'+(orange?' orange':'')}, h('span',null,ic)),
    h('div',null, h('h4',null,t), h('p',null,d)));
  s.append(
    header('ทำความรู้จัก','โรคหลอดเลือดสมอง (Stroke)',()=>go(1)),
    h('div',{class:'grow scroll',style:{margin:'0',borderRadius:'22px 22px 0 0',background:'#fff',padding:'20px 18px 10px'}},
      h('div',{style:{fontSize:'18px',fontWeight:800,color:'#1B3B9B',marginBottom:'10px'},html:'🧠 โรคหลอดเลือดสมองคืออะไร?'}),
      h('p',{style:{fontSize:'14px',lineHeight:1.7,color:'#444',marginBottom:'12px'}},'โรคหลอดเลือดสมอง หรือ Stroke เกิดขึ้นเมื่อหลอดเลือดในสมองตีบ อุดตัน หรือแตก ทำให้เนื้อสมองขาดออกซิเจนและถูกทำลาย เป็นภาวะฉุกเฉินที่ต้องรีบรักษา'),
      h('div',{style:{background:'#fff8f0',borderLeft:'4px solid #F5831F',borderRadius:'8px',padding:'12px 14px',marginBottom:'14px',fontSize:'13px',color:'#333',lineHeight:1.6},html:'⚠️ ทุก <b>1 นาที</b> ที่สมองขาดเลือด เซลล์สมองตายราว <b>1.9 ล้านเซลล์</b> — ยิ่งรักษาเร็ว ยิ่งลดความพิการ'}),
      h('div',{style:{display:'flex',gap:'8px',marginBottom:'14px'}}, stat('4.5','ชั่วโมง Golden Period'), stat('1669','เบอร์ฉุกเฉิน')),
      card('🔴',false,'Ischemic Stroke','หลอดเลือดตีบ/อุดตัน พบ ~80% ของผู้ป่วย'),
      card('💥',true,'Hemorrhagic Stroke','หลอดเลือดสมองแตก อันตรายถึงชีวิต')
    ),
    h('div',{style:{background:'#fff',padding:'6px 16px calc(16px + env(safe-area-inset-bottom))'}},
      h('button',{class:'btn',onclick:()=>go(3),html:'เรียนรู้สัญญาณ B.E.F.A.S.T '+ICON.next})
    )
  );
  return s;
};

/* ============================ MENU ============================ */
SCREENS.menu=function(){
  const s=h('div',{class:'screen',style:{background:'linear-gradient(175deg,#1B3B9B,#0d2266)'}});
  const grid=h('div',{style:{flex:1,minHeight:0,display:'grid',gridTemplateColumns:'1fr 1fr',gridTemplateRows:'repeat(3,1fr)',gap:'16px',padding:'14px 16px 18px'}});
  BEFAST.forEach((item,i)=>{
    grid.append(h('div',{onclick:()=>openDetail(i),style:{background:'#fff',borderRadius:'22px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'2px',padding:'14px 8px',cursor:'pointer',boxShadow:'0 4px 16px rgba(0,0,0,.18)',position:'relative',transition:'transform .15s'},
      onmouseenter:e=>e.currentTarget.style.transform='translateY(-3px)', onmouseleave:e=>e.currentTarget.style.transform='none'},
      h('div',{class:'font-n',style:{position:'absolute',top:'-12px',left:'14px',width:'38px',height:'38px',borderRadius:'50%',background:'#F5831F',color:'#fff',fontSize:'20px',fontWeight:900,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 8px rgba(0,0,0,.2)'}},item.letter),
      h('div',{style:{width:'66%',aspectRatio:'1',borderRadius:'50%',background:'#fff',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',border:'3px solid #eef1fb',marginBottom:'10px'}},
        h('img',{src:ASSETS[item.mascot],alt:item.word,style:{width:'100%',height:'100%',objectFit:'contain'}})),
      h('div',{class:'font-n',style:{fontSize:'26px',fontWeight:900,color:'#F5831F',lineHeight:1}},item.word),
      h('div',{style:{fontSize:'17px',color:'#555',marginTop:'6px',fontWeight:600}},item.thai),
      h('div',{style:{position:'absolute',bottom:'14px',right:'16px',width:'13px',height:'13px',borderRadius:'50%',background:'#F5831F'}})
    ));
  });
  s.append(
    h('div',{class:'hdr',style:{paddingBottom:'2px'}},
      h('button',{class:'back-btn',onclick:()=>go(2),html:ICON.back}),
      h('div',{class:'hdr-title'},
        h('div',{class:'font-n',style:{display:'flex',justifyContent:'center',alignItems:'baseline',flexWrap:'nowrap',whiteSpace:'nowrap',fontSize:'30px',fontWeight:900,color:'#fff',letterSpacing:'2px',lineHeight:1}},
          ...'BEFAST'.split('').map((l,i)=>h('span',{style:{whiteSpace:'nowrap'}}, l, h('span',{style:{color:'#F5831F',visibility:i<5?'visible':'hidden'}},'.')))),
        h('span',{style:{fontSize:'13px'}},'เลือกหัวข้อที่ต้องการเรียนรู้')
      ), logo(38)
    ),
    grid
  );
  return s;
};

/* ============================ DETAIL ============================ */
function detailHero(item,onBack){
  return h('div',{class:'hero'},
    h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 18px 0'}},
      h('button',{class:'back-btn',onclick:onBack,html:ICON.back}), logo(46)),
    h('div',{style:{display:'flex',flexDirection:'column',alignItems:'center',paddingTop:'4px'}},
      h('div',{class:'badge'}, h('span',{class:'font-n'},item.letter)),
      h('div',{class:'w font-n'},item.word), h('div',{class:'th'},item.thai),
      h('img',{class:'mascot',src:ASSETS[item.mascot],alt:''})
    )
  );
}
const symCard=(ic,orange,t,d)=>h('div',{class:'card symptom'},h('div',{class:'ic'+(orange?' orange':'')},h('span',null,ic)),h('div',null,h('h4',null,t),h('p',null,d)));

SCREENS.detail=function(i){
  const item=BEFAST[i];
  const s=h('div',{class:'screen',style:{background:'var(--bg)'}});
  const body=h('div',{class:'detail-body'});
  DETAIL_BUILDERS[item.letter](body,item);
  body.append(h('div',{class:'disc dark',style:{marginTop:'14px'}},'⚠️ '+DISCLAIMER));
  s.append(detailHero(item,()=>go(3)), body);
  return s;
};

/* ============================ DETAIL CONTENT ============================ */
const DETAIL_BUILDERS={
  B(body){
    body.append(
      symCard('🌀',false,'เวียนศีรษะรุนแรง','รู้สึกบ้านหมุน ทรงตัวไม่ได้'),
      symCard('🚶',true,'เดินเซ / ล้มโดยไม่มีสาเหตุ','ควบคุมการเดินไม่ได้'),
      symCard('🤢',false,'คลื่นไส้ อาเจียน','มักเกิดร่วมกับอาการเวียนศีรษะ'),
      h('div',{class:'tip',html:'🧪 <b>วิธีทดสอบ:</b> ยืนขาเดียว หลับตา 10 วินาที หากล้มหรือเซ อาจเป็นสัญญาณอันตราย'}),
      h('button',{class:'btn',onclick:()=>launchCamera(BEFAST[0]),html:'📷 เปิดกล้องจำลองอาการบ้านหมุน'})
    );
  },
  E(body){
    body.append(h('div',{style:{fontSize:'14px',fontWeight:700,color:'#1B3B9B',marginBottom:'10px'}},'ประเภทความผิดปกติทางสายตา'));
    const subs=[
      {mode:'blur',img:'blur1',title:'ภาพมัว',desc:'มองเห็นไม่ชัด ทั้งข้างเดียวหรือสองข้าง',label:'ทดสอบภาพมัว'},
      {mode:'hemi',img:'half1',title:'มองเห็นครึ่งซีก',desc:'สูญเสียการมองเห็นครึ่งหนึ่งของภาพ (Hemianopia)',label:'ทดสอบครึ่งซีก'},
      {mode:'double',img:'double1',title:'ภาพซ้อนทับ',desc:'เห็นภาพซ้อน (Double Vision)',label:'ทดสอบภาพซ้อน'},
    ];
    subs.forEach(su=>{
      body.append(h('div',{style:{background:'#fff',borderRadius:'16px',overflow:'hidden',marginBottom:'12px',boxShadow:'var(--card-sh)'}},
        h('div',{style:{display:'flex',alignItems:'center'}},
          h('div',{style:{width:'76px',height:'76px',flexShrink:0,background:'#f0f4ff',display:'flex',alignItems:'center',justifyContent:'center'}},
            h('img',{src:ASSETS[su.img],style:{width:'100%',height:'100%',objectFit:'contain'}})),
          h('div',{style:{padding:'10px 14px'}}, h('div',{style:{fontSize:'15px',fontWeight:700,color:'#c0392b'}},su.title), h('div',{style:{fontSize:'12px',color:'#888',marginTop:'3px'}},su.desc))
        ),
        h('button',{class:'btn blue',style:{borderRadius:0,minHeight:'44px',fontSize:'13px'},onclick:()=>launchCamera(BEFAST[1],su.mode),html:'📷 เปิดกล้อง — '+su.label})
      ));
    });
  },
  F(body){
    body.append(
      symCard('😶',false,'ปากเบี้ยว / หน้าตก','กล้ามเนื้อใบหน้าข้างหนึ่งอ่อนแรง'),
      symCard('🙂',true,'ยิ้มไม่สมมาตร','มุมปากสองข้างไม่เท่ากันเมื่อยิ้ม'),
      h('div',{class:'tip',html:'🔍 <b>วิธีตรวจ:</b> ให้ยิ้มกว้าง สังเกตว่ามุมปากทั้งสองข้างขยับเท่ากันหรือไม่'}),
      h('button',{class:'btn',onclick:()=>launchCamera(BEFAST[2]),html:'📷 เปิดกล้องจำลองใบหน้าเบี้ยว'})
    );
  },
  A(body){
    body.append(
      symCard('💪',false,'แขนข้างหนึ่งอ่อนแรง','ยกแขนได้ไม่เท่ากัน หรือยกไม่ขึ้น'),
      symCard('✋',true,'มือชา / รู้สึกเหน็บ','ความรู้สึกผิดปกติที่มือหรือแขน'),
      h('div',{class:'tip',html:'🔍 <b>วิธีทดสอบ:</b> ยกแขนสองข้างขึ้นพร้อมกัน ค้าง 10 วินาที หากข้างหนึ่งตก <span style="color:#c0392b;font-weight:700">⚠️ อาจเป็น Stroke</span>'}),
      h('button',{class:'btn',onclick:()=>launchCamera(BEFAST[3]),html:'📷 เปิดกล้องจำลองแขนอ่อนแรง'})
    );
  },
  S(body){
    body.append(
      symCard('🗣️',false,'พูดไม่ชัด / ติดขัด','ออกเสียงยาก พูดช้า หรือไม่สมบูรณ์'),
      symCard('❓',true,'พูดสับสน ไม่รู้เรื่อง','พูดประโยคที่ไม่มีความหมาย'),
      h('div',{class:'tip',html:'🔍 <b>วิธีทดสอบ:</b> ให้พูดประโยคง่ายๆ เช่น “ฉันกินข้าว” แล้วฟังว่าชัดหรือไม่'}),
      h('button',{class:'btn',onclick:()=>launchSpeech(),html:'🎤 อัดเสียง แล้วฟังเสียง “พูดไม่ชัด”'})
    );
  },
  T(body){
    body.append(
      h('div',{style:{background:'linear-gradient(135deg,#c0392b,#e74c3c)',borderRadius:'16px',padding:'16px',marginBottom:'12px',color:'#fff',textAlign:'center'}},
        h('div',{class:'font-n',style:{fontSize:'54px',fontWeight:900,lineHeight:1}},'1669'),
        h('div',{style:{fontSize:'13px',opacity:.9,marginTop:'4px'}},'สายด่วนฉุกเฉิน — โทรทันที!')),
      h('div',{style:{fontSize:'14px',fontWeight:700,color:'#1B3B9B',marginBottom:'8px'}},'⏱️ สิ่งที่ควรทำทันที'),
      ...[['บันทึกเวลา','จดเวลาที่เริ่มมีอาการ'],['โทร 1669','แจ้งว่าสงสัยโรคหลอดเลือดสมอง'],['ห้ามให้กินอาหาร/ยา','ก่อนถึงโรงพยาบาล'],['รีบไป รพ. ใกล้บ้าน','ภายใน 4.5 ชม. = Golden Period']].map((r,i)=>
        h('div',{style:{background:'#fff',borderRadius:'13px',padding:'12px 14px',marginBottom:'8px',display:'flex',gap:'12px',alignItems:'center',boxShadow:'0 2px 8px rgba(0,0,0,.05)'}},
          h('div',{class:'font-n',style:{width:'34px',height:'34px',borderRadius:'50%',background:'#1B3B9B',color:'#fff',fontWeight:800,fontSize:'15px',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}},i+1),
          h('div',{style:{fontSize:'13px',color:'#333',lineHeight:1.5},html:'<b style="color:#1B3B9B">'+r[0]+'</b><br>'+r[1]}))),
      h('button',{class:'btn',style:{marginTop:'6px'},onclick:()=>launchTime(),html:'จำลองการโทร'})
    );
  },
};

/* ============================ CAMERA SHELL ============================ */
const GUIDE={
  B:{icon:'🧍',title:'จำลองอาการทรงตัว',desc:'ขยับศีรษะช้าๆ แล้วสังเกตว่าโลกรอบตัว “หมุน/โคลงเคลง” อย่างไร'},
  E:{icon:'👁️',title:'จำลองการมองเห็น',desc:'มองหน้าจอ แล้วสังเกตความผิดปกติของการมองเห็น'},
  F:{icon:'😊',title:'จำลองใบหน้าเบี้ยว',desc:'หันหน้าเข้ากล้องตรงๆ ระบบจะจำลองอาการหน้าตกข้างหนึ่ง'},
  A:{icon:'🤲',title:'จำลองแขนอ่อนแรง',desc:'ยืนห่างให้เห็นช่วงตัว แล้วยกแขนสองข้างขึ้น'},
};
function camShell(item, onBack){
  const screen=h('div',{class:'screen',style:{background:'#000'}});
  const video=h('video',{playsinline:'true',muted:'true',autoplay:'true',style:{opacity:0,position:'absolute',width:'1px',height:'1px'}});
  const canvas=h('canvas',{style:{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}});
  const wrap=h('div',{class:'cam-wrap'}, canvas, video);
  const g=GUIDE[item.letter]||{icon:'📷',title:item.word,desc:''};
  const controls=h('div',null);
  const statusPill=h('div',{class:'pill',style:{width:'100%',justifyContent:'center',marginBottom:'10px',display:'none'}});
  const bottom=h('div',{class:'cam-bottom'}, statusPill, controls);
  const overlayBtn=h('button',{class:'btn',style:{width:'auto',padding:'14px 30px'},html:'📷 เปิดกล้อง'});
  const overlay=h('div',{class:'cam-overlay'},
    h('img',{src:ASSETS[item.mascot],alt:''}),
    h('h3',null,g.title), h('p',null,g.desc), overlayBtn);
  const top=h('div',{class:'cam-top'},
    h('div',{class:'hdr',style:{paddingBottom:0}},
      h('button',{class:'back-btn',style:{background:'rgba(255,255,255,.2)'},onclick:onBack,html:ICON.back}),
      h('div',{class:'hdr-title'}, h('b',null,g.icon+' '+g.title), h('span',null,item.word+' — '+item.thai)),
      logo(44)));
  screen.append(wrap, top, overlay, bottom);
  return {screen,video,canvas,overlay,overlayBtn,controls,statusPill,setStatus(t){statusPill.style.display='flex';statusPill.textContent=t;}};
}
function mountCam(item, startFn){
  stopAll();
  const back=()=>{ stopAll(); state.screen='detail'; render(); };
  const ui=camShell(item, back);
  app.innerHTML=''; app.append(ui.screen);
  ui.overlayBtn.addEventListener('click', async ()=>{
    ui.overlayBtn.disabled=true; ui.overlayBtn.innerHTML='<div class="spin"></div>';
    try{
      // ใช้ค่ากล้องเริ่มต้นของเครื่อง (ไม่บังคับความละเอียด/อัตราส่วน) → ได้ FOV ปกติ ไม่ถูกครอปจนซูม
      let stream; try{ stream=await getCam({video:{facingMode:'user'},audio:false}); }
      catch(e){ stream=await getCam({video:true,audio:false}); }
      ui.video.srcObject=stream; await ui.video.play();
      await new Promise(r=>{ if(ui.video.videoWidth) r(); else ui.video.onloadedmetadata=r; });
      syncCanvas(ui.canvas);          // ขนาด canvas = ขนาดที่แสดงจริง → ข้อความ/ภาพไม่ยืด/ไม่เพี้ยน
      ui.overlay.style.display='none';
      startFn(ui);
    }catch(e){
      ui.overlay.innerHTML='';
      ui.overlay.append(
        h('img',{src:ASSETS[item.mascot]}),
        h('h3',null,'ไม่สามารถเข้าถึงกล้องได้'),
        h('p',null,'กรุณาอนุญาตการใช้กล้องในเบราว์เซอร์ และเปิดผ่าน HTTPS'),
        h('button',{class:'btn ghost',style:{width:'auto',padding:'12px 24px'},onclick:back},'ย้อนกลับ'));
    }
  });
}

/* ---------- B: Balance / dizziness ---------- */
function launchCamera(item, sub){
  if(item.letter==='B') return mountCam(item, startBalance);
  if(item.letter==='E') return mountCam(item, ui=>startEyes(ui,sub||'blur'));
  if(item.letter==='F') return mountCam(item, startFace);
  if(item.letter==='A') return mountCam(item, startArms);
}
function slider(label, min, max, val, step, oninput){
  const out=h('span',null,'');
  const inp=h('input',{type:'range',min,max,value:val,step});
  inp.addEventListener('input',()=>{ oninput(parseFloat(inp.value), out); });
  oninput(val,out);
  return {el:h('div',{class:'ctl'}, h('label',null, h('span',null,label), out), inp), input:inp};
}
/* ---------- กล้อง: ตัวช่วยกลาง ---------- */
// ปรับขนาด canvas ให้เท่าที่แสดงจริง (คูณ devicePixelRatio) เพื่อความคมและไม่บิดเบี้ยว
function syncCanvas(cv){
  const dpr=Math.min(2, window.devicePixelRatio||1);
  const w=Math.round((cv.clientWidth||cv.parentElement.clientWidth)*dpr);
  const h=Math.round((cv.clientHeight||cv.parentElement.clientHeight)*dpr);
  if(w>1&&h>1&&(cv.width!==w||cv.height!==h)){ cv.width=w; cv.height=h; }
}
// วาดวิดีโอแบบ "cover" เต็มจอ (ขอ stream แนวตั้งมาแล้ว จึงเต็มพอดี ไม่ซูม ไม่มีขอบดำ) + มิเรอร์
// คืนค่า mapping ไว้แปลงพิกัด landmark -> พิกัด canvas
function drawCover(ctx, video, W, H, zoom, mirror){
  const vw=video.videoWidth, vh=video.videoHeight; if(!vw||!vh) return null;
  const scale=Math.max(W/vw, H/vh)*(zoom||1);
  const dw=vw*scale, dh=vh*scale, dx=(W-dw)/2, dy=(H-dh)/2;
  ctx.save();
  if(mirror){ ctx.translate(W,0); ctx.scale(-1,1); ctx.drawImage(video, dx, dy, dw, dh); }
  else ctx.drawImage(video, dx, dy, dw, dh);
  ctx.restore();
  return {dx,dy,dw,dh,mirror,W};
}
// แปลง landmark (normalized 0..1 ของเฟรมวิดีโอ) -> พิกัด canvas ตาม mapping ของ drawCover
function mapPt(m,nx,ny){ const x=m.dx+nx*m.dw; return { x: m.mirror ? (m.W-x) : x, y: m.dy+ny*m.dh }; }
const CAM_ZOOM_FACE=1.0, CAM_ZOOM_BALANCE=1.0, CAM_ZOOM_EYES=1.0, CAM_ZOOM_ARMS=1.0;

/* ---------- B: Balance / dizziness (ค่าคงที่ ผู้ใช้ปรับไม่ได้) ---------- */
function startBalance(ui){
  const {video,canvas,setStatus}=ui;
  const cctx=canvas.getContext('2d');
  const src=document.createElement('canvas'); const sctx=src.getContext('2d');
  const trail=document.createElement('canvas'); const tctx=trail.getContext('2d');
  const amp=1.0;
  setStatus('🌀 จำลอง: เวียนศีรษะ / บ้านหมุน (Balance)');
  function frame(t){
    syncCanvas(canvas);
    const W=canvas.width,H=canvas.height;
    if(src.width!==W){src.width=W;src.height=H;trail.width=W;trail.height=H;tctx.fillStyle='#000';tctx.fillRect(0,0,W,H);}
    // เฟรมภาพจริง (cover+zoom+mirror) ลง src ก่อน แล้วค่อยนำไปหมุน/เบลอ
    sctx.clearRect(0,0,W,H); if(!drawCover(sctx,video,W,H,CAM_ZOOM_BALANCE,true)){ _raf=requestAnimationFrame(frame); return; }
    tctx.fillStyle='rgba(0,0,0,0.30)'; tctx.fillRect(0,0,W,H);
    const ang=(Math.sin(t*0.0016)*0.10+Math.sin(t*0.0031)*0.05)*amp;
    const sway=Math.sin(t*0.0012)*W*0.05*amp, swayY=Math.cos(t*0.0015)*H*0.03*amp;
    const sc=1.14+Math.sin(t*0.002)*0.05*amp;
    tctx.save(); tctx.translate(W/2+sway,H/2+swayY); tctx.rotate(ang); tctx.scale(sc,sc);
    tctx.globalAlpha=0.9; tctx.drawImage(src,-W/2,-H/2,W,H); tctx.restore();
    tctx.save(); tctx.translate(W/2-sway*1.3,H/2); tctx.rotate(-ang*0.7); tctx.scale(sc,sc);
    tctx.globalAlpha=0.28*amp; tctx.drawImage(src,-W/2,-H/2,W,H); tctx.restore();
    cctx.setTransform(1,0,0,1,0,0); cctx.globalAlpha=1; cctx.drawImage(trail,0,0);
    const vg=cctx.createRadialGradient(W/2,H/2,H*0.18,W/2,H/2,H*(0.58-0.06*Math.sin(t*0.004)));
    vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,'+(0.5+0.22*amp)+')');
    cctx.fillStyle=vg; cctx.fillRect(0,0,W,H);
    const N=7; cctx.save(); cctx.translate(W/2,H*0.26); cctx.textAlign='center'; cctx.textBaseline='middle';
    for(let i=0;i<N;i++){ const a=t*0.004+i*(Math.PI*2/N); const r=Math.min(W,H)*0.17;
      cctx.save(); cctx.translate(Math.cos(a)*r,Math.sin(a)*r*0.5); cctx.rotate(a);
      cctx.font='700 '+(18+5*Math.sin(t*0.01+i))+'px Nunito'; cctx.fillStyle='rgba(245,131,31,.85)'; cctx.fillText('★',0,0); cctx.restore(); }
    cctx.restore();
    _raf=requestAnimationFrame(frame);
  }
  _raf=requestAnimationFrame(frame);
}

/* ---------- E: Eyes (ค่าคงที่ ผู้ใช้ปรับไม่ได้) ---------- */
function startEyes(ui, mode){
  const {video,canvas,setStatus,controls}=ui;
  const cctx=canvas.getContext('2d');
  const label={blur:'👁️ จำลอง: ภาพมัว (Blur)',hemi:'👁️ จำลอง: มองเห็นครึ่งซีก (Hemianopia)',double:'👁️ จำลอง: ภาพซ้อน (Double Vision)'};
  setStatus(label[mode]||label.blur);
  let hemiSide='right';
  if(mode==='hemi'){   // ให้ผู้ใช้เลือกบังซ้าย/ขวาได้
    const sw=h('div',{class:'seg'});
    [['left','บังด้านซ้าย'],['right','บังด้านขวา']].forEach(([k,l])=>{
      const b=h('button',{class:hemiSide===k?'on':'',onclick:()=>{hemiSide=k;[...sw.children].forEach(c=>c.className='');b.className='on';}},l);
      sw.append(b);
    });
    controls.append(sw);
  }
  function frame(){
    syncCanvas(canvas);
    const W=canvas.width,H=canvas.height;
    cctx.setTransform(1,0,0,1,0,0); cctx.clearRect(0,0,W,H);
    if(mode==='double'){
      canvas.style.filter='none';
      const off=W*0.055;
      cctx.fillStyle='#000'; cctx.fillRect(0,0,W,H);
      cctx.globalAlpha=0.6;
      cctx.save(); cctx.translate(-off,-off*0.35); drawCover(cctx,video,W,H,CAM_ZOOM_EYES,true); cctx.restore();
      cctx.save(); cctx.translate(off,off*0.35); drawCover(cctx,video,W,H,CAM_ZOOM_EYES,true); cctx.restore();
      cctx.globalAlpha=1;
    } else if(mode==='hemi'){
      canvas.style.filter='none';
      drawCover(cctx,video,W,H,CAM_ZOOM_EYES,true);
      cctx.fillStyle='#000'; if(hemiSide==='left') cctx.fillRect(0,0,W/2,H); else cctx.fillRect(W/2,0,W/2,H);
    } else { // blur — ใช้ CSS filter บน element (รองรับ iOS Safari ต่างจาก ctx.filter)
      canvas.style.filter='blur(11px)';
      drawCover(cctx,video,W,H,CAM_ZOOM_EYES,true);
    }
    _raf=requestAnimationFrame(frame);
  }
  _raf=requestAnimationFrame(frame);
}

/* ---------- MediaPipe loader ---------- */
let _visionMod=null, _faceLM=null, _poseLM=null;
const MPV='0.10.20';
async function loadVision(){ if(_visionMod) return _visionMod; _visionMod=await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@'+MPV); return _visionMod; }
const FACE_URL='https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';
const POSE_URL='https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';
async function getFaceLM(){ if(_faceLM) return _faceLM; const v=await loadVision();
  const fs=await v.FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@'+MPV+'/wasm');
  const mk=d=>v.FaceLandmarker.createFromOptions(fs,{baseOptions:{modelAssetPath:FACE_URL,delegate:d},runningMode:'VIDEO',numFaces:1});
  try{ _faceLM=await mk('GPU'); }catch(e){ _faceLM=await mk('CPU'); }  // GPU ไม่ได้ → ลอง CPU
  return _faceLM; }
async function getPoseLM(){ if(_poseLM) return _poseLM; const v=await loadVision();
  const fs=await v.FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@'+MPV+'/wasm');
  const mk=d=>v.PoseLandmarker.createFromOptions(fs,{baseOptions:{modelAssetPath:POSE_URL,delegate:d},runningMode:'VIDEO',numPoses:1});
  try{ _poseLM=await mk('GPU'); }catch(e){ _poseLM=await mk('CPU'); }
  return _poseLM; }
const NET_MSG = (location.protocol==='file:') ? 'ต้องเปิดผ่านลิงก์เว็บ (https) ไม่ใช่เปิดไฟล์ในเครื่อง' : 'โหลดตัวตรวจจับไม่ได้ — ตรวจสอบอินเทอร์เน็ต';

/* ---------- triangle texture-map helper (image warp) ---------- */
function drawTriTex(ctx,img,s,d){
  const [s0,s1,s2]=s,[d0,d1,d2]=d;
  ctx.save();
  ctx.beginPath();ctx.moveTo(d0.x,d0.y);ctx.lineTo(d1.x,d1.y);ctx.lineTo(d2.x,d2.y);ctx.closePath();ctx.clip();
  const x0=s0.x,y0=s0.y,x1=s1.x,y1=s1.y,x2=s2.x,y2=s2.y;
  const u0=d0.x,v0=d0.y,u1=d1.x,v1=d1.y,u2=d2.x,v2=d2.y;
  const den=x0*(y1-y2)+x1*(y2-y0)+x2*(y0-y1);
  if(Math.abs(den)<1e-6){ctx.restore();return;}
  const a=(u0*(y1-y2)+u1*(y2-y0)+u2*(y0-y1))/den;
  const b=(v0*(y1-y2)+v1*(y2-y0)+v2*(y0-y1))/den;
  const c=(u0*(x2-x1)+u1*(x0-x2)+u2*(x1-x0))/den;
  const dd=(v0*(x2-x1)+v1*(x0-x2)+v2*(x1-x0))/den;
  const e=(u0*(x1*y2-x2*y1)+u1*(x2*y0-x0*y2)+u2*(x0*y1-x1*y0))/den;
  const f=(v0*(x1*y2-x2*y1)+v1*(x2*y0-x0*y2)+v2*(x0*y1-x1*y0))/den;
  ctx.setTransform(a,b,c,dd,e,f);
  ctx.drawImage(img,0,0);
  ctx.restore();
  ctx.setTransform(1,0,0,1,0,0);
}
function labelBox(ctx,text,cx,y,fs){
  ctx.font='700 '+fs+'px Sarabun'; ctx.textAlign='center'; ctx.textBaseline='alphabetic';
  const w=ctx.measureText(text).width+18, h=fs+12;
  ctx.fillStyle='rgba(192,57,43,.92)'; ctx.beginPath();
  (ctx.roundRect?ctx.roundRect(cx-w/2,y,w,h,9):ctx.rect(cx-w/2,y,w,h)); ctx.fill();
  ctx.fillStyle='#fff'; ctx.fillText(text,cx,y+fs+2);
}

/* ---------- F: Face droop (ค่าคงที่ + subtle) ---------- */
function startFace(ui){
  const {video,canvas,setStatus}=ui;
  const cctx=canvas.getContext('2d');
  const tmp=document.createElement('canvas'); const tctx=tmp.getContext('2d');
  const side='right'; let lm=null, ready=false, useMP=true;   // ค่าคงที่: ปากตกซีกขวา
  setStatus('😶 กำลังโหลดตัวตรวจจับใบหน้า...');
  getFaceLM().then(()=>{ready=true;setStatus('😶 จำลอง: ปากเบี้ยว/หน้าตก — หันหน้าตรงเข้ากล้อง');}).catch(()=>{useMP=false;ready=true;setStatus('😶 '+NET_MSG);});
  let map=null;
  function C(i){ const p=lm[i]; return mapPt(map,p.x,p.y); }
  function frame(){
    syncCanvas(canvas);
    const W=canvas.width,H=canvas.height;
    if(tmp.width!==W){tmp.width=W;tmp.height=H;}
    if(useMP&&ready&&_faceLM){ try{ const r=_faceLM.detectForVideo(video,performance.now()); if(r&&r.faceLandmarks&&r.faceLandmarks[0]) lm=r.faceLandmarks[0]; }catch(e){} }
    cctx.setTransform(1,0,0,1,0,0); cctx.clearRect(0,0,W,H);
    map=drawCover(cctx,video,W,H,CAM_ZOOM_FACE,true);
    if(useMP&&lm&&map){
      tctx.setTransform(1,0,0,1,0,0); tctx.clearRect(0,0,W,H); tctx.drawImage(canvas,0,0);
      const cL=C(61),cR=C(291),nose=C(1),chin=C(152),top=C(10),fl=C(234),fr=C(454);
      const anchor = side==='right' ? (cL.x>cR.x?cL:cR) : (cL.x<cR.x?cL:cR);
      const cx=nose.x, fh=Math.max(40,Math.abs(chin.y-top.y));
      const rx0=Math.min(fl.x,fr.x)-fh*0.06, rx1=Math.max(fl.x,fr.x)+fh*0.06;
      const topY=nose.y-fh*0.02;
      const ry0=topY, ry1=chin.y+fh*0.30;
      const cols=7, rows=6, droopPx=fh*0.07, sigX=fh*0.30, sigY=fh*0.32;  // subtle มากๆ: แค่พอสังเกตมุมปากไม่เท่ากัน
      const srcG=[],dst=[];
      for(let j=0;j<=rows;j++){ srcG.push([]); dst.push([]);
        for(let i=0;i<=cols;i++){
          const x=rx0+(rx1-rx0)*i/cols, y=ry0+(ry1-ry0)*j/rows;
          srcG[j].push({x,y});
          const onSide = side==='right' ? (x>=cx-fh*0.04) : (x<=cx+fh*0.04);
          let dx=0,dy=0;
          if(onSide){ const ex=(x-anchor.x)/sigX, ey=(y-anchor.y)/sigY; let w=Math.exp(-(ex*ex+ey*ey)/2);
            const topFade=Math.min(1,Math.max(0,(y-topY)/(fh*0.10)));
            w*=topFade; dy=droopPx*w; dx=(cx-x)*0.10*w; }
          dst[j].push({x:x+dx,y:y+dy});
        }
      }
      for(let j=0;j<rows;j++) for(let i=0;i<cols;i++){
        const a=srcG[j][i],b=srcG[j][i+1],c=srcG[j+1][i],d=srcG[j+1][i+1];
        const A=dst[j][i],B=dst[j][i+1],Cc=dst[j+1][i],D=dst[j+1][i+1];
        drawTriTex(cctx,tmp,[a,b,d],[A,B,D]);
        drawTriTex(cctx,tmp,[a,d,c],[A,D,Cc]);
      }
      cctx.setTransform(1,0,0,1,0,0);
      // เอาวงกลม/เส้นเปรียบเทียบ/ข้อความบนภาพออก — เหลือเฉพาะเอฟเฟกต์ปากตก
    } else if(ready){ drawNetError(cctx,W,H); }
    _raf=requestAnimationFrame(frame);
  }
  _raf=requestAnimationFrame(frame);
}
// ข้อความแจ้งเตือนโหลดโมเดลไม่ได้ (สองบรรทัด กันข้อความล้นจอ)
function drawNetError(cctx,W,H){
  cctx.setTransform(1,0,0,1,0,0);
  cctx.fillStyle='rgba(0,0,0,.6)'; cctx.fillRect(0,H*0.40,W,H*0.20);
  cctx.fillStyle='#fff'; cctx.textAlign='center'; cctx.textBaseline='alphabetic'; cctx.font='700 '+Math.round(H*0.03)+'px Sarabun';
  const lines=(location.protocol==='file:')?['⚠️ เปิดผ่านลิงก์เว็บ (https)','ไม่ใช่เปิดไฟล์ในเครื่อง']:['⚠️ โหลดตัวตรวจจับไม่ได้','ตรวจสอบอินเทอร์เน็ต'];
  cctx.fillText(lines[0], W/2, H*0.48); cctx.fillText(lines[1], W/2, H*0.48+H*0.05);
}

/* ---------- A: Arms weakness (realtime overlay) ---------- */
function startArms(ui){
  const {video,canvas,controls,setStatus}=ui;
  const cctx=canvas.getContext('2d');
  let lm=null, ready=false, useMP=true, map=null;
  const weak=Math.random()<0.5?'right':'left'; const weakTxt=weak==='right'?'ขวา':'ซ้าย';
  setStatus('🤲 กำลังโหลดตัวตรวจจับท่าทาง...');
  controls.append(h('div',{class:'ctl',style:{textAlign:'center'},html:'ยืนให้เห็นช่วงตัว แล้วยกแขนสองข้างขึ้น — สังเกตแขนข้าง<b style="color:#F5831F">'+weakTxt+'</b>ที่จะตกลง'}));
  getPoseLM().then(()=>{ready=true;setStatus('🤲 จำลอง: แขนข้าง'+weakTxt+'อ่อนแรง — ยกแขนสองข้างขึ้น');}).catch(()=>{useMP=false;ready=true;setStatus('🤲 '+NET_MSG);});
  function P(i){ const p=lm[i]; const q=mapPt(map,p.x,p.y); q.v=p.visibility; return q; }
  function limb(a,b,c,col,wid){ cctx.strokeStyle=col; cctx.lineWidth=wid; cctx.lineCap='round'; cctx.lineJoin='round';
    cctx.beginPath(); cctx.moveTo(a.x,a.y); cctx.lineTo(b.x,b.y); cctx.lineTo(c.x,c.y); cctx.stroke();
    cctx.fillStyle=col; cctx.beginPath(); cctx.arc(c.x,c.y,wid*0.72,0,7); cctx.fill(); }
  function frame(){
    syncCanvas(canvas);
    const W=canvas.width,H=canvas.height;
    if(useMP&&ready&&_poseLM){ try{ const r=_poseLM.detectForVideo(video,performance.now()); if(r&&r.landmarks&&r.landmarks[0]) lm=r.landmarks[0]; }catch(e){} }
    // Base layer = กล้องจริง 100% (ไม่หรี่ ไม่วาดหุ่นทึบบังคน) ; Top layer = เส้น AR สั้นๆ เฉพาะแขน
    cctx.setTransform(1,0,0,1,0,0); cctx.clearRect(0,0,W,H);
    map=drawCover(cctx,video,W,H,CAM_ZOOM_ARMS,true);
    if(useMP&&lm&&map){
      const Ls=P(11),Rs=P(12),Le=P(13),Re=P(14),Lw=P(15),Rw=P(16);
      const wid=Math.max(8,H*0.022);
      // แขนข้างแข็งแรง = วาดเส้นตามจริง (เขียว) เฉพาะแขน
      const strongLeft = weak!=='left';
      if(strongLeft) limb(Ls,Le,Lw,'rgba(46,230,166,.95)',wid); else limb(Rs,Re,Rw,'rgba(46,230,166,.95)',wid);
      // แขนข้างอ่อนแรง (Simulation) = คำนวณพิกัดจำลองให้ดิ่งลงจากไหล่เสมอ แม้ผู้ใช้ยกจริง (แดง)
      const sh = weak==='left'?Ls:Rs;
      const raised = (weak==='left'?(Lw.y<Ls.y-H*0.03):(Rw.y<Rs.y-H*0.03));
      const dir = weak==='left'?1:-1;
      const el={x:sh.x+dir*W*0.05, y:sh.y+H*0.15};
      const wr={x:sh.x+dir*W*0.015, y:sh.y+H*0.31};
      limb(sh,el,wr,'#ff3b3b',wid);
      cctx.fillStyle='#ff3b3b'; cctx.font='900 '+Math.round(H*0.05)+'px Nunito'; cctx.textAlign='center'; cctx.textBaseline='alphabetic'; cctx.fillText('↓',wr.x,wr.y+H*0.075);
      labelBox(cctx,'แขน'+weakTxt+'อ่อนแรง',wr.x,Math.min(H-H*0.06,wr.y+H*0.09),Math.round(H*0.03));
      const msg = raised ? 'แขนข้าง'+weakTxt+'ยกไม่ขึ้น' : 'ยกแขนสองข้างขึ้นพร้อมกัน';
      const fs=Math.round(H*0.032); cctx.font='700 '+fs+'px Sarabun'; cctx.textAlign='center'; cctx.textBaseline='alphabetic';
      const bw=cctx.measureText(msg).width+28, bh=fs+16, by=H*0.04;
      cctx.fillStyle= raised?'rgba(245,131,31,.96)':'rgba(0,0,0,.55)';
      cctx.beginPath(); (cctx.roundRect?cctx.roundRect(W/2-bw/2,by,bw,bh,10):cctx.rect(W/2-bw/2,by,bw,bh)); cctx.fill();
      cctx.fillStyle='#fff'; cctx.fillText(msg,W/2,by+fs+3);
    } else if(ready){ drawNetError(cctx,W,H); }
    _raf=requestAnimationFrame(frame);
  }
  _raf=requestAnimationFrame(frame);
}

/* ============================ S: Speech ============================ */
function launchSpeech(){
  stopAll();
  const item=BEFAST[4];
  const back=()=>{stopAll();state.screen='detail';render();};
  const screen=h('div',{class:'screen',style:{background:'linear-gradient(175deg,#1B3B9B,#0d2266)'}});
  const wordList=['แมงมุม','ทับทิม','ฟื้นฟู','ขอบคุณ','รื่นเริง','ใบบัวบก'];
  const sentenceList=['คุณสบายดีหรือ','เท้าติดดิน','ฉันกลับบ้านทันทีหลังเลิกงาน','ใกล้โต๊ะอาหารในห้องครัว','เมื่อคืนฉันได้ยินเขาพูดทางวิทยุ'];
  let mediaR=null, chunks=[], recBuf=null, actx=null, recording=false, playing=false;
  const statusEl=h('div',{style:{color:'rgba(255,255,255,.85)',fontSize:'13px',textAlign:'center',minHeight:'20px',marginBottom:'10px'}},'กดปุ่มไมค์ แล้วพูดประโยคด้านล่าง');
  const recBtn=h('button',{class:'btn',style:{width:'auto',padding:'16px 26px'},html:'🎤 เริ่มอัดเสียง'});
  const playRaw=h('button',{class:'btn blue sm',disabled:'true',html:'▶ ฟังเสียงปกติ'});
  const playSlur=h('button',{class:'btn sm',disabled:'true',html:'🗣️ ฟังเสียงพูดติดขัด'});
  // ทำได้ทีละอย่าง: อัดอยู่ห้ามฟัง / ฟังอยู่ห้ามอัดและห้ามฟังอีกปุ่ม
  function updBtns(){ recBtn.disabled=playing; const canPlay=!!recBuf&&!recording&&!playing; playRaw.disabled=!canPlay; playSlur.disabled=!canPlay; }
  let micStream=null;
  async function getMic(){ if(micStream && micStream.active) return micStream; micStream=await navigator.mediaDevices.getUserMedia({audio:true}); _stream=micStream; return micStream; }
  async function decode(blob){ const buf=await blob.arrayBuffer(); const ac=new (window.AudioContext||window.webkitAudioContext)(); recBuf=await ac.decodeAudioData(buf); ac.close(); }
  async function startRec(){
    try{ const s=await getMic(); chunks=[];   // ขออนุญาตไมค์ครั้งเดียว แล้วใช้ซ้ำได้เรื่อยๆ
      mediaR=new MediaRecorder(s); _recorder=mediaR;
      mediaR.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
      mediaR.onstop=async()=>{ const blob=new Blob(chunks,{type:mediaR.mimeType||'audio/webm'});   // ไม่ปิด track — คงสิทธิ์ไมค์ไว้
        statusEl.textContent='กำลังประมวลผลเสียง...'; try{ await decode(blob); updBtns(); statusEl.textContent='อัดเสียงเรียบร้อย — กดอัดใหม่ได้เลย ไม่ต้องขออนุญาตอีก'; }catch(e){ statusEl.textContent='ประมวลผลเสียงไม่ได้ ลองใหม่'; } };
      mediaR.start(); recording=true; updBtns(); recBtn.innerHTML='⏹ หยุดอัด'; recBtn.style.background='linear-gradient(135deg,#c0392b,#e74c3c)';
      statusEl.innerHTML='<span style="display:inline-flex;gap:8px;align-items:center;justify-content:center"><span class="rec-dot"></span> กำลังอัด... พูดเลย!</span>';
    }catch(e){ statusEl.textContent='ไม่สามารถเข้าถึงไมโครโฟนได้ (ต้องอนุญาต + ใช้ HTTPS)'; }
  }
  function stopRec(){ if(mediaR&&mediaR.state!=='inactive') mediaR.stop(); recording=false; recBtn.innerHTML='🎤 อัดเสียงอีกครั้ง'; recBtn.style.background=''; updBtns(); }
  recBtn.addEventListener('click',()=>{ if(playing) return; recording?stopRec():startRec(); });
  function playNormal(){ if(!recBuf||recording||playing)return; playing=true; updBtns(); const ac=new (window.AudioContext||window.webkitAudioContext)(); _audio=ac; const s=ac.createBufferSource(); s.buffer=recBuf; s.connect(ac.destination); s.onended=()=>{playing=false;updBtns();}; s.start(); }
  // "พูดไม่ชัด": จูนตามเสียงตัวอย่าง dysarthria จริง — มัวจัด เน้นย่านต่ำ ตัดพยัญชนะ ฟังไม่รู้เรื่อง + ยืดช้านิดเดียว
  function playSlurred(){ if(!recBuf||recording||playing)return; playing=true; updBtns();
    const ac=new (window.AudioContext||window.webkitAudioContext)(); _audio=ac;
    const s=ac.createBufferSource(); s.buffer=recBuf; s.playbackRate.value=0.9;      // ยืด/ช้าลงเล็กน้อย
    const lp=ac.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=900; lp.Q.value=0.9;   // มัวจัด (พลังงานเสียงจริงเกือบทั้งหมด <500Hz)
    const lp2=ac.createBiquadFilter(); lp2.type='lowpass'; lp2.frequency.value=1500; lp2.Q.value=0.5; // ชันขึ้น
    const low=ac.createBiquadFilter(); low.type='peaking'; low.frequency.value=300; low.gain.value=5; low.Q.value=0.8; // ดันย่านต่ำ 125–400Hz ที่เด่นในตัวอย่าง
    const dip=ac.createBiquadFilter(); dip.type='peaking'; dip.frequency.value=2500; dip.gain.value=-13; dip.Q.value=1.0; // กดพยัญชนะ = ฟังไม่รู้เรื่อง
    const dl=ac.createDelay(); dl.delayTime.value=0.045; const fb=ac.createGain(); fb.gain.value=0.22; dl.connect(fb); fb.connect(dl); // เบลอ/ลิ้นพัน
    const wet=ac.createGain(); wet.gain.value=0.4; const master=ac.createGain(); master.gain.value=1.5; // ชดเชยพลังงานที่หายไป
    s.connect(lp); lp.connect(lp2); lp2.connect(low); low.connect(dip); dip.connect(master);
    dip.connect(dl); dl.connect(wet); wet.connect(master); master.connect(ac.destination);
    s.onended=()=>{playing=false;updBtns();}; s.start();
  }
  playRaw.addEventListener('click',playNormal); playSlur.addEventListener('click',playSlurred);
  const body=h('div',{class:'grow scroll',style:{padding:'6px 18px 18px',display:'flex',flexDirection:'column'}},
    h('div',{style:{background:'rgba(255,255,255,.08)',borderRadius:'16px',padding:'16px',marginBottom:'14px'}},
      statusEl,
      h('div',{style:{display:'flex',justifyContent:'center',marginBottom:'12px'}}, recBtn),
      h('div',{style:{display:'flex',flexDirection:'column',gap:'8px'}}, playRaw, playSlur)),
    h('div',{style:{fontSize:'13px',fontWeight:700,color:'rgba(255,255,255,.85)',marginBottom:'8px'}},'① ลองอ่านออกเสียงคำเหล่านี้:'),
    h('div',{style:{display:'flex',flexWrap:'wrap',gap:'8px',marginBottom:'14px'}},
      ...wordList.map(w=>h('div',{style:{background:'rgba(255,255,255,.12)',borderRadius:'10px',padding:'9px 14px',color:'#fff',fontSize:'16px',fontWeight:700,fontFamily:'Sarabun'}},w))),
    h('div',{style:{fontSize:'13px',fontWeight:700,color:'rgba(255,255,255,.85)',marginBottom:'8px'}},'② แล้วอ่านประโยคเหล่านี้:'),
    ...sentenceList.map(w=>h('div',{style:{background:'rgba(255,255,255,.1)',borderRadius:'12px',padding:'12px 16px',marginBottom:'8px',color:'#fff',fontSize:'16px',fontWeight:600,fontFamily:'Sarabun',lineHeight:1.5}},w)),
    h('div',{class:'disc',style:{marginTop:'6px'}},'⚠️ '+DISCLAIMER)
  );
  screen.append(header('ทดสอบการพูด',null,back), body);
  app.innerHTML=''; app.append(screen);
}

/* ============================ T: Time / 1669 dialer ============================ */
function launchTime(){
  stopAll();
  // ---- sound effects (Web Audio, ไม่ใช้ไฟล์เสียง) ----
  let actx=null, ringTimer=null;
  function AC(){ if(!actx){ try{actx=new (window.AudioContext||window.webkitAudioContext)();}catch(e){return null;} } if(actx.state==='suspended') actx.resume(); return actx; }
  function tone(freqs,dur,type,gain){ const ac=AC(); if(!ac)return; const g=ac.createGain(); g.connect(ac.destination); const t0=ac.currentTime;
    g.gain.setValueAtTime(gain,t0); g.gain.setValueAtTime(gain,t0+Math.max(0.01,dur-0.03)); g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
    freqs.forEach(f=>{ const o=ac.createOscillator(); o.type=type||'sine'; o.frequency.value=f; o.connect(g); o.start(t0); o.stop(t0+dur); }); }
  const DTMF={'1':[697,1209],'2':[697,1336],'3':[697,1477],'4':[770,1209],'5':[770,1336],'6':[770,1477],'7':[852,1209],'8':[852,1336],'9':[852,1477],'*':[941,1209],'0':[941,1336],'#':[941,1477]};
  function dtmf(d){ tone(DTMF[d]||[800],0.13,'sine',0.16); }
  function errorBuzz(){ tone([180,230],0.18,'sawtooth',0.14); setTimeout(()=>tone([180,230],0.18,'sawtooth',0.14),210); }
  function ringOnce(){ tone([425],1.0,'sine',0.13); }
  function ringStart(){ ringStop(); ringOnce(); ringTimer=setInterval(ringOnce,3000); }
  function ringStop(){ if(ringTimer){clearInterval(ringTimer);ringTimer=null;} }
  function killAudio(){ ringStop(); if(actx){ try{actx.close();}catch(e){} actx=null; } }
  const back=()=>{ killAudio(); state.screen='detail'; render(); };
  const screen=h('div',{class:'screen',style:{background:'linear-gradient(175deg,#0d2266,#1B3B9B)'}});
  let num='';
  const disp=h('div',{class:'dial-display'},'');
  const hint=h('div',{style:{textAlign:'center',color:'rgba(255,255,255,.55)',fontSize:'15px',minHeight:'22px',marginTop:'6px'}},'กดหมายเลขสายด่วนฉุกเฉิน แล้วกดปุ่มโทร');
  function upd(){ disp.textContent=num||' '; }
  function press(d){ dtmf(d); if(num.length<10){num+=d; hint.textContent='กดหมายเลขสายด่วนฉุกเฉิน แล้วกดปุ่มโทร'; upd();} }
  function del(){ num=num.slice(0,-1);upd(); }
  function callNow(){ if(num==='1669'){ showCalling(); } else { errorBuzz(); hint.innerHTML='<span style="color:#ffcf9a">หมายเลขไม่ถูกต้อง ลองใหม่อีกครั้ง</span>'; num=''; upd(); } }
  const keys=[['1',''],['2','ABC'],['3','DEF'],['4','GHI'],['5','JKL'],['6','MNO'],['7','PQRS'],['8','TUV'],['9','WXYZ'],['*',''],['0','+'],['#','']];
  const pad=h('div',{class:'keypad'});
  keys.forEach(([d,s])=>pad.append(h('button',{class:'key',onclick:()=>press(d)}, h('span',null,d), s&&h('small',null,s))));
  const callRow=h('div',{style:{display:'flex',alignItems:'center',justifyContent:'center',gap:'30px',marginTop:'14px'}},
    h('div',{style:{width:'44px'}}),
    h('button',{onclick:callNow,style:{width:'62px',height:'62px',borderRadius:'50%',background:'#2ecc71',border:'none',cursor:'pointer',boxShadow:'0 6px 20px rgba(46,204,113,.4)',display:'flex',alignItems:'center',justifyContent:'center'},html:'<svg width="27" height="27" viewBox="0 0 24 24" fill="#fff"><path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.24 11 11 0 003.5.56 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11 11 0 00.56 3.5 1 1 0 01-.24 1z"/></svg>'}),
    h('button',{onclick:del,style:{width:'44px',height:'44px',borderRadius:'50%',background:'rgba(255,255,255,.12)',border:'none',cursor:'pointer',color:'#fff',fontSize:'18px'}},'⌫')
  );
  function showCalling(){
    ringStart();
    screen.innerHTML='';
    screen.append(header('กำลังโทร','สายด่วนฉุกเฉิน',back),
      h('div',{class:'grow',style:{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'18px',padding:'24px'}},
        h('div',{style:{width:'110px',height:'110px',borderRadius:'50%',background:'linear-gradient(135deg,#c0392b,#e74c3c)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 0 12px rgba(231,76,60,.15)',animation:'blink 1.3s infinite'}},
          h('div',{class:'font-n',style:{fontSize:'40px',fontWeight:900,color:'#fff'}},'1669')),
        h('div',{style:{color:'#fff',fontSize:'20px',fontWeight:700}},'กำลังโทรออก...'),
        h('div',{style:{color:'rgba(255,255,255,.6)',fontSize:'13px'}},'สายด่วนการแพทย์ฉุกเฉิน 1669'),
        h('div',{style:{background:'rgba(245,131,31,.15)',border:'1px solid rgba(245,131,31,.4)',borderRadius:'14px',padding:'14px 16px',color:'#fff',fontSize:'13px',lineHeight:1.7,textAlign:'center',maxWidth:'300px'},html:'⏱️ <b>Golden Period 4.5 ชั่วโมง</b><br>แจ้งเวลาที่เริ่มมีอาการ และบอกว่าสงสัยโรคหลอดเลือดสมอง'}),
        h('button',{class:'btn',style:{width:'auto',padding:'12px 28px',background:'linear-gradient(135deg,#c0392b,#e74c3c)'},onclick:back,html:'📵 วางสาย'})
      ),
      h('div',{class:'disc'},'⚠️ นี่คือการจำลองเท่านั้น — ในสถานการณ์จริงโทร 1669 ได้ทันที'));
  }
  screen.append(header('จำลองโทรฉุกเฉิน','B.E.F.A.S.T — Time',back),
    h('div',{class:'grow',style:{display:'flex',flexDirection:'column',justifyContent:'center',padding:'6px 22px 16px'}},
      disp, hint, h('div',{style:{height:'22px'}}), pad, callRow),
    h('div',{class:'disc'},'⚠️ '+DISCLAIMER));
  upd();
  app.innerHTML=''; app.append(screen);
}

/* ============================ RESPONSIVE SCALE-TO-FIT ============================ */
const BASE_W=430, BASE_H=924;
function fitApp(){
  const s=Math.min(window.innerWidth/BASE_W, window.innerHeight/BASE_H);
  app.style.transform='translate(-50%,-50%) scale('+s+')';
}
window.addEventListener('resize', fitApp);
window.addEventListener('orientationchange', fitApp);
if(window.visualViewport) window.visualViewport.addEventListener('resize', fitApp);

/* ============================ INIT ============================ */
window.addEventListener('pagehide', stopAll);
window.addEventListener('beforeunload', stopAll);
document.addEventListener('visibilitychange',()=>{ if(document.hidden) stopAll(); });
fitApp();
render();
