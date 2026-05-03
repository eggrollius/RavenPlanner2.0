import { CourseRepository } from '../repositories/CourseRepository.js';
import { CourseModel } from '../models/CourseModel.js';
import { CourseOfferingModel } from '../models/CourseOfferingModel.js';
import { MeetingModel } from '../models/MeetingModel.js';

export class CourseService {
  private courseRepository: CourseRepository;

  constructor() {
    this.courseRepository = new CourseRepository();
  }

  async getAllCourses(): Promise<CourseModel[]> {
    const courseEntities = await this.courseRepository.getAllCourses();

    return courseEntities.map(courseEntity =>
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
  }
}
