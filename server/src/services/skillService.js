import { AppDataSource } from '../config/database.js';
import { Category } from '../entities/Category.js';
import { Skill } from '../entities/Skill.js';
import { SkillLevelDetailed } from '../entities/SkillLevelDetailed.js';

const categoryRepo = AppDataSource.getRepository(Category);
const skillRepo = AppDataSource.getRepository(Skill);
const skillLevelRepo = AppDataSource.getRepository(SkillLevelDetailed);

export const getAllCategories = async () => {
    return await categoryRepo.find();
};


export const getSkillsByCategory = async (category_id) => {
    return await skillRepo.find({
        where: { category: { category_id: parseInt(category_id) } },
        relations: ['category']
    });
};


export const getSkillLevelsBySkill = async (skill_id) => {
    return await skillLevelRepo.find({
        where: { skill: { skill_id: parseInt(skill_id) } },
        order: { level_number: 'ASC' },
        relations: ['skill']
    });
};

