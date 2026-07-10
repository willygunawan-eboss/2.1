const fs = require('fs');
let code = fs.readFileSync('src/components/FinanceView.tsx', 'utf-8');

code = code.replace(/<tbody className="divide-y divide-slate-100 text-sm">[\s\S]*?<\/tbody>/, `
              <tbody className="divide-y divide-slate-100 text-sm">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  transactions.map((t, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{t.id}</td>
                      <td className="px-6 py-4 text-slate-600">{t.date}</td>
                      <td className="px-6 py-4 text-slate-900 font-medium">{t.description}</td>
                      <td className="px-6 py-4 text-slate-600">{t.category}</td>
                      <td className="px-6 py-4 text-slate-900 font-medium">{formatCurrency(t.amount)}</td>
                      <td className="px-6 py-4">
                        <span className={"px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase " + (t.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
`);

fs.writeFileSync('src/components/FinanceView.tsx', code);
