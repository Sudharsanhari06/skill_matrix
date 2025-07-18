import { EntitySchema } from "typeorm";

export const Employee = new EntitySchema({
    name: 'Employee',
    tableName: 'employees',
    columns: {
        employee_id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        employee_name: {
            type: 'varchar',
            nullable: false
        },
        email: {
            type: 'varchar',
            length: 255,
            unique: true,
            nullable: true
        },
        password: {
            type: 'varchar',
            nullable: true
        },
        role_id: {
            type: "int"
        },
        team_id: {
            type: "int",
            nullable: true
        },
        hr_id: {
            type: "int",
            nullable: true
        },
        desi_id: {
            type: "int",
            nullable: true
        },
        is_active: {
            type: "boolean",
            default: true,
        },
        created_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        }
    },
    relations: {
        role: {
            type: 'many-to-one',
            target: 'Role',
            joinColumn: { name: "role_id" },
            nullable: false
        },
        team: {
            type: 'many-to-one',
            target: 'Team',
            joinColumn: { name: "team_id" },
            nullable: true
        },
        lead_of: {
            type: "one-to-many",
            target: "Team",
            inverseSide: "lead"
        },
        hr: {
            type: "many-to-one",
            target: "Employee",
            joinColumn: { name: "hr_id" },
            nullable: true
        },
        designation: {
            type: "many-to-one",
            target: 'Designation',
            joinColumn: { name: 'desi_id' },
            nullable: true
        },
        skillMatrix: {
            type: "one-to-many",
            target: "SkillMatrix",
            inverseSide: "employee"
        }
    }
});
