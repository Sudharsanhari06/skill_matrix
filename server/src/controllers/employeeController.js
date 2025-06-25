import * as emploeeService from '../services/employeeService.js';

export const addEmployee = async (request, h) => {
    const { employee_name, email, password, role_id, team_id, hr_id, desi_id,categories } = request.payload;

    try {
        const result = emploeeService.addEmployee(employee_name, email, password, role_id, team_id, hr_id,desi_id,categories);

        return h.response({ message: 'Successfully added the employee', employee_id: result.employee_id }).code(200);

    } catch (error) {
        if (error.message === 'Email already exists') {
            return h.response({ message: error.message }).code(400);
        } else {
            return h.response({ message: "Internal server Error", error }).code(500)

        }
    }

}

export const getAllRoles = async (request, h) => {
    try {
        const result = await emploeeService.getAllRoles();
        return h.response({ message: 'Successfully get the Roles', result }).code(200)
    } catch (error) {
        console.error("Internal server error", error);
        return h.response({ message: 'Internal server error' }).code(500);
    }
}

export const getAllCategory = async (request, h) => {
    try {
        const result = await emploeeService.getAllCategory();
        return h.response({ message: 'Successfully get the Roles', result }).code(200)
    } catch (error) {
        console.error("Internal server error", error);
        return h.response({ message: 'Internal server error' }).code(500);
    }
}

export const getAllTeamsNames = async (request, h) => {
    try {
        const result = await emploeeService.getAllTeamsNames();
        return h.response({ message: 'Successfully get the Roles', result }).code(200)
    } catch (error) {
        console.error("Internal server error", error);
        return h.response({ message: 'Internal server error' }).code(500);
    }
}

export const getAllHrNames = async (request, h) => {

    try {
        const result = await emploeeService.getAllHrNames();
        return h.response({ message: 'Successfully get the Roles', result }).code(200);
    } catch (error) {
        console.error("Internal server error", error);
        return h.response({ message: 'Internal server error' }).code(500);
    }
}

export const getAllDesignations = async (request, h) => {
    try {
        const result = await emploeeService.getAllDesignations();
        return h.response({ message: 'Successfully get the Designations', result }).code(200);
    } catch (error) {
        console.error("Internal server error", error);
        return h.response({ message: 'Internal server error' }).code(500);
    }
}


export const getAllEmployees = async (request, h) => {
    try {
        const result = await emploeeService.getAllEmployees();
        return h.response({ message: "Successfully get All employees", result }).code(200)

    } catch (error) {
        return h.response({ message: 'Internal Server Error', error }).code(500)
    }
}




export const getCurrentSkillMatrixByEmployeeId = async (request, h) => {
    try {
        const { employee_id } = request.auth;
        console.log("employee_id", employee_id);
        const skills = await emploeeService.getCurrentSkillMatrixByEmployeeId(employee_id);

        return h.response({
            message: 'Skill matrix loaded successfully',
            skills
        }).code(200);
    } catch (error) {
        return h.response({
            message: error.message || 'Internal Server Error'
        }).code(500);
    }
};



export const submitEmployeeSkillRatings = async (request, h) => {
    try {
        const { employee_id } = request.auth;
        const { ratings } = request.payload;

        const result = await emploeeService.submitEmployeeSkillRatings(parseInt(employee_id), ratings);

        return h.response(result).code(200);
    } catch (error) {
        console.error("Rating submission failed", error);
        return h.response({ message: error.message || 'Something went wrong' }).code(500);
    }
};



export const viewOwnSkillMatrix = async (request, h) => {
    const employee_id = request.auth.employee_id;
    try {
        const data = await emploeeService.viewOwnSkillMatrix(employee_id);
        return h.response(data).code(200);
    } catch (err) {
        console.error(err);
        return h.response({ error: err.message }).code(400);
    }
};




export const getGapAnalysis = async (request, h) => {
    try {
        const employee_id = request.auth.employee_id;
        const data = await emploeeService.getGapAnalysis(employee_id);
        return h.response(data).code(200);
    } catch (error) {
        console.error('Gap Analysis Controller Error:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};