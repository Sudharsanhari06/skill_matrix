import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database.js';
import { Employee } from '../entities/Employee.js';
import dotenv from 'dotenv';
// import { Team } from '../entities/Team.js';
dotenv.config();

export const login = async (request, h) => {

    const { email, password } = request.payload;
    console.log("email, password ", email, password);

    const employeeRepo = AppDataSource.getRepository(Employee);

    const emploee = await employeeRepo.findOne({
        where: { email },
        relations: ['role', 'team'],
    });

    if (!emploee) {
        return h.response({ message: 'User not found' }).code(404);
    }

    const isMatch = await bcrypt.compare(password, emploee.password);
    if (!isMatch) {
        return h.response({ message: 'Invalid credentials' }).code(401);
    }

    const user = {
        employee_id: emploee.employee_id,
        name: emploee.employee_name,
         role: emploee.role,
        team: emploee.team
    };

    const token = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: '1d' });

    return h.response({
        message: 'Login successful',
        token,
        user
    }).code(200);
};


export const changePassword = async (request, h) => {
    const { oldPassword, newPassword } = request.payload;
    const employeeId = request.auth.employee_id;

    try {
        const employeeRepo = AppDataSource.getRepository(Employee);

        const user = await employeeRepo.findOneBy({ employee_id: employeeId });

        if (!user) {
            return h.response({ message: 'User not found' }).code(404);
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return h.response({ message: 'Old password is incorrect' }).code(401);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await employeeRepo.save(user);
        return h.response({ message: 'Password updated successfully' }).code(200);
    } catch (error) {
        console.error('Change password error:', error);
        return h.response({ message: 'Server error' }).code(500);
    }
};