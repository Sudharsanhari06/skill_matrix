import * as employeeController from '../controllers/employeeController.js';
import { verifyToken,allowRoles } from '../middleware/authMiddleware.js';

export const employeeRoute=[
    {
        method:'POST',
        path:'/employee',
        options:{
            pre:[
                {method:verifyToken},
                {method:allowRoles('hr')}
            ]
    },
        handler:employeeController.addEmployee
    },{
        method:'GET',
        path:'/employees',
        options:{
            pre:[
                {method:verifyToken},
                {method:allowRoles('hr')}
            ]
        },
        handler:employeeController.getAllEmployees
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
      
    }
]