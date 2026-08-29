const cfg=window.HYPEX_CONFIG;
const fallback={heroEyebrow:"HYPEX",heroTitle:"WHERE HYPE MEETS EXECUTION",heroSubtitle:"HYPEX — a next-generation crypto + metaverse + AI ecosystem powered by the HXP token.",marketCap:"—",holders:"—",transactions:"—",burned:"—",aboutTitle:"About HYPEX",aboutText:"HYPEX (HXP) merges blockchain, AI and the metaverse to create an immersive, community-driven digital universe.",vision:"To build a global digital ecosystem that connects creativity, finance, and technology — empowering individuals in the metaverse.",mission:"Bridge blockchain and everyday users through AI-powered, metaverse-integrated experiences that are fun, secure and community-led.",values:"Innovation\nTransparency\nEmpowerment\nSecurity",tokenomicsIntro:"Designed for sustainability and community ownership.",totalSupply:"1,000,000,000 HXP",circulating:"—",burnRate:"—",ecosystem:[],roadmap:[],telegram:"#",twitter:"#",contract:"—",footerText:"© 2026 HYPEX — Built for believers, powered by execution."};
async function load(){
 let data=fallback;
 try{if(cfg.SUPABASE_URL.startsWith("http")){const s=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);const {data:r}=await s.from("site_content").select("content").order("id",{ascending:false}).limit(1).single();if(r?.content)data={...fallback,...r.content};}}catch(e){console.warn(e)}
 render(data);
}
function render(d){
 document.querySelectorAll("[id]").forEach(el=>{if(d[el.id]!==undefined && !["ecosystemGrid","roadmapList","values"].includes(el.id))el.textContent=d[el.id]});
 document.getElementById("values").innerHTML=(d.values||"").split("\n").filter(Boolean).map(x=>`<span>${esc(x)}</span>`).join("");
 document.getElementById("ecosystemGrid").innerHTML=(d.ecosystem||[]).map(x=>`<article class="card"><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p><div class="chips">${(x.tags||"").split(",").map(t=>`<span>${esc(t.trim())}</span>`).join("")}</div></article>`).join("");
 document.getElementById("roadmapList").innerHTML=(d.roadmap||[]).map(x=>`<article><b>${esc(x.phase)}</b><h3>${esc(x.title)}</h3></article>`).join("");
 document.getElementById("telegram").href=d.telegram||"#";document.getElementById("twitter").href=d.twitter||"#";
}
function esc(s){return String(s??"").replace(/[&<>\"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]))}
document.getElementById("copy").onclick=()=>navigator.clipboard?.writeText(document.getElementById("contract").textContent);
load();
