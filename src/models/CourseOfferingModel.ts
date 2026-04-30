import { MeetingModel } from './MeetingModel.js';

export class CourseOfferingModel {
  constructor(
    public id: number,
    public courseId: number,
    public meetings: MeetingModel[] = []
  ) {}
}
