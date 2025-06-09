import * as teamService from '../services/teamService.js';

export const getAllTeams = async (request, h) => {
    try {
        const result = await teamService.getAllTeams();

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
        const employees = await teamService.getAllEmployeeswithTeamId(team_id);

        return h.response({
          message: `Employees in team ${team_id} fetched successfully`,
            employees
        }).code(200);
    } catch (error) {
        console.error("Error fetching team members:", error);
        return h.response({ message: 'Internal server error', error }).code(500);
    }
}
