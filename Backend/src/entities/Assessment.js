import { EntitySchema } from "typeorm";

export const Assessment = new EntitySchema({
    name: "Assessment",
    tableName: "assessments",
    columns: {
        assessment_id: {
            primary: true,
            type: "int",
            generated: true
        },
        employee_id: {
            type: "int"
        },
        quarter: {
            type: "int"
        },
        year: {
            type: "int"
        },
        status: {
            type: "int"
        },
        lead_comments: {
            type: "text",
            nullable: true
        },
        hr_approve: {
            type: "boolean",
            default: false
        },
        is_active: {
            type: "boolean",
            default: true
        },
        initiated_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP"
        },
        updated_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP"
        }
    },
    relations: {
        employee: {
            type: "many-to-one",
            target: "Employee",
            joinColumn: { name: "employee_id" }
        },
        skillMatrix: {
            type: "one-to-many",
            target: "SkillMatrix",
            inverseSide: "assessment",
            cascade: true
        }
    },
    uniques: [{
        columns: ["employee_id",
            "quarter",
            "year"]
    }]
});
