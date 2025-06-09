import { EntitySchema } from "typeorm";


export const SkillMatrix = new EntitySchema({
    name: "SkillMatrix",
    tableName: "skill_matrix",
    columns: {
        skill_matrix_id: {
            primary: true,
            type: "int",
            generated: true
        },
        employee_id: {
            type: "int"
        },
        assessment_id: {
            type: "int"
        },
        skill_id: {
            type: "int"
        },
        employee_rating: {
            type: "int",
            nullable: true
        },
        lead_rating: {
            type: "int",
            nullable: true
        },
        lead_comments: {
            type: "text",
            nullable: true
        },
        hr_approve: {
            type: "boolean",
            default: false
        },
        hr_comments: {
            type: "text",
            nullable: true
        },
        created_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP"
        }
    },
    relations: {
        employee: {
            type: "many-to-one",
            target: "Employee",
            joinColumn: { name: "employee_id" }
        },
        assessment: {
            type: "many-to-one",
            target: "Assessment",
            joinColumn: { name: "assessment_id" }
        },
        skill: {
            type: "many-to-one",
            target: "Skill",
            joinColumn: { name: "skill_id" }
        }
    },
    uniques: [{ columns: ["assessment_id", "skill_id"] }]
});