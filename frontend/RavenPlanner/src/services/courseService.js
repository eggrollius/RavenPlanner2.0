import axios from 'axios'

const BASE_URL = '/api/';

const getAllCourses = async () => {
    try {
        const response = await axios.get(BASE_URL + 'courses');
        console.log("recieved courses:", response.data);
        return response.data;
    } catch (error) {
        console.log('Error fetching all courses: ' + error);
    }
};

export default { getAllCourses }