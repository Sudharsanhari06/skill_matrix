import { EntitySchema } from "typeorm";

export const Team = new EntitySchema({
    name: "Team",
    tableName: "teams",
    columns: {
        team_id: {
            primary: true,
            type: "int",
            generated: true
        },
        team_name: {
            type: "varchar",
            length: 100
        },
        lead_id: {
            type: "int",
            nullable: true
        },
        created_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP"
        }
    },
    relations: {
        lead: {
            type: "many-to-one",
            target: "Employee",
            joinColumn: { name: "lead_id" }
        }
    }
});