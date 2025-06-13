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
        const employees = await adminService.getAllEmployeeswithTeamId(team_id);

        return h.response({
            message: `Employees in team ${team_id} fetched successfully`,
            employees
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
            message: 'Assessment cycle initiated successfully',
            assessments_created: result.length
        }).code(201);
    } catch (error) {
        console.error("Error initiating assessment cycle:", error);
        return h.response({ message: 'Internal server error', error }).code(500);
    }
};


export const getSkillMatrixForHrReview = async (request, h) => {
    try {
        const hrId = request.auth.employee_id;
        console.log("hrId", hrId);

        const result = await adminService.getSkillMatrixForHrReview(hrId);
        return h.response({ message: "Success", data: result }).code(200);
    } catch (error) {
        console.error("Error fetching skill matrix for review", error);
        return h.response({ message: "Internal Server Error", error }).code(500);
    }
};



export const skillMatrixApproveHr = async (request, h) => {
    try {
        const hrId = request.auth.employee_id
        const { assessment_id } = request.params;

        const result = await adminService.skillMatrixApproveHr(assessment_id, hrId)
        return h.response({ message: 'HR approval successful' }).code(200); return h.response({ message: "Success", data: result }).code(200);
    } catch (error) {

        console.error("Error approving assessment by HR:", error);
        return h.response({ message: error.message || "Internal Server Error", error }).code(500);
    }
}