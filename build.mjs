#!/usr/bin/env node
// Reads projects.json and writes a self-contained static index.html.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const { owner, projects } = JSON.parse(readFileSync(join(root, "projects.json"), "utf8"));
const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
const statusClass = s => ({ live:"live", alpha:"alpha", "in progress":"progress", archived:"archived" })[(s || "").toLowerCase()] || "progress";
let projectNumber = 0;
const project = p => { return `<article class="project reveal"><p class="kicker">PROJECT ${String(++projectNumber).padStart(2, '0')} / ${esc(p.year)}</p><div class="project-top"><h3>${esc(p.name)}</h3><span class="status ${statusClass(p.status)}">${esc(p.status)}</span></div><p class="project-type">${esc(p.tagline)}</p><p>${esc(p.description)}</p><div class="project-notes"><div><h4>THE APPROACH</h4><p>${esc(p.approach)}</p></div></div><p class="tools">${(p.stack || []).map(esc).join(' / ')}</p>${p.url ? `<a href="${esc(p.url)}" target="_blank" rel="noopener">[ visit site ↗ ]</a>` : ''}</article>`; };
const groups = [["LIVE SYSTEMS", ["live"]], ["IN THE LAB", ["alpha", "in progress", "demo", "prototype"]], ["ARCHIVE", ["archived"]]];
const work = groups.map(([label, statuses], index) => { const items = projects.filter(p => !p.hidden && statuses.includes((p.status || "").toLowerCase())); return items.length ? `<section id="${index === 0 ? 'work' : 'work-' + index}" class="work-section"><h2>&gt; ${label} <span>(${items.length})</span></h2><div class="project-list">${items.map(project).join("")}</div></section>` : ""; }).join("\n");
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="${esc(owner.tagline || "")}"><title>${esc(owner.name)} // systems builder</title><style>
:root{--paper:#f1ecd9;--ink:#141414;--blue:#0000b8;--line:#59554c}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--ink);font-family:"Courier New",Courier,monospace;font-size:16px;line-height:1.45}a{color:var(--blue);text-decoration:underline;text-underline-offset:2px}a:hover,a:focus{color:#fff;background:var(--blue);text-decoration:none;outline:0}.shell{width:min(920px,calc(100% - 32px));margin:0 auto}.topbar{border-bottom:2px solid var(--ink);padding:12px 0 10px;display:flex;justify-content:space-between;gap:16px;font-size:13px}.topbar b{letter-spacing:.05em}.topbar nav{display:flex;gap:14px;flex-wrap:wrap}.hero{padding:74px 0 58px;border-bottom:1px dashed var(--line)}.kicker{margin:0 0 12px;font-size:13px;letter-spacing:.08em}h1{font-size:clamp(40px,9vw,80px);line-height:.88;letter-spacing:-.09em;margin:0;font-weight:700}.cursor{display:inline-block;margin-left:5px;animation:blink 850ms steps(2,start) infinite}.intro{max-width:650px;font-size:clamp(18px,2.6vw,25px);line-height:1.25;margin:28px 0 25px}.readout{display:inline-block;background:var(--ink);color:var(--paper);padding:6px 10px;font-size:13px}section{padding:55px 0;border-bottom:1px dashed var(--line)}h2{margin:0 0 26px;font-size:15px;letter-spacing:.05em}h2 span{color:var(--line);font-weight:400}.project-list{display:block;border-top:1px solid var(--line)}.project{padding:38px 0 42px;border-bottom:1px solid var(--line);display:flex;flex-direction:column;align-items:flex-start}.project:last-child{border-bottom:0;padding-bottom:0}.project-top{width:100%;display:flex;align-items:baseline;justify-content:space-between;gap:12px}h3{margin:0;font-size:clamp(25px,4vw,36px);line-height:1.1}.status{font-size:11px;white-space:nowrap;padding:1px 5px;border:1px solid currentColor}.live{color:#006c2c}.alpha{color:#984600}.progress{color:var(--blue)}.archived{color:var(--line)}.project-type{margin:12px 0 20px;color:var(--blue);font-size:15px}.project p:not(.project-type):not(.tools){font-size:16px;line-height:1.65;max-width:700px;margin:0 0 22px}.tools{margin:0 0 14px;color:var(--line);font-size:11px}.project a,.year{font-size:13px}.about{display:grid;grid-template-columns:minmax(0,2fr) minmax(180px,1fr);gap:38px}.about p{margin:0;max-width:630px;font-size:18px}.aside{border-left:2px solid var(--ink);padding-left:16px;font-size:13px}.aside p{font-size:13px;margin:0}.contact{padding:64px 0 84px}.contact h2{font-size:clamp(26px,5vw,48px);letter-spacing:-.06em;margin-bottom:14px}.contact p{margin:0;font-size:17px}footer{border-top:2px solid var(--ink);padding:14px 0 28px;font-size:12px;display:flex;justify-content:space-between;gap:12px}.reveal{opacity:1;transform:translateY(18px);transition:opacity 600ms ease,transform 600ms ease}.reveal.is-pending{opacity:0}.reveal.is-visible{opacity:1;transform:none}@keyframes blink{50%{opacity:0}}@media(max-width:620px){.shell{width:min(100% - 24px,920px)}.hero{padding:52px 0 44px}.topbar{align-items:flex-start;flex-direction:column}.project-list{grid-template-columns:1fr}.project{min-height:0}.about{grid-template-columns:1fr;gap:25px}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.reveal{opacity:1;transform:none;transition:none}.cursor{animation:none}}
/* Individual paper boards, spaced for one project per viewport. */
body{background:#d5d0bf;background-image:radial-gradient(#aaa591 .65px,transparent .65px);background-size:6px 6px}
.shell{width:min(920px,calc(100% - 40px))}.hero,.project,.about,.contact{background:var(--paper);border:1px solid var(--ink);padding:clamp(24px,5vw,56px);box-shadow:8px 10px 0 #24231d;min-height:75svh;display:flex;flex-direction:column;justify-content:center;margin:12svh 0 30svh;scroll-margin-top:8vh}
.hero{min-height:78svh;margin-top:5svh}.hero-copy{max-width:650px;line-height:1.7}.scroll-note{margin-top:30px;font-size:13px}.work-section{padding:0;border:0}.work-section>h2{margin:0 0 24px}.project-list{border:0}.project:last-child{border:1px solid var(--ink);padding:clamp(24px,5vw,56px)}.project-top{flex-wrap:wrap}.project h3{font-size:clamp(30px,5vw,48px)}.project-notes{border-top:1px dashed var(--line);padding-top:20px;margin-bottom:12px;max-width:700px}.project-notes h4{font-size:12px;letter-spacing:.08em;margin:0 0 8px}.project .project-notes p{font-size:14px;line-height:1.65}.about .aside{margin-top:28px}.contact{margin-bottom:10svh}.contact a{overflow-wrap:anywhere}.reveal{transform:none;transition:opacity .6s ease,transform .8s cubic-bezier(.2,.8,.2,1),box-shadow .8s ease}.reveal.is-pending{opacity:0;transform:translateY(90px) scale(.97);box-shadow:0 0 0 transparent}.reveal.is-visible{opacity:1;transform:none;box-shadow:8px 10px 0 #24231d}.reveal:focus-within{opacity:1;transform:none}
@media(max-width:620px){.shell{width:calc(100% - 30px)}.hero,.project,.about,.contact,.project:last-child{padding:25px 20px}.project{min-height:80svh;margin-bottom:25svh}.readout{font-size:11px}.project p:not(.project-type):not(.tools){font-size:15px}footer{flex-wrap:wrap}}
@media(prefers-reduced-motion:reduce){.reveal,.reveal.is-pending{opacity:1;transform:none;transition:none}}

.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.typed-word{white-space:nowrap}.typed-char{opacity:0;animation:type-in 80ms ease-out forwards}
@keyframes type-in{from{opacity:0}to{opacity:1}}
.reveal{transition:opacity .65s ease,transform 1s cubic-bezier(.16,1,.3,1),box-shadow 1s cubic-bezier(.16,1,.3,1)}
.reveal.is-pending{transform:translateY(64px) scale(.985)}
a{transition:color .2s ease,background-color .2s ease;text-decoration-thickness:1px}
@media(prefers-reduced-motion:reduce){.typed-char{opacity:1;animation:none}.reveal{transition:none}.cursor{animation:none}}
</style></head><body><div class="shell"><header class="topbar"><b>${esc(owner.name).toUpperCase()} // PORTFOLIO</b><nav><a href="#work">work</a><a href="#about">about</a><a href="#contact">contact</a></nav></header><main><section class="hero reveal"><p class="kicker">INTRODUCTION // ${esc(owner.location || "")}</p><h1>${esc(owner.name)}<span class="cursor">_</span></h1><p class="intro">${esc(owner.tagline)}</p><span class="readout">SYSTEMS BUILDER / PRODUCT ARCHITECT</span><p class="hero-copy">I’m Spencer. I work in retail management in Canada’s remote North, engineer sound, and prospect for minerals. I build software around the practical problems that catch my attention—through Presidia Corp, the problem-solving corporation.</p><a class="scroll-note" href="#work">[ scroll down to explore the work ↓ ]</a></section>${work}<section id="about" class="about reveal"><div><h2>&gt; ABOUT THE BUILDER</h2><p>${esc(owner.about || owner.blurb || "")}</p></div><aside class="aside"><p>WORKING ON<br>real-world software<br>local infrastructure<br>products with edge cases<br><br>BASED IN<br>${esc(owner.location || "Canada")}</p></aside></section><section id="contact" class="contact reveal"><h2>Have a system worth building?</h2><p><a href="mailto:${esc(owner.email)}">${esc(owner.email)}</a><br><br>Available for interesting problems, unusual contexts, and products that have to work outside the happy path.</p></section></main><footer><span>© ${new Date().getFullYear()} ${esc(owner.name)}</span><span>HAND-CODED // NO TRACKERS</span></footer></div><script>
const boards=[...document.querySelectorAll('.reveal')];
const motion=matchMedia('(prefers-reduced-motion: reduce)');
function typeText(board){
  board.querySelectorAll('h1,h2,h3,h4,p').forEach((element,index)=>{
    if(element.children.length || !element.textContent.trim()) return;
    const value=element.textContent;
    const accessible=document.createElement('span');
    accessible.className='sr-only'; accessible.textContent=value;
    const visual=document.createElement('span'); visual.setAttribute('aria-hidden','true');
    const chars=[...value]; const step=Math.min(24,1600/Math.max(chars.length,1));
    let position=0;
    value.split(/(\\s+)/).forEach(token=>{
      const word=document.createElement('span');word.className=/^\\s+$/.test(token)?'':'typed-word';
      for(const character of token){
        const span=document.createElement('span');span.textContent=character;span.className='typed-char';
        span.style.animationDelay=(180+Math.min(index*100,650)+position++*step)+'ms';
        word.append(span);
      }
      visual.append(word);
    });
    element.replaceChildren(accessible,visual);
    setTimeout(()=>element.replaceChildren(document.createTextNode(value)),2700);
  });
}
function reveal(board){
  board.classList.remove('is-pending');board.classList.add('is-visible');
  if(!motion.matches)typeText(board);
}
if(!motion.matches){
  boards.forEach(board=>board.classList.add('is-pending'));
  let scheduled=false;
  function update(){
    scheduled=false;
    boards.forEach((board,index)=>{
      if(!board.classList.contains('is-pending'))return;
      const rect=board.getBoundingClientRect();
      const previous=index?boards[index-1].getBoundingClientRect():null;
      if(rect.top<innerHeight*.75 && (!previous || previous.bottom<innerHeight*.18))reveal(board);
    });
  }
  function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(update)}}
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);
  document.addEventListener('focusin',event=>{const board=event.target.closest('.reveal.is-pending');if(board)reveal(board)});
  motion.addEventListener('change',()=>{if(motion.matches)boards.forEach(board=>board.classList.remove('is-pending'))});
  update();
}
</script></body></html>`;
const brandedHtml = html
  .replace("SYSTEMS BUILDER / PRODUCT ARCHITECT", `SYSTEMS BUILDER / PRODUCT ARCHITECT<br>${esc(owner.company || "Presidia Corp").toUpperCase()} // ${esc(owner.companyTagline || "the problem-solving corporation").toUpperCase()}`)
  .replace(`© ${new Date().getFullYear()} ${esc(owner.name)}</span>`, `© ${new Date().getFullYear()} ${esc(owner.name)} / ${esc(owner.company || "Presidia Corp")}</span>`);
const finalHtml = brandedHtml;
writeFileSync(join(root, "index.html"), finalHtml);
console.log(`Built index.html — ${projects.length} projects.`);
