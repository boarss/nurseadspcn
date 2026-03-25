import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import HomePage from '../app/page'

// Mock next/link to avoid router context errors in simple component tests
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('HomePage', () => {
  it('renders the header and main content', () => {
    render(<HomePage />)
    
    // Check that NurseAda branding appears
    const brandName = screen.getByText('NurseAda', { selector: 'span' })
    expect(brandName).toBeInTheDocument()
    
    // Check for the hero section
    const heroTitle = screen.getByText(/Healthcare Companion/i)
    expect(heroTitle).toBeInTheDocument()
    
    // Check for features
    const featureSymptomAnalysis = screen.getByText('Symptom Analysis')
    expect(featureSymptomAnalysis).toBeInTheDocument()
  })
})
