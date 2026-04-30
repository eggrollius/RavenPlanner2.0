import { CourseOffering } from './CourseOffering.js';

export class Course {
  constructor(
    public id: number,
    public facultyCode: string,
    public courseCode: string,
    public courseName: string,
    public courseOfferings: CourseOffering[] = []
  ) {}
}