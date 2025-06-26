import * as adminService from '../services/adminService.js';

export const getAllTeams = async (request, h) => {
    try {
        const result = await adminService.getAllTeams();
        return h.response({
            message: 'Successfully fetched the teams', result
        }).code(200)
    } catch (error) {
        return h.response({ message: 'Internal server error', error }).code(500);
    }
}


export const getAllEmployeeswithTeamId = async (request, h) => {
    const { team_id } = request.params;
    try {
        const result = await adminService.getAllEmployeeswithTeamId(team_id);

        return h.response({
            message: `Employees in team ${team_id} fetched successfully`,
            result
        }).code(200);
    } catch (error) {
        console.error("Error fetching team members:", error);
        return h.response({ message: 'Internal server error', error }).code(500);
    }
}





export const initiateAssessmentCycle = async (request, h) => {
    try {
        const { quarter, year } = request.payload;

        const result = await adminService.initiateAssessmentCycle(quarter, year);

        return h.response({
            success:true,
            message: 'Assessment cycle initiated successfully',
            assessments_created: result.length
        }).code(201);
    } catch (error) {
        console.error("Error initiating assessment cycle:", error);
        const errorMessage = error.message?.includes("already exists")
            ? error.message
            : 'Internal server error';

        const statusCode = error.message?.includes("already exists") ? 400 : 500;
        return h.response({ success:false,message: errorMessage }).code(statusCode);
    }
};


export const getSkillMatrixForHrReview = async (request, h) => {
    try {
        const hrId = request.auth.employee_id;
        console.log("hrId", hrId);

        const result = await adminService.getSkillMatrixForHrReview(hrId);
        return h.response({ message: "Success", result }).code(200);
    } catch (error) {
        console.error("Error fetching skill matrix for review", error);
        return h.response({ message: "Internal Server Error", error }).code(500);
    }
};



export const skillMatrixApproveHr = async (request, h) => {
    try {
        const hrId = request.auth.employee_id
        const { status,hr_comments } = request.payload;
        const { assessment_id } = request.params;

        const result = await adminService.skillMatrixApproveHr(assessment_id, hrId, status, hr_comments)
        return h.response({ success:true,message: 'HR approval successful' }).code(200);
    } catch (error) {
        console.error("Error approving assessment by HR:", error);
        return h.response({success:false,message: error.message || "Internal Server Error", error }).code(500);
    }
}

export const getSkillMatrixById = async (request, h) => {
    try {
        const { assessment_id } = request.params;
        const hr_id = request.auth.employee_id;

        const data = await adminService.getSkillMatrixById(parseInt(assessment_id), hr_id);
        return h.response({ success: true, data }).code(200);
    } catch (err) {
        return h.response({ success: false, message: err.message }).code(400);
    }
};


export const getEmployeeByName = async (request, h) => {
    try {
        const name = request.query.name?request.query.name.toLowerCase() : '';
        if (!name) {
            return h.response({ error: 'Name query is required' }).code(400);
        }
        const employees = await adminService.getEmployeeByName(name);
        return h.response({ message: "Successfully get the employee", employees }).code(200);
    } catch (err) {
        console.error(err);
        return h.response({ error: 'Failed to fetch employees' }).code(500);
    }
}

