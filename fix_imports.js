const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'frontend', 'src', 'components');
const foldersToProcess = ['home', 'about', 'nvq', 'courses'];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Fix figma:asset imports
  // import workerImg from "figma:asset/d53a8bff042262f043645e8bb9cfb764b56d17dd.png";
  content = content.replace(/import\s+(\w+)\s+from\s+['"]figma:asset\/([^'"]+)['"];/g, 'const $1 = "/$2";');

  // 2. Fix imports/08AboutUs-1 imports
  // import imgJames from "../../../imports/08AboutUs-1/0948576c0cff3354c5e77ef470ce79f9e8fcb418.png";
  content = content.replace(/import\s+(\w+)\s+from\s+['"](?:\.\.\/)+imports\/08AboutUs-1\/([^'"]+)['"];/g, 'const $1 = "/$2";');

  // 3. Fix UI component imports (Default to Named)
  content = content.replace(/import\s+Card\s+from\s+['"](?:\.\.\/)+ui\/Card['"];/g, 'import { Card } from "@/components/ui/Card";');
  content = content.replace(/import\s+Badge\s+from\s+['"](?:\.\.\/)+ui\/Badge['"];/g, 'import { Badge } from "@/components/ui/Badge";');
  content = content.replace(/import\s+Button\s+from\s+['"](?:\.\.\/)+ui\/Button['"];/g, 'import { Button } from "@/components/ui/Button";');
  content = content.replace(/import\s+Input\s+from\s+['"](?:\.\.\/)+ui\/Input['"];/g, 'import { Input } from "@/components/ui/Input";');

  // 4. Update Figma ImageWithFallback imports to use @/components/figma
  content = content.replace(/import\s+\{\s*ImageWithFallback\s*\}\s+from\s+['"](?:\.\.\/)+figma\/ImageWithFallback['"];/g, 'import { ImageWithFallback } from "@/components/figma/ImageWithFallback";');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function traverseDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

foldersToProcess.forEach(folder => {
  traverseDir(path.join(componentsDir, folder));
});

console.log('Imports fixing complete.');
