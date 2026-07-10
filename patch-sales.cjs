const fs = require('fs');
let code = fs.readFileSync('src/components/SalesView.tsx', 'utf-8');

// Replace the placeholder table with real data mapping
code = code.replace(/<tbody className="divide-y divide-slate-100 text-sm">[\s\S]*?<\/tbody>/, `
              <tbody className="divide-y divide-slate-100 text-sm">
                {salesOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                      No records found. Click "Create Sales Order" to get started.
                    </td>
                  </tr>
                ) : (
                  salesOrders.map((order, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                      <td className="px-6 py-4 text-slate-600">{order.customer}</td>
                      <td className="px-6 py-4 text-slate-600">{order.date}</td>
                      <td className="px-6 py-4 text-slate-900 font-medium">{formatCurrency(order.amount)}</td>
                      <td className="px-6 py-4">
                        <span className={"px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase " + (order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
`);

fs.writeFileSync('src/components/SalesView.tsx', code);
