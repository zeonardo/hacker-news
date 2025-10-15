import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StorySlider from './StorySlider';
import type { StoryWithAuthor } from '../../types';

// Mock the useCarouselItems hook
jest.mock('../../hooks/useCarouselItems', () => ({
  useCarouselItems: () => 3,
}));

// Mock react-alice-carousel
jest.mock('react-alice-carousel', () => {
  return function MockCarousel({
    items,
    renderPrevButton,
    renderNextButton,
  }: {
    items: React.ReactNode[];
    renderPrevButton?: () => React.ReactNode;
    renderNextButton?: () => React.ReactNode;
  }) {
    return (
      <div data-testid="carousel">
        {renderPrevButton && <div data-testid="prev-button">{renderPrevButton()}</div>}
        <div data-testid="carousel-items">{items}</div>
        {renderNextButton && <div data-testid="next-button">{renderNextButton()}</div>}
      </div>
    );
  };
});

describe('StorySlider', () => {
  const mockStories: StoryWithAuthor[] = [
    {
      id: 1,
      title: 'Story 1',
      url: 'https://example.com/story1',
      time: 1610000000,
      score: 10,
      by: 'author1',
      kids: [],
      type: 'story',
      descendants: 0,
      author: {
        id: 'author1',
        karma: 100,
      },
    },
    {
      id: 2,
      title: 'Story 2',
      url: 'https://example.com/story2',
      time: 1610000001,
      score: 20,
      by: 'author2',
      kids: [],
      type: 'story',
      descendants: 0,
      author: {
        id: 'author2',
        karma: 200,
      },
    },
    {
      id: 3,
      title: 'Story 3',
      url: 'https://example.com/story3',
      time: 1610000002,
      score: 5,
      by: 'author3',
      kids: [],
      type: 'story',
      descendants: 0,
      author: {
        id: 'author3',
        karma: 300,
      },
    },
  ];

  it('renders stories in ascending order of score', () => {
    render(<StorySlider stories={mockStories} />);

    // Stories should be sorted by score: Story 3 (5), Story 1 (10), Story 2 (20)
    const storyLinks = screen.getAllByRole('link');
    expect(storyLinks[0]).toHaveTextContent('Story 3');
    expect(storyLinks[1]).toHaveTextContent('Story 1');
    expect(storyLinks[2]).toHaveTextContent('Story 2');
  });

  it('displays the correct number of stories', () => {
    render(<StorySlider stories={mockStories} />);

    const storyCards = screen.getAllByRole('article');
    expect(storyCards).toHaveLength(mockStories.length);
  });

  it('renders skeleton when isLoading is true', () => {
    render(<StorySlider stories={mockStories} isLoading={true} />);

    // Check for Material-UI skeleton elements by class name or role
    const skeletonElements = document.querySelectorAll('.MuiSkeleton-root');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('renders skeleton when stories is undefined', () => {
    render(<StorySlider />);

    // Check for Material-UI skeleton elements by class name or role
    const skeletonElements = document.querySelectorAll('.MuiSkeleton-root');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('renders skeleton when stories array is empty', () => {
    render(<StorySlider stories={[]} />);

    // Check for Material-UI skeleton elements by class name or role
    const skeletonElements = document.querySelectorAll('.MuiSkeleton-root');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });
  it('renders carousel with navigation buttons', () => {
    render(<StorySlider stories={mockStories} />);

    expect(screen.getByTestId('carousel')).toBeInTheDocument();
    expect(screen.getByTestId('prev-button')).toBeInTheDocument();
    expect(screen.getByTestId('next-button')).toBeInTheDocument();
  });

  it('renders story cards with correct URLs', () => {
    render(<StorySlider stories={mockStories} />);

    mockStories.forEach((story) => {
      const link = screen.getByRole('link', { name: story.title });
      expect(link).toHaveAttribute('href', story.url);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('renders stories with correct author information', () => {
    render(<StorySlider stories={mockStories} />);

    mockStories.forEach((story) => {
      expect(screen.getByText(story.author.id)).toBeInTheDocument();
      expect(screen.getByText(story.score.toString())).toBeInTheDocument();
      expect(screen.getByText(story.author.karma.toString())).toBeInTheDocument();
    });
  });

  it('renders carousel items with proper structure', () => {
    render(<StorySlider stories={mockStories} />);

    const carouselItems = screen.getByTestId('carousel-items');
    expect(carouselItems).toBeInTheDocument();

    // Each story should be wrapped in a div with carousel_item class
    const items = carouselItems.querySelectorAll('.carousel_item');
    expect(items).toHaveLength(mockStories.length);
  });

  it('renders arrow icons in navigation buttons', () => {
    render(<StorySlider stories={mockStories} />);

    expect(screen.getByTestId('ArrowBackIosIcon')).toBeInTheDocument();
    expect(screen.getByTestId('ArrowForwardIosIcon')).toBeInTheDocument();
  });
});
