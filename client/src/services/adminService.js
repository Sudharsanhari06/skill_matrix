import { BASE_URL, getHeaders } from "./api";

export const initiateAssessment=async(payload)=>{
    const response = await fetch(`${BASE_URL}/assessments/initiate`,{
        method: 'POST',
        headers:getHeaders(),
        body: JSON.stringify(payload)
      }); 
      return response.json();
}

export const getAllTeams=async()=>{
    const response = await fetch(`${BASE_URL}/teams`,{
        headers:getHeaders(),
      }); 
      return response.json();
}

export const hrSkillMatrixView=async(assessmentId)=>{
    const response = await fetch(`${BASE_URL}/hr/skill-matrix-view/${assessmentId}`,{
        headers:getHeaders(),
      }); 
      return response.json();
}

export const hrDecisionSkillMatrix=async(assessmentId,payload)=>{
    const response = await fetch(`${BASE_URL}/hr/skill-matrix-view/${assessmentId}/decision`,{
        method:'PUT',
        headers:getHeaders(),
        body:JSON.stringify(payload)
      }); 
      return response.json();
}


export const employeeLeadUpdate=async()=>{
    const response = await fetch(`${BASE_URL}/hr/skill-matrix-view/employee-lead-update`,{
        headers:getHeaders(),
      }); 
      return response.json();
}


export const getAllRoles=async()=>{
    const response = await fetch(`${BASE_URL}/roles`,{
        headers:getHeaders(),
      }); 
      return response.json();
}

export const getAllTeamNames=async()=>{
    const response = await fetch(`${BASE_URL}/teams-name`,{
        headers:getHeaders(),
      }); 
      return response.json();
}

export const getAllCategories=async()=>{
    const response = await fetch(`${BASE_URL}/categories`,{
        headers:getHeaders(),
      }); 
      return response.json();
}

export const getAllHrames=async()=>{
    const response = await fetch(`${BASE_URL}/hr-names`,{
        headers:getHeaders(),
      }); 
      return response.json();
}

export const getAllEmployees=async()=>{
    const response = await fetch(`${BASE_URL}/employees`,{
        headers:getHeaders(),
      }); 
      return response.json();
}

export const getAllDesignations=async()=>{
    const response = await fetch(`${BASE_URL}/designations`,{
        headers:getHeaders(),
      }); 
      return response.json();
}

export const addEmployee=async(payload)=>{
    const response = await fetch(`${BASE_URL}/employee`,{
        method: 'POST',
        headers:getHeaders(),
        body: JSON.stringify(payload)
      }); 
      return response.json();
}

export const searchEmployee=async(searchTerm)=>{
    const response = await fetch(`${BASE_URL}/employees/search?name=${searchTerm}`,{
        headers:getHeaders(),
      }); 
      return response.json();
}






// const employeesRes = await fetch('http://localhost:3008/employees', {
//     headers: { Authorization: `Bearer ${token}` }
//   });
  
//   const employeesData = await employeesRes.json();