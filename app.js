const missions = [
 {id:'sky',title:'Read the sky',desc:'Look up for two full minutes. Notice cloud shapes, movement, and where the light is coming from.',time:5,tag:'LOOK UP',icon:'☁'},
 {id:'three-greens',title:'Find three greens',desc:'Find three different shades of green. What makes each one look different?',time:5,tag:'NOTICE',icon:'❋'},
 {id:'listen',title:'A minute of listening',desc:'Stand still and identify three separate sounds without trying to name their source immediately.',time:5,tag:'LISTEN',icon:'♫'},
 {id:'texture',title:'Texture walk',desc:'Find five natural textures using only your eyes. Leave plants, bark, and fungi undisturbed.',time:10,tag:'OBSERVE',icon:'〰'},
 {id:'shadow',title:'Follow a shadow',desc:'Notice how a tree, wall, or railing makes a shadow. Return later and see what changed.',time:10,tag:'LIGHT',icon:'◒'},
 {id:'birds',title:'Birdwatch quietly',desc:'Watch birds from a respectful distance. Notice movement, calls, and how they travel.',time:10,tag:'WILDLIFE',icon:'⌁'},
 {id:'tiny-world',title:'Look closer',desc:'Observe a small patch of ground without disturbing it. What tiny patterns or movements can you spot?',time:10,tag:'DETAIL',icon:'⌕'},
 {id:'weather',title:'Make a weather note',desc:'Describe the temperature, wind, cloud cover, and the feeling of the air in your own words.',time:10,tag:'WEATHER',icon:'☼'},
 {id:'plant',title:'Meet a local plant',desc:'Observe a plant from the path. Note leaf shape, colour, and where it is growing. Do not taste it.',time:15,tag:'BOTANY',icon:'♧'},
 {id:'route',title:'Take a different route',desc:'With permission and in a familiar, safe area, take a different public path and notice what changes.',time:15,tag:'EXPLORE',icon:'↗'},
 {id:'sound-map',title:'Draw a sound map',desc:'On paper, mark where you hear sounds around you. Use symbols instead of words if you like.',time:15,tag:'LISTEN',icon:'◎'},
 {id:'sit',title:'Sit and notice',desc:'Spend fifteen quiet minutes outdoors. Record five things you noticed, not five things you photographed.',time:15,tag:'SLOW DOWN',icon:'◌'}
];
const $ = s => document.querySelector(s); const $$ = s => [...document.querySelectorAll(s)];
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
let completed = read('wildsense-completed', []); let notes = read('wildsense-notes', []); let activeFilter = 'all';
const badges = [
 {id:'first-step',icon:'✳',title:'First Step',detail:'Complete your first nature mission',test:()=>completed.length>=1},
 {id:'noticer',icon:'⌕',title:'Careful Noticer',detail:'Complete 3 nature missions',test:()=>completed.length>=3},
 {id:'wanderer',icon:'↗',title:'Curious Explorer',detail:'Complete 6 nature missions',test:()=>completed.length>=6},
 {id:'naturalist',icon:'♧',title:'Field Naturalist',detail:'Complete all 12 nature missions',test:()=>completed.length>=missions.length},
 {id:'journal-one',icon:'✎',title:'Memory Keeper',detail:'Save your first field note',test:()=>notes.length>=1},
 {id:'journal-three',icon:'▤',title:'Story Collector',detail:'Save 3 field notes',test:()=>notes.length>=3}
];
function renderDailyMission(){
 const dayNumber=Math.floor(Date.now()/86400000);
 const mission=missions[(dayNumber+Math.floor(dayNumber/7))%missions.length];
 $('#dailyTitle').textContent=mission.title;
 $('#dailyDescription').textContent=mission.desc;
 $('#dailyMeta').textContent=`${mission.time} MIN · ${mission.tag} · ${completed.includes(mission.id)?'ALREADY COMPLETED':'NO EQUIPMENT NEEDED'}`;
 $('#startDailyMission').dataset.mission=mission.id;
}
function renderBadges(){
 const host=$('#achievementGrid');host.innerHTML='';
 badges.forEach(b=>{const earned=b.test();const card=document.createElement('article');card.className=`achievement ${earned?'earned':'locked'}`;card.innerHTML=`<span class="achievement-icon" aria-hidden="true">${b.icon}</span><div><h4>${b.title}</h4><p>${b.detail}</p></div><span class="achievement-state" aria-label="${earned?'Earned':'Not yet earned'}">${earned?'✓':'○'}</span>`;host.append(card);});
}
function renderMissions(){
 const grid=$('#missionGrid');grid.innerHTML='';
 const query=$('#missionSearch').value.trim().toLowerCase();
 const visible=missions.filter(m=>(activeFilter==='all'||String(m.time)===activeFilter)&&(!query||`${m.title} ${m.desc} ${m.tag}`.toLowerCase().includes(query)));
 visible.forEach(m=>{const done=completed.includes(m.id);const card=document.createElement('article');card.className='mission-card';card.id=`mission-${m.id}`;card.innerHTML=`<div class="mission-top"><span class="mission-icon" aria-hidden="true">${m.icon}</span><span class="duration">${m.time} MIN</span></div><h3>${m.title}</h3><p>${m.desc}</p><div class="mission-bottom"><span class="mission-tag">${m.tag}</span><button class="complete-btn ${done?'done':''}" data-id="${m.id}" aria-pressed="${done}">${done?'✓ Completed':'Mark complete +'}</button></div>`;grid.append(card);});
 $('#missionEmpty').hidden=visible.length!==0;
 $('#completedCount').textContent=completed.length;
 $('#progressLabel').textContent=`${completed.length} of ${missions.length} complete`;
 $('#progressBar').setAttribute('aria-valuemax',missions.length);$('#progressBar').setAttribute('aria-valuenow',completed.length);
 $('#progressFill').style.width=`${Math.min(100,completed.length/missions.length*100)}%`;
 renderDailyMission();renderBadges();
}

function renderNotes(){renderBadges();const host=$('#journalEntries');host.innerHTML='';$('#journalCount').textContent=notes.length;if(!notes.length){host.innerHTML='<p class="empty-note" style="font-size:11px;color:var(--muted);line-height:1.7">Your saved field notes will appear here.</p>';return;}notes.forEach(n=>{const el=document.createElement('article');el.className='note-entry';const title=document.createElement('h4');title.textContent=n.title;const body=document.createElement('p');body.textContent=n.body;const foot=document.createElement('footer');const date=document.createElement('span');date.textContent=new Date(n.created).toLocaleString();const del=document.createElement('button');del.className='delete-note';del.textContent='Delete';del.dataset.delete=n.id;foot.append(date,del);el.append(title,body,foot);host.append(el);});}
$$('.filter').forEach(b=>b.addEventListener('click',()=>{$$('.filter').forEach(x=>{const active=x===b;x.classList.toggle('active',active);x.setAttribute('aria-pressed',String(active));});activeFilter=b.dataset.filter;renderMissions();}));
$('#missionSearch').addEventListener('input',renderMissions);
$('#surpriseMission').addEventListener('click',()=>{const candidates=missions.filter(m=>!completed.includes(m.id));const pool=candidates.length?candidates:missions;const pick=pool[Math.floor(Math.random()*pool.length)];activeFilter='all';$('#missionSearch').value='';$$('.filter').forEach(x=>{const active=x.dataset.filter==='all';x.classList.toggle('active',active);x.setAttribute('aria-pressed',String(active));});renderMissions();const card=$(`#mission-${pick.id}`);card?.scrollIntoView({behavior:'smooth',block:'center'});card?.classList.add('mission-highlight');window.setTimeout(()=>card?.classList.remove('mission-highlight'),1600);});
$('#missionGrid').addEventListener('click',e=>{const b=e.target.closest('[data-id]');if(!b)return;const id=b.dataset.id;completed=completed.includes(id)?completed.filter(x=>x!==id):[...completed,id];write('wildsense-completed',completed);renderMissions();});
$('#startDailyMission').addEventListener('click',()=>{const id=$('#startDailyMission').dataset.mission;const card=$(`#mission-${id}`);if(card){card.scrollIntoView({behavior:'smooth',block:'center'});card.classList.add('mission-highlight');window.setTimeout(()=>card.classList.remove('mission-highlight'),1600);}});
$('#noteBody').addEventListener('input',()=>$('#charCount').textContent=`${$('#noteBody').value.length} / 1200`);
$('#journalForm').addEventListener('submit',e=>{e.preventDefault();notes.unshift({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),title:$('#noteTitle').value.trim(),body:$('#noteBody').value.trim(),created:new Date().toISOString()});write('wildsense-notes',notes);e.target.reset();$('#charCount').textContent='0 / 1200';$('#journalStatus').textContent='Field note saved in this browser.';renderNotes();});
$('#journalEntries').addEventListener('click',e=>{const b=e.target.closest('[data-delete]');if(!b)return;notes=notes.filter(n=>n.id!==b.dataset.delete);write('wildsense-notes',notes);renderNotes();});
$('#exportNotes').addEventListener('click',()=>{const blob=new Blob([JSON.stringify({format:'wildsense-backup-v1',exportedAt:new Date().toISOString(),notes,completedMissions:completed},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='wildsense-field-journal.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('#journalStatus').textContent='Backup exported. Keep the file somewhere safe.';});
$('#importNotesButton').addEventListener('click',()=>$('#importNotesFile').click());
$('#importNotesFile').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{const data=JSON.parse(await file.text());if(!data||!Array.isArray(data.notes)||!Array.isArray(data.completedMissions))throw new Error('This file does not look like a WildSense backup.');const validNotes=data.notes.filter(n=>n&&typeof n.title==='string'&&typeof n.body==='string').map(n=>({id:String(n.id||`${Date.now()}-${Math.random()}`),title:n.title.slice(0,80),body:n.body.slice(0,1200),created:n.created||new Date().toISOString()}));const validIds=new Set(missions.map(m=>m.id));const validCompleted=[...new Set(data.completedMissions.filter(id=>validIds.has(id)))];notes=[...validNotes,...notes.filter(old=>!validNotes.some(n=>n.id===old.id))];completed=[...new Set([...completed,...validCompleted])];write('wildsense-notes',notes);write('wildsense-completed',completed);renderNotes();renderMissions();$('#journalStatus').textContent=`Imported ${validNotes.length} notes and restored mission progress.`;}catch(err){$('#journalStatus').textContent=err.message||'Could not import this backup.';}finally{e.target.value='';}});
$('#themeToggle').addEventListener('click',()=>{document.body.classList.toggle('dark');localStorage.setItem('wildsense-theme',document.body.classList.contains('dark')?'dark':'light');$('#themeToggle').setAttribute('aria-pressed',String(document.body.classList.contains('dark')));});if(localStorage.getItem('wildsense-theme')==='dark'){document.body.classList.add('dark');$('#themeToggle').setAttribute('aria-pressed','true');}
function addMessage(role,text){const el=document.createElement('div');el.className=`message ${role}`;if(role==='assistant'){const label=document.createElement('span');label.className='message-label';label.textContent='WILDSENSE';el.append(label);}el.append(document.createTextNode(text));$('#chatMessages').append(el);$('#chatMessages').scrollTop=$('#chatMessages').scrollHeight;return el;}
async function checkAI(){try{const r=await fetch('/api/status');const data=await r.json();$('#aiStatus').textContent=data.available?`Connected to local Ollama · ${data.model}`:data.ollama?'Ollama is running, but model ${data.model} is not installed.': 'Local Ollama not detected. See README for setup.';}catch{$('#aiStatus').textContent='Start this website with start.bat to enable the local AI connection.';}}
async function sendChat(text){const prompt=text.trim();if(!prompt)return;addMessage('user',prompt);$('#chatInput').value='';const waiting=addMessage('assistant','Thinking on your local model…');try{const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt})});const data=await r.json();if(!r.ok)throw new Error(data.error||'Local AI request failed.');waiting.lastChild.textContent=data.response||'No response returned.';}catch(err){waiting.lastChild.textContent=`${err.message} Check that Ollama is running and the model is installed.`;}$('#chatMessages').scrollTop=$('#chatMessages').scrollHeight;}
$('#chatForm').addEventListener('submit',e=>{e.preventDefault();sendChat($('#chatInput').value);});$$('.suggestions button').forEach(b=>b.addEventListener('click',()=>sendChat(b.dataset.prompt)));renderMissions();renderNotes();checkAI();
