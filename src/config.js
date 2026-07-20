import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  db: {
    host: process.env.BD_HOST,
    database: process.env.BD_DATABASE,
    user: process.env.BD_USER,
    password: process.env.BD_PASSWORD,
    port: process.env.BD_PORT || 3306
  },
  jwtSecret: process.env.JWT_SECRET
};