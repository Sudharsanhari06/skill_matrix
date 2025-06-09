import { EntitySchema } from "typeorm";


export const EmployeeCategoryAssociation = new EntitySchema({
    name: "EmployeeCategoryAssociation",
    tableName: "employee_category_associations",
    columns: {
      employee_id: { type: "int", primary: true },
      category_id: { type: "int", primary: true },
      is_primary: { type: "boolean", default: false }
    },
    relations: {
      employee: { type: "many-to-one", target: "Employee", joinColumn: { name: "employee_id" } },
      category: { type: "many-to-one", target: "Category", joinColumn: { name: "category_id" } }
    }
  });