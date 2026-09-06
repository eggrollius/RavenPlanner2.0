import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import CourseSelector from '../CourseSelector'
import courseService from '../../services/courseService'

vi.mock('../../services/courseService', () => ({
  default: { getAllCourses: vi.fn() },
}))

const courses = [
  { id: 1, facultyCode: 'COMP', courseCode: '2402', courseName: 'Abstract Data Types' },
  { id: 2, facultyCode: 'COMP', courseCode: '2404', courseName: 'Introduction to Software Engineering' },
  { id: 3, facultyCode: 'MATH', courseCode: '1007', courseName: 'Calculus' },
]

const renderSelector = (props = {}) =>
  render(<CourseSelector onSelect={vi.fn()} onDeselect={vi.fn()} {...props} />)

const search = async (user, term) => {
  await user.type(screen.getByRole('textbox'), term)
  await user.click(screen.getByRole('button', { name: /search/i }))
}

describe('CourseSelector', () => {
  beforeEach(() => {
    courseService.getAllCourses.mockReset()
    courseService.getAllCourses.mockResolvedValue(courses)
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('loads the courses once on mount and shows no results before searching', async () => {
    renderSelector()

    await waitFor(() => expect(courseService.getAllCourses).toHaveBeenCalledTimes(1))
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('reflects what the user types in the search field', async () => {
    const user = userEvent.setup()
    renderSelector()

    await user.type(screen.getByRole('textbox'), 'calculus')

    expect(screen.getByRole('textbox')).toHaveValue('calculus')
  })

  it('lists the courses whose name matches the search term, ignoring case', async () => {
    const user = userEvent.setup()
    renderSelector()
    await waitFor(() => expect(courseService.getAllCourses).toHaveBeenCalled())

    await search(user, 'CALCULUS')

    expect(await screen.findByText('Calculus')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
  })

  it('matches on the combined faculty and course code', async () => {
    const user = userEvent.setup()
    renderSelector()
    await waitFor(() => expect(courseService.getAllCourses).toHaveBeenCalled())

    await search(user, 'comp2404')

    expect(await screen.findByText('Introduction to Software Engineering')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
  })

  it('shows every matching course when the term matches more than one', async () => {
    const user = userEvent.setup()
    renderSelector()
    await waitFor(() => expect(courseService.getAllCourses).toHaveBeenCalled())

    await search(user, 'comp')

    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(2))
    expect(screen.queryByText('Calculus')).not.toBeInTheDocument()
  })

  it('shows no results when nothing matches the search term', async () => {
    const user = userEvent.setup()
    renderSelector()
    await waitFor(() => expect(courseService.getAllCourses).toHaveBeenCalled())

    await search(user, 'underwater basket weaving')

    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('notifies the parent with the course when its checkbox is checked', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const onDeselect = vi.fn()
    renderSelector({ onSelect, onDeselect })
    await waitFor(() => expect(courseService.getAllCourses).toHaveBeenCalled())
    await search(user, 'calculus')

    await user.click(await screen.findByRole('checkbox'))

    expect(onSelect).toHaveBeenCalledWith(courses[2])
    expect(onDeselect).not.toHaveBeenCalled()
  })

  it('keeps previous results visible while a new search term is being typed', async () => {
    const user = userEvent.setup()
    renderSelector()
    await waitFor(() => expect(courseService.getAllCourses).toHaveBeenCalled())
    await search(user, 'calculus')
    expect(await screen.findByText('Calculus')).toBeInTheDocument()

    await user.clear(screen.getByRole('textbox'))
    await user.type(screen.getByRole('textbox'), 'comp')

    expect(screen.getByText('Calculus')).toBeInTheDocument()
  })
})
