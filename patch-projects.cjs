const fs = require('fs');
let code = fs.readFileSync('src/components/ProjectsView.tsx', 'utf-8');

code = code.replace(/<tbody className="divide-y divide-slate-100 text-sm">[\s\S]*?<\/tbody>/, `
              <tbody className="divide-y divide-slate-100 text-sm">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  projects.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{p.id}</td>
                      <td className="px-6 py-4 text-slate-900 font-medium">{p.name}</td>
                      <td className="px-6 py-4 text-slate-600">{p.client}</td>
                      <td className="px-6 py-4 text-slate-600">{p.dueDate}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-slate-200 rounded-full h-1.5">
                            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: p.progress + '%' }}></div>
                          </div>
                          <span className="text-xs text-slate-500 w-8">{p.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={"px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase " + (p.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : p.status === 'Active' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700')}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
`);

fs.writeFileSync('src/components/ProjectsView.tsx', code);
