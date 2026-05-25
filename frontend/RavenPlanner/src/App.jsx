import CourseSelector from './components/CourseSelector.jsx';
import SelectedCourseDisplay from './components/SelectedCourseDisplay.jsx';
import SchedulesDisplay from './components/ScheduleDisplay.jsx';
import scheduleService from './services/scheduleService.js';
import { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [ selectedCourses, setSelectedCourses ] = useState([]);
  const [ schedules, setSchedules ] = useState([]);

  const handleCourseSelect = (course) => {
    setSelectedCourses(selectedCourses.concat(course));
  };

  const handleCourseDeselect = (deselectedCourse) => {
    setSelectedCourses(selectedCourses.filter(course => course.id != deselectedCourse.id));
  };

  const handleSelectedCoursesChangedAsync = async () => {
    const newSchedules = await scheduleService.getAllSchedules(selectedCourses.map((course) => {
      return course.id
    }));

    setSchedules(newSchedules);
  };

  useEffect(() => {
    if(selectedCourses.length == 0) {
      return;
    }

    handleSelectedCoursesChangedAsync();
  }, [selectedCourses])

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Raven Planner</h1>
      </header>
      
      <div className="app-main">
        <aside className="app-sidebar">
          <CourseSelector 
            onSelect={handleCourseSelect}
            onDeselect={handleCourseDeselect}
            selectedCourses={selectedCourses}
          />
          <SelectedCourseDisplay selectedCourses={selectedCourses} onDeselect={handleCourseDeselect} />
        </aside>
        
        <main className="app-content">
          <SchedulesDisplay schedule={schedules.length == 0 ? [] : schedules[0] } />
        </main>
      </div>
    </div>
  )
}

export default App