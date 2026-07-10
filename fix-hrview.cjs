const fs = require('fs');
let content = fs.readFileSync('src/components/HRView.tsx', 'utf8');

// remove all fragments ends that I wrongly added
content = content.replace(/    \n    <\/>/g, '');
content = content.replace(/    <\/>\n  \);\n\}/g, '  );\n}');

// Specifically for EmployeeDirectoryTab
const correctEnd = `      </div>
    </div>
    </>
  );
}`;

content = content.replace(`        </div>
      </div>
    </div>
  );
}`, `        </div>
      </div>
    </div>
    </>
  );
}`);

fs.writeFileSync('src/components/HRView.tsx', content);
