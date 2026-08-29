const cfg=window.HYPEX_CONFIG;
const sb=cfg.SUPABASE_URL.startsWith("http")?window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY):null;
let content=null;
const defaults={heroEyebrow:"HYPEX",heroTitle:"WHERE HYPE MEETS EXECUTION",heroSubtitle:"HYPEX — a next-generation crypto + metaverse + AI ecosystem powered by the HXP token.",marketCap:"—",holders:"—",transactions:"—",burned:"—",aboutTitle:"About HYPEX",aboutText:"",vision:"",mission:"",values:"Innovation\nTransparency\nEmpowerment\nSecurity",tokenomicsIntro:"",totalSupply:"1,000,000,000 HXP",circulating:"—",burnRate:"—",ecosystem:[],roadmap:[],telegram:"",twitter:"",contract:"",footerText:""};
function field(key){return document.querySelector(`[data-key="${key}"]`)}
function fill(){for(const k of Object.keys(defaults)){const f=field(k);if(f)f.value=content[k]??defaults[k]}renderArrays()}
function renderArrays(){
 document.getElementById("ecoEditor").innerHTML=(content.ecosystem||[]).map((x,i)=>`<div class="array-card"><input data-eco-title="${i}" value="${attr(x.title)}" placeholder="Title"><textarea data-eco-text="${i}" placeholder="Description">${esc(x.text)}</textarea><input data-eco-tags="${i}" value="${attr(x.tags)}" placeholder="Tags: Utility, Staking"><button class="remove" onclick="removeEco(${i})">Remove</button></div>`).join("");
 document.getElementById("roadmapEditor").innerHTML=(content.roadmap||[]).map((x,i)=>`<div class="array-card row"><input data-phase="${i}" value="${attr(x.phase)}" placeholder="Phase"><input data-road-title="${i}" value="${attr(x.title)}" placeholder="Title"><button class="remove" onclick="removePhase(${i})">Remove</button></div>`).join("");
}
function attr(s){return esc(s).replace(/`/g,"&#96;")}function esc(s){return String(s??"").replace(/[&<>\"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]))}
window.removeEco=i=>{content.ecosystem.splice(i,1);renderArrays()};window.removePhase=i=>{content.roadmap.splice(i,1);renderArrays()};
document.getElementById("addEco").onclick=()=>{content.ecosystem.push({title:"New Item",text:"",tags:""});renderArrays()};
document.getElementById("addPhase").onclick=()=>{content.roadmap.push({phase:`Phase ${content.roadmap.length+1}`,title:"New milestone"});renderArrays()};
async function load(){
 if(!sb)return;
 const {data:{session}}=await sb.auth.getSession();
 if(session)showDash();
}
function showDash(){document.getElementById("login").hidden=true;document.getElementById("dashboard").hidden=false;getData()}
async function getData(){const {data:r}=await sb.from("site_content").select("content").order("id",{ascending:false}).limit(1).single();content=r?.content||defaults;fill()}
document.getElementById("loginBtn").onclick=async()=>{const {error}=await sb.auth.signInWithPassword({email:email.value,password:password.value});if(error)loginMsg.textContent=error.message;else showDash()};
document.getElementById("logout").onclick=()=>sb.auth.signOut().then(()=>location.reload());
document.getElementById("save").onclick=async()=>{
 for(const k of Object.keys(defaults)){const f=field(k);if(f)content[k]=f.value}
 content.ecosystem=(content.ecosystem||[]).map((x,i)=>({title:document.querySelector(`[data-eco-title="${i}"]`)?.value||"",text:document.querySelector(`[data-eco-text="${i}"]`)?.value||"",tags:document.querySelector(`[data-eco-tags="${i}"]`)?.value||""}));
 content.roadmap=(content.roadmap||[]).map((x,i)=>({phase:document.querySelector(`[data-phase="${i}"]`)?.value||"",title:document.querySelector(`[data-road-title="${i}"]`)?.value||""}));
 const {data:r}=await sb.from("site_content").select("id").order("id",{ascending:false}).limit(1).single();
 const {error}=await sb.from("site_content").update({content,updated_at:new Date().toISOString()}).eq("id",r.id);
 saveMsg.textContent=error?error.message:"Saved successfully. The live site is updated.";setTimeout(()=>saveMsg.textContent="",3500);
};
if(sb)load();else loginMsg.textContent="Add Supabase URL and anon key in config.js first.";
