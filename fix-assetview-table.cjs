const fs = require('fs');
let content = fs.readFileSync('src/components/AssetView.tsx', 'utf8');

const regex = /<td className="px-6 py-4">\s*<span className=\{\`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold \$\{\s*asset\.status === 'Active' \? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :\s*asset\.status === 'Maintenance' \? 'bg-amber-50 text-amber-700 border border-amber-200' :\s*'bg-slate-100 text-slate-700 border border-slate-200'\s*\}\`\}>\s*\{asset\.status\}\s*<\/span>\s*<\/td>/;

const newStatusCol = `<td className="px-6 py-4 text-slate-600 font-medium">
                        {asset.assignedEmployeeName || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={\`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold \${
                          asset.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          asset.status === 'Maintenance' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-slate-100 text-slate-700 border border-slate-200'
                        }\`}>
                          {asset.status}
                        </span>
                      </td>`;

content = content.replace(regex, newStatusCol);

fs.writeFileSync('src/components/AssetView.tsx', content);
