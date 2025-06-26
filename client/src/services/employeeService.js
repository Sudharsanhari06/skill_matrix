import { BASE_URL,getHeaders } from "./api";

export const employeeSkillMatrixView = async () => {
    const response = await fetch(`${BASE_URL}/employee/skill-matrix/view`, {
        headers: getHeaders(),
    });
    return response.json();
}
