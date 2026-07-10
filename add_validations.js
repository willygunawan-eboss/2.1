import fs from 'fs';
let valCode = fs.readFileSync('src/validations.ts', 'utf8');

const referenceValidations = `
export const referenceGroupSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  sortOrder: z.number().int().default(0),
  isSystem: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const referenceValueSchema = z.object({
  id: z.string().optional(),
  groupId: z.string().min(1, "Group is required"),
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  sortOrder: z.number().int().default(0),
  metadata: z.string().nullable().optional(),
  isDefault: z.boolean().default(false),
  isSystem: z.boolean().default(false),
  isActive: z.boolean().default(true),
});
`;

valCode = valCode + "\\n" + referenceValidations;

fs.writeFileSync('src/validations.ts', valCode);
