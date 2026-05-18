const SelectedCourseDisplay = ({selectedCourses}) => {
    return (
        <div>
            <h2>Selected Courses:</h2>
            <ul>
                {
                    selectedCourses.map((course) => <li key={course.id}>{course.courseName}</li>)
                }
            </ul>
        </div>
    );
};

export default SelectedCourseDisplay;