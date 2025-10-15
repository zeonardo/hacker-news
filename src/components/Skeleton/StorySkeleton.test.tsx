import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import StorySkeleton from './StorySkeleton';

describe('StorySkeleton component', () => {
  it('renders without crashing', () => {
    render(<StorySkeleton />);
    expect(document.body).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<StorySkeleton />);
    expect(asFragment()).toMatchSnapshot();
  });
});
