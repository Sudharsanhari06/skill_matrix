import { EntitySchema } from "typeorm";

export const SkillProgression = new EntitySchema({
  name: "SkillProgression",
  tableName: "skill_progressions",
  columns: {
    path_id: {
      primary: true,
      type: "int",
      generated: true
    },
    skill_id: {
      type: "int"
    },
    category_id: {
      type: "int"
    },
    from_level_id: {
      type: "int"

    },
    to_level_id: {
      type: "int"

    },
    guidance: {
      type: "text",
      nullable: true
    },
    resources_link: {
      type: "text", nullable: true
    }
  },
  relations: {
    skill: {
      type: "many-to-one", target: "Skill",
      joinColumn: { name: "skill_id" }
    },
    category: {
      type: "many-to-one",
      target: "Category",
      joinColumn: { name: "category_id" }
    }
  }
});