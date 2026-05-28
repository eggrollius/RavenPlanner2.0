import { Fragment } from 'react';
import ScheduleMeetingCard from './ScheduleMeetingCard.jsx';
import './ScheduleDisplay.css';

const ScheduleDisplay = ({ schedule = [], selectedCourses = [] }) => {
    const startTimeMinutes = 8 * 60 + 35;
    const endTimeMinutes = 22 * 60 + 5;
    const cellStartTimes = [];
    for (let m = startTimeMinutes; m <= endTimeMinutes; m += 15) {
        cellStartTimes.push(m);
    }

    // Days of week: 0=Monday, 1=Tuesday, 2=Wednesday, 3=Thursday, 4=Friday
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    // Organize meetings by day of week
    const meetingsByDay = Array(5).fill(null).map(() => []);
    const courseMap = selectedCourses.reduce((map, course) => {
        map[course.id] = course;
        return map;
    }, {});
    
    // Flatten meetings from all course offerings
    schedule.forEach((courseOffering) => {
        const offeringCourse = courseMap[courseOffering.courseId];
        courseOffering.meetings.forEach((meeting) => {
            const meetingWithCourse = {
                ...meeting,
                courseId: courseOffering.courseId,
                courseCode: offeringCourse ? `${offeringCourse.facultyCode} ${offeringCourse.courseCode}` : undefined,
                courseName: offeringCourse ? offeringCourse.courseName : undefined,
                courseLink: offeringCourse ? `https://calendar.carleton.ca/search/?P=${encodeURIComponent(`${offeringCourse.facultyCode} ${offeringCourse.courseCode}`)}` : undefined,
            };
            for (let day = 0; day < 5; day++) {
                // Check if this meeting occurs on this day using bitmask
                // Bit 0 = Monday, Bit 1 = Tuesday, etc.
                if ((meeting.daysOfWeekMask & (1 << day)) !== 0) {
                    meetingsByDay[day].push(meetingWithCourse);
                }
            }
        });
    });

    return (
        <div className="calendar">
            <div className="grid">
                <div className="header"></div>
                <div className="header">Monday</div>
                <div className="header">Tuesday</div>
                <div className="header">Wednesday</div>
                <div className="header">Thursday</div>
                <div className="header">Friday</div>

                {
                    cellStartTimes.map((cellStartTime) => {
                        const hours = Math.trunc(cellStartTime / 60);
                        const minutes = cellStartTime % 60;
                        const formattedCellStartTime = `${ hours % 12}:${minutes.toString().padStart(2, '0')}`;
                        return (
                            <Fragment key={cellStartTime}>
                                <div className="time">{formattedCellStartTime}</div>
                                <div className="cell"></div>
                                <div className="cell"></div>
                                <div className="cell"></div>
                                <div className="cell"></div>
                                <div className="cell"></div>
                            </Fragment>
                        )
                    })
                }

                <div className="events-layer">
                    {meetingsByDay.map((dayMeetings, dayIndex) => (
                        <div key={dayIndex} style={{ flex: 1, position: "relative" }}>
                            {dayMeetings.map((meeting) => (
                                <ScheduleMeetingCard
                                    key={`${meeting.crn}-${dayIndex}`}
                                    courseCode={meeting.courseCode}
                                    courseName={meeting.courseName}
                                    meetingType={meeting.meetingType}
                                    professor={meeting.professor || 'TBA'}
                                    location={meeting.location || 'TBD'}
                                    start={meeting.startTimeMinutes}
                                    end={meeting.endTimeMinutes}
                                    courseLink={meeting.courseLink}
                                    courseCrn={meeting.crn}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ScheduleDisplay;