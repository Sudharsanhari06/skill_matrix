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
    }
]