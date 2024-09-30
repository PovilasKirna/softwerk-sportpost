import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '@/app/page'
import { Suspense } from 'react'
 
describe('Page', () => {
  it('renders a heading', async () => {
        const ui = await Page();

        render(
            ui
        )
 
    const heading = screen.getByRole('heading', { level: 2 })
 
    expect(heading).toBeInTheDocument()
  })
})