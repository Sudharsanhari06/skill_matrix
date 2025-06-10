import * as teamService from '../services/teamService.js';



export const getAllEmployeWithLeadId = async (request, h) => {
    try {
        const {employeeId} = request.params;
        const result = await teamService.getAllEmployeWithLeadId(employeeId);

        return h.response({ message: 'Successfully get the all employees with lead', result }).code(200)
    } catch (error) {
        console.error("Error fetching the employees", error);   
        return h.response({
            message: 'Internal server error', error
        })
    }
}