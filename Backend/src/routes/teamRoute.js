import * as teamController from '../controllers/teamController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

export const teamRoutes=[
    {
        method:'GET',
        path:'/teams',
        options:{
            pre:[
                {method:verifyToken}
            ]
        },
        handler:teamController.getAllTeams
    },{
       method:'GET',
       path:'/teams/{team_id}/employees',
       options:{
        pre:[
            {method:verifyToken}
        ]
       } ,
       handler:teamController.getAllEmployeeswithTeamId

    }
]


