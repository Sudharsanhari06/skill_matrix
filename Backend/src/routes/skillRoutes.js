import * as skillController from '../controllers/skillController';
import { verifyToken } from '../middleware/authMiddleware';

export const skillRoutes = [
    {
        method: 'GET',
        path: '/categories',
        options: {
            pre: [
                { method: verifyToken }
            ]
        },
        handler: skillController.getAllCategories
    }
    ,
    {
        method: 'GET',
        path: '/skills/category/{category_id}',
        options: {
            pre: [
                { method: verifyToken }
            ]
        },
        handler: skillController.getSkillsByCategory
    },
    {
        method: 'GET',
        path: '/skill-levels/{skill_id}',
        options: {
            pre: [
                { method: verifyToken }
            ]
        },
        handler: skillController.getSkillLevelsBySkill
    }
]

