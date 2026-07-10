const fs = require('fs');
let content = fs.readFileSync('src/components/HRView.tsx', 'utf8');

// Clean up the wrong onClick in Attendance
content = content.replace(
  '<tr key={record.id} onClick={() => setSelectedEmployee(record)} className="hover:bg-slate-50/50 transition-colors cursor-pointer">',
  '<tr key={record.id} className="hover:bg-slate-50/50 transition-colors">'
);

// Add Action column to Employee Directory Tab
content = content.replace(
  '<th className="px-6 py-3">Status</th>\n              </tr>',
  '<th className="px-6 py-3">Status</th>\n                <th className="px-6 py-3 text-right">Action</th>\n              </tr>'
);

content = content.replace(
  '<span className={cn(\n                      "px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md",\n                      record.status === \'Active\' ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"\n                    )}>\n                      {record.status}\n                    </span>\n                  </td>\n                </tr>',
  '<span className={cn(\n                      "px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md",\n                      record.status === \'Active\' ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"\n                    )}>\n                      {record.status}\n                    </span>\n                  </td>\n                  <td className="px-6 py-3 text-right">\n                    <button onClick={() => setSelectedEmployee(record)} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-xs font-medium hover:bg-blue-100 transition-colors">View Profile</button>\n                  </td>\n                </tr>'
);

// Also remove that weird -e
content = content.replace('-e     </div>', '    </div>');

fs.writeFileSync('src/components/HRView.tsx', content);
