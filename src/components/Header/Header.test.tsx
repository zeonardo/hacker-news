import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';

describe('Header', () => {
  it('renders the header component', () => {
    render(<Header />);
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('displays the application title', () => {
    render(<Header />);
    expect(screen.getByText('Hacker News')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders the newspaper icon', () => {
    render(<Header />);
    const icon = screen.getByTestId('NewspaperIcon');
    expect(icon).toBeInTheDocument();
  });

  it('has the correct styling and structure', () => {
    render(<Header />);
    const header = screen.getByRole('banner');

    // Check if it's an AppBar with correct position
    expect(header).toHaveStyle('position: sticky');
    expect(header).toHaveStyle('background-color: #222728');
  });

  it('renders with elevation styling', () => {
    render(<Header />);
    const header = screen.getByRole('banner');

    // Material-UI AppBar with elevation=2 adds box-shadow
    const computedStyle = window.getComputedStyle(header);
    expect(computedStyle.boxShadow).toBeTruthy();
  });
});
