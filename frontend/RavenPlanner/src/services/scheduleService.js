import axios from 'axios';

const BASE_URL = '/api/';

const getAllSchedules = async (courseIds) => {
    try {
        const config = {
            "params": {
                "courseIds": courseIds.join(',')
            }
        };
        const url = BASE_URL + 'schedules';
        const response = await axios.get(url, config);
        console.log("recieved schedules:", response.data);
        return response.data;
    } catch (error) {
        console.log('Error fetching all schedules: ' + error);
    }
};

export default { getAllSchedules };