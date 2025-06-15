import { EntitySchema } from "typeorm";

export const Role = new EntitySchema({
  name: "Role",
  tableName: "roles",
  columns: {
    role_id: { primary: true, type: "int", generated: true },
    role_name: { type: "varchar", length: 100 }
  }
});