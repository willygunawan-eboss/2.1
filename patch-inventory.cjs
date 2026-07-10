const fs = require('fs');
let code = fs.readFileSync('src/components/InventoryView.tsx', 'utf-8');

code = code.replace(/<tbody className="divide-y divide-slate-100 text-sm">[\s\S]*?<\/tbody>/, `
              <tbody className="divide-y divide-slate-100 text-sm">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  products.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{p.id}</td>
                      <td className="px-6 py-4 text-slate-900 font-medium">{p.name}</td>
                      <td className="px-6 py-4 text-slate-600">{p.sku}</td>
                      <td className="px-6 py-4 text-slate-600">{p.category}</td>
                      <td className="px-6 py-4 text-slate-900">{p.stock}</td>
                      <td className="px-6 py-4">
                        <span className={"px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase " + (p.status === 'In Stock' ? 'bg-emerald-100 text-emerald-700' : p.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700')}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
`);

fs.writeFileSync('src/components/InventoryView.tsx', code);
