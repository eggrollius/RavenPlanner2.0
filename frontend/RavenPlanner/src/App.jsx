import CourseSelector from './components/CourseSelector.jsx';
import SelectedCourseDisplay from './components/SelectedCourseDisplay.jsx';
import PreferenceSelector from './components/PreferenceSelector.jsx';
import SchedulesDisplay from './components/ScheduleDisplay.jsx';
import scheduleService from './services/scheduleService.js';
import { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [ selectedCourses, setSelectedCourses ] = useState([]);
  const [ schedules, setSchedules ] = useState([]);
  const [ preferences, setPreferences ] = useState({
    avoidBeforeTime: '',
    avoidAfterTime: '',
    avoidDays: [],
  });

  const handleCourseSelect = (course) => {
    setSelectedCourses(selectedCourses.concat(course));
  };

  const handleCourseDeselect = (deselectedCourse) => {
    setSelectedCourses(selectedCourses.filter(course => course.id != deselectedCourse.id));
  };

  const handlePreferencesChange = (newPreferences) => {
    setPreferences(newPreferences);
  };

  const handleSelectedCoursesChangedAsync = async () => {
    const newSchedules = await scheduleService.getAllSchedules(selectedCourses.map((course) => {
      return course.id
    }), preferences);

    const rankedSchedules = scheduleService.rankSchedules(newSchedules || [], preferences);
    setSchedules(rankedSchedules);
  };

  useEffect(() => {
    if(selectedCourses.length == 0) {
      return;
    }

    handleSelectedCoursesChangedAsync();
  }, [selectedCourses, preferences])

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Raven Planner</h1>
      </header>
      
      <div className="app-main">
        <aside className="app-sidebar">
          <SelectedCourseDisplay selectedCourses={selectedCourses} onDeselect={handleCourseDeselect} />
          <CourseSelector 
            onSelect={handleCourseSelect}
            onDeselect={handleCourseDeselect}
            selectedCourses={selectedCourses}
          />
          <PreferenceSelector preferences={preferences} onChange={handlePreferencesChange} />
        </aside>
        
        <main className="app-content">
          <SchedulesDisplay schedule={schedules.length == 0 ? [] : schedules[0]} selectedCourses={selectedCourses} />
        </main>
      </div>
    </div>
  )
}

export default App