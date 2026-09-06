import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MeetingType } from '../../entities/Meeting.js';

const query = vi.fn();
const release = vi.fn();
const connect = vi.fn(async () => ({ query, release }));

vi.mock('pg', () => ({
  Pool: class {
    connect = connect;
  },
}));

const { CourseRepository } = await import('../CourseRepository.js');

const row = (overrides: Record<string, unknown> = {}) => ({
  id: 1,
  facultycode: 'COMP',
  coursecode: '2402',
  coursename: 'Abstract Data Types',
  offering_id: 10,
  offering_course_id: 1,
  crn: 30001,
  courseofferingid: 10,
  meetingtype: 'lecture',
  daysofweekmask: 0b10101,
  starttimeminutes: 540,
  endtimeminutes: 620,
  ...overrides,
});

describe('CourseRepository.getAllCourses', () => {
  beforeEach(() => {
    query.mockReset();
    release.mockReset();
    connect.mockClear();
  });

  it('groups joined rows into courses, offerings and meetings', async () => {
    query.mockResolvedValue({
      rows: [
        row(),
        row({ crn: 30002, meetingtype: 'tutorial', daysofweekmask: 0b01000 }),
        row({ offering_id: 11, crn: 30003, courseofferingid: 11 }),
        row({
          id: 2,
          coursecode: '2404',
          coursename: 'Algorithms',
          offering_id: 20,
          offering_course_id: 2,
          crn: 40001,
          courseofferingid: 20,
        }),
      ],
    });

    const courses = await new CourseRepository().getAllCourses();

    expect(courses).toHaveLength(2);
    expect(courses[0]!.courseOfferings).toHaveLength(2);
    expect(courses[0]!.courseOfferings[0]!.meetings.map(m => m.crn)).toEqual([30001, 30002]);
    expect(courses[0]!.courseOfferings[0]!.meetings[1]!.meetingType).toBe(MeetingType.tutorial);
    expect(courses[1]!.courseName).toBe('Algorithms');
  });

  it('returns a course with no offerings when the offering join produced nulls', async () => {
    query.mockResolvedValue({
      rows: [row({ offering_id: null, offering_course_id: null, crn: null, courseofferingid: null })],
    });

    const courses = await new CourseRepository().getAllCourses();

    expect(courses[0]!.courseOfferings).toEqual([]);
  });

  it('returns an offering with no meetings when the meeting join produced nulls', async () => {
    query.mockResolvedValue({ rows: [row({ crn: null, courseofferingid: null })] });

    const courses = await new CourseRepository().getAllCourses();

    expect(courses[0]!.courseOfferings).toHaveLength(1);
    expect(courses[0]!.courseOfferings[0]!.meetings).toEqual([]);
  });

  it('returns an empty list when the query yields no rows', async () => {
    query.mockResolvedValue({ rows: [] });

    await expect(new CourseRepository().getAllCourses()).resolves.toEqual([]);
  });

  it('releases the client when the query succeeds', async () => {
    query.mockResolvedValue({ rows: [row()] });

    await new CourseRepository().getAllCourses();

    expect(release).toHaveBeenCalledTimes(1);
  });

  it('releases the client and rethrows when the query fails', async () => {
    query.mockRejectedValue(new Error('relation "course" does not exist'));

    await expect(new CourseRepository().getAllCourses()).rejects.toThrow('relation "course" does not exist');
    expect(release).toHaveBeenCalledTimes(1);
  });
});
