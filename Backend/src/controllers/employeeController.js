import * as emploeeService from '../services/employeeService.js';

export const addEmployee=async(request,h)=>{
    const{employee_name,email,password,role_id,team_id,categories}=request.payload;

    try{
        const result=emploeeService.addEmployee(employee_name,email,password,role_id,team_id,categories);
       
        return h.response({message:'Successfully added the employee',employee_id: result.employee_id}).code(200);

    }catch(error){
        if (error.message === 'Email already exists') {
            return h.response({ message: error.message }).code(400);
        }else{
            return h.response({message:"Internal server Error",error}).code(500)

        }
    }

}

export const getAllEmployees=async(request,h)=>{
    try{
            const result = await emploeeService.getAllEmployees();
            return h.response({message:"Successfully get All employees",result}).code(200)

    }catch(error){
        return h.response({message:'Internal Server Error',error}).code(500)
    }
}

