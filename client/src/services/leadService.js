import { BASE_URL, getHeaders } from "./api";

export const getLeadEmployee = async () => {
    const response = await fetch(`${BASE_URL}/employees/lead`, {
        headers: getHeaders(),
    });
    return response.json();
}

export const leadReviewSkillMatrix = async () => {
    const response = await fetch(`${BASE_URL}/lead/skill-matrix-view/employee-update`, {
        headers: getHeaders(),
    });
    return response.json();
}

export const leadDecisionSkillMatrix = async () => {
    const response = await fetch(`${BASE_URL}/lead/submit-skill-review`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
    });
    return response.json();
}



