import { EntitySchema } from "typeorm";


export const Category = new EntitySchema({
  name: "Category",
  tableName: "categories",
  columns: {
    category_id: {
      primary: true,
      type: "int",
      generated: true
    },
    category_name: {
      type: "varchar",
      length: 100
    }
  },
  relations: {
    skills: {
      type: "one-to-many",
      target: "Skill",
      inverseSide: "category"
    }
  }
});