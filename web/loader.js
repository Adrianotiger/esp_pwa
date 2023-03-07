// helper function to create nodes. (https://github.com/Adrianotiger/CreateElement)
function _CN(e,t,r,n=null){var o=document.createElement(e);if("object"==typeof t)for(var a in t)o.setAttribute(a,t[a]);return Array.isArray(r)&&r.forEach(e=>{o.appendChild("string"==typeof e||"number"==typeof e?document.createTextNode(e):e)}),null!==n&&n.appendChild(o),o}

// The entire PWA is hosted here
const HOST = "https://adrianotiger.github.io/esp_pwa/web/";
// Title for your PWA
const TITLE = "PWA TITLE";
// scripts to load dynamically ("page" will load page.js as javascript)
const SCRIPTS = ["page"];
// stylesheets to load dynamically ("page" will load page.css as stylesheet)
const CSS = ["page"];


window.addEventListener("load", ()=>{
  
  console.log(document.location);
  window.IP = document.location.host;
  
  _CN("title", {}, [TITLE], document.head);
  _CN("meta", {charset:"UTF-8"}, null, document.head);
  _CN("meta", {name:"viewport", content:"width=device-width, initial-scale=1.0"}, null, document.head);
      
  SCRIPTS.forEach(s=>{
    _CN("script", {src:HOST+s+".js", async:true}, null, document.head);
  });
  CSS.forEach(c=>{
    _CN("link", {href:HOST+c+".css", rel:"stylesheet"}, null, document.head);
  });
});