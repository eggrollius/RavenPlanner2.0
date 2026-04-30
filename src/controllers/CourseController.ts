import { Request, Response } from 'express';
import { CourseService } from '../services/CourseService.js';
import { CourseDto } from '../dtos/CourseDto.js';
import { CourseOfferingDto } from '../dtos/CourseOfferingDto.js';
import { MeetingDto } from '../dtos/MeetingDto.js';

export class CourseController {
  private courseService: CourseService;

  constructor() {
    this.courseService = new CourseService();
  }

  async getAllCourses(req: Request, res: Response): Promise<void> {
    try {
      const courseModels = await this.courseService.getAllCourses();

      const courseDtos = courseModels.map(course =>
        new CourseDto(
          course.id,
          course.facultyCode,
          course.courseCode,
          course.courseName,
          course.courseOfferings.map(offering =>
            new CourseOfferingDto(
              offering.id,
              offering.courseId,
              offering.meetings.map(meeting =>
                new MeetingDto(
                  meeting.crn,
                  meeting.courseOfferingId,
                  meeting.meetingType,
                  meeting.daysOfWeekMask,
                  meeting.startTimeMinutes,
                  meeting.endTimeMinutes
                )
              )
            )
          )
        )
      );

      res.status(200).json(courseDtos);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ error: 'Failed to fetch courses' });
    }
  }
}