import { EntitySchema } from "typeorm";

export const SkillLevelDetailed = new EntitySchema({
    
    name: "SkillLevelDetailed",
    tableName: "skill_levels_detailed",
    columns: {
        level_id: {
            primary: true,
            type: "int",
            generated: true
        },
        skill_id: {
            type: "int"
        },
        level_number: {
            type: "int"
        },
        description: {
            type: "text",
            nullable: true
        }
    },
    relations: {
        skill: {
            type: "many-to-one",
            target: "Skill",
            joinColumn: { name: "skill_id" }
        }
    },
    uniques: [{ columns: ["skill_id", "level_number"] }]
});
