import { useState } from 'react'
import CourseSelector from './components/CourseSelector.jsx'

const App = () => {
  const [selectedCourses, setSelectedCourses] = useState([])

  const handleSelect = (course) => {
    setSelectedCourses(current =>
      current.some(selected => selected.id === course.id)
        ? current
        : current.concat(course)
    )
  }

  const handleDeselect = (course) => {
    setSelectedCourses(current =>
      current.filter(selected => selected.id !== course.id)
    )
  }

  return (
    <div>
      <h1>Raven Planner</h1>
      <CourseSelector
        selectedCourses={selectedCourses}
        onSelect={handleSelect}
        onDeselect={handleDeselect}
      />
    </div>
  )
}

export default App
