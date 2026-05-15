import dotenv from 'dotenv';
import express, { type Express } from 'express';
import { CourseController } from './controllers/CourseController.js';
import { ScheduleController } from './controllers/ScheduleController.js';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const courseController = new CourseController();
const scheduleController = new ScheduleController();

// Middleware
app.use(express.json());

// Routes
app.get('/api/courses', (req, res) => courseController.getAllCourses(req, res));
app.get('/api/schedules', (req, res) => scheduleController.getSchedules(req, res));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
