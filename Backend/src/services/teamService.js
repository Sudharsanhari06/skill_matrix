import { AppDataSource } from "../config/database.js";
import { Team } from "../entities/Team.js";

const teamRepo = AppDataSource.getRepository(Team);




export const getAllEmployeWithLeadId=async(employeeId)=>{
    const result=await teamRepo.find({
      where:{
        lead: { employee_id: employeeId }
      },
      relations:['members',]
    })
    // const allMembers=result.flatMap(team=>team.members)
    return result;
}