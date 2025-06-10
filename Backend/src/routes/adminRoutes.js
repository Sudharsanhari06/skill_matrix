import * as adminController from '../controllers/adminController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

export const adminRouts = [
    {
        method: 'GET',
        path: '/teams',
        options: {
            pre: [
                { method: verifyToken }
            ]
        },
        handler:adminController.getAllTeams
    },
    //hr see the each team employee
    {
        method: 'GET',
        path: '/teams/{team_id}/employees',
        options: {
            pre: [
                { method: verifyToken }
            ]
        },
        handler: adminController.getAllEmployeeswithTeamId
    },
    
    {
        method: 'POST',
        path: '/assessments/initiate',
        options: {
            pre: [
                { method: verifyToken }
            ]
        },
        handler: adminController.initiateAssessmentCycle
    }
]