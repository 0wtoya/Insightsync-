import { useState, useMemo } from "react";

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@300;400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Plus Jakarta Sans',sans-serif;background:#f0f2f5;color:#1a1d23;}
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:#d0d4dc;border-radius:3px;}
input,select,textarea{outline:none;font-family:inherit;}
button{font-family:inherit;cursor:pointer;}
.row-hover:hover{background:#f0f7ff!important;}
.nav-btn:hover{background:#f0f2f5!important;}
`;

const C = {
  bg:"#f0f2f5",border:"#e8eaef",
  accent:"#00b386",accentLight:"#e6f7f3",accentDark:"#008f6b",
  red:"#e8344e",redLight:"#fde8eb",
  blue:"#3b6ef8",yellow:"#f5a623",
  text:"#1a1d23",textSub:"#6b7280",textMuted:"#9ca3af",
  shadow:"0 1px 3px rgba(0,0,0,0.08)",
};

const TRADES_INIT = [
  {id:1,date:"2025-01-17",symbol:"XAUUSD",side:"Long", entry:2648.5,exit:2665.2,size:2.0, pnl:6051.49, tags:["Trend","Gold"],notes:"Strong momentum"},
  {id:2,date:"2025-01-17",symbol:"XAUUSD",side:"Long", entry:2651.0,exit:2658.8,size:1.5, pnl:2079.51, tags:["Scalp"],      notes:"Quick scalp"},
  {id:3,date:"2025-01-16",symbol:"XAUUSD",side:"Short",entry:2660.0,exit:2669.5,size:0.8, pnl:-1436.50,tags:["Reversal"],   notes:"Stopped out"},
  {id:4,date:"2025-01-15",symbol:"XAUUSD",side:"Short",entry:2670.0,exit:2688.3,size:0.85,pnl:-2816.49,tags:["Loss"],       notes:"Against trend"},
  {id:5,date:"2025-01-14",symbol:"XAUUSD",side:"Long", entry:2638.0,exit:2650.6,size:0.87,pnl:-1988.53,tags:["Breakout"],  notes:"False breakout"},
  {id:6,date:"2025-01-13",symbol:"XAUUSD",side:"Long", entry:2620.0,exit:2641.5,size:0.82,pnl:3147.50, tags:["Trend"],     notes:"Clean trend day"},
  {id:7,date:"2025-01-10",symbol:"XAUUSD",side:"Short",entry:2690.0,exit:2695.8,size:0.83,pnl:-860.47, tags:["Counter"],   notes:"Early entry"},
  {id:8,date:"2025-01-09",symbol:"XAUUSD",side:"Short",entry:2695.0,exit:2705.5,size:0.78,pnl:-1244.47,tags:["Loss"],      notes:"Wrong direction"},
  {id:9,date:"2025-01-08",symbol:"XAUUSD",side:"Long", entry:2635.0,exit:2651.8,size:0.92,pnl:-1148.47,tags:["Breakout"], notes:"Choppy day"},
  {id:10,date:"2025-01-07",symbol:"XAUUSD",side:"Long",entry:2618.0,exit:2645.2,size:1.1, pnl:5280.00, tags:["Trend","Gold"],notes:"Excellent setup"},
  {id:11,date:"2025-01-06",symbol:"XAUUSD",side:"Long",entry:2610.0,exit:2637.5,size:0.95,pnl:2700.00, tags:["Trend"],    notes:"News driven"},
  {id:12,date:"2025-01-03",symbol:"XAUUSD",side:"Short",entry:2660.0,exit:2751.3,size:0.88,pnl:-9030.00,tags:["Loss"],    notes:"Major loss"},
  {id:13,date:"2025-01-02",symbol:"XAUUSD",side:"Short",entry:2655.0,exit:2673.7,size:0.94,pnl:-9670.00,tags:["Loss"],    notes:"Bad risk mgmt"},
];

const CAL = {
  "2025-01-02":{pnl:7220,trades:2,wr:50.0},
  "2025-01-03":{pnl:2080,trades:3,wr:33.3},
  "2025-01-06":{pnl:-6740,trades:4,wr:0.0},
  "2025-01-07":{pnl:2900,trades:3,wr:33.3},
  "2025-01-08":{pnl:-3840,trades:3,wr:33.3},
  "2025-01-13":{pnl:5280,trades:3,wr:33.3},
  "2025-01-14":{pnl:2700,trades:1,wr:100.0},
  "2025-01-15":{pnl:-9030,trades:9,wr:11.1},
  "2025-01-16":{pnl:-9670,trades:1,wr:0.0},
  "2025-01-17":{pnl:-2340,trades:7,wr:28.6},
};

const EQ = [
  {d:"12/28",v:0},{d:"01/15",v:28000},{d:"02/20",v:52000},{d:"04/01",v:95000},
  {d:"05/10",v:80000},{d:"06/15",v:110000},{d:"07/20",v:145000},{d:"09/01",v:190000},
  {d:"10/15",v:220000},{d:"11/20",v:255000},{d:"12/28",v:270000},{d:"01/17",v:299683},
];

const BARS = [
  {v:1200},{v:3400},{v:-800},{v:4200},{v:6800},{v:-1400},{v:2100},{v:5500},
  {v:-2200},{v:3800},{v:7200},{v:-1100},{v:4500},{v:6200},{v:-3400},{v:2900},
  {v:5100},{v:8900},{v:-1800},{v:4400},{v:3200},{v:-900},{v:6100},{v:4800},
  {v:-2500},{v:3700},{v:5900},{v:4200},{v:70000},{v:-1300},{v:3600},{v:5200},
  {v:-1700},{v:4100},{v:-7600},
];

const JOURNAL_INIT = [
  {id:1,date:"2025-01-17",mood:"good",marketBias:"Bullish",preNotes:"Gold looking strong above 2650. Plan to buy dips.",postNotes:"Executed well on morning session. Took profits early on second trade.",lessons:"Let winners run more. First trade was perfect execution.",tags:["Discipline","Gold"],pnl:8131},
  {id:2,date:"2025-01-16",mood:"bad",marketBias:"Bearish",preNotes:"DXY strength expected. Looking for shorts on bounce.",postNotes:"Tried to fight the trend early, got stopped out.",lessons:"Don't trade against strong momentum. Wait for confirmation.",tags:["Lesson"],pnl:-1437},
  {id:3,date:"2025-01-15",mood:"neutral",marketBias:"Bearish",preNotes:"CPI data due. Staying cautious.",postNotes:"CPI came in hot. Big move but unclear direction.",lessons:"Avoid trading into major news without a clear plan.",tags:["News","Risk"],pnl:-4805},
  {id:4,date:"2025-01-14",mood:"good",marketBias:"Bullish",preNotes:"Clean ascending triangle on 1H gold chart.",postNotes:"Clean breakout trade. Followed the plan well.",lessons:"When setup is clean and you follow the plan, results come.",tags:["Discipline","Breakout"],pnl:2700},
  {id:5,date:"2025-01-13",mood:"good",marketBias:"Bullish",preNotes:"Fresh week. Expecting trend continuation from Friday highs.",postNotes:"Solid trend day. Stayed patient and caught the main move.",lessons:"Patience pays. Don't force trades early.",tags:["Patience","Trend"],pnl:3148},
];

const MOODS = [
  {val:"great",emoji:"😄",label:"Great",color:"#00b386"},
  {val:"good", emoji:"🙂",label:"Good", color:"#3b6ef8"},
  {val:"neutral",emoji:"😐",label:"Neutral",color:"#f5a623"},
  {val:"bad",  emoji:"😕",label:"Bad",  color:"#e8344e"},
  {val:"awful",emoji:"😤",label:"Awful",color:"#9b1c1c"},
];

const fmt = (n,d=2) => {
  const abs = Math.abs(n);
  return (n<0?"-$":"$") + abs.toLocaleString("en-US",{minimumFractionDigits:d,maximumFractionDigits:d});
};

// GaugeArc
function GaugeArc({value,max=100,color,size=80,thickness=8}){
  const r=(size-thickness)/2,cx=size/2,cy=size/2;
  const sa=-210,ea=30,ta=ea-sa;
  const va=value/max*ta+sa;
  const rad=a=>a*Math.PI/180;
  const arc=(a1,a2,s,sw)=>{
    const x1=cx+r*Math.cos(rad(a1)),y1=cy+r*Math.sin(rad(a1));
    const x2=cx+r*Math.cos(rad(a2)),y2=cy+r*Math.sin(rad(a2));
    const lg=Math.abs(a2-a1)>180?1:0;
    return <path d={`M${x1},${y1} A${r},${r} 0 ${lg} 1 ${x2},${y2}`} fill="none" stroke={s} strokeWidth={sw} strokeLinecap="round"/>;
  };
  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>{arc(sa,ea,"#e8eaef",thickness)}{arc(sa,va,color,thickness)}</svg>;
}

// RadarChart
function RadarChart({data,size=200}){
  const n=data.length,cx=size/2,cy=size/2,r=size*0.36;
  const ang=i=>(i*2*Math.PI/n)-Math.PI/2;
  const pt=(i,s)=>[cx+r*s*Math.cos(ang(i)),cy+r*s*Math.sin(ang(i))];
  const vals=data.map(d=>d.value/100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[0.25,0.5,0.75,1].map(s=><polygon key={s} points={data.map((_,i)=>pt(i,s).join(",")).join(" ")} fill="none" stroke="#e8eaef" strokeWidth="1"/>)}
      {data.map((_,i)=>{const[x,y]=pt(i,1);return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e8eaef" strokeWidth="1"/>;} )}
      <polygon points={vals.map((v,i)=>pt(i,v).join(",")).join(" ")} fill={C.accent} fillOpacity="0.18" stroke={C.accent} strokeWidth="2" strokeLinejoin="round"/>
      {vals.map((v,i)=>{const[x,y]=pt(i,v);return <circle key={i} cx={x} cy={y} r="4" fill={C.accent} stroke="#fff" strokeWidth="2"/>;} )}
      {data.map((d,i)=>{const[x,y]=pt(i,1.3);return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="9" fill={C.textSub}>{d.label}</text>;} )}
    </svg>
  );
}

// EquityChart
function EquityChart({points}){
  const W=500,H=160,pl={l:60,r:10,t:10,b:24};
  const vals=points.map(p=>p.v);
  const mn=Math.min(...vals),mx=Math.max(...vals),rng=mx-mn||1;
  const iw=W-pl.l-pl.r,ih=H-pl.t-pl.b;
  const px=i=>pl.l+(i/(points.length-1))*iw;
  const py=v=>pl.t+ih-((v-mn)/rng)*ih;
  const line=points.map((p,i)=>`${px(i)},${py(p.v)}`).join(" ");
  const fill=`${px(0)},${pl.t+ih} ${line} ${px(points.length-1)},${pl.t+ih}`;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs><linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={C.accent} stopOpacity="0.28"/>
        <stop offset="100%" stopColor={C.accent} stopOpacity="0.02"/>
      </linearGradient></defs>
      {[0,100000,200000,300000].map(v=>{const y=py(v);return <g key={v}>
        <line x1={pl.l} y1={y} x2={W-pl.r} y2={y} stroke="#e8eaef" strokeWidth="1" strokeDasharray="3,3"/>
        <text x={pl.l-5} y={y} textAnchor="end" dominantBaseline="central" fontSize="9" fill={C.textMuted} fontFamily="monospace">{v>=1000?"$"+(v/1000)+"K":"$0"}</text>
      </g>;})}
      {[0,3,6,9,11].map(i=><text key={i} x={px(i)} y={H-5} textAnchor="middle" fontSize="9" fill={C.textMuted} fontFamily="monospace">{points[i].d}</text>)}
      <polygon points={fill} fill="url(#eg)"/>
      <polyline points={line} fill="none" stroke={C.accent} strokeWidth="2.5" strokeLinejoin="round"/>
      <circle cx={px(points.length-1)} cy={py(vals[vals.length-1])} r="4" fill={C.accent} stroke="#fff" strokeWidth="2"/>
    </svg>
  );
}

// DailyBars
function DailyBars({bars}){
  const W=420,H=140,pl={l:48,r:6,t:10,b:22};
  const ma=Math.max(...bars.map(b=>Math.abs(b.v)));
  const iw=W-pl.l-pl.r,ih=H-pl.t-pl.b;
  const bw=Math.max(2,iw/bars.length-1.5);
  const z=pl.t+ih/2;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      {[-ma*0.7,-ma*0.35,0,ma*0.35,ma*0.7].map(v=>{
        const y=z-(v/ma)*(ih/2);
        return <g key={v}>
          <line x1={pl.l} y1={y} x2={W-pl.r} y2={y} stroke="#e8eaef" strokeWidth="1" strokeDasharray={v===0?"":"3,3"}/>
          <text x={pl.l-4} y={y} textAnchor="end" dominantBaseline="central" fontSize="8" fill={C.textMuted} fontFamily="monospace">
            {v===0?"$0":v>0?"$"+(v/1000|0)+"K":"-$"+(Math.abs(v)/1000|0)+"K"}
          </text>
        </g>;
      })}
      {bars.map((b,i)=>{
        const x=pl.l+(i/bars.length)*iw+0.5;
        const bh=(Math.abs(b.v)/ma)*(ih/2);
        return <rect key={i} x={x} y={b.v>=0?z-bh:z} width={bw} height={Math.max(1,bh)} fill={b.v>=0?C.accent:C.red} rx="1" opacity="0.85"/>;
      })}
    </svg>
  );
}

// Calendar
function Calendar({data=CAL}){
  const year=2025,month=0;
  const firstDay=new Date(year,month,1).getDay();
  const dim=new Date(year,month+1,0).getDate();
  const weeks=[];
  let day=1-firstDay;
  while(day<=dim){
    const wk=[];
    for(let d=0;d<7;d++,day++) wk.push(day>=1&&day<=dim?day:null);
    weeks.push(wk);
  }
  const pad=n=>String(n).padStart(2,"0");
  const key=d=>`${year}-${pad(month+1)}-${pad(d)}`;
  const totalPnl=Object.values(data).reduce((a,v)=>a+v.pnl,0);
  const days=Object.keys(data).length;
  const WL=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button style={{border:`1px solid ${C.border}`,background:"#fff",borderRadius:6,width:26,height:26,color:C.textSub}}>‹</button>
          <b style={{fontSize:14}}>January 2025</b>
          <button style={{border:`1px solid ${C.border}`,background:"#fff",borderRadius:6,width:26,height:26,color:C.textSub}}>›</button>
          <span style={{background:C.accentLight,color:C.accent,fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:6}}>This month</span>
        </div>
        <div style={{display:"flex",gap:12,fontSize:12,alignItems:"center"}}>
          <span style={{color:C.textSub}}>Monthly stats:</span>
          <span style={{color:totalPnl>=0?C.accent:C.red,fontWeight:700}}>{fmt(totalPnl,0)}</span>
          <span style={{color:C.textSub}}>{days} days</span>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"56px repeat(7,1fr)",gap:3}}>
        <div/>
        {WL.map(l=><div key={l} style={{textAlign:"center",fontSize:10,fontWeight:600,color:C.textMuted,padding:"4px 0"}}>{l}</div>)}
        {weeks.map((wk,wi)=>{
          const wpnl=wk.reduce((a,d)=>a+(d&&data[key(d)]?data[key(d)].pnl:0),0);
          return [
            <div key={`wk${wi}`} style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:wpnl===0?"#f8f9fb":wpnl>0?C.accentLight:C.redLight,borderRadius:8,padding:"4px 2px",minHeight:64}}>
              <div style={{fontSize:9,color:C.textMuted,fontWeight:600}}>Wk {wi+1}</div>
              <div style={{fontSize:11,fontWeight:700,color:wpnl>0?C.accentDark:wpnl<0?C.red:C.textMuted,marginTop:2,fontFamily:"monospace"}}>{wpnl!==0?fmt(wpnl,0):""}</div>
            </div>,
            ...wk.map((d,di)=>{
              const k=d?key(d):null;
              const e=k?data[k]:null;
              const today=d===21;
              return (
                <div key={`${wi}-${di}`} style={{borderRadius:8,minHeight:64,padding:"5px 6px",background:!d?"transparent":e?(e.pnl>0?C.accentLight:C.redLight):"#f8f9fb",border:today?`2px solid ${C.accent}`:`1px solid ${d?C.border:"transparent"}`}}>
                  {d&&<>
                    <div style={{fontSize:10,fontWeight:700,color:today?C.accent:C.textSub,marginBottom:2}}>{d}</div>
                    {e&&<>
                      <div style={{fontSize:11,fontWeight:700,color:e.pnl>0?C.accentDark:C.red,fontFamily:"monospace"}}>{fmt(e.pnl,0)}</div>
                      <div style={{fontSize:9,color:C.textMuted}}>{e.trades} tr</div>
                      <div style={{fontSize:9,color:e.wr>=50?C.accentDark:C.red,fontWeight:600}}>{e.wr.toFixed(0)}%</div>
                    </>}
                  </>}
                </div>
              );
            })
          ];
        })}
      </div>
    </div>
  );
}

// Sidebar
const NAV=[
  {id:"dashboard",icon:"⊞",label:"Dashboard"},
  {id:"journal",  icon:"📓",label:"Daily Journal"},
  {id:"trades",   icon:"≡", label:"Trades"},
  {id:"notebook", icon:"📔",label:"Notebook"},
  {id:"progress", icon:"📈",label:"Progress Tracker",badge:"NEW"},
  {id:"playbook", icon:"📋",label:"Playbook"},
  {id:"reports",  icon:"📊",label:"Reports"},
  {id:"backtest", icon:"⏪",label:"Backtesting"},
  {id:"replay",   icon:"▶", label:"Trade Replay"},
  {id:"mentor",   icon:"👤",label:"Mentor Mode"},
  {id:"university",icon:"🎓",label:"University"},
  {id:"resources",icon:"🔗",label:"Resource Center"},
];

function Sidebar({active,onNav,collapsed}){
  return (
    <aside style={{width:collapsed?54:218,minHeight:"100vh",background:"#fff",borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",transition:"width 0.25s",overflow:"hidden",flexShrink:0}}>
      <div style={{padding:"16px 14px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:28,height:28,background:`linear-gradient(135deg,#008f6b,#00b386)`,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <span style={{color:"#fff",fontWeight:900,fontSize:11}}>IS</span>
        </div>
        {!collapsed&&<span style={{fontWeight:800,fontSize:15,whiteSpace:"nowrap"}}>Insight<span style={{color:C.accent}}>Sync</span></span>}
      </div>
      {!collapsed&&<div style={{padding:"10px 10px 6px"}}>
        <button onClick={()=>onNav("addtrade")} style={{width:"100%",background:C.accent,color:"#fff",border:"none",borderRadius:8,padding:"8px 0",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
          + Add Trade
        </button>
      </div>}
      <nav style={{flex:1,padding:"6px 8px",overflowY:"auto"}}>
        {NAV.map(n=>(
          <button key={n.id} className="nav-btn" onClick={()=>onNav(n.id)} style={{
            width:"100%",display:"flex",alignItems:"center",gap:9,padding:collapsed?"10px 0":"8px 10px",
            borderRadius:8,border:"none",background:active===n.id?C.accentLight:"transparent",
            color:active===n.id?C.accent:C.textSub,fontWeight:active===n.id?700:500,fontSize:12.5,
            justifyContent:collapsed?"center":"flex-start",marginBottom:1,transition:"all 0.15s",whiteSpace:"nowrap"
          }}>
            <span style={{fontSize:14,flexShrink:0}}>{n.icon}</span>
            {!collapsed&&<span style={{flex:1,textAlign:"left"}}>{n.label}</span>}
            {!collapsed&&n.badge&&<span style={{background:C.accent,color:"#fff",fontSize:9,fontWeight:700,padding:"2px 5px",borderRadius:4}}>{n.badge}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
}

// TopBar
function TopBar({onToggle}){
  return (
    <div style={{height:54,background:"#fff",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",padding:"0 18px",gap:10,flexShrink:0}}>
      <button onClick={onToggle} style={{background:"transparent",border:"none",color:C.textSub,fontSize:17,padding:4,borderRadius:6}}>☰</button>
      <h1 style={{fontWeight:800,fontSize:16,flex:1}}>Dashboard</h1>
      <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:C.textSub}}>
        <span>Last import: <b style={{color:C.text}}>Jan 21, 2025</b></span>
        <button style={{color:C.accent,background:"none",border:"none",fontWeight:600,fontSize:12}}>Resync</button>
      </div>
      <div style={{display:"flex",gap:7}}>
        {["Filters","Date range","All Accounts"].map(l=>(
          <button key={l} style={{border:`1px solid ${C.border}`,background:"#fff",borderRadius:7,padding:"5px 11px",fontSize:12,color:C.textSub}}>{l} ▾</button>
        ))}
        <button style={{border:"none",background:`linear-gradient(135deg,${C.accent},#008f6b)`,color:"#fff",borderRadius:7,padding:"6px 14px",fontSize:12,fontWeight:700}}>▶ Start my day</button>
        <button style={{border:`1px solid ${C.border}`,background:"#fff",borderRadius:7,padding:"5px 10px",fontSize:14}}>🔔</button>
      </div>
    </div>
  );
}

// StatCard
function StatCard({label,value,color,gauge,gaugeColor,children}){
  return (
    <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:"15px 18px",boxShadow:C.shadow,flex:1,minWidth:0}}>
      <div style={{fontSize:11,color:C.textMuted,fontWeight:500,marginBottom:6}}>{label} ⓘ</div>
      {gauge!=null
        ?<div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{fontWeight:800,fontSize:20,color:color||C.text,fontFamily:"'IBM Plex Mono',monospace"}}>{value}</div>
            <GaugeArc value={gauge} color={gaugeColor||C.accent} size={72} thickness={8}/>
          </div>
        :<div style={{fontWeight:800,fontSize:21,color:color||C.text,fontFamily:"'IBM Plex Mono',monospace"}}>{value}</div>
      }
      {children}
    </div>
  );
}

// Trade Modal
function Modal({onClose,onSave,initial}){
  const [f,setF]=useState(initial||{date:"",symbol:"",side:"Long",entry:"",exit:"",size:"",notes:"",tags:""});
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",backdropFilter:"blur(4px)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:16,padding:28,width:480,maxWidth:"calc(100vw - 32px)",boxShadow:"0 20px 60px rgba(0,0,0,0.15)"}}>
        <div style={{fontWeight:800,fontSize:19,marginBottom:22}}>{initial&&initial.id?"Edit Trade":"Log New Trade"}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>
          {[["date","Date","date"],["symbol","Symbol","text"],["entry","Entry","number"],["exit","Exit","number"],["size","Size/Lots","number"]].map(([fld,lbl,tp])=>(
            <div key={fld}>
              <div style={{fontSize:11,color:C.textSub,fontWeight:600,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>{lbl}</div>
              <input type={tp} value={f[fld]||""} onChange={e=>setF(p=>({...p,[fld]:e.target.value}))}
                style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 11px",fontSize:13,color:C.text}}/>
            </div>
          ))}
          <div>
            <div style={{fontSize:11,color:C.textSub,fontWeight:600,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>Direction</div>
            <select value={f.side} onChange={e=>setF(p=>({...p,side:e.target.value}))} style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 11px",fontSize:13,color:C.text}}>
              <option>Long</option><option>Short</option>
            </select>
          </div>
        </div>
        <div style={{marginTop:13}}>
          <div style={{fontSize:11,color:C.textSub,fontWeight:600,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>Tags (comma-separated)</div>
          <input value={f.tags||""} onChange={e=>setF(p=>({...p,tags:e.target.value}))} placeholder="Trend, Scalp, Gold..." style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 11px",fontSize:13,color:C.text}}/>
        </div>
        <div style={{marginTop:13}}>
          <div style={{fontSize:11,color:C.textSub,fontWeight:600,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>Notes</div>
          <textarea value={f.notes||""} onChange={e=>setF(p=>({...p,notes:e.target.value}))} rows={3} style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 11px",fontSize:13,color:C.text,resize:"vertical"}}/>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:20}}>
          <button onClick={onClose} style={{border:`1px solid ${C.border}`,background:"#fff",borderRadius:8,padding:"8px 18px",fontSize:13,color:C.textSub}}>Cancel</button>
          <button onClick={()=>{onSave(f);onClose();}} style={{background:C.accent,border:"none",color:"#fff",borderRadius:8,padding:"8px 22px",fontSize:13,fontWeight:700}}>
            {initial&&initial.id?"Update":"Log Trade"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Dashboard
function Dashboard({trades}){
  const s=useMemo(()=>{
    const wins=trades.filter(t=>t.pnl>0),losses=trades.filter(t=>t.pnl<0);
    const tp=trades.reduce((a,t)=>a+t.pnl,0);
    const aw=wins.length?wins.reduce((a,t)=>a+t.pnl,0)/wins.length:0;
    const al=losses.length?Math.abs(losses.reduce((a,t)=>a+t.pnl,0)/losses.length):0;
    const gw=wins.reduce((a,t)=>a+t.pnl,0),gl=Math.abs(losses.reduce((a,t)=>a+t.pnl,0));
    return {wins:wins.length,losses:losses.length,tp,aw,al,wr:trades.length?wins.length/trades.length*100:0,pf:gl?gw/gl:0,awl:al?aw/al:0};
  },[trades]);
  const radar=[
    {label:"Win %",value:s.wr},{label:"Profit factor",value:Math.min(s.pf*22,100)},
    {label:"Avg win/loss",value:Math.min(s.awl*40,100)},{label:"Recovery",value:100},
    {label:"Max drawdown",value:80.62},{label:"Consistency",value:98},
  ];
  return (
    <div style={{padding:18,display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",gap:10}}>
        <StatCard label={`Net P&L · ${trades.length}`} value={fmt(s.tp)} color={s.tp>=0?C.accent:C.red}/>
        <StatCard label="Trade Win %" value={s.wr.toFixed(2)+"%"} gauge={s.wr} gaugeColor={C.accent}/>
        <StatCard label="Profit Factor" value={s.pf.toFixed(2)} gauge={Math.min(s.pf*50,100)} gaugeColor="#6366f1"/>
        <StatCard label="Day Win %" value="59.18%" gauge={59.18} gaugeColor={C.red}/>
        <StatCard label="Avg win/loss trade" value={s.awl.toFixed(2)}>
          <div style={{marginTop:8,display:"flex",gap:2}}>
            <div style={{flex:s.aw||1,height:5,background:C.accent,borderRadius:"3px 0 0 3px"}}/>
            <div style={{flex:s.al||1,height:5,background:C.red,borderRadius:"0 3px 3px 0"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:10,marginTop:3}}>
            <span style={{color:C.accent}}>{fmt(s.aw)}</span>
            <span style={{color:C.red}}>-{fmt(s.al)}</span>
          </div>
        </StatCard>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"290px 1fr 340px",gap:12}}>
        <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:18,boxShadow:C.shadow}}>
          <div style={{fontWeight:700,fontSize:13,marginBottom:4}}>Insight Score ⓘ</div>
          <div style={{display:"flex",justifyContent:"center"}}><RadarChart data={radar} size={188}/></div>
          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:10}}>
            <div style={{fontSize:10,color:C.textMuted,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:5}}>INSIGHT SCORE</div>
            <div style={{position:"relative",height:8,borderRadius:4,background:"linear-gradient(to right,#e8344e 0%,#f5a623 40%,#00b386 100%)",marginBottom:4}}>
              <div style={{position:"absolute",left:"73%",top:-3,width:14,height:14,background:"#1a1d23",borderRadius:"50%",border:"2px solid #fff"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:C.textMuted,marginBottom:6}}>
              {[0,20,40,60,80,100].map(n=><span key={n}>{n}</span>)}
            </div>
            <div style={{fontWeight:900,fontSize:26,fontFamily:"'IBM Plex Mono',monospace"}}>73.62</div>
          </div>
        </div>
        <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:18,boxShadow:C.shadow}}>
          <div style={{fontWeight:700,fontSize:13,marginBottom:10}}>Daily Net Cumulative P&amp;L ⓘ</div>
          <EquityChart points={EQ}/>
        </div>
        <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:18,boxShadow:C.shadow}}>
          <div style={{fontWeight:700,fontSize:13,marginBottom:10}}>Net Daily P&amp;L ⓘ</div>
          <DailyBars bars={BARS}/>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:12}}>
        <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:18,boxShadow:C.shadow}}>
          <div style={{fontWeight:700,fontSize:13,marginBottom:10}}>Open Positions</div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>
              {["Date","Symbol","Net P&L"].map(h=><th key={h} style={{textAlign:"left",padding:"5px 8px",fontSize:10,fontWeight:600,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.05em"}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {trades.slice(0,9).map(t=>(
                <tr key={t.id} className="row-hover" style={{borderBottom:`1px solid ${C.border}`}}>
                  <td style={{padding:"7px 8px",color:C.textSub,fontSize:11}}>{t.date.slice(5)}</td>
                  <td style={{padding:"7px 8px",fontWeight:700}}>{t.symbol}</td>
                  <td style={{padding:"7px 8px",fontWeight:700,color:t.pnl>=0?C.accent:C.red,fontFamily:"monospace"}}>{fmt(t.pnl)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:18,boxShadow:C.shadow}}>
          <Calendar/>
        </div>
      </div>
    </div>
  );
}

// Journal Page
function JournalPage({trades}){
  const [entries,setEntries]=useState(JOURNAL_INIT);
  const [selected,setSelected]=useState(JOURNAL_INIT[0]);
  const [editing,setEditing]=useState(false);
  const [draft,setDraft]=useState(null);
  const [showNew,setShowNew]=useState(false);
  const [newEntry,setNewEntry]=useState({date:"",mood:"good",marketBias:"Bullish",preNotes:"",postNotes:"",lessons:"",tags:""});
  const fmt2=(n,d=0)=>{const abs=Math.abs(n);return(n<0?"-$":"$")+abs.toLocaleString("en-US",{minimumFractionDigits:d,maximumFractionDigits:d});};
  const moodInfo=m=>MOODS.find(x=>x.val===m)||MOODS[2];
  const dayTrades=selected?trades.filter(t=>t.date===selected.date):[];

  function startEdit(){setDraft({...selected,tags:(selected.tags||[]).join(", ")});setEditing(true);}
  function saveEdit(){
    const updated={...draft,tags:draft.tags?draft.tags.split(",").map(t=>t.trim()).filter(Boolean):[]};
    setEntries(prev=>prev.map(e=>e.id===updated.id?updated:e));
    setSelected(updated);setEditing(false);setDraft(null);
  }
  function deleteEntry(id){
    const remaining=entries.filter(e=>e.id!==id);
    setEntries(remaining);setSelected(remaining[0]||null);
  }
  function addEntry(){
    const id=Date.now();
    const tags=newEntry.tags?newEntry.tags.split(",").map(t=>t.trim()).filter(Boolean):[];
    const dayPnl=trades.filter(t=>t.date===newEntry.date).reduce((a,t)=>a+t.pnl,0);
    const e={...newEntry,id,tags,pnl:dayPnl};
    setEntries(prev=>[e,...prev]);setSelected(e);
    setShowNew(false);
    setNewEntry({date:"",mood:"good",marketBias:"Bullish",preNotes:"",postNotes:"",lessons:"",tags:""});
  }

  return (
    <div style={{display:"flex",height:"100%",overflow:"hidden"}}>
      <div style={{width:260,borderRight:`1px solid ${C.border}`,background:"#fff",display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"14px 14px 10px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <b style={{fontSize:14}}>Daily Journal</b>
          <button onClick={()=>setShowNew(true)} style={{background:C.accent,color:"#fff",border:"none",borderRadius:7,padding:"5px 12px",fontSize:12,fontWeight:700}}>+ New</button>
        </div>
        <div style={{flex:1,overflowY:"auto"}}>
          {entries.map(e=>{
            const mi=moodInfo(e.mood);
            const isActive=selected&&selected.id===e.id;
            return (
              <div key={e.id} onClick={()=>{setSelected(e);setEditing(false);}} style={{padding:"12px 14px",borderBottom:`1px solid ${C.border}`,cursor:"pointer",background:isActive?C.accentLight:"#fff",borderLeft:isActive?`3px solid ${C.accent}`:"3px solid transparent"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:12,fontWeight:700,color:isActive?C.accentDark:C.text}}>{e.date}</span>
                  <span style={{fontSize:16}}>{mi.emoji}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:11,color:C.textMuted}}>{e.marketBias}</span>
                  <span style={{fontSize:12,fontWeight:700,color:e.pnl>=0?C.accent:C.red,fontFamily:"monospace"}}>{fmt2(e.pnl)}</span>
                </div>
                <div style={{fontSize:11,color:C.textSub,marginTop:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.preNotes}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:20,background:C.bg}}>
        {!selected?(
          <div style={{textAlign:"center",padding:60,color:C.textMuted}}>Select a journal entry or create a new one.</div>
        ):editing?(
          <div style={{maxWidth:740,margin:"0 auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <b style={{fontSize:18}}>Edit Entry</b>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setEditing(false)} style={{border:`1px solid ${C.border}`,background:"#fff",borderRadius:8,padding:"7px 16px",fontSize:13,color:C.textSub}}>Cancel</button>
                <button onClick={saveEdit} style={{background:C.accent,border:"none",color:"#fff",borderRadius:8,padding:"7px 18px",fontSize:13,fontWeight:700}}>Save</button>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              <div>
                <div style={{fontSize:11,color:C.textSub,fontWeight:600,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>Date</div>
                <input type="date" value={draft.date} onChange={e=>setDraft(p=>({...p,date:e.target.value}))} style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 11px",fontSize:13}}/>
              </div>
              <div>
                <div style={{fontSize:11,color:C.textSub,fontWeight:600,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>Market Bias</div>
                <select value={draft.marketBias} onChange={e=>setDraft(p=>({...p,marketBias:e.target.value}))} style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 11px",fontSize:13,color:C.text}}>
                  {["Bullish","Bearish","Neutral","Mixed"].map(b=><option key={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,color:C.textSub,fontWeight:600,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.05em"}}>Mood</div>
              <div style={{display:"flex",gap:8}}>
                {MOODS.map(m=>(
                  <button key={m.val} onClick={()=>setDraft(p=>({...p,mood:m.val}))} style={{border:`2px solid ${draft.mood===m.val?m.color:C.border}`,background:draft.mood===m.val?m.color+"22":"#fff",borderRadius:10,padding:"8px 14px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                    <span style={{fontSize:20}}>{m.emoji}</span>
                    <span style={{fontSize:10,fontWeight:600,color:draft.mood===m.val?m.color:C.textMuted}}>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
            {[["preNotes","Pre-Market Notes",4],["postNotes","Post-Session Review",4],["lessons","Lessons Learned",3]].map(([fld,lbl,rows])=>(
              <div key={fld} style={{marginBottom:14}}>
                <div style={{fontSize:11,color:C.textSub,fontWeight:600,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>{lbl}</div>
                <textarea value={draft[fld]||""} onChange={e=>setDraft(p=>({...p,[fld]:e.target.value}))} rows={rows} style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",fontSize:13,color:C.text,resize:"vertical"}}/>
              </div>
            ))}
            <div>
              <div style={{fontSize:11,color:C.textSub,fontWeight:600,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>Tags</div>
              <input value={draft.tags||""} onChange={e=>setDraft(p=>({...p,tags:e.target.value}))} style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 11px",fontSize:13,color:C.text}}/>
            </div>
          </div>
        ):(
          <div style={{maxWidth:740,margin:"0 auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
              <div>
                <div style={{fontSize:22,fontWeight:800,marginBottom:4}}>{selected.date}</div>
                <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                  <span style={{fontSize:20}}>{moodInfo(selected.mood).emoji}</span>
                  <span style={{fontSize:13,fontWeight:600,color:moodInfo(selected.mood).color}}>{moodInfo(selected.mood).label}</span>
                  <span style={{background:selected.marketBias==="Bullish"?C.accentLight:selected.marketBias==="Bearish"?C.redLight:"#f0f2f5",color:selected.marketBias==="Bullish"?C.accentDark:selected.marketBias==="Bearish"?C.red:C.textSub,borderRadius:6,padding:"2px 10px",fontSize:12,fontWeight:600}}>{selected.marketBias}</span>
                  {(selected.tags||[]).map(t=><span key={t} style={{background:"#f0f2f5",color:C.textSub,borderRadius:5,padding:"2px 8px",fontSize:11}}>{t}</span>)}
                </div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:11,color:C.textMuted}}>Day P&amp;L</div>
                  <div style={{fontSize:22,fontWeight:800,color:selected.pnl>=0?C.accent:C.red,fontFamily:"monospace"}}>{fmt2(selected.pnl)}</div>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={startEdit} style={{border:`1px solid ${C.border}`,background:"#fff",borderRadius:8,padding:"7px 14px",fontSize:12,color:C.textSub}}>✏️ Edit</button>
                  <button onClick={()=>deleteEntry(selected.id)} style={{border:`1px solid ${C.redLight}`,background:C.redLight,borderRadius:8,padding:"7px 14px",fontSize:12,color:C.red}}>🗑 Delete</button>
                </div>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:18}}>
              {[
                {label:"📋 Pre-Market Notes",field:"preNotes",bg:"#eaefff",bd:"#c7d7f5"},
                {label:"📝 Post-Session Review",field:"postNotes",bg:C.accentLight,bd:"#b2e8d8"},
                {label:"💡 Lessons Learned",field:"lessons",bg:"#fffbea",bd:"#fde68a"},
              ].map(({label,field,bg,bd})=>(
                <div key={field} style={{background:bg,border:`1px solid ${bd}`,borderRadius:12,padding:18}}>
                  <div style={{fontWeight:700,fontSize:13,marginBottom:8}}>{label}</div>
                  <p style={{fontSize:13,color:C.textSub,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{selected[field]||"Nothing written yet."}</p>
                </div>
              ))}
            </div>
            {dayTrades.length>0&&(
              <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:18}}>
                <div style={{fontWeight:700,fontSize:13,marginBottom:12}}>Trades on this day ({dayTrades.length})</div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                  <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>
                    {["Symbol","Dir","Entry","Exit","Size","P&L","Notes"].map(h=><th key={h} style={{textAlign:"left",padding:"6px 10px",fontSize:10,fontWeight:600,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.05em"}}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {dayTrades.map(t=>(
                      <tr key={t.id} className="row-hover" style={{borderBottom:`1px solid ${C.border}`}}>
                        <td style={{padding:"8px 10px",fontWeight:700}}>{t.symbol}</td>
                        <td style={{padding:"8px 10px"}}><span style={{background:t.side==="Long"?C.accentLight:C.redLight,color:t.side==="Long"?C.accentDark:C.red,borderRadius:5,padding:"2px 7px",fontSize:10,fontWeight:600}}>{t.side}</span></td>
                        <td style={{padding:"8px 10px",fontFamily:"monospace"}}>${t.entry}</td>
                        <td style={{padding:"8px 10px",fontFamily:"monospace"}}>${t.exit}</td>
                        <td style={{padding:"8px 10px",color:C.textSub}}>{t.size}</td>
                        <td style={{padding:"8px 10px",fontWeight:700,color:t.pnl>=0?C.accent:C.red,fontFamily:"monospace"}}>{fmt(t.pnl)}</td>
                        <td style={{padding:"8px 10px",color:C.textSub,fontSize:11}}>{t.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
      {showNew&&(
        <div onClick={()=>setShowNew(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",backdropFilter:"blur(4px)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:16,padding:28,width:520,maxWidth:"calc(100vw - 32px)",boxShadow:"0 20px 60px rgba(0,0,0,0.15)",maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{fontWeight:800,fontSize:18,marginBottom:20}}>New Journal Entry</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13,marginBottom:13}}>
              <div>
                <div style={{fontSize:11,color:C.textSub,fontWeight:600,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>Date</div>
                <input type="date" value={newEntry.date} onChange={e=>setNewEntry(p=>({...p,date:e.target.value}))} style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 11px",fontSize:13}}/>
              </div>
              <div>
                <div style={{fontSize:11,color:C.textSub,fontWeight:600,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>Market Bias</div>
                <select value={newEntry.marketBias} onChange={e=>setNewEntry(p=>({...p,marketBias:e.target.value}))} style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 11px",fontSize:13,color:C.text}}>
                  {["Bullish","Bearish","Neutral","Mixed"].map(b=><option key={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <div style={{marginBottom:13}}>
              <div style={{fontSize:11,color:C.textSub,fontWeight:600,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.05em"}}>Mood</div>
              <div style={{display:"flex",gap:7}}>
                {MOODS.map(m=>(
                  <button key={m.val} onClick={()=>setNewEntry(p=>({...p,mood:m.val}))} style={{border:`2px solid ${newEntry.mood===m.val?m.color:C.border}`,background:newEntry.mood===m.val?m.color+"22":"#fff",borderRadius:10,padding:"6px 10px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,flex:1}}>
                    <span style={{fontSize:18}}>{m.emoji}</span>
                    <span style={{fontSize:9,fontWeight:600,color:newEntry.mood===m.val?m.color:C.textMuted}}>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
            {[["preNotes","Pre-Market Notes",3],["postNotes","Post-Session Review",3],["lessons","Lessons Learned",2]].map(([fld,lbl,rows])=>(
              <div key={fld} style={{marginBottom:13}}>
                <div style={{fontSize:11,color:C.textSub,fontWeight:600,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>{lbl}</div>
                <textarea value={newEntry[fld]||""} onChange={e=>setNewEntry(p=>({...p,[fld]:e.target.value}))} rows={rows} style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 11px",fontSize:13,color:C.text,resize:"vertical"}}/>
              </div>
            ))}
            <div style={{marginBottom:18}}>
              <div style={{fontSize:11,color:C.textSub,fontWeight:600,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>Tags</div>
              <input value={newEntry.tags||""} onChange={e=>setNewEntry(p=>({...p,tags:e.target.value}))} placeholder="Discipline, Lesson, Gold..." style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 11px",fontSize:13,color:C.text}}/>
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <button onClick={()=>setShowNew(false)} style={{border:`1px solid ${C.border}`,background:"#fff",borderRadius:8,padding:"8px 18px",fontSize:13,color:C.textSub}}>Cancel</button>
              <button onClick={addEntry} style={{background:C.accent,border:"none",color:"#fff",borderRadius:8,padding:"8px 22px",fontSize:13,fontWeight:700}}>Save Entry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Trades Page
function TradesPage({trades,onEdit,onDelete}){
  const [search,setSearch]=useState("");
  const [side,setSide]=useState("All");
  const [sort,setSort]=useState({f:"date",d:"desc"});
  const filtered=useMemo(()=>{
    let l=[...trades];
    if(side!=="All") l=l.filter(t=>t.side===side);
    if(search) l=l.filter(t=>t.symbol.toLowerCase().includes(search.toLowerCase()));
    l.sort((a,b)=>sort.d==="asc"?(a[sort.f]>b[sort.f]?1:-1):(a[sort.f]<b[sort.f]?1:-1));
    return l;
  },[trades,side,search,sort]);
  const tp=filtered.reduce((a,t)=>a+t.pnl,0);
  return (
    <div style={{padding:18}}>
      <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search symbol..." style={{border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 13px",fontSize:13,width:170}}/>
        <select value={side} onChange={e=>setSide(e.target.value)} style={{border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 13px",fontSize:13,color:C.textSub}}>
          {["All","Long","Short"].map(s=><option key={s}>{s}</option>)}
        </select>
        <div style={{marginLeft:"auto",fontWeight:700,fontSize:15,color:tp>=0?C.accent:C.red,fontFamily:"monospace"}}>Total: {fmt(tp)}</div>
      </div>
      <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,boxShadow:C.shadow,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead style={{background:"#f8f9fb"}}>
            <tr>
              {[["date","Date"],["symbol","Symbol"],["side","Dir"],["entry","Entry"],["exit","Exit"],["size","Size"],["pnl","P&L"]].map(([f,l])=>(
                <th key={f} onClick={()=>setSort(s=>({f,d:s.f===f&&s.d==="desc"?"asc":"desc"}))} style={{textAlign:"left",padding:"11px 14px",fontSize:10,fontWeight:600,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.05em",cursor:"pointer",userSelect:"none"}}>
                  {l}{sort.f===f?(sort.d==="asc"?" ↑":" ↓"):""}
                </th>
              ))}
              <th style={{padding:"11px 14px",fontSize:10,fontWeight:600,color:C.textMuted,textTransform:"uppercase"}}>Tags</th>
              <th style={{padding:"11px 14px"}}/>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t,i)=>(
              <tr key={t.id} className="row-hover" style={{borderTop:`1px solid ${C.border}`,background:i%2===0?"#fff":"#fafbfc"}}>
                <td style={{padding:"10px 14px",color:C.textSub,fontSize:12}}>{t.date}</td>
                <td style={{padding:"10px 14px",fontWeight:700}}>{t.symbol}</td>
                <td style={{padding:"10px 14px"}}><span style={{background:t.side==="Long"?C.accentLight:C.redLight,color:t.side==="Long"?C.accentDark:C.red,borderRadius:5,padding:"2px 8px",fontSize:11,fontWeight:600}}>{t.side}</span></td>
                <td style={{padding:"10px 14px",fontFamily:"monospace"}}>${t.entry}</td>
                <td style={{padding:"10px 14px",fontFamily:"monospace"}}>${t.exit}</td>
                <td style={{padding:"10px 14px",color:C.textSub}}>{t.size}</td>
                <td style={{padding:"10px 14px",fontWeight:700,color:t.pnl>=0?C.accent:C.red,fontFamily:"monospace"}}>{fmt(t.pnl)}</td>
                <td style={{padding:"10px 14px"}}><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{(t.tags||[]).map(tg=><span key={tg} style={{background:"#f0f2f5",color:C.textSub,borderRadius:4,padding:"2px 6px",fontSize:10}}>{tg}</span>)}</div></td>
                <td style={{padding:"10px 14px"}}><div style={{display:"flex",gap:5}}>
                  <button onClick={()=>onEdit(t)} style={{border:`1px solid ${C.border}`,background:"#fff",borderRadius:6,padding:"3px 9px",fontSize:11,color:C.textSub}}>Edit</button>
                  <button onClick={()=>onDelete(t.id)} style={{border:`1px solid ${C.redLight}`,background:C.redLight,borderRadius:6,padding:"3px 9px",fontSize:11,color:C.red}}>Del</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length&&<div style={{padding:40,textAlign:"center",color:C.textMuted}}>No trades found.</div>}
      </div>
    </div>
  );
}

// Reports
function Reports({trades}){
  const s=useMemo(()=>{
    const wins=trades.filter(t=>t.pnl>0),losses=trades.filter(t=>t.pnl<0);
    const tp=trades.reduce((a,t)=>a+t.pnl,0);
    const aw=wins.length?wins.reduce((a,t)=>a+t.pnl,0)/wins.length:0;
    const al=losses.length?Math.abs(losses.reduce((a,t)=>a+t.pnl,0)/losses.length):0;
    const gw=wins.reduce((a,t)=>a+t.pnl,0),gl=Math.abs(losses.reduce((a,t)=>a+t.pnl,0));
    const tm={},sm={};
    trades.forEach(t=>{
      (t.tags||[]).forEach(tg=>{if(!tm[tg])tm[tg]={c:0,p:0,w:0};tm[tg].c++;tm[tg].p+=t.pnl;if(t.pnl>0)tm[tg].w++;});
      if(!sm[t.symbol])sm[t.symbol]={c:0,p:0,w:0};sm[t.symbol].c++;sm[t.symbol].p+=t.pnl;if(t.pnl>0)sm[t.symbol].w++;
    });
    return {tp,aw,al,wr:trades.length?wins.length/trades.length*100:0,pf:gl?gw/gl:0,
      tags:Object.entries(tm).sort((a,b)=>b[1].p-a[1].p),syms:Object.entries(sm).sort((a,b)=>b[1].p-a[1].p)};
  },[trades]);
  const mxT=Math.max(...s.tags.map(([,d])=>Math.abs(d.p)),1);
  return (
    <div style={{padding:18,display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",gap:10}}>
        {[["Net P&L",fmt(s.tp),s.tp>=0?C.accent:C.red],["Win Rate",s.wr.toFixed(1)+"%",C.text],["Profit Factor",s.pf.toFixed(2),C.blue],["Avg Win",fmt(s.aw),C.accent],["Avg Loss",fmt(s.al),C.red],["Total Trades",trades.length,C.text]].map(([l,v,c])=>(
          <div key={l} style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 18px",boxShadow:C.shadow,flex:1,minWidth:0}}>
            <div style={{fontSize:11,color:C.textMuted,fontWeight:500,marginBottom:5}}>{l}</div>
            <div style={{fontWeight:800,fontSize:19,color:c,fontFamily:"monospace"}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:18,boxShadow:C.shadow}}>
          <div style={{fontWeight:700,fontSize:13,marginBottom:14}}>Performance by Tag</div>
          {s.tags.map(([tag,d])=>(
            <div key={tag} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
                <span style={{fontWeight:600}}>{tag} <span style={{color:C.textMuted,fontWeight:400}}>x{d.c}</span></span>
                <span style={{color:d.p>=0?C.accent:C.red,fontWeight:700,fontFamily:"monospace"}}>{fmt(d.p)}</span>
              </div>
              <div style={{height:5,background:"#f0f2f5",borderRadius:3}}>
                <div style={{height:"100%",width:`${Math.abs(d.p)/mxT*100}%`,background:d.p>=0?C.accent:C.red,borderRadius:3}}/>
              </div>
            </div>
          ))}
        </div>
        <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:18,boxShadow:C.shadow}}>
          <div style={{fontWeight:700,fontSize:13,marginBottom:14}}>Symbol Performance</div>
          {s.syms.map(([sym,d])=>(
            <div key={sym} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",background:"#f8f9fb",borderRadius:8,marginBottom:6}}>
              <div><span style={{fontWeight:700}}>{sym}</span><span style={{color:C.textMuted,fontSize:11,marginLeft:8}}>{d.c} trades · {Math.round(d.w/d.c*100)}% WR</span></div>
              <span style={{color:d.p>=0?C.accent:C.red,fontWeight:700,fontFamily:"monospace"}}>{fmt(d.p)}</span>
            </div>
          ))}
        </div>
        <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:18,boxShadow:C.shadow,gridColumn:"1/-1"}}>
          <div style={{fontWeight:700,fontSize:13,marginBottom:14}}>Long vs Short</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {["Long","Short"].map(sd=>{
              const g=trades.filter(t=>t.side===sd);
              const p=g.reduce((a,t)=>a+t.pnl,0);
              const wr=g.length?Math.round(g.filter(t=>t.pnl>0).length/g.length*100):0;
              const col=sd==="Long"?C.accent:C.red;
              return (
                <div key={sd} style={{padding:18,background:"#f8f9fb",borderRadius:10,border:`1px solid ${C.border}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                    <b style={{fontSize:15}}>{sd}</b>
                    <span style={{background:sd==="Long"?C.accentLight:C.redLight,color:col,borderRadius:6,padding:"2px 10px",fontSize:11,fontWeight:600}}>{g.length} trades</span>
                  </div>
                  <div style={{color:col,fontWeight:800,fontSize:24,fontFamily:"monospace",marginBottom:4}}>{fmt(p)}</div>
                  <div style={{fontSize:12,color:C.textSub}}>Win Rate: <b style={{color:col}}>{wr}%</b></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App
export default function App(){
  const [page,setPage]=useState("dashboard");
  const [collapsed,setCollapsed]=useState(false);
  const [trades,setTrades]=useState(TRADES_INIT);
  const [modal,setModal]=useState(null);

  function nav(id){
    if(id==="addtrade"){setModal({initial:null});return;}
    setPage(id);
  }
  function save(f){
    const tags=f.tags?f.tags.split(",").map(t=>t.trim()).filter(Boolean):[];
    const pnl=(parseFloat(f.exit)-parseFloat(f.entry))*parseFloat(f.size)*(f.side==="Short"?-1:1)||0;
    if(f.id){
      setTrades(prev=>prev.map(t=>t.id===f.id?{...f,entry:+f.entry,exit:+f.exit,size:+f.size,pnl,tags}:t));
    } else {
      setTrades(prev=>[...prev,{...f,id:Date.now(),entry:+f.entry,exit:+f.exit,size:+f.size,pnl,tags}]);
    }
  }

  const pages={
    dashboard:<Dashboard trades={trades}/>,
    journal:<JournalPage trades={trades}/>,
    trades:<TradesPage trades={trades} onEdit={t=>setModal({initial:{...t,tags:(t.tags||[]).join(", ")}})} onDelete={id=>setTrades(p=>p.filter(t=>t.id!==id))}/>,
    reports:<Reports trades={trades}/>,
  };

  return (
    <div style={{display:"flex",height:"100vh",overflow:"hidden",background:C.bg}}>
      <style>{GLOBAL_CSS}</style>
      <Sidebar active={page} onNav={nav} collapsed={collapsed}/>
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <TopBar onToggle={()=>setCollapsed(c=>!c)}/>
        <main style={{flex:1,overflowY:"auto"}}>
          {pages[page]||<div style={{padding:60,textAlign:"center",color:C.textMuted}}>
            <div style={{fontSize:40,marginBottom:12}}>🚧</div>
            <b style={{fontSize:16}}>Coming Soon</b>
            <p style={{marginTop:8,fontSize:13}}>This section is under construction.</p>
          </div>}
        </main>
      </div>
      {modal&&<Modal onClose={()=>setModal(null)} onSave={save} initial={modal.initial}/>}
    </div>
  );
}
