const fs = require('fs');
const path = require('path');
const root = __dirname;
const mime = {'.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.mp3':'audio/mpeg'};
const assetsDir = path.join(root,'assets');
const assetMap = new Map();
function walk(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,ent.name);if(ent.isDirectory())walk(full);else{const rel=path.relative(root,full).split(path.sep).join('/');const ext=path.extname(full).toLowerCase();assetMap.set(rel,`data:${mime[ext]||'application/octet-stream'};base64,${fs.readFileSync(full).toString('base64')}`)}}}
walk(assetsDir);
function inlineAssets(s){for(const [rel,data] of assetMap)s=s.split(rel).join(data);return s}
let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const css=inlineAssets(fs.readFileSync(path.join(root,'style.css'),'utf8'));
const content=inlineAssets(fs.readFileSync(path.join(root,'content/content.js'),'utf8'));
const main=inlineAssets(fs.readFileSync(path.join(root,'js/main.js'),'utf8'));
html=html.replace(/<link rel="stylesheet" href="style\.css">/,`<style>\n${css}\n</style>`);
html=html.replace(/<script src="content\/content\.js"><\/script>\s*<script src="js\/main\.js"><\/script>/,`<script>\n${content}\n</script><script>\n${main}\n</script>`);
html=html.replace('<base href="./">','');
fs.writeFileSync(path.join(root,'birthday-standalone.html'),html,'utf8');
console.log(`Created birthday-standalone.html (${fs.statSync(path.join(root,'birthday-standalone.html')).size} bytes; embedded ${assetMap.size} assets)`);
