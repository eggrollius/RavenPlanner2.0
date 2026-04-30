export enum MeetingType {
  lecture = 'lecture',
  tutorial = 'tutorial',
  laboratory = 'laboratory'
}

export class Meeting {
  constructor(
    public crn: number,
    public courseOfferingId: number,
    public meetingType: MeetingType,
    public daysOfWeekMask: number,
    public startTimeMinutes: number,
    public endTimeMinutes: number
  ) {}
}