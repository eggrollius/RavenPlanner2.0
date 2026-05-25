import axios from 'axios';

const BASE_URL = '/api/';

const parseTimeToMinutes = (timeString) => {
    if (!timeString) {
        return null;
    }

    const [hours, minutes] = timeString.split(':').map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
        return null;
    }

    return hours * 60 + minutes;
};

const preferenceDaysToMask = (avoidDays = []) => {
    const dayMap = {
        Monday: 1 << 0,
        Tuesday: 1 << 1,
        Wednesday: 1 << 2,
        Thursday: 1 << 3,
        Friday: 1 << 4,
    };

    return avoidDays.reduce((mask, day) => mask | (dayMap[day] || 0), 0);
};

const scoreSchedule = (schedule, preferences = {}) => {
    const avoidBeforeMinutes = parseTimeToMinutes(preferences.avoidBeforeTime);
    const avoidAfterMinutes = parseTimeToMinutes(preferences.avoidAfterTime);
    const avoidDayMask = preferenceDaysToMask(preferences.avoidDays);

    return schedule.reduce((scheduleScore, courseOffering) => {
        return courseOffering.meetings.reduce((meetingScore, meeting) => {
            let penalty = 0;

            if (avoidDayMask && (meeting.daysOfWeekMask & avoidDayMask) !== 0) {
                penalty += 200;
            }

            if (avoidBeforeMinutes !== null && meeting.startTimeMinutes < avoidBeforeMinutes) {
                penalty += 100 + (avoidBeforeMinutes - meeting.startTimeMinutes);
            }

            if (avoidAfterMinutes !== null) {
                if (meeting.startTimeMinutes > avoidAfterMinutes) {
                    penalty += 100 + (meeting.startTimeMinutes - avoidAfterMinutes);
                }

                if (meeting.endTimeMinutes != null && meeting.endTimeMinutes > avoidAfterMinutes) {
                    penalty += Math.max(0, meeting.endTimeMinutes - avoidAfterMinutes) * 0.5;
                }
            }

            return meetingScore + penalty;
        }, 0);
    }, 0);
};

const rankSchedules = (schedules = [], preferences = {}) => {
    if (!Array.isArray(schedules)) {
        return [];
    }

    const ranked = [...schedules]
        .map((schedule) => ({
            schedule,
            score: scoreSchedule(schedule, preferences),
        }))
        .sort((a, b) => a.score - b.score)
        .map((entry) => entry.schedule);
    console.log('ranked schedules:', ranked);
    return ranked;
};

const getAllSchedules = async (courseIds, preferences = {}) => {
    try {
        const params = {
            courseIds: courseIds.join(','),
        };

        if (preferences.avoidBeforeTime) {
            params.avoidBeforeTime = preferences.avoidBeforeTime;
        }

        if (preferences.avoidAfterTime) {
            params.avoidAfterTime = preferences.avoidAfterTime;
        }

        if (preferences.avoidDays && preferences.avoidDays.length > 0) {
            params.avoidDays = preferences.avoidDays.join(',');
        }

        const config = { params };
        const url = BASE_URL + 'schedules';
        const response = await axios.get(url, config);
        console.log('received schedules:', response.data);
        return response.data;
    } catch (error) {
        console.log('Error fetching all schedules: ' + error);
    }
};

export default { getAllSchedules, rankSchedules };