import { ScheduleRepository } from '../repositories/ScheduleRepository.js';
import { CourseModel } from '../models/CourseModel.js';
import { CourseOfferingModel } from '../models/CourseOfferingModel.js';
import { MeetingModel } from '../models/MeetingModel.js';

export class ScheduleService {
  private scheduleRepository: ScheduleRepository;

  constructor() {
    this.scheduleRepository = new ScheduleRepository();
  }

  async getSchedules(courseIds: number[]): Promise<CourseOfferingModel[][]> {
    const courseEntities = await this.scheduleRepository.getCoursesWithOfferingsByIds(courseIds);

    const courseModels = courseEntities.map(courseEntity =>
      new CourseModel(
        courseEntity.id,
        courseEntity.facultyCode,
        courseEntity.courseCode,
        courseEntity.courseName,
        courseEntity.courseOfferings.map(offering =>
          new CourseOfferingModel(
            offering.id,
            offering.courseId,
            offering.meetings.map(meeting =>
              new MeetingModel(
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

    if (courseModels.some(course => course.courseOfferings.length === 0)) {
      return [];
    }

    const schedules: CourseOfferingModel[][] = [];
    const currentSchedule: CourseOfferingModel[] = [];

    const backtrack = (index: number): void => {
      if (index === courseModels.length) {
        schedules.push([...currentSchedule]);
        return;
      }

      const course = courseModels[index];
      if (!course) {
        return;
      }

      for (const offering of course.courseOfferings) {
        if (!this.hasConflict(currentSchedule, offering)) {
          currentSchedule.push(offering);
          backtrack(index + 1);
          currentSchedule.pop();
        }
      }
    };

    backtrack(0);
    return schedules;
  }

  private hasConflict(existingOfferings: CourseOfferingModel[], candidate: CourseOfferingModel): boolean {
    return existingOfferings.some(offering => this.offeringsConflict(offering, candidate));
  }

  private offeringsConflict(a: CourseOfferingModel, b: CourseOfferingModel): boolean {
    return a.meetings.some(meetingA =>
      b.meetings.some(meetingB => this.meetingsConflict(meetingA, meetingB))
    );
  }

  private meetingsConflict(a: MeetingModel, b: MeetingModel): boolean {
    const overlapDays = (a.daysOfWeekMask & b.daysOfWeekMask) !== 0;
    const overlapTime = a.startTimeMinutes <= b.endTimeMinutes && b.startTimeMinutes <= a.endTimeMinutes;
    return overlapDays && overlapTime;
  }
}
