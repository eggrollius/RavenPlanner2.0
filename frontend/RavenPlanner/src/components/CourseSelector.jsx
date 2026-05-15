import { useState, useEffect } from 'react';
import courseService from '../services/courseService';

const CourseSelector = ({ onSelect, onDeselect }) => {

    const [ courses, setCourses ] = useState([]);
    const [ searchTerm, setSearchTerm ] = useState("");
    const [ searchResultCourses, setSearchResultCourses ] = useState([]);
    const [ selectedCourseIds, setSelectedCourseIds ] = useState([]);

    const initializeCourseAsync = async () => {
        const newCourses = await courseService.getAllCourses();
        setCourses(newCourses);
    };

    useEffect(() => {
        initializeCourseAsync();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const normalizedSearch = searchTerm.toLowerCase();
        const newSearchResultCourses = courses.filter(course => {
            const courseName = course.courseName.toLowerCase();
            const courseCode = (course.facultyCode + course.courseCode).toLowerCase();

            return (
                courseName.includes(normalizedSearch) ||
                courseCode.includes(normalizedSearch)
            );
        });

        console.log("search filter results in:", newSearchResultCourses);
        setSearchResultCourses(newSearchResultCourses);
    };

    const handleOnChange = (event) => {
        event.preventDefault();
        const newSearchTerm = event.target.value;
        setSearchTerm(newSearchTerm);
    };

    const handleCheckboxOnChange = (event, course) => {
        if (event.target.checked) {
            setSelectedCourseIds(selectedCourseIds.concat(course.id));
            onSelect(course);
        } else {
            setSelectedCourseIds(selectedCourseIds.filter(id => id !== course.id));
            onDeselect(course);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input 
                    value={searchTerm} 
                    onChange={handleOnChange}    
                />
                <button type="submit">search</button>
            </form>
            <ul>
                {searchResultCourses.map(
                    course => 
                    <li key={course.id}>
                        <label>
                            {course.courseName}
                        </label>
                        <input 
                            type="checkbox" 
                            checked={selectedCourseIds.includes(course.id)}
                            onChange={(event) => handleCheckboxOnChange(event, course)} 
                        />
                    </li>
                )}

            </ul>
        </div>
    );
};

export default CourseSelector;