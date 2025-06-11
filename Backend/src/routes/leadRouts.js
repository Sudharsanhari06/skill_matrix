import * as leadController from '../controllers/leadController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

export const leadRoutes = [

    {
        method: 'GET',
        path: '/employees/lead/{employeeId}',
        options: {
            pre: [
                { method: verifyToken }
            ]
        },
        handler: leadController.getAllEmployeWithLeadId
    },
    //lead see the skill matrix request
    {
        method: 'GET',
        path: '/lead/skill-matrix-view/employee-update',
        options: {
            pre: [{ method: verifyToken }

            ]
        },
        handler: leadController.getSkillMatrixForLeadReview
    },
    {
        method: 'POST',
        path: '/lead/submit-skill-review',
        options: {
            pre: [{ method: verifyToken }]
        },
        handler: leadController.submitLeadSkillRatings
    }

]


