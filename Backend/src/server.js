import dotenv from 'dotenv';
dotenv.config();
import Hapi from '@hapi/hapi';
import { AppDataSource } from './config/database.js';
import { authRoutes } from './routes/authRoutes.js';
import { employeeRoute } from './routes/employeeRoute.js';
import { teamRoutes } from './routes/teamRoute.js';

const init = async () => {
    const server = Hapi.server({
      port: process.env.PORT ,
      host: process.env.DB_HOST,
    });

    try {

      await AppDataSource.initialize();
      console.log('Data Source initialized');
    server.route(authRoutes);
    server.route(employeeRoute);
    server.route(teamRoutes)

      await server.start();
      console.log(`Server running at: ${server.info.uri}`);
    } catch (error) {
      console.error('Failed to initialize Data Source or start server:', error);
    }
  };  
init();
  