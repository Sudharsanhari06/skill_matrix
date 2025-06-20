import * as skillService from '../services/skillService.js';

export const getAllCategories = async (request, h) => {
  try {
    const result = await skillService.getAllCategories();
    return h.response({ message: 'Successfully fetched all categories', result }).code(200);
  } catch (error) {
    console.error('Internal server error:', error);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

export const getSkillsByCategory = async (request, h) => {
  try {
    const { category_id } = request.params;
    const result = await skillService.getSkillsByCategory(category_id);
    return h.response({ message: 'Successfully fetched skills', result }).code(200);
  } catch (error) {
    console.error('Error fetching skills:', error);
    return h.response({ message: 'Failed to fetch skills for category' }).code(500);
  }
};

export const getSkillLevelsBySkill = async (request, h) => {
  try {
    const { skill_id } = request.params;
    const result = await skillService.getSkillLevelsBySkill(skill_id);
    return h.response({ message: 'Successfully fetched skill levels', result }).code(200);
  } catch (error) {
    console.error('Error fetching skill levels:', error);
    return h.response({ message: 'Failed to fetch skill levels' }).code(500);
  }
};
