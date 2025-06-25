import { AppDataSource } from "../config/database.js";
import bcrypt from 'bcrypt';

import { Employee } from "../entities/Employee.js";
import { EmployeeCategoryAssociation } from "../entities/EmployeeCategoryAssociation.js";
import { Assessment } from '../entities/Assessment.js';
import { SkillMatrix } from '../entities/SkillMatrix.js';
import { Role } from '../entities/Role.js'
import { Category } from '../entities/Category.js';
import { Team } from "../entities/Team.js";
import { RoleSkillThreshold } from '../entities/RoleSkillThreshold.js';
import { SkillProgression } from '../entities/SkillProgression.js';
import { Designation } from '../entities/Designation.js'

const thresholdRepo = AppDataSource.getRepository(RoleSkillThreshold);
const progressionRepo = AppDataSource.getRepository(SkillProgression);
const assessmentRepo = AppDataSource.getRepository(Assessment);
const roleRepo = AppDataSource.getRepository(Role)

const skillMatrixRepo = AppDataSource.getRepository(SkillMatrix);

const employeeRepo = AppDataSource.getRepository(Employee);
const teamRepo = AppDataSource.getRepository(Team);
const designationRepo = AppDataSource.getRepository(Designation);

const categoryAssociationRepo = AppDataSource.getRepository(EmployeeCategoryAssociation);

const categoryRepo = AppDataSource.getRepository(Category);



export const addEmployee = async (employee_name, email, password, role_id, team_id, hr_id, desi_id,categories) => {
    console.log("email", email);

    const existingEmployee = await employeeRepo.findOneBy({ email });
    if (existingEmployee) {
        throw new Error('Email already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const employee = employeeRepo.create({
        employee_name,
        email,
        password: hashedPassword,
        role_id,
        team_id,
        hr_id,
        desi_id,
        is_active: true
    })

    const result = await employeeRepo.save(employee);

    const association = categories.map(cat => categoryAssociationRepo.create({
        employee: { employee_id: result.employee_id },
        category: { category_id: cat.category_id },
        is_primary: cat.is_primary,
    }));
    await categoryAssociationRepo.save(association);
    return result;
}


export const getAllEmployees = async () => {
    return await employeeRepo.find({
        relations: ['role', 'team'],
        where: { is_active: true },
        order: { employee_id: 'DESC' },
    });
}

export const getAllRoles = async () => {
    return roleRepo.find();
}

export const getAllCategory = async () => {
    return await categoryRepo.find();
}

export const getAllTeamsNames = async () => {
    return await teamRepo.find();
}

export const getAllHrNames = async () => {
    const result = await employeeRepo.find({
        where: { role_id: 2 },
    })
    return result;
}
export const getAllDesignations = async () => {
    return await designationRepo.find();
}


const getCurrentQuarter = () => {
    const month = new Date().getMonth() + 1;
    return Math.floor((month - 1) / 3) + 1
};


export const getCurrentSkillMatrixByEmployeeId = async (employeeId) => {
    const year = new Date().getFullYear();
    const quarter = getCurrentQuarter();

    const assessment = await assessmentRepo.findOne({
        where: {
            employee: {
                employee_id: employeeId
            },
            // status: 0,
            year,
            quarter
        }
    });

    if (!assessment) {
        throw new Error('Assessment not found for this quarter and year');
    }

    const skillMatrix = await skillMatrixRepo.find({
        where: {
            employee: { employee_id: employeeId },
            assessment: { assessment_id: assessment.assessment_id }
        },
        relations: ['skill', 'skill.level_details']
    });
    return {
        status: assessment.status, 
        skills: skillMatrix
    };;
};


export const submitEmployeeSkillRatings = async (employeeId, ratings) => {
    const year = new Date().getFullYear();
    const quarter = getCurrentQuarter();
    const assessment = await assessmentRepo.findOne({
        where: {
            employee: { employee_id: employeeId },
            year,
            quarter
        }
    });

    if (!assessment) {
        throw new Error('Assessment not initiated for this employee');
    }

    for (const rating of ratings) {
        await skillMatrixRepo.update(
            {
                employee: { employee_id: employeeId },
                assessment: { assessment_id: assessment.assessment_id },
                skill: { skill_id: rating.skill_id }
            },{
                employee_rating: rating.employee_rating
            }
        );
    }
    assessment.status = 1;
    await assessmentRepo.save(assessment);
    return { message: 'Employee skill ratings submitted successfully' };
};


export const viewOwnSkillMatrix = async (employee_id) => {
    const assessment = await assessmentRepo.findOne({
        where: {
            employee: { employee_id },
            status: 3
        },
        order: { assessment_id: 'DESC' },
        relations: ['skillMatrix', 'skillMatrix.skill']
    });

    if (!assessment) {
        throw new Error('No approved skill matrix found');
    }

    return {
        assessment_id: assessment.assessment_id,
        status: assessment.status,
        lead_comments: assessment.lead_comments,
        hr_comments: assessment.hr_comments,
        skills: assessment.skillMatrix.map(skillEntry => ({
            skill_id: skillEntry.skill.skill_id,
            skill_name: skillEntry.skill.skill_name,
            employee_rating: skillEntry.employee_rating,
            lead_rating: skillEntry.lead_rating
        }))
    };
};




export const getGapAnalysis = async (employee_id) => {
    const employee = await employeeRepo.findOne({
        where: { employee_id }
    });

    if (!employee) return [];

    const skillMatrix = await skillMatrixRepo.find({
        where: { employee: { employee_id } },
        relations: ['employee', 'skill']
    });

    const thresholds = await thresholdRepo.find({
        where: { desi_id: employee.desi_id }
    });

    const progressions = await progressionRepo.find();

    const result = [];

    for (const skillEntry of skillMatrix) {
        const skill = skillEntry.skill;
        const currentLevel = skillEntry.lead_rating ?? skillEntry.employee_rating;

        if (currentLevel === null || currentLevel === undefined) continue;

        const threshold = thresholds.find(
            (t) => t.skill_id === skill.skill_id
        );

        if (!threshold) continue;

        const expectedLevel = threshold.score;

        const toExpected = progressions.find(
            (p) =>
                p.skill_id === skill.skill_id &&
                p.from_level_id === currentLevel &&
                p.to_level_id === expectedLevel
        );

  
        const nextLevel = expectedLevel + 1;
        const toNext = progressions.find(
            (p) =>
                p.skill_id === skill.skill_id &&
                p.from_level_id === expectedLevel &&
                p.to_level_id === nextLevel
        );

        result.push({
            employee_id: employee.employee_id,
            employee_name: employee.employee_name,
            skill_id: skill.skill_id,
            skill_name: skill.skill_name,
            current_level: currentLevel,
            expected_level: expectedLevel,
            guidance_to_expected: toExpected?.guidance || 'No guidance available',
            resource_to_expected: toExpected?.resources_link || 'No resource available',
            next_level: toNext ? nextLevel : null,
            guidance_to_next: toNext?.guidance || 'No guidance available',
            resource_to_next: toNext?.resources_link || 'No resource available',
        });
    }

    return result;
};
