import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../../App'

describe('Roomly home page', () => {
  it('opens by default and connects the demo portal back to home', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Your space.Your home.All in one place.')
    await user.click(screen.getByRole('button', { name: 'Open the demo portal' }))
    expect(screen.getByRole('heading', { name: 'Tenant profile' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Roomly home' }))
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('All in one place.')
  })

  it('toggles navigation and closes it with Escape or an anchor', async () => {
    const user = userEvent.setup()
    render(<App />)
    const menu = screen.getByRole('button', { name: /Menu/ })
    await user.click(menu)
    expect(menu).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard('{Escape}')
    expect(menu).toHaveAttribute('aria-expanded', 'false')
    expect(menu).toHaveFocus()
    await user.click(menu)
    await user.click(screen.getByRole('link', { name: 'How it works' }))
    expect(menu).toHaveAttribute('aria-expanded', 'false')
  })

  it('exposes the demo limitations in the expandable FAQ', async () => {
    const user = userEvent.setup()
    render(<App />)
    const question = screen.getByText('Is this a live rental portal?')
    expect(question.closest('details')).not.toHaveAttribute('open')
    await user.click(question)
    expect(question.closest('details')).toHaveAttribute('open')
    expect(screen.getByText(/Authentication, stored tenant records/)).toBeInTheDocument()
  })
})
