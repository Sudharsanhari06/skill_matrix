import { AppDataSource } from "../config/database.js";
import bcrypt from 'bcrypt';
import { Employee } from "../entities/Employee.js";

const employeeRepo = AppDataSource.getRepository(Employee);
export const addEmployee = async (employee_name, email, password, role_id, team_id) => {
    console.log("email", email);
    const existingEmployee = await employeeRepo.findOneBy({ email });

    if (existingEmployee) {
        throw new Error('Email already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const employee = employeeRepo.create({
        employee_name,
        email,
        password: hashedPassword,
        role_id,
        team_id,
        is_active: true
    })

    const result = employeeRepo.save(employee);
    return result;
}

export const getAllEmployees = async () => {
    return await employeeRepo.find({
        relations: ['role', 'team'],
        where: { is_active: true },
        order: { employee_id: 'DESC' },
    });
}