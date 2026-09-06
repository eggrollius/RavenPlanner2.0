import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from '../App'

vi.mock('../components/CourseSelector.jsx', () => ({
  default: () => <div>course selector</div>,
}))

describe('App', () => {
  it('renders the application heading and the course selector', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Raven Planner' })).toBeInTheDocument()
    expect(screen.getByText('course selector')).toBeInTheDocument()
  })
})
