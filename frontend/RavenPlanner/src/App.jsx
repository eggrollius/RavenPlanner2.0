import CourseSelector from './components/CourseSelector.jsx'
const App = () => {
  const handleCourseSelect = (course) => {
    console.log("selected course:", course);
  };

  const handleCourseDeselect = (course) => {
    console.log("deselected course:", course);
  };

  return (
    <div>
      <h1>Raven Planner</h1>
      <CourseSelector 
        onSelect={handleCourseSelect}
        onDeselect={handleCourseDeselect}
      />
    </div>
  )
}

export default App