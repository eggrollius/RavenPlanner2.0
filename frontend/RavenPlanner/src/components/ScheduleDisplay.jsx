import { Fragment } from 'react';
import ScheduleMeetingCard from './ScheduleMeetingCard.jsx';
import './ScheduleDisplay.css';

const ScheduleDisplay = ({ schedule = [] }) => {
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
    
    // Flatten meetings from all course offerings
    schedule.forEach((courseOffering) => {
        courseOffering.meetings.forEach((meeting) => {
            for (let day = 0; day < 5; day++) {
                // Check if this meeting occurs on this day using bitmask
                // Bit 0 = Monday, Bit 1 = Tuesday, etc.
                if ((meeting.daysOfWeekMask & (1 << day)) !== 0) {
                    meetingsByDay[day].push(meeting);
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
                        <div key={dayIndex} style={{ flex: 1 }}>
                            {dayMeetings.map((meeting) => (
                                <ScheduleMeetingCard
                                    key={`${meeting.crn}-${dayIndex}`}
                                    title={`CRN ${meeting.crn}`}
                                    start={meeting.startTimeMinutes}
                                    end={meeting.endTimeMinutes}
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