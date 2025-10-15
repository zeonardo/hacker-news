import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StoryCard from './StoryCard';
import type { StoryWithAuthor } from '../../types';
import { formatDate } from '../../utils';

describe('StoryCard', () => {
  const mockStory: StoryWithAuthor = {
    id: 1,
    title: 'Test Story Title',
    url: 'https://example.com',
    time: 1620000000,
    score: 100,
    by: 'testAuthor',
    kids: [],
    type: 'story',
    descendants: 0,
    author: {
      id: 'testAuthor',
      karma: 200,
    },
  };

  it('renders the story card when story is provided', () => {
    render(<StoryCard story={mockStory} />);
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('returns null when no story is provided', () => {
    const { container } = render(<StoryCard />);
    expect(container.firstChild).toBeNull();
  });

  it('renders story title as a clickable link', () => {
    render(<StoryCard story={mockStory} />);
    const link = screen.getByRole('link', { name: mockStory.title });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', mockStory.url);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders formatted date', () => {
    render(<StoryCard story={mockStory} />);
    const formattedDate = formatDate(mockStory.time);
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });

  it('renders story score with star icon', () => {
    render(<StoryCard story={mockStory} />);
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByTestId('StarIcon')).toBeInTheDocument();
  });

  it('renders author information', () => {
    render(<StoryCard story={mockStory} />);
    expect(screen.getByText('Author:')).toBeInTheDocument();
    expect(screen.getByText('testAuthor')).toBeInTheDocument();
  });

  it('renders author karma with straight icon', () => {
    render(<StoryCard story={mockStory} />);
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByTestId('StraightIcon')).toBeInTheDocument();
  });

  it('truncates long titles properly', () => {
    const longTitleStory = {
      ...mockStory,
      title:
        'This is a very long title that should be truncated when displayed in the card component to maintain proper layout and readability',
    };

    render(<StoryCard story={longTitleStory} />);
    const titleElement = screen.getByRole('link');

    // Check that the title has the truncation styles
    expect(titleElement.closest('div')).toHaveStyle({
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
    });
  });
});
