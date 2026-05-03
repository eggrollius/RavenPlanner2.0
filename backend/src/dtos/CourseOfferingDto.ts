import { MeetingDto } from './MeetingDto.js';

export class CourseOfferingDto {
  constructor(
    public id: number,
    public courseId: number,
    public meetings: MeetingDto[] = []
  ) {}
}
