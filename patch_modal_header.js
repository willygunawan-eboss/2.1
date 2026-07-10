import fs from 'fs';
let code = fs.readFileSync('src/components/EmployeeDetailModal.tsx', 'utf8');

const oldHeader = `<div className="flex gap-6 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{data?.assetAssignments?.length || 0}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Assets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{data?.trainings?.length || 0}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Trainings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{data?.certifications?.length || 0}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Certs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">{data?.performances?.[0]?.score || '-'}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Latest KPI</div>
            </div>
          </div>`;

const newHeader = `<div className="flex gap-4 md:gap-6 overflow-x-auto pb-2 md:pb-0 hide-scrollbar pr-4">
            <div className="text-center shrink-0">
              <div className="text-2xl font-bold text-white">{data?.projects?.length || 0}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Projects</div>
            </div>
            <div className="text-center shrink-0">
              <div className="text-2xl font-bold text-white">{data?.tickets?.length || 0}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Tickets</div>
            </div>
            <div className="text-center shrink-0">
              <div className="text-2xl font-bold text-white">{data?.assetAssignments?.length || 0}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Assets</div>
            </div>
            <div className="text-center shrink-0">
              <div className="text-2xl font-bold text-white">{data?.trainings?.length || 0}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Trainings</div>
            </div>
            <div className="text-center shrink-0">
              <div className="text-2xl font-bold text-emerald-400">{data?.performances?.[0]?.score || '-'}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">KPI Score</div>
            </div>
          </div>`;

code = code.replace(oldHeader, newHeader);
fs.writeFileSync('src/components/EmployeeDetailModal.tsx', code);
