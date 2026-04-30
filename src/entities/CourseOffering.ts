import { Meeting } from './Meeting.js';

export class CourseOffering {
  constructor(
    public id: number,
    public courseId: number,
    public meetings: Meeting[] = []
  ) {}
}