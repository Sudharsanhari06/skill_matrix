import * as teamController from '../controllers/teamController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

export const teamRoutes = [

    {
        method: 'GET',
        path: '/employees/lead/{employeeId}',
        options: {
            pre: [
                { method: verifyToken }
            ]
        },
        handler: teamController.getAllEmployeWithLeadId   
    }
]


