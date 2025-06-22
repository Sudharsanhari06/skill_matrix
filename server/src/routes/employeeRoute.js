import * as employeeController from '../controllers/employeeController.js';
import { verifyToken, allowRoles } from '../middleware/authMiddleware.js';

export const employeeRoute = [
    {
        method: 'POST',
        path: '/employee',
        options: {
            pre: [
                { method: verifyToken },
                { method: allowRoles('hr') }
            ]
        },
        handler: employeeController.addEmployee
    },
    {
        method: 'GET',
        path: '/roles',
        handler: employeeController.getAllRoles
    },
    {
        method: 'GET',
        path: '/categories',
        handler: employeeController.getAllCategory
    },
    {
        method: 'GET',
        path: '/teams-name',
        handler: employeeController.getAllTeamsNames
    },
    {
        method: 'GET',
        path: '/hr-names',
        handler: employeeController.getAllHrNames
    },
    {
        method: 'GET',
        path: '/employees',
        options: {
            pre: [
                { method: verifyToken },
                { method: allowRoles('hr') }
            ]
        },
        handler: employeeController.getAllEmployees
    },
    // to view the skill matrix for emploee
    {
        method: 'GET',
        path: '/employee/skills/view',
        options: {
            pre: [{ method: verifyToken }]
        },
        handler: employeeController.getCurrentSkillMatrixByEmployeeId

    }, // to submit the skill matrix employee id
    {
        method: 'POST',
        path: '/employee/skills/rate',
        options: {
            pre: [{ method: verifyToken }]
        },
        handler: employeeController.submitEmployeeSkillRatings
    }, {
        method: 'GET',
        path: '/employee/skill-matrix/view',
        options: {
            pre: [
                { method: verifyToken }
            ]
        },
        handler: employeeController.viewOwnSkillMatrix
    },
    {
        method: 'GET',
        path: '/gap-analysis',
        options: {
            pre: [
                { method: verifyToken }
            ]
        },
        handler: employeeController.getGapAnalysis
    }
]