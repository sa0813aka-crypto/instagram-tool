import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const read=p=>readFile(new URL(p,root),'utf8');
const [template,css,generator,app]=await Promise.all(['scripts/page-template.html','style.css','generator.js','app.js'].map(read));
const js=generator.replace('export function generatePlan','function generatePlan')+'\n'+app.replace("import {generatePlan} from './generator.js';",'');
const html=template.replace('<link rel="stylesheet" href="/style.css">',()=>'<style>'+css+'</style>').replace('<script type="module" src="/app.js"></script>',()=>'<script>(()=>{\n'+js+'\n})();</script>').replace('class="brand" href="/"','class="brand" href="#"');
for(const name of ['index.html','instagram-tool.html','instagram-tool-v2.html'])await writeFile(new URL(name,root),html);
console.log('Both HTML files are ready to open directly.');
