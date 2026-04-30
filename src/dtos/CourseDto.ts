import { CourseOfferingDto } from './CourseOfferingDto.js';

export class CourseDto {
  constructor(
    public id: number,
    public facultyCode: string,
    public courseCode: string,
    public courseName: string,
    public courseOfferings: CourseOfferingDto[] = []
  ) {}
}
