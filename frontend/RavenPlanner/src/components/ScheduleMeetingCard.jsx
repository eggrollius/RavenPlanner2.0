import './ScheduleMeetingCard.css';

const hashCRN = (crn) => {
    let hash = 0;
    const crnStr = String(crn);
    for (let i = 0; i < crnStr.length; i++) {
        const char = crnStr.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
};

const generateColorFromCRN = (crn) => {
    const hash = hashCRN(crn);
    // Generate hue (0-360), saturation (60-100), lightness (45-55)
    const hue = (hash % 360);
    const saturation = 70 + (Math.floor(hash / 360) % 30);
    const lightness = 50;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const formatTimeRange = (start, end) => {
    const format = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const period = hours >= 12 ? 'PM' : 'AM';
        const normalizedHour = hours % 12 === 0 ? 12 : hours % 12;
        return `${normalizedHour}:${mins.toString().padStart(2, '0')} ${period}`;
    };

    return `${format(start)} - ${format(end)}`;
};

const ScheduleMeetingCard = ({ courseCode, courseName, meetingType, professor, location, start, end, courseLink, courseCrn }) => {
    const cardColor = generateColorFromCRN(courseCrn);
    
    return (
        <div
            className="meetingCard"
            style={{
                "--startMinutes": start,
                "--endMinutes": end,
                background: cardColor
            }}
        >
            <a
                className="meetingCardLink"
                href={courseLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
            >
                <div className="meetingCardHeader">
                    <span className="meetingCardTitle">{courseCode || 'Course'}</span>
                    <span className="meetingCardType">{meetingType ? meetingType.charAt(0).toUpperCase() + meetingType.slice(1) : 'Meeting'}</span>
                </div>
                <div className="meetingCardSpacer" />
                <div className="meetingCardFooter">
                    <span className="meetingCardDetail">Prof. {professor}</span>
                    <span className="meetingCardDetail">{formatTimeRange(start, end)}</span>
                    <span className="meetingCardDetail">{location}</span>
                </div>
            </a>
        </div>
    );
};

export default ScheduleMeetingCard;