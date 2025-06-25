import { AppDataSource } from '../config/database.js';
import { Employee } from '../entities/Employee.js';
import { Assessment } from '../entities/Assessment.js';
import { SkillMatrix } from '../entities/SkillMatrix.js';
import { EmployeeCategoryAssociation } from '../entities/EmployeeCategoryAssociation.js';
import { Skill } from '../entities/Skill.js';
import { Not ,Like} from 'typeorm';
import { Team } from "../entities/Team.js";


const teamRepo = AppDataSource.getRepository(Team);
const employeeRepo = AppDataSource.getRepository(Employee);
const categoryAssociationRepo = AppDataSource.getRepository(EmployeeCategoryAssociation);
const skillMatrixRepo = AppDataSource.getRepository(SkillMatrix);
const assessmentRepo = AppDataSource.getRepository(Assessment);
const skillRepo = AppDataSource.getRepository(Skill);


export const getAllTeams = async () => {
    return await teamRepo.find({
        relations: ['lead', 'members', 'members.role']
    });
}

export const getAllEmployeeswithTeamId = async (teamId) => {
    const employees = await employeeRepo.find({
        where: {
            team: {team_id: teamId },
            is_active: true
        },
        relations: ['team', 'role','team.lead']
    })
    return employees;
}

export const initiateAssessmentCycle = async (quarter, year) => {
    const existingAssessments = await assessmentRepo.find({
        where: { quarter, year }
    });
    if (existingAssessments.length > 0) {
        throw new Error(`Assessment cycle for Q${quarter}, ${year} already exists.`);
    }

    const employees = await employeeRepo.find({
        relations: ['role'],
        where: {
            role: { role_name: Not('hr') }
        }
    });
    console.log("without hrs", employees);

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

export const getSkillMatrixForHrReview = async (hrId) => {
    const results = await assessmentRepo.find({
        where: {
            status: 2,
            employee:{
                hr_id:hrId 
            }
        },
        relations: ['employee', 'skillMatrix', 'skillMatrix.skill']
    });
    console.log("results", results);

    return results.map(assessment => ({
        assessment_id: assessment.assessment_id,
        lead_comments: assessment.lead_comments,
        employee: {
            id: assessment.employee.employee_id,
            name: assessment.employee.employee_name
        },
        skills: assessment.skillMatrix.map(skillEntry => ({
            skill_id: skillEntry.skill.skill_id,
            skill_name: skillEntry.skill.skill_name,
            employee_rating: skillEntry.employee_rating,
            lead_rating: skillEntry.lead_rating
        }))
    }));
};





export const skillMatrixApproveHr = async (assessment_id, hr_id, status, hr_comments,) => {
    if (![3, 4].includes(status)) {
        throw new Error('Invalid status. Must be 3 (approved) or 4 (rejected)');
    }
    const existing = await assessmentRepo.findOne({
        where: { assessment_id, status: 2 },
        relations: ['employee']
    });

    if (!existing) throw new Error('Assessment not found');
    if (existing.employee.hr_id !== hr_id) throw new Error('Unauthorized');

    await assessmentRepo.update(
        { assessment_id },
        {
            status,
            hr_comments
        }
    );

    return { success: true };
};

export const getSkillMatrixById = async (assessment_id, hr_id) => {
    const assessment = await assessmentRepo.findOne({
        where: {
            assessment_id,
            status: 2
        },
        relations: ['employee', 'skillMatrix', 'skillMatrix.skill']
    });

    if (!assessment) {
        throw new Error('Assessment not found or not in review stage');
    }

    if (assessment.employee.hr_id !== hr_id) {
        throw new Error('Unauthorized to view this assessment');
    }

    return {
        assessment_id: assessment.assessment_id,
        lead_comments: assessment.lead_comments,
        hr_comments: assessment.hr_comments,
        employee: {
            id: assessment.employee.employee_id,
            name: assessment.employee.employee_name
        },
        skills: assessment.skillMatrix.map(skill => ({
            skill_id: skill.skill.skill_id,
            skill_name: skill.skill.skill_name,
            employee_rating: skill.employee_rating,
            lead_rating: skill.lead_rating
        }))
    };
};


export const getEmployeeByName=async(name)=>{ 
    const employees = await employeeRepo.find({
        where: {
          employee_name:Like(`%${name}%`) 
        },
        relations: ['team', 'role']
      });
      return employees;
}