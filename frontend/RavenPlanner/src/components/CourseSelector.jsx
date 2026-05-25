import { useState, useEffect, useRef } from 'react';
import courseService from '../services/courseService';
import './CourseSelector.css';

const CourseSelector = ({ onSelect, onDeselect, selectedCourses = [] }) => {

    const [ courses, setCourses ] = useState([]);
    const [ searchTerm, setSearchTerm ] = useState("");
    const [ searchResultCourses, setSearchResultCourses ] = useState([]);
    const [ selectedCourseIds, setSelectedCourseIds ] = useState([]);
    const [ isSearching, setIsSearching ] = useState(false);
    const searchContainerRef = useRef(null);

    const initializeCourseAsync = async () => {
        const newCourses = await courseService.getAllCourses();
        setCourses(newCourses);
    };

    useEffect(() => {
        initializeCourseAsync();
    }, []);

    useEffect(() => {
        setSelectedCourseIds(selectedCourses.map(course => course.id));
    }, [selectedCourses]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setSearchTerm("");
                setSearchResultCourses([]);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearchChange = (event) => {
        const newSearchTerm = event.target.value;
        setSearchTerm(newSearchTerm);
        setIsSearching(true);

        if (newSearchTerm.trim() === "") {
            setSearchResultCourses([]);
            setIsSearching(false);
            return;
        }

        const normalizedSearch = newSearchTerm.toLowerCase();
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
        setIsSearching(false);
    };

    const handleClearSearch = () => {
        setSearchTerm("");
        setSearchResultCourses([]);
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
        <div className="course-selector">
            <div className="course-selector-header">
                <h2>Add Courses</h2>
                <p className="course-selector-subtitle">Search and select courses to add to your schedule</p>
            </div>

            <div className="course-selector-search" ref={searchContainerRef}>
                <div className="search-input-container">
                    <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input 
                        type="text"
                        className="search-input"
                        placeholder="PSYCH 1001 or Calculus"
                        value={searchTerm} 
                        onChange={handleSearchChange}
                        autoComplete="off"
                    />
                    {searchTerm && (
                        <button 
                            className="clear-button"
                            onClick={handleClearSearch}
                            aria-label="Clear search"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {searchTerm && (
                    <div className="search-results">
                        {isSearching ? (
                            <div className="loading">Searching...</div>
                        ) : searchResultCourses.length > 0 ? (
                            <ul className="course-list">
                                {searchResultCourses.map(course => (
                                    <li key={course.id} className="course-item">
                                        <label className="course-label">
                                            <input 
                                                type="checkbox" 
                                                className="course-checkbox"
                                                checked={selectedCourseIds.includes(course.id)}
                                                onChange={(event) => handleCheckboxOnChange(event, course)} 
                                            />
                                            <div className="course-info">
                                                <span className="course-code">
                                                    {course.facultyCode} {course.courseCode}
                                                </span>
                                                <span className="course-name">{course.courseName}</span>
                                            </div>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="no-results">
                                No courses found matching "{searchTerm}"
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseSelector;