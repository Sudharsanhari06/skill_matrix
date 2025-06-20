import * as skillController from '../controllers/skillController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

export const skillRoutes = [

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

