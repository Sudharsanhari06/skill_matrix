import { EntitySchema } from "typeorm";


export const Skill = new EntitySchema({
    name: "Skill",
    tableName: "skills",
    columns: {
        skill_id: {
            primary: true,
            type: "int", generated: true
        },
        skill_name: {
            type: "varchar",
            length: 100
        },
        category_id: {
            type: "int"
        },
        is_active: {
            type: "boolean",
            default: true
        },
        created_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP"
        }
    },
    relations: {
        category: {
            type: "many-to-one",
            target: "Category",
            joinColumn: { name: "category_id" },
            nullable: true
        },
        level_details: {
            type: "one-to-many",
            target: "SkillLevelDetailed",
            inverseSide: "skill", // refers to SkillLevelDetailed.relations.skill
            cascade: true // optional: allows you to insert/update skill levels with skill
        },
        skillMatrix: {
            type: "one-to-many",
            target: "SkillMatrix",
            inverseSide: "skill"
        }
    }
});
