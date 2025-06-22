import { EntitySchema } from 'typeorm';

export const Designation = new EntitySchema({
    name: 'Designation',
    tableName: 'designation',
    columns: {
        desi_id: {
            type: 'int',
            primary: true,
            generated: true
        },
        position: {
            type: 'varchar',
            nullable:false
        }
    }
});
