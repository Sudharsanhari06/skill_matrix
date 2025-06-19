import { AppDataSource } from "../config/database.js";
import bcrypt from 'bcrypt';

import { Employee } from "../entities/Employee.js";
import { EmployeeCategoryAssociation } from "../entities/EmployeeCategoryAssociation.js";
import { Assessment } from '../entities/Assessment.js';
import { SkillMatrix } from '../entities/SkillMatrix.js';
import { Role } from '../entities/Role.js'
import { Category } from '../entities/Category.js';
import { Team } from "../entities/Team.js";


const assessmentRepo = AppDataSource.getRepository(Assessment);
const roleRepo = AppDataSource.getRepository(Role)

const skillMatrixRepo = AppDataSource.getRepository(SkillMatrix);

const employeeRepo = AppDataSource.getRepository(Employee);
const teamRepo = AppDataSource.getRepository(Team);


const categoryAssociationRepo = AppDataSource.getRepository(EmployeeCategoryAssociation);

const categoryRepo = AppDataSource.getRepository(Category);



export const addEmployee = async (employee_name, email, password, role_id, team_id, hr_id, categories) => {
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
            status: 0,
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
    return skillMatrix;
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
            },
            {
                employee_rating: rating.employee_rating
            }
        );
    }

    assessment.status = 1;
    await assessmentRepo.save(assessment);

    return { message: 'Employee skill ratings submitted successfully' };
};
