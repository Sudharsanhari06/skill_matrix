import { AppDataSource } from "../config/database.js";
import { Employee } from "../entities/Employee.js";
import { Team } from "../entities/Team.js";

const TeamRepo = AppDataSource.getRepository(Team);
const employeeRepo=AppDataSource.getRepository(Employee)


export const getAllTeams = async () => {
    return await TeamRepo.find({
        relations: ['lead']
    });
}

export const getAllEmployeeswithTeamId=async(teamId)=>{
    const employees = await employeeRepo.find({
        where: {
          team: { team_id: teamId },
          is_active: true
        },
        relations: ['team', 'role']
      })
      return employees;
}
