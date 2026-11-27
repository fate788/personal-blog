"use strict";

const model = JSON.parse(document.getElementById("source-data").textContent);
const byPath = new Map(model.files.map(file => [file.path, file]));
const groupOrder = ["后端","前端","数据与样例","验收测试","配置与启动","项目说明","第三方许可"];
const id = name => document.getElementById(name);
const repositoryLink = id("github-repository");
repositoryLink.href = window.blogGitHub.repositories[repositoryLink.dataset.project];
repositoryLink.hidden = false;
const mobile = window.matchMedia("(max-width:660px)");
let currentFile = null;
let selectedLine = null;
let pendingFrame = 0;
let currentLength = 0;

function fileHash(path,number) {
  const params = new URLSearchParams({file:path});
  if(number) params.set("line",number);
  return "#"+params;
}
function basename(path) { return path.split("/").pop(); }
function make(tag, content, className) {
  const node = document.createElement(tag);
  if(content !== null) node.textContent = content;
  if(className) node.className = className;
  return node;
}
function filterTree() {
  const needle = id("query").value.trim().toLowerCase();
  const matches = model.files.filter(file=>file.path.toLowerCase().includes(needle));
  const countNames = new Map();
  for(const file of model.files) {
    const name=basename(file.path);
    countNames.set(name, (countNames.get(name)||0)+1);
  }
  const previouslyOpen=new Set(Array.from(id("files").querySelectorAll("details[open]"), node=>node.dataset.group));
  const firstBuild=!id("files").children.length;
  const fragment=document.createDocumentFragment();
  for(const group of groupOrder) {
    const groupFiles=matches.filter(file=>file.group===group);
    if(!groupFiles.length) continue;
    const element=make("details",null);
    element.dataset.group=group;
    const current=groupFiles.some(file=>file===currentFile);
    element.open=Boolean(needle) || current || previouslyOpen.has(group) || (firstBuild && model.files.length < 20);
    const heading=make("summary",group);
    heading.append(make("small",String(groupFiles.length)));
    element.append(heading);
    for(const file of groupFiles) {
      const name=basename(file.path);
      const label=countNames.get(name)>1 ? file.path : name;
      const link=make("a",label,"file");
      link.href=fileHash(file.path);
      link.title=file.path;
      link.setAttribute("aria-label",file.path);
      if(file===currentFile) link.setAttribute("aria-current","page");
      element.append(link);
    }
    fragment.append(element);
  }
  id("files").replaceChildren(fragment);
  id("empty").hidden=matches.length>0;
}
function loadFile(file) {
  currentFile=file;
  id("filename").textContent=basename(file.path);
  id("path").textContent=file.path;
  id("feedback").textContent="";
  const lines=file.text.split("\n");
  if(lines.length>1 && lines.at(-1)==="") lines.pop();
  currentLength=lines.length;
  id("counts").textContent=currentLength+" 行";
  const content=document.createDocumentFragment();
  const hashPrefix=fileHash(file.path)+"&line=";
  for(const [index, text] of lines.entries()) {
    const row=make("div",null,"line");
    const number=index+1;
    row.id="L"+number;
    const trimmed=text.trimStart();
    if(trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("* ") || trimmed.startsWith("#")) row.classList.add("comment");
    else if(/^(def |class |(?:public|private|protected) |function |async function )/.test(trimmed)) row.classList.add("declaration");
    const numberLink=make("a",String(number),"num");
    numberLink.href=hashPrefix+number;
    numberLink.title="定位到第 "+number+" 行";
    numberLink.setAttribute("aria-label","第 "+number+" 行");
    numberLink.tabIndex=-1;
    row.append(numberLink,make("code",text));
    content.append(row);
  }
  id("source").replaceChildren(content);
  id("viewport").scrollTo(0,0);
  filterTree();
}
function renderHash() {
  const params=new URLSearchParams(location.hash.slice(1));
  const requested=params.get("file");
  const file=byPath.get(requested) || byPath.get(model.defaultFile);
  const changed=file!==currentFile;
  if(changed) loadFile(file);
  if(pendingFrame) cancelAnimationFrame(pendingFrame);
  selectedLine?.classList.remove("selected");
  selectedLine=null;
  const locationNumber=Number(params.get("line"));
  if(requested && !byPath.has(requested)){
    id("feedback").textContent="文件路径无效，已打开默认文件。";
    return;
  }
  if(Number.isInteger(locationNumber) && locationNumber>0 && locationNumber<=currentLength){
    const line=id("L"+locationNumber);
    selectedLine=line;
    line.classList.add("selected");
    id("counts").textContent=currentLength+" 行 · 定位至 "+locationNumber+" 行";
    pendingFrame=requestAnimationFrame(()=>{
      const pane=id("viewport");
      const offset=line.getBoundingClientRect().top-pane.getBoundingClientRect().top+pane.scrollTop;
      pane.scrollTop=Math.max(0,offset-pane.clientHeight*0.16);
    });
  } else {
    id("counts").textContent=currentLength+" 行";
    if(!changed) id("viewport").scrollTop=0;
  }
}
function fallbackCopy(value){
  const before=document.activeElement;
  const area=make("textarea",null);
  area.value=value;
  area.style.cssText="position:fixed;top:0;left:-10000px";
  document.body.append(area);
  area.select();
  let copied=false;
  try{copied=document.execCommand("copy");}finally{area.remove();before?.focus({preventScroll:true});}
  return copied;
}
async function copyFile(){
  const source=currentFile;
  let copied=false;
  try{
    if(navigator.clipboard?.writeText){
      await navigator.clipboard.writeText(source.text);
      copied=true;
    }
  }catch{}
  if(!copied){
    try{copied=fallbackCopy(source.text);}catch{}
  }
  if(currentFile===source) id("feedback").textContent=copied?"已复制文件内容":"复制未成功，可选中代码手动复制。";
}
id("tree").open=!mobile.matches;
mobile.addEventListener("change", event=>{id("tree").open=!event.matches;});
id("query").addEventListener("input",filterTree);
id("wrap").addEventListener("change", event=>id("viewport").classList.toggle("wrapped",event.target.checked));
id("copy").addEventListener("click",copyFile);
id("files").addEventListener("click",event=>{if(mobile.matches && event.target.closest(".file")) id("tree").open=false;});
window.addEventListener("hashchange",renderHash);
renderHash();
