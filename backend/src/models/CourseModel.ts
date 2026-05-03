import { CourseOfferingModel } from './CourseOfferingModel.js';

export class CourseModel {
  constructor(
    public id: number,
    public facultyCode: string,
    public courseCode: string,
    public courseName: string,
    public courseOfferings: CourseOfferingModel[] = []
  ) {}
}
