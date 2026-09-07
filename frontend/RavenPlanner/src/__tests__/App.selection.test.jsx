import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import courseService from '../services/courseService'

vi.mock('../services/courseService', () => ({
  default: { getAllCourses: vi.fn() },
}))

const courses = [
  { id: 1, facultyCode: 'COMP', courseCode: '2402', courseName: 'Abstract Data Types' },
  { id: 2, facultyCode: 'MATH', courseCode: '1007', courseName: 'Calculus' },
]

describe('App course selection', () => {
  beforeEach(() => {
    courseService.getAllCourses.mockReset()
    courseService.getAllCourses.mockResolvedValue(courses)
  })

  it('lists the fetched courses without requiring a search', async () => {
    render(<App />)

    expect(await screen.findAllByRole('listitem')).toHaveLength(courses.length)
  })

  it('checks and unchecks a course without throwing', async () => {
    const user = userEvent.setup()
    const errors = []
    const originalError = console.error
    console.error = (...args) => errors.push(args)

    try {
      render(<App />)
      const checkbox = await screen.findByRole('checkbox', { name: /calculus/i })

      await user.click(checkbox)
      expect(checkbox).toBeChecked()

      await user.click(checkbox)
      expect(checkbox).not.toBeChecked()
    } finally {
      console.error = originalError
    }

    expect(errors).toEqual([])
  })

  it('keeps a course selected across searches', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(await screen.findByRole('checkbox', { name: /calculus/i }))

    await user.type(screen.getByRole('textbox'), 'comp')
    await user.click(screen.getByRole('button', { name: /search/i }))
    expect(screen.queryByRole('checkbox', { name: /calculus/i })).not.toBeInTheDocument()

    await user.clear(screen.getByRole('textbox'))
    await user.click(screen.getByRole('button', { name: /search/i }))
    expect(await screen.findByRole('checkbox', { name: /calculus/i })).toBeChecked()
  })
})
