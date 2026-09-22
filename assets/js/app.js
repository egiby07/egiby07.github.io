const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fallback={profile:{name:'egiby07',role:'DEVELOPER · BUILDER · EXPLORER',summary:'이력부터 프로젝트까지 한 곳에서 보여주는 포트폴리오입니다.',bio:'data/portfolio.json에서 실제 정보를 입력하세요.',now:{title:'Portfolio System',detail:'프로젝트를 계속 추가할 수 있는 구조입니다.'},github:'https://github.com/egiby07',skills:[],facts:[]},career:[],certifications:[],awards:[],projects:[]};

let serverMainHTML='';
let isAdmin=false;

function render(d){
 const p=d.profile;
 document.title=p.name+' | Portfolio';
 $('#role').textContent=p.role;$('#name').innerHTML=esc(p.name)+'<br><em>PORTFOLIO.</em>';$('#summary').textContent=p.summary;$('#nowTitle').textContent=p.now.title;$('#nowDetail').textContent=p.now.detail;$('#bio').textContent=p.bio;$('#skills').innerHTML=p.skills.map(x=>'<span class="tag">'+esc(x)+'</span>').join('');$('#facts').innerHTML=p.facts.map(x=>'<div><dt>'+esc(x.label)+'</dt><dd>'+esc(x.value)+'</dd></div>').join('');$('#github1').href=p.github;$('#footerName').textContent=p.name;
 $('#careerList').innerHTML=d.career.map(x=>'<article class="careerItem"><div class="period">'+esc(x.period)+'</div><div><b>'+esc(x.org)+'</b><h3>'+esc(x.title)+'</h3><p>'+esc(x.description)+'</p></div><div class="meta">'+esc(x.meta||'')+'</div></article>').join('');
 const cred=a=>'<div class="credItem"><small>'+esc(a.date)+'</small><div><b>'+esc(a.name)+'</b><div class="muted">'+esc(a.issuer)+'</div></div></div>';$('#certs').className='cred';$('#awards').className='cred';$('#certs').innerHTML=d.certifications.map(cred).join('');$('#awards').innerHTML=d.awards.map(cred).join('');
 $('#projectsGrid').innerHTML=d.projects.map(x=>'<article class="project" data-type="'+esc(x.type)+'">'+(x.thumbnail&&x.path?'<a class="projectThumb projectThumbLink" href="'+esc(x.path)+'" aria-label="'+esc(x.title)+' 상세 보기"><img src="'+esc(x.thumbnail)+'" alt="'+esc(x.title)+' 썸네일" loading="lazy"></a>':(x.thumbnail?'<div class="projectThumb"><img src="'+esc(x.thumbnail)+'" alt="'+esc(x.title)+' 썸네일" loading="lazy"></div>':''))+'<span class="projectType">'+esc(x.label)+'</span><h3>'+(x.path?'<a class="projectTitleLink" href="'+esc(x.path)+'">'+esc(x.title)+'</a>':esc(x.title))+'</h3><p>'+esc(x.description)+'</p><div class="stack">'+(x.stack||[]).map(s=>'<span>'+esc(s)+'</span>').join('')+'</div><div class="links">'+(x.repo?'<a target="_blank" href="'+esc(x.repo)+'">Repository ↗</a>':'')+(x.demo?'<a target="_blank" href="'+esc(x.demo)+'">Demo ↗</a>':'')+(x.path?'<a href="'+esc(x.path)+'">Project ↗</a>':'')+'</div></article>').join('');
 document.querySelectorAll('.filters button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filters button').forEach(x=>x.classList.remove('active'));b.classList.add('active');const f=b.dataset.filter;document.querySelectorAll('.project').forEach(x=>x.classList.toggle('hidden',f!=='all'&&x.dataset.type!==f));});
 serverMainHTML=$('#top').innerHTML;
}

async function adminPasswordLogin(){const input=$("#adminPassword"),error=$("#adminLoginError");const data=new TextEncoder().encode(input.value);const hash=Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",data))).map(x=>x.toString(16).padStart(2,"0")).join("");if(hash==="6d62aa4b52071e39f064a930d190b85ab327eb1a5045a8050ac538666ee765ca"){isAdmin=true;localStorage.setItem(sessionKey(),JSON.stringify({local:true}));$("#adminLoginModal").setAttribute("aria-hidden","true");input.value="";error.textContent="";setAdminUI({name:"관리자"});}else{error.textContent="비밀번호가 올바르지 않습니다.";input.select();}}
function setAdminUI(user){const area=$("#adminArea");if(!isAdmin){area.innerHTML='<button id="adminLoginBtn" class="adminMiniBtn" type="button">관리자</button>';$("#adminLoginBtn").onclick=openLogin;return;}area.innerHTML='<div class="adminTools"><button id="openEditor" class="adminBtn">✏️ 편집</button><button id="logoutAdmin" class="adminBtn">로그아웃</button></div>';$("#openEditor").onclick=openEditor;$("#logoutAdmin").onclick=()=>{localStorage.removeItem(sessionKey());isAdmin=false;location.reload();};}
function openLogin(){$("#adminLoginModal").setAttribute("aria-hidden","false");$("#adminPassword").focus();}
function openEditor(){
 if(!isAdmin)return;
 $('#htmlEditor').value=localStorage.getItem('egiby07.portfolio.mainHtml')||serverMainHTML;
 $('#editorUser').textContent='관리자 편집 모드';
 $('#saveStatus').textContent='';
 $('#editorPanel').setAttribute('aria-hidden','false');
 document.body.classList.add('editorOpen');
}
function closeEditor(){ $('#editorPanel').setAttribute('aria-hidden','true');document.body.classList.remove('editorOpen'); }

function saveHTML(){
 if(!isAdmin)return;
 const html=$('#htmlEditor').value;
 localStorage.setItem('egiby07.portfolio.mainHtml',html);
 applyLocalHTML(html);
 $('#saveStatus').textContent='저장 완료 · 이 브라우저에 저장됨';
}
function applyLocalHTML(html){
 const top=$('#top'); if(!top)return;
 const current=top.querySelector('#role'); 
 top.innerHTML=html;
 // 편집 후에는 관리 도구가 header에 있으므로 editor 내부의 script 실행을 허용하지 않습니다.
 document.querySelectorAll('#top script, #top iframe').forEach(el=>el.remove());
 if(current){/* no-op */}
}
function resetHTML(){
 if(!confirm('이 브라우저에 저장된 수정 내용을 삭제하고 원본 화면으로 돌아갈까요?'))return;
 localStorage.removeItem('egiby07.portfolio.mainHtml');closeEditor();location.reload();
}

function insertImages(files){
 const editor=$('#htmlEditor');
 [...files].forEach(file=>{
  const reader=new FileReader();
  reader.onload=()=>{const tag='\n<img src="'+reader.result+'" alt="'+esc(file.name)+'" style="max-width:100%;height:auto;border-radius:12px;">\n';const a=editor.selectionStart,b=editor.selectionEnd;editor.setRangeText(tag,a,b,'end');};
  reader.readAsDataURL(file);
 });
}

document.addEventListener("DOMContentLoaded",()=>{fetch("data/portfolio.json").then(r=>r.ok?r.json():Promise.reject()).then(render).catch(()=>render(fallback)).finally(()=>{const saved=localStorage.getItem("egiby07.portfolio.mainHtml");if(saved){setTimeout(()=>applyLocalHTML(saved),0);}$("#closeEditor").onclick=closeEditor;$("#saveEditor").onclick=saveHTML;$("#resetEditor").onclick=resetHTML;$("#imageUpload").onchange=e=>insertImages(e.target.files);$("#closeLogin").onclick=()=>$("#adminLoginModal").setAttribute("aria-hidden","true");$("#adminPasswordSubmit").onclick=adminPasswordLogin;$("#adminPassword").onkeydown=e=>{if(e.key==="Enter")adminPasswordLogin();};const session=JSON.parse(localStorage.getItem(sessionKey())||"null");if(session){isAdmin=true;setAdminUI(session);}else{setAdminUI(null);}});});