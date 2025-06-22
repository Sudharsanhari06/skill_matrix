import { AppDataSource } from "../config/database.js";
import { Team } from "../entities/Team.js";
import { Assessment } from '../entities/Assessment.js';
import { SkillMatrix } from "../entities/SkillMatrix.js";
import { In } from 'typeorm'
// import { Designation } from "../entities/Designation.js";
// import { Skill } from "../entities/Skill.js";
// import { SkillLevelDetailed } from "../entities/SkillLevelDetailed.js";
// import { Employee } from "../entities/Employee.js";




const teamRepo = AppDataSource.getRepository(Team);
const assessmentRepo = AppDataSource.getRepository(Assessment);
const skillMatrixRepo = AppDataSource.getRepository(SkillMatrix);

export const getAllEmployeWithLeadId = async (employeeId) => {
    const result = await teamRepo.find({
        where: {
            lead: { employee_id: employeeId }
        },
        relations: ['members',]
    })
    // const allMembers=result.flatMap(team=>team.members)
    return result;
}

export const getSkillMatrixForLeadReview = async () => {

    const results = await assessmentRepo.find({
        where: { status: 1 },
        relations: ['employee', 'skillMatrix', 'skillMatrix.skill']
    });
    console.log("results", results);

    return results.map(assessment => ({
        assessment_id: assessment.assessment_id,
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


export const updateLeadSkillRatings = async (assessment_id, lead_comments, ratings) => {
    console.log("assessment_id, lead_comments, ratings", assessment_id, lead_comments, ratings)
    const assessment = await assessmentRepo.findOneBy({ assessment_id });

    if (!assessment) {
        throw new Error('Assessment not found');
    }

    // Update each skill matrix record
    for (const rating of ratings) {
        await skillMatrixRepo.update(
            {
                assessment: { assessment_id },
                skill: { skill_id: rating.skill_id }
            },
            {
                lead_rating: rating.lead_rating,
            }
        );
    }

    await assessmentRepo.update(
        { assessment_id },
        {
            lead_comments,
            status: 2
        }
    );

    return { success: true };
};



export const getTeamSkillMatrix = async (leadId) => {
    const team = await teamRepo.findOne({
        where: {
            lead: { employee_id: leadId }
        },
        relations: ['members']
    });

    if (!team) return [];

    const employeeIds = team.members.map(emp => emp.employee_id);

    const skillMatrixData = await skillMatrixRepo.find({
        where: {
            employee: In(employeeIds)
        },
        relations: ['employee', 'skill', 'skill.category', 'assessment','employee.designation']
    });
    console.log("skillMatrixData", skillMatrixData);

    return skillMatrixData.map(entry => ({
        employee_id: entry.employee.employee_id,
        employee_name: entry.employee.employee_name,
        skill_name: entry.skill.skill_name,
        designation:entry.employee.designation?.position||'N/A',
        category: entry.skill.category?.category_name || 'N/A',
        employee_rating: entry.employee_rating,
        lead_rating: entry.lead_rating
    }));
};
