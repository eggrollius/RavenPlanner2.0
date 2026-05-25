import './SelectedCourseDisplay.css';

const SelectedCourseDisplay = ({selectedCourses, onDeselect}) => {
    return (
        <div className="selected-courses-container">
            <div className="selected-courses-header">
                <h2>Selected Courses</h2>
                <span className="course-count">{selectedCourses.length}</span>
            </div>

            {selectedCourses.length > 0 ? (
                <ul className="selected-courses-list">
                    {selectedCourses.map((course) => {
                        const courseCodeString = `${course.facultyCode} ${course.courseCode}`;
                        const courseLink = `https://calendar.carleton.ca/search/?P=${encodeURIComponent(courseCodeString)}`;
                        return (
                            <li key={course.id} className="selected-course-item">
                                <div className="course-item-content">
                                    <a href={courseLink} target="_blank" rel="noopener noreferrer" className="course-item-code">
                                        {courseCodeString}
                                    </a>
                                    <div className="course-item-name">{course.courseName}</div>
                                </div>
                                <button 
                                    className="remove-course-button"
                                    onClick={() => onDeselect(course)}
                                    aria-label={`Remove ${courseCodeString}`}
                                    title="Remove course"
                                >
                                    ✕
                                </button>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <div className="empty-state">
                    <p>No courses selected yet</p>
                </div>
            )}
        </div>
    );
};

export default SelectedCourseDisplay;