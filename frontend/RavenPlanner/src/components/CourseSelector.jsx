import { useState, useEffect } from 'react';
import courseService from '../services/courseService';

const CourseSelector = ({ selectedCourses = [], onSelect, onDeselect }) => {

    const [ courses, setCourses ] = useState([]);
    const [ searchTerm, setSearchTerm ] = useState("");
    const [ submittedSearchTerm, setSubmittedSearchTerm ] = useState("");

    useEffect(() => {
        let cancelled = false;

        courseService.getAllCourses().then(newCourses => {
            if (!cancelled) {
                setCourses(newCourses ?? []);
            }
        });

        return () => {
            cancelled = true;
        };
    }, []);

    const normalizedSearch = submittedSearchTerm.toLowerCase();
    const visibleCourses = courses.filter(course => {
        const courseName = course.courseName.toLowerCase();
        const courseCode = (course.facultyCode + course.courseCode).toLowerCase();

        return (
            courseName.includes(normalizedSearch) ||
            courseCode.includes(normalizedSearch)
        );
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmittedSearchTerm(searchTerm);
    };

    const handleOnChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCheckboxOnChange = (event, course) => {
        if (event.target.checked) {
            onSelect?.(course);
        } else {
            onDeselect?.(course);
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
            {visibleCourses.length === 0
                ? <p>No courses to show.</p>
                : <ul>
                    {visibleCourses.map(
                        course => 
                        <li key={course.id}>
                            <label>
                                {course.courseName}
                                <input 
                                    type="checkbox" 
                                    checked={selectedCourses.some(selected => selected.id === course.id)}
                                    onChange={(event) => handleCheckboxOnChange(event, course)} 
                                />
                            </label>
                        </li>
                    )}
                </ul>
            }
        </div>
    );
};

export default CourseSelector;
