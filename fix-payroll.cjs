const fs = require('fs');
let content = fs.readFileSync('src/components/HRView.tsx', 'utf8');

// remove all fragments ends globally
content = content.replace(/\s*<\/>\n  \);\n\}/g, "\n  );\n}");

// Add correctly to EmployeeDirectoryTab
const correctEnd = `            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
}`;
content = content.replace(`            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function useAttendance`, correctEnd + "\n\nfunction useAttendance"); // Wait, useAttendance is before it? No, EmployeeDirectoryTab is the last tab.

fs.writeFileSync('src/components/HRView.tsx', content);
