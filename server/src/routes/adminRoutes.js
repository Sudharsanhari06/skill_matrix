import * as adminController from '../controllers/adminController.js';
import { verifyToken, allowRoles } from '../middleware/authMiddleware.js';

export const adminRouts = [
    {
        method: 'GET',
        path: '/teams',
        options: {
            pre: [
                { method: verifyToken },
                { method: allowRoles('hr') }
            ]
        },
        handler: adminController.getAllTeams
    },

    //hr see the each team employee
    {
        method: 'GET',
        path: '/teams/{team_id}/employees',
        options: {
            pre: [
                { method: verifyToken },
                { method: allowRoles('hr')}
            ]
        },
        handler: adminController.getAllEmployeeswithTeamId
    },

    {
        method: 'POST',
        path: '/assessments/initiate',
        options: {
            pre: [
                { method: verifyToken },
                { method: allowRoles('hr') }
            ]
        },
        handler: adminController.initiateAssessmentCycle
    }
    // to view the skill matrix hr
    , {
        method: 'GET',
        path: '/hr/skill-matrix-view/employee-lead-update',
        options: {
            pre: [{ method: verifyToken },
            { method: allowRoles('hr') }
            ]
        },
        handler: adminController.getSkillMatrixForHrReview
    },
    {
        method: 'PUT',
        path: '/hr/skill-matrix-view/{assessment_id}/decision',
        options: {
            pre: [
                { method: verifyToken },
                { method: allowRoles('hr') }
            ]
        },
        handler: adminController.skillMatrixApproveHr
    },
    // get sillmatrix by assessment ID
    {
        method:'GET',
        path:'/hr/skill-matrix-view/{assessment_id}',
        options:{
            pre:[
                {method:verifyToken},
                {method:allowRoles('hr')}
            ]
        },
        handler:adminController.getSkillMatrixById
    }

]