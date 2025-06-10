import { AppDataSource } from '../config/database.js';
import { Employee } from '../entities/Employee.js';
import { Assessment } from '../entities/Assessment.js';
import { SkillMatrix } from '../entities/SkillMatrix.js';
import { EmployeeCategoryAssociation } from '../entities/EmployeeCategoryAssociation.js';
import { Skill } from '../entities/Skill.js';
import { Not } from 'typeorm';
import { Team } from "../entities/Team.js";



const teamRepo = AppDataSource.getRepository(Team);
const employeeRepo = AppDataSource.getRepository(Employee);
const categoryAssociationRepo = AppDataSource.getRepository(EmployeeCategoryAssociation);
const skillMatrixRepo = AppDataSource.getRepository(SkillMatrix);
const assessmentRepo = AppDataSource.getRepository(Assessment);
const skillRepo = AppDataSource.getRepository(Skill);


export const getAllTeams = async () => {
    return await teamRepo.find({
        relations: ['lead']
    });
}

export const getAllEmployeeswithTeamId=async(teamId)=>{
    const employees = await employeeRepo.find({
        where: {
          team: { team_id: teamId },
          is_active: true
        },
        relations: ['team', 'role']
      })
      return employees;
}


export const initiateAssessmentCycle = async (quarter, year) => {
    const employees = await employeeRepo.find({
        relations: ['role'],
        where: {
            role: { role_name: Not('hr') }
        }
    });

    const assessments = [];
    for (const employee of employees) {
        const existing = await assessmentRepo.findOne({
            where: {
                employee: { employee_id: employee.employee_id },
                quarter,
                year
            }
        });
        if (existing) continue;

        const assessment = assessmentRepo.create({
            employee,
            quarter,
            year,
            status: 0
        });

        const savedAssessment = await assessmentRepo.save(assessment);
        assessments.push(savedAssessment);

        const categories = await categoryAssociationRepo.find({
            where: { employee: { employee_id: employee.employee_id } },
            relations: ['category']
        });

        for (const cat of categories) {
            const skills = await skillRepo.find({
                where: { category: { category_id: cat.category.category_id } },
                relations: ['category']
            });

            for (const skill of skills) {
                await skillMatrixRepo.save({
                    employee,
                    assessment: savedAssessment,
                    skill,
                    employee_rating: null,
                    lead_rating: null,
                    lead_comments: null,
                    hr_approve: false,
                    hr_comments: null
                });
            }
        }
    }

    return assessments;
};
