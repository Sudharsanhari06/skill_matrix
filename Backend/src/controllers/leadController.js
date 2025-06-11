import * as leadService from '../services/leadService.js';



export const getAllEmployeWithLeadId = async (request, h) => {
    try {

        const {employeeId} = request.params;
        const result = await leadService.getAllEmployeWithLeadId(employeeId);
        return h.response({ message: 'Successfully get the all employees with lead', result }).code(200)
    } catch (error) {
        console.error("Error fetching the employees", error);   
        return h.response({
            message: 'Internal server error', error
        })
    }
}

export const getSkillMatrixForLeadReview = async (request, h) => {
    try {
        const result = await leadService.getSkillMatrixForLeadReview();
        return h.response({ message: "Success", data: result }).code(200);
    } catch (error) {
        console.error("Error fetching skill matrix for review", error);
        return h.response({ message: "Internal Server Error", error }).code(500);
    }
};




export const submitLeadSkillRatings = async (request, h) => {
    try {
      const { assessment_id, lead_comments, ratings } = request.payload;
  
      const result = await leadService.updateLeadSkillRatings(assessment_id, lead_comments, ratings);
  
      return h.response({ message: 'Lead review submitted successfully', result }).code(200);
    } catch (error) {
      console.error('Error submitting lead skill ratings:', error);
      return h.response({ message: 'Internal Server Error', error }).code(500);
    }
  };