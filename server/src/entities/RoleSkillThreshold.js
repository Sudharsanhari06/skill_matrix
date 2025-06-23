import { EntitySchema } from 'typeorm';

export const RoleSkillThreshold = new EntitySchema({
  name: 'RoleSkillThreshold',
  tableName: 'role_skill_thresholds',
  columns: {
    rst_id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    skill_id:{
      type:'int'
    },
    desi_id:{
      type:'int'
    },
    score: {
      type: 'int',
      default: 0,
    }
  },
  relations: {
    skill: {
      type: 'many-to-one',
      target: 'Skill',
      joinColumn: { name: 'skill_id' },
      nullable: false,
    },
    designation: {
      type: 'many-to-one',
      target: 'Designation', 
      joinColumn: { name: 'desi_id' },
      nullable: false,
    },
  }
});