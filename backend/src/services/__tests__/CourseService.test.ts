import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Course } from '../../entities/Course.js';
import { CourseOffering } from '../../entities/CourseOffering.js';
import { Meeting, MeetingType } from '../../entities/Meeting.js';
import { CourseModel } from '../../models/CourseModel.js';
import { CourseOfferingModel } from '../../models/CourseOfferingModel.js';
import { MeetingModel } from '../../models/MeetingModel.js';

const getAllCourses = vi.fn();

vi.mock('../../repositories/CourseRepository.js', () => ({
  CourseRepository: class {
    getAllCourses = getAllCourses;
  },
}));

const { CourseService } = await import('../CourseService.js');

describe('CourseService.getAllCourses', () => {
  beforeEach(() => {
    getAllCourses.mockReset();
  });

  it('maps repository entities to models preserving the offering and meeting hierarchy', async () => {
    getAllCourses.mockResolvedValue([
      new Course(1, 'COMP', '2402', 'Abstract Data Types', [
        new CourseOffering(10, 1, [
          new Meeting(30001, 10, MeetingType.lecture, 0b10101, 540, 620),
          new Meeting(30002, 10, MeetingType.tutorial, 0b01000, 780, 860),
        ]),
      ]),
    ]);

    const courses = await new CourseService().getAllCourses();

    expect(courses).toEqual([
      new CourseModel(1, 'COMP', '2402', 'Abstract Data Types', [
        new CourseOfferingModel(10, 1, [
          new MeetingModel(30001, 10, MeetingType.lecture, 0b10101, 540, 620),
          new MeetingModel(30002, 10, MeetingType.tutorial, 0b01000, 780, 860),
        ]),
      ]),
    ]);
    expect(courses[0]).toBeInstanceOf(CourseModel);
    expect(courses[0]!.courseOfferings[0]).toBeInstanceOf(CourseOfferingModel);
    expect(courses[0]!.courseOfferings[0]!.meetings[0]).toBeInstanceOf(MeetingModel);
  });

  it('returns an empty list when the repository has no courses', async () => {
    getAllCourses.mockResolvedValue([]);

    await expect(new CourseService().getAllCourses()).resolves.toEqual([]);
  });

  it('handles courses without offerings and offerings without meetings', async () => {
    getAllCourses.mockResolvedValue([
      new Course(1, 'MATH', '1007', 'Calculus', []),
      new Course(2, 'PHYS', '1003', 'Physics', [new CourseOffering(20, 2, [])]),
    ]);

    const courses = await new CourseService().getAllCourses();

    expect(courses[0]!.courseOfferings).toEqual([]);
    expect(courses[1]!.courseOfferings[0]!.meetings).toEqual([]);
  });

  it('propagates repository failures to the caller', async () => {
    getAllCourses.mockRejectedValue(new Error('connection refused'));

    await expect(new CourseService().getAllCourses()).rejects.toThrow('connection refused');
  });
});
