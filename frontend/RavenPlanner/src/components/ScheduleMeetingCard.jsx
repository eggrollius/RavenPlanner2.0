import './ScheduleMeetingCard.css';

const ScheduleMeetingCard = ({ title, start, end }) => {
    return (
        <div
            className="meetingCard"
            style={{
                "--startMinutes": start,
                "--endMinutes": end
            }}
        >
            {title}
        </div>
    );
};

export default ScheduleMeetingCard;