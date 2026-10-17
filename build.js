// בנייה: gym-tracker.src.html (JSX גולמי) -> gym-tracker.html + index.html (JS מקומפל מראש, בלי Babel בדפדפן)
// הרצה: node build.js
const fs = require('fs'), path = require('path');
const Babel = require('./.tools/node_modules/@babel/standalone');
let html = fs.readFileSync(path.join(__dirname, 'gym-tracker.src.html'), 'utf8');
const m = html.match(/<script id="app-source" type="text\/plain">([\s\S]*?)<\/script>\s*<script>\s*\(function\(\)\{[\s\S]*?Babel\.transform[\s\S]*?\}\)\(\);\s*<\/script>/);
if (!m) throw new Error('app-source/loader block not found');
const out = Babel.transform(m[1], { presets: ['env', ['react', { runtime: 'classic' }]] }).code.replace(/<\/script/gi, '<\/script');
html = html.replace(m[0], () => '<script>\n' + out + '\n</script>');
html = html.replace(/\s*<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/babel-standalone[^>]*><\/script>/, '');
fs.writeFileSync(path.join(__dirname, 'gym-tracker.html'), html);
fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('built', (html.length/1024).toFixed(0) + 'KB');
