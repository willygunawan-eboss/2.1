import fs from 'fs';
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

const oldMap = `          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (`;

const newMap = `          {navItems.map((item) => {
            if (!hasMenu(item.id)) return null;
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (`;

code = code.replace(oldMap, newMap);
fs.writeFileSync('src/components/Sidebar.tsx', code);
