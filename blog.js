"use strict";

const host=document.getElementById("content");
const gallery=document.getElementById("gallery");
const entries=Object.entries(projects);
const localPreview=["127.0.0.1","localhost"].includes(location.hostname) && location.port==="8795";
const source=id=>"source/"+id+"/index.html";
const zip=id=>"downloads/"+id+"-source.zip";
const caseLink=id=>"#project/"+id;
const sampleLink=id=>caseLink(id)+"?view=sample";
const noteLink=id=>"#note/"+id;
const codePaths={campus:["src/main/java/cn/campus/events/CampusEvents.java",183],ledger:["engine.py",133],incident:["monitor.py",117],clinic:["engine.py",244]};
const deepCode=id=>source(id)+"#"+new URLSearchParams({file:codePaths[id][0],line:codePaths[id][1]});
const runtime={campus:"Java 17 或以上，解压后运行 start-review.cmd，默认端口 8768。",ledger:"Python 3.10 或以上，解压后运行 start-review.cmd，默认端口 8792。",incident:"Python 3.10 或以上，解压后运行 start-incident.cmd，默认端口 8793。隔离演练可独立使用。",clinic:"解压后在项目目录运行 python server.py，默认端口 8796。排班和预约使用合成演示数据。"};
const captions={
  clinic:["S01 综合门诊的 2 席均已约，R003 与 R004 按登记顺序候补。","S01 停诊后，R001 和 R002 待改约，接收班次 S02 同科且尚余 2 席。"],
  campus:["学生端活动大厅和可报名的样例分享会。","发布端的限时六位码、二维码与现场报名名单。"],
  ledger:["两份样例分别有 8 行和 6 行，3 项一致，5 项待复核。","000127 两侧第 4 行的 128 元和 118 元，以及已保存的演示复核结论。"],
  incident:["独立演练服务返回 HTTP 200，最早任务已等 95 秒，同时双账探针正常。","一次隔离演练的首次异常、签收、解除和连续健康确认。"]
};
const images=(id,detail=false)=>"images/"+id+"-"+(detail?"detail":"main")+".webp";
const textLink=(url,label)=>'<a class="textlink" href="'+url+'">'+label+'</a>';
const button=(url,label,primary=false,download=false)=>'<a class="button'+(primary?' primary':'')+'" href="'+url+'"'+(download?' download':'')+'>'+label+'</a>';
const routeTo=(role="",industry="",group="")=>{
  const query=new URLSearchParams();
  if(group)query.set("group",group);
  if(role)query.set("role",role);
  if(industry)query.set("industry",industry);
  return "#projects"+(query.size?"?"+query:"");
};
const relevant=(role,industry,project)=>(!role || project.roles.includes(role)) && (!industry || project.sector.includes(industry));
const crumbs=(last,parent="我的作品",href="#projects")=>'<div class="crumb"><a href="'+href+'">'+parent+'</a><span>/</span>'+last+'</div>';
const linkedNotes=(list)=>'<div class="note-list">'+list.map(([id,p])=>'<a class="note-row" href="'+noteLink(id)+'"><span class="note-type">'+p.name+'</span><div class="note-copy"><h3 class="notetitle">'+p.note+'</h3><p>'+p.teaser+'</p></div><span class="arrow" aria-hidden="true">↗</span></a>').join("")+'</div>';
let lastPath="";

function card(id,p,{role="",group,archive=false,heading="h3"}={}){
  const shownRole=role || p.roles.find(key=>!group||group.roles.includes(key));
  const description=group || role?p.proof[shownRole]:p.pitch;
  return `<article class="card">
    <div class="study-art"><img src="images/${id}-study.webp" width="960" height="480" alt=""></div>
    <div class="card-body">
      <${heading} class="project-title"><a href="${caseLink(id)}">${p.name}<span class="card-arrow" aria-hidden="true">→</span></a></${heading}>
      <p>${description}</p>
      <div class="card-meta"><span>${roleNames[shownRole]}</span><span>${industryNames[p.sector[0]]}</span></div>
    </div>
    ${archive?`<div class="card-proof"><small>验证记录</small><p>${p.evidence}</p></div>`:""}
  </article>`;
}
function options(labels,used){
  return Object.entries(labels).filter(([key])=>used.has(key)).map(([key,label])=>'<option value="'+key+'">'+label+'</option>').join("");
}
function personalHome(){
  const articles=entries.map(([id,p])=>'<li><a href="'+noteLink(id)+'"><span>'+p.name+'</span><strong>'+p.note+'</strong><i aria-hidden="true">↗</i></a></li>').join("");
  host.innerHTML='<div class="personal-intro"><header class="personal-bio"><h1>李子衡的个人博客</h1>'+
    '<p>你好，我是李子衡，一名计算机专业学生。这里收录了我的开发作品和技术文章。</p>'+
    '<div class="bio-actions">'+button("#projects","查看我的作品",true)+textLink("#contact","联系我")+'</div></header>'+
    '<aside class="personal-reading" aria-labelledby="home-reading-title"><div class="reading-head"><h2 id="home-reading-title">文章选读</h2>'+textLink("#notes","全部文章")+'</div><ul>'+articles+'</ul></aside></div>'+
    '<section class="personal-projects"><div class="section-head"><h2>我的作品</h2>'+textLink("#projects","按方向浏览")+'</div>'+
    '<div class="cards">'+entries.map(([id,p])=>card(id,p)).join("")+'</div></section>';
}
function projectCatalog(query,scroll){
  const group=groups.find(item=>item.id===query.get("group"));
  const requestedRole=query.get("role");
  const role=Object.hasOwn(roleNames,requestedRole) && (!group||group.roles.includes(requestedRole))?requestedRole:"";
  const industry=Object.hasOwn(industryNames,query.get("industry"))?query.get("industry"):"";
  const pool=entries.filter(([,p])=>!group || p.roles.some(r=>group.roles.includes(r)));
  if(group)pool.sort(([,a],[,b])=>Number(group.roles.includes(b.roles[0]))-Number(group.roles.includes(a.roles[0])));
  const visible=pool.filter(([,p])=>relevant(role,industry,p));
  const all=!group && !role && !industry;
  const rolesUsed=new Set(pool.flatMap(([,p])=>p.roles).filter(r=>!group||group.roles.includes(r)));
  const sectorsUsed=new Set(pool.flatMap(([,p])=>p.sector));
  if(role)rolesUsed.add(role);
  if(industry)sectorsUsed.add(industry);
  const focused=host.contains(document.activeElement)?document.activeElement.id:"";
  const heading=group?group.name:role?roleNames[role]:industry?industryNames[industry]:"我的作品";
  let empty="";
  if(group && !pool.length){
    empty='<div class="pipeline"><h2>计划中的选题</h2><p>这个方向还没有发布作品。</p><ul>'+group.planned.map(([name,desc])=>'<li><h3>'+name+'</h3><p>'+desc+'</p></li>').join("")+'</ul>'+textLink("#projects","浏览已发布项目")+'</div>';
  }else if(!visible.length){
    empty='<div class="empty">当前筛选没有匹配的作品。 '+textLink(routeTo("","",group?.id),"清除筛选")+'</div>';
  }
  host.innerHTML='<section id="catalog" class="catalog '+(all?'catalog-home':'catalog-filtered')+'">'+
    '<div class="catalog-head"><div class="catalog-title"><div class="section-name"><h1>'+heading+'</h1><span class="count" id="count" role="status">'+visible.length+' 项</span></div>'+(group?'<p>'+group.description+'</p>':'')+textLink("#skills","按能力浏览")+'</div>'+
    (pool.length?'<div class="controls"><label><span>技术方向</span><select id="role-filter"><option value="">全部技术方向</option>'+options(roleNames,rolesUsed)+'</select></label>'+
      '<label><span>行业场景</span><select id="industry-filter"><option value="">全部行业</option>'+options(industryNames,sectorsUsed)+'</select></label>'+
      (role||industry?'<button id="reset" type="button" class="textbtn">清除筛选</button>':'')+'</div>':'')+
    '</div><div id="matches">'+(visible.length?'<div class="cards">'+visible.map(([id,p])=>card(id,p,{role,group,archive:!all,heading:"h2"})).join("")+'</div>':empty)+'</div></section>';
  const roleSelect=document.getElementById("role-filter");
  const industrySelect=document.getElementById("industry-filter");
  if(roleSelect){roleSelect.value=role;industrySelect.value=industry;}
  if(focused)document.getElementById(focused)?.focus({preventScroll:true});
  if(scroll)document.getElementById("catalog").scrollIntoView();
}
function note(id,p){
  const screenshot='<figure class="article-figure"><button class="screenbtn" data-screen="'+images(id,true)+'" aria-label="放大实屏图"><img src="'+images(id,true)+'" alt="'+captions[id][1]+'" loading="lazy"></button><figcaption>'+captions[id][1]+'</figcaption></figure>';
  const record=id==="incident"?'<div class="article-probe">'+document.getElementById("incident-record").innerHTML+'</div>':"";
  host.innerHTML=crumbs(p.name,"我的文章","#notes")+'<article class="article"><header><div class="eyebrow">'+p.name+'　/　'+p.version+'</div><h1>'+p.note+'</h1><p class="intro">'+p.teaser+'</p><div class="article-byline">李子衡 <span>·</span> '+p.stack+'</div></header>'+
    p.parts.map(([title,body],i)=>'<section><h2>'+title+'</h2><p>'+body+'</p></section>'+(i===0?record:'')+(i===1?screenshot:'')).join("")+
    '<div class="linkrow">'+button(deepCode(id),"阅读这段实现",true)+button(sampleLink(id),"打开交互样例")+button(caseLink(id),"查看项目")+'</div></article>';
}
function skills(){
  host.innerHTML=crumbs("能力索引")+'<header class="pagehead"><h1>能力索引</h1><p>按技术方向查看相关作品、实现细节和验证记录。</p></header>'+
    '<section class="section"><div class="skill-grid">'+groups.map(group=>'<article class="skill-group"><h3><a href="'+routeTo("","",group.id)+'">'+group.name+'</a></h3><p>'+group.description+'</p><ul>'+
    group.roles.map(role=>{const n=entries.filter(([,p])=>p.roles.includes(role)).length;return '<li>'+(n?'<a href="'+routeTo(role,"",group.id)+'">'+roleNames[role]+' ↗</a>':'<span>'+roleNames[role]+'</span>')+'<small>'+(n?n+' 项':'待补作品')+'</small></li>';}).join("")+'</ul></article>').join("")+'</div></section>'+
    '<section class="section"><h2>已覆盖的行业场景</h2><div class="linkrow" style="margin-top:12px">'+Object.entries(industryNames).filter(([s])=>entries.some(([,p])=>p.sector.includes(s))).map(([s,label])=>button(routeTo("",s),label)).join("")+'</div></section>';
}
function contact(){
  host.innerHTML=crumbs("联系","首页","#home")+'<header class="pagehead"><h1>联系李子衡</h1><p>欢迎通过邮箱或电话与我交流项目。</p></header>'+
    '<section class="contact"><dl><div><dt>姓名</dt><dd>李子衡</dd></div><div><dt>QQ 邮箱</dt><dd><a href="mailto:1316241517@qq.com">1316241517@qq.com</a></dd></div>'+
    '<div><dt>电话</dt><dd><a href="tel:19137523310">19137523310</a></dd></div>'+
    '<div><dt>GitHub</dt><dd><a href="'+window.blogGitHub.profile+'">@'+window.blogGitHub.profile.split("/").pop()+'</a></dd></div>'+
    '<div><dt>博客源码</dt><dd><a href="'+window.blogGitHub.repositories.blog+'">personal-blog</a></dd></div></dl></section>';
}
function setGallerySize(original){
  gallery.classList.toggle("original-size",original);
  document.getElementById("gallery-size").textContent=original?"适应窗口":"原始尺寸";
  document.getElementById("photo-viewport").scrollTo(0,0);
}
function paint(){
  const hash=location.hash.slice(1);
  const [path,qs]=hash.split("?");
  const currentPath=path || "home";
  const [page,id]=currentPath.split("/");
  const query=new URLSearchParams(qs);
  const group=groups.find(item=>item.id===query.get("group"));
  const isCatalog=page==="projects" || page==="catalog";
  document.querySelector(".category-band").hidden=!(isCatalog || page==="skills");
  for(const item of document.querySelectorAll("#categories [data-group]")){
    if(isCatalog && item.dataset.group===(group?.id || ""))item.setAttribute("aria-current","page");
    else item.removeAttribute("aria-current");
  }
  const active=isCatalog || page==="project" || page==="skills"?"projects":page==="note"?"notes":page;
  for(const item of document.querySelectorAll(".mast [data-page]")){
    if(item.dataset.page===active)item.setAttribute("aria-current","page"); else item.removeAttribute("aria-current");
  }
  if(gallery.open)gallery.close();
  if(page!=="catalog" && lastPath!==currentPath)window.scrollTo(0,0);
  let title="";
  if(isCatalog){
    projectCatalog(query,page==="catalog");
    title=group?.name || "我的作品";
    lastPath="projects";
  }else{
    if((page==="note"||page==="project") && Object.hasOwn(projects,id)){
      const p=projects[id];
      if(page==="note"){
        note(id,p);title=p.note;
      }else{
        if(lastPath!==path) window.renderProjectDetail(id,p,query.get("view"));
        else if(query.get("view")==="sample") document.getElementById("sample").scrollIntoView();
        title=p.name;
      }
    }else if(page==="home"){personalHome();}
    else if(page==="notes"){
      title="我的文章";
      host.innerHTML=crumbs(title,"首页","#home")+'<header class="pagehead"><h1>我的文章</h1><p>做项目时，有些问题值得单独写下来。这里记录我的实现选择、验证过程和对应的代码。</p></header><section class="section">'+linkedNotes(entries)+'</section>';
    }else if(page==="skills"){skills();title="能力索引";}
    else if(page==="contact"){contact();title="联系";}
    else{host.innerHTML='<section class="section"><h1>未找到这个页面</h1>'+textLink("#projects","返回项目目录")+'</section>';title="页面未找到";}
    lastPath=currentPath;
  }
  document.title=(title?title+" · ":"")+"李子衡的个人博客";
}
document.addEventListener("change",e=>{
  if(e.target.id==="role-filter"||e.target.id==="industry-filter"){
    const group=new URLSearchParams(location.hash.split("?")[1]).get("group");
    location.hash=routeTo(document.getElementById("role-filter").value,document.getElementById("industry-filter").value,group);
  }
});
document.addEventListener("click",e=>{
  if(e.target.closest(".skip")){e.preventDefault();host.focus();return;}
  if(e.target.id==="reset"){location.hash=routeTo("","",new URLSearchParams(location.hash.split("?")[1]).get("group"));return;}
  const category=e.target.closest("#categories a");
  if(category)window.scrollTo(0,0);
  const imageButton=e.target.closest("[data-screen]");
  if(imageButton){
    const alt=imageButton.querySelector("img").alt;
    document.getElementById("photo-caption").textContent=alt;
    const img=document.getElementById("photo");img.src=imageButton.dataset.screen;img.alt=alt;
    setGallerySize(matchMedia("(max-width:620px)").matches);
    gallery.showModal();
    document.getElementById("photo-viewport").scrollTo(0,0);
  }else if(e.target.id==="gallery-size")setGallerySize(!gallery.classList.contains("original-size"));
  else if(e.target.id==="close-gallery" || e.target===gallery) gallery.close();
  const same=e.target.closest("a");
  if(same && same.getAttribute("href")===location.hash && location.hash.includes("?view=sample"))document.getElementById("sample")?.scrollIntoView();
});
window.addEventListener("hashchange",paint);
document.getElementById("categories").innerHTML='<a data-group="" href="#projects">全部项目</a>'+
  groups.map(group=>'<a data-group="'+group.id+'" href="'+routeTo("","",group.id)+'">'+group.name+'</a>').join("");
paint();
