import { Pool } from 'pg';
import { Course } from '../entities/Course.js';
import { CourseOffering } from '../entities/CourseOffering.js';
import { Meeting, MeetingType } from '../entities/Meeting.js';

export class ScheduleRepository {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME || 'ravenplanner',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
    });
  }

  async getCoursesWithOfferingsByIds(courseIds: number[]): Promise<Course[]> {
    if (courseIds.length === 0) {
      return [];
    }

    const client = await this.pool.connect();
    try {
      const query = `
        SELECT
          c.id AS id,
          c.facultycode AS facultycode,
          c.coursecode AS coursecode,
          c.coursename AS coursename,
          o.id AS offering_id,
          o."CourseId" AS offering_course_id,
          m.crn AS crn,
          m.courseofferingid AS courseofferingid,
          m.meetingtype AS meetingtype,
          m.daysofweekmask AS daysofweekmask,
          m.starttimeminutes AS starttimeminutes,
          m.endtimeminutes AS endtimeminutes
        FROM Course c
        LEFT JOIN CourseOffering o ON o."CourseId" = c.id
        LEFT JOIN Meeting m ON m.courseofferingid = o.id
        WHERE c.id = ANY($1)
        ORDER BY c.id, o.id, m.crn
      `;

      const result = await client.query(query, [courseIds]);
      const coursesMap: { [courseId: number]: Course } = {};
      const offeringsMap: { [offeringId: number]: CourseOffering } = {};

      for (const row of result.rows) {
        let course = coursesMap[row.id];
        if (!course) {
          course = new Course(
            row.id,
            row.facultycode,
            row.coursecode,
            row.coursename,
            []
          );
          coursesMap[row.id] = course;
        }

        if (row.offering_id != null) {
          let offering = offeringsMap[row.offering_id];
          if (!offering) {
            offering = new CourseOffering(
              row.offering_id,
              row.offering_course_id,
              []
            );
            offeringsMap[row.offering_id] = offering;
            course.courseOfferings.push(offering);
          }

          if (row.crn != null) {
            offering.meetings.push(
              new Meeting(
                row.crn,
                row.courseofferingid,
                row.meetingtype as MeetingType,
                row.daysofweekmask,
                row.starttimeminutes,
                row.endtimeminutes
              )
            );
          }
        }
      }

      return Object.values(coursesMap);
    } finally {
      client.release();
    }
  }
}
