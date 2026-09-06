import type { Request, Response } from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MeetingType } from '../../entities/Meeting.js';
import { CourseModel } from '../../models/CourseModel.js';
import { CourseOfferingModel } from '../../models/CourseOfferingModel.js';
import { MeetingModel } from '../../models/MeetingModel.js';

const getAllCourses = vi.fn();

vi.mock('../../services/CourseService.js', () => ({
  CourseService: class {
    getAllCourses = getAllCourses;
  },
}));

const { CourseController } = await import('../CourseController.js');

const createResponse = () => {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));
  return { res: { status } as unknown as Response, status, json };
};

const request = {} as Request;

describe('CourseController.getAllCourses', () => {
  beforeEach(() => {
    getAllCourses.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('responds with 200 and the courses serialized as DTOs', async () => {
    getAllCourses.mockResolvedValue([
      new CourseModel(1, 'COMP', '2402', 'Abstract Data Types', [
        new CourseOfferingModel(10, 1, [
          new MeetingModel(30001, 10, MeetingType.lecture, 0b10101, 540, 620),
        ]),
      ]),
    ]);
    const { res, status, json } = createResponse();

    await new CourseController().getAllCourses(request, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith([
      {
        id: 1,
        facultyCode: 'COMP',
        courseCode: '2402',
        courseName: 'Abstract Data Types',
        courseOfferings: [
          {
            id: 10,
            courseId: 1,
            meetings: [
              {
                crn: 30001,
                courseOfferingId: 10,
                meetingType: MeetingType.lecture,
                daysOfWeekMask: 0b10101,
                startTimeMinutes: 540,
                endTimeMinutes: 620,
              },
            ],
          },
        ],
      },
    ]);
  });

  it('responds with 200 and an empty array when there are no courses', async () => {
    getAllCourses.mockResolvedValue([]);
    const { res, status, json } = createResponse();

    await new CourseController().getAllCourses(request, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith([]);
  });

  it('responds with 500 and an error payload when the service throws', async () => {
    getAllCourses.mockRejectedValue(new Error('database is down'));
    const { res, status, json } = createResponse();

    await new CourseController().getAllCourses(request, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ error: 'Failed to fetch courses' });
  });

  it('does not leak internal error details to the client', async () => {
    getAllCourses.mockRejectedValue(new Error('password authentication failed for user'));
    const { res, json } = createResponse();

    await new CourseController().getAllCourses(request, res);

    expect(JSON.stringify(json.mock.calls[0])).not.toContain('password');
  });
});
