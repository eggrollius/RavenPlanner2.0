import { MeetingType } from '../entities/Meeting.js';

export class MeetingModel {
  constructor(
    public crn: number,
    public courseOfferingId: number,
    public meetingType: MeetingType,
    public daysOfWeekMask: number,
    public startTimeMinutes: number,
    public endTimeMinutes: number
  ) {}
}
