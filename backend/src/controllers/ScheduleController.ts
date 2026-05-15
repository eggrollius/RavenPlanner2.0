import { Request, Response } from 'express';
import { ScheduleService } from '../services/ScheduleService.js';
import { CourseOfferingDto } from '../dtos/CourseOfferingDto.js';
import { MeetingDto } from '../dtos/MeetingDto.js';

export class ScheduleController {
  private scheduleService: ScheduleService;

  constructor() {
    this.scheduleService = new ScheduleService();
  }

  async getSchedules(req: Request, res: Response): Promise<void> {
    try {
      const rawCourseIds = req.query.courseIds;
      const courseIds = this.parseCourseIds(rawCourseIds);

      if (courseIds.length === 0) {
        res.status(400).json({ error: 'courseIds query parameter is required' });
        return;
      }

      const schedules = await this.scheduleService.getSchedules(courseIds);
      const schedulesDto = schedules.map(schedule =>
        schedule.map(offering =>
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
      );

      res.status(200).json(schedulesDto);
    } catch (error) {
      console.error('Error generating schedules:', error);
      res.status(500).json({ error: 'Failed to generate schedules' });
    }
  }

  private parseCourseIds(rawCourseIds: unknown): number[] {
    if (rawCourseIds == null) {
      return [];
    }

    const courseIdStrings =
      Array.isArray(rawCourseIds) ? rawCourseIds.flatMap(value => String(value).split(',')) : String(rawCourseIds).split(',');

    return courseIdStrings
      .map(value => Number(value.trim()))
      .filter(value => Number.isFinite(value) && value > 0);
  }
}
