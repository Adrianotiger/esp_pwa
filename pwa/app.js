/*
 Simple PWA to check a local ESP32 and open the page if available.
 Author: Adriano Petrucci
 07.03.2023
 */

// Helper function to create a DOM-node (https://github.com/Adrianotiger/CreateElement)
function _CN(e,t,r,n=null){var o=document.createElement(e);if("object"==typeof t)for(var a in t)o.setAttribute(a,t[a]);return Array.isArray(r)&&r.forEach(e=>{o.appendChild("string"==typeof e||"number"==typeof e?document.createTextNode(e):e)}),null!==n&&n.appendChild(o),o}

// Projects to check
let projects = [];
// Timeout, to check if the ESP is available (on Desktops, it need 2000-2300ms, on Android 200-300ms)
let TIMEOUT = navigator.maxTouchPoints > 1 ? 1500 : 3000;
let VER = 1.1;
let isOpeningProject = false;

//console.log(navigator.userAgentData); 
//console.log(navigator.maxTouchPoints);

function editProject(index)
{
  let win = createEditWindow(index, (title, ip, autostart)=>{
    if(index < 0)
    {
      index = projects.length;
      localStorage.setItem("numProjects", index + 1);
    }
    localStorage.setItem("proj"+index+"title", title);
    localStorage.setItem("proj"+index+"ip", ip);
    localStorage.setItem("proj"+index+"autostart", autostart ? 1 : 0);
    setTimeout(()=>{
      document.location.reload();
    }, 200);
  });
  
  if(index >= 0)
  {
    win.querySelectorAll("input")[0].value = projects[index].title;
    win.querySelectorAll("input")[1].value = projects[index].ip;
    win.querySelectorAll("input")[2].checked = projects[index].autostart;
  }
}

function editSettings()
{
  let div = _CN("div", {class:"overlay"}, [], document.body);
  let win = _CN("div", {class:"window"}, [], div);
  
  _CN("h3", null, ["App Version: " + VER], win);
  _CN("a", {href:"https://github.com/Adrianotiger/esp_pwa"}, ["Open GitHub project"], win);
  _CN("h2", null, ["Settings:"], win);  
  _CN("h3", null, ["Request timeout:"], win);
  _CN("input", {type:"number", value:TIMEOUT, min:500, max:20000, placeholder:3000}, null, win).addEventListener("change", (e)=>{
	if(e.target.value != TIMEOUT)
	{
		TIMEOUT = parseInt(e.target.value);
		localStorage.setItem("timeout", TIMEOUT);
	}
  });
  
  _CN("button", null, ["CLOSE"], win).addEventListener("click", (e)=>{
	closeEditWindow(div);
  });
  
  div.addEventListener("click", (e)=>{
    if(e.srcElement != div) return;
    closeEditWindow(div);
  });
}

function openProject(index)
{
  if(isOpeningProject) return;
  if(index >= 0)
  {
    if(projects[index].active)
    {
      isOpeningProject = true;
      document.location.href = projects[index].ip;
      return;
    }
    else
    {
      editProject(index);
    }
  }
}

function closeEditWindow(div)
{
  div.style.opacity = 0.0;
  setTimeout(()=>{
    document.body.removeChild(div);
  }, 800);
}

function createEditWindow(index, func)
{
  let div = _CN("div", {class:"overlay"}, [], document.body);
  let win = _CN("div", {class:"window"}, [], div);
  
  _CN("h2", null, ["Project:"], win);
  _CN("input", {type:"text", value:"", placeholder:"Title"}, null, win);
  
  _CN("h2", null, ["IP Address:"], win);
  _CN("input", {type:"url", value:"", placeholder:"192.168.1.10"}, null, win);
    
  if(index >= 0)
  {
    _CN("h2", null, ["Autostart:"], win);
    _CN("input", {type:"checkbox"}, null, win);
  
    _CN("h2", null, ["Delete project:"], win);
    _CN("input", {type:"checkbox"}, null, win);
  }
  
  _CN("button", null, ["OK"], win).addEventListener("click", (e)=>{
    const newTitle = win.querySelectorAll("input")[0].value;
    let newIP = win.querySelectorAll("input")[1].value;
    if(win.querySelectorAll("input")[3]?.checked)
    {
      const prjs = parseInt(localStorage.getItem("numProjects"));
      for(var j=index;j<projects.length-1;j++)
      {
        localStorage.setItem("proj"+j+"title", localStorage.getItem("proj"+(j+1)+"title"));
        localStorage.setItem("proj"+j+"ip", localStorage.getItem("proj"+(j+1)+"ip"));
        localStorage.setItem("proj"+j+"autostart", localStorage.getItem("proj"+(j+1)+"autostart"));
      }
      localStorage.setItem("numProjects", projects.length - 1);
      
      closeEditWindow(div);
      
      setTimeout(()=>{
        document.location.reload();
      }, 200);
      return;
    }
    else if(newTitle.length < 1)
    {
      alert("Please set a project title.");
      return;
    }
    else if(newIP.length < 1)
    {
      alert("Please set an IP or URL.");
      return;
    }
    if(!newIP.startsWith("http")) newIP = "http://" + newIP;
    
    for(let j=0;j<projects.length;j++)
    {
      if(projects[j].ip == newIP && j != index) 
      {
        alert(`This IP is already present as ${projects[j].title}-project.`);
        return;
      }
    }
    
    func(newTitle, newIP, win.querySelectorAll("input")[2]?.checked);
    closeEditWindow(div);
  });
  
  div.addEventListener("click", (e)=>{
    if(e.srcElement != div) return;
    closeEditWindow(div);
  });
  
  return win;
}

function activateProject(projectId)
{
  const butt = document.querySelectorAll("button")[projectId];
  if(!butt) return;
  butt.classList.remove("red");
  butt.classList.add("green");
  projects[projectId].active = true;
  if(projects[projectId].autostart) openProject(projectId);
}

function checkProject(projectId)
{
  const t1 = new Date();
  const link = projects[projectId].ip.replace("http:", "https:");
  
  
  fetch(link, {method: "OPTIONS", mode: "cors", cache: "no-store"}).then(c=>{
    console.log("fetch success: " + link);
    console.log(c);
    activateProject(projectId);
  }).catch(e=>{
    console.warn(e);
    const answerTime = (new Date()) - t1;
    if(answerTime > TIMEOUT)
    {
      console.warn("Timeout: " + link, answerTime + "ms");
    }
    else
    {
      console.log("fetch error, but available? " + link, "time: " + answerTime + "ms");
      activateProject(projectId);
    }
  });
}

window.addEventListener("load", ()=>{
  if(localStorage.getItem("timeout") != null)
  {
	  TIMEOUT = Math.max(500, parseInt(localStorage.getItem("timeout")));
  }
  if(localStorage.getItem("numProjects") != null)
  {
    const prjs = parseInt(localStorage.getItem("numProjects"));
    for(var j=0;j<prjs;j++)
    {
      projects.push({
        title: localStorage.getItem("proj"+j+"title"),
        ip: localStorage.getItem("proj"+j+"ip"),
        autostart: parseInt(localStorage.getItem("proj"+j+"autostart")) == 1,
        active: false
      });
    }
    
    for(let j=0;j<projects.length;j++)
    {
      const p = projects[j];
      let butt = _CN("button", null, [p.title], document.querySelector(".projects"));
      let butt_e = _CN("em", {style:""}, ["✎"], butt);
      butt_e.addEventListener("click", (e)=>{
        e.preventDefault();
        e.stopPropagation();
        editProject(j);
      });
      
      butt.addEventListener("click", ()=>{
        openProject(j);
      });
      setTimeout(()=>{
        checkProject(j);
      }, 100);
    };
  }
});
