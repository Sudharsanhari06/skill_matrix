import * as leadController from '../controllers/leadController.js';
import { verifyToken, allowRoles } from '../middleware/authMiddleware.js';

export const leadRoutes = [

    {
        method: 'GET',
        path: '/employees/lead',
        options: {
            pre: [
                { method: verifyToken },
                { method: allowRoles('lead') }
            ]
        },
        handler: leadController.getAllEmployeWithLeadId
    },
    //lead see the skill matrix request each employee
    {
        method: 'GET',
        path: '/lead/skill-matrix-view/employee-update',
        options: {
            pre: [
                { method: verifyToken }
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
    },
    //lead view the team skill matrix
    {
        method: 'GET',
        path: '/lead/team-skill-matrix',
        options: {
            pre: [
                { method: verifyToken },
                { method: allowRoles('lead') }
            ]
        },
        handler: leadController.getTeamSkillMatrix

    }

]


