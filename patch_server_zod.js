import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

const postNewOld = `  const createPostRoute = (path: string, table: any, moduleName?: string) => {
    const middleware = moduleName ? requirePermission(moduleName, 'write') : (req, res, next) => next();
    app.post(path, middleware, async (req, res) => {
      try {
        const id = req.body.id || 'ID-' + crypto.randomUUID();
        await db.insert(table).values({ id, ...req.body });
        res.json({ success: true, message: 'Record created successfully', data: { id } });
      } catch (e) {
        res.status(500).json({ success: false, message: 'Failed to create record', errors: String(e) });
      }
    });
  };`;

const postNewZod = `  const createPostRoute = (path: string, table: any, moduleName?: string, zodSchema?: any) => {
    const middleware = moduleName ? requirePermission(moduleName, 'write') : (req, res, next) => next();
    app.post(path, middleware, async (req, res) => {
      try {
        const id = req.body.id || 'ID-' + crypto.randomUUID();
        let dataToInsert = { ...req.body };
        
        if (zodSchema) {
          try {
            dataToInsert = zodSchema.parse(req.body);
          } catch (validationError: any) {
            return res.status(400).json({ success: false, message: 'Validation Error', errors: validationError.issues });
          }
        }
        
        await db.insert(table).values({ id, ...dataToInsert });
        res.json({ success: true, message: 'Record created successfully', data: { id } });
      } catch (e) {
        res.status(500).json({ success: false, message: 'Failed to create record', errors: String(e) });
      }
    });
  };`;

code = code.replace(postNewOld, postNewZod);
fs.writeFileSync('server.ts', code);
