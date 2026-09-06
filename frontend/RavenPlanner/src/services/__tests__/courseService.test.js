import axios from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import courseService from '../courseService'

vi.mock('axios', () => ({
  default: { get: vi.fn() },
}))

describe('courseService.getAllCourses', () => {
  beforeEach(() => {
    axios.get.mockReset()
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('requests the courses endpoint and returns the response payload', async () => {
    const courses = [{ id: 1, facultyCode: 'COMP', courseCode: '2402', courseName: 'ADT' }]
    axios.get.mockResolvedValue({ data: courses })

    await expect(courseService.getAllCourses()).resolves.toEqual(courses)
    expect(axios.get).toHaveBeenCalledWith('/api/courses')
  })

  it('resolves with undefined instead of throwing when the request fails', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'))

    await expect(courseService.getAllCourses()).resolves.toBeUndefined()
  })
})
