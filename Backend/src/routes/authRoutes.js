import * as authController from '../controllers/authController.js'
import { verifyToken } from '../middleware/authMiddleware.js';


export const authRoutes = [
    // done
    {
        method: 'POST',
        path: '/api/login',
        handler: authController.login
    }
    ,{
        method: 'PUT',
        path: '/employee/change-password',
        options: {
            pre: [{
                method: verifyToken
            }],
            handler: authController.changePassword
        }
    }
]











