import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders the copyright message', () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(`© ${year} Hacker News. All rights reserved.`)).toBeInTheDocument();
  });

  it('has a black background and is positioned at the bottom', () => {
    render(<Footer />);
    const footer = screen.getByTestId('footer');
    expect(footer).toHaveStyle('background-color: #000');
    expect(footer).toHaveStyle('position: fixed');
    expect(footer).toHaveStyle('bottom: 0px');
  });
});
