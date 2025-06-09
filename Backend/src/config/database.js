import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
dotenv.config();
// import { Employee } from '../entities/Employee.js'; 
// // import { Role } from '../entities/Role.js';
// // import { Assessment } from '../entities/Assessment.js';
// // import { Category } from '../entities/Category.js';
// // import { EmployeeCategoryAssociation } from '../entities/EmployeeCategoryAssociation';
// // import { RoleSkillThreshold } from '../entities/RoleSkillThreshold.js';
// // import { Skill } from '../entities/Skill.js';
// // import { SkillLevelDetailed } from '../entities/SkillLevelDetailed.js';
// // import




export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // use false in production
  logging: false,
  entities: [`src/entities/*.js`]
});