import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useStories } from './useStories';
import { getRandomTopStories } from '../services/storyService';
import type { StoryWithAuthor } from '../types';

// Mock the storyService
jest.mock('../services/storyService', () => ({
  getRandomTopStories: jest.fn(),
}));

const mockGetRandomTopStories = getRandomTopStories as jest.MockedFunction<typeof getRandomTopStories>;

// Test component that uses the hook
function TestComponent() {
  const { stories, loading, error } = useStories();
  
  if (loading) return <div data-testid="loading">Loading...</div>;
  if (error) return <div data-testid="error">{error.message}</div>;
  
  return (
    <div data-testid="stories">
      {stories.map(story => (
        <div key={story.id} data-testid={`story-${story.id}`}>
          {story.title} - Score: {story.score}
        </div>
      ))}
    </div>
  );
}

describe('useStories', () => {
  const mockStories: StoryWithAuthor[] = [
    {
      id: 3,
      title: 'Story 3',
      url: 'https://example.com/3',
      score: 5,
      time: 1620000002,
      by: 'author3',
      kids: [],
      type: 'story',
      descendants: 0,
      author: { id: 'author3', karma: 300 },
    },
    {
      id: 1,
      title: 'Story 1',
      url: 'https://example.com/1',
      score: 10,
      time: 1620000000,
      by: 'author1',
      kids: [],
      type: 'story',
      descendants: 0,
      author: { id: 'author1', karma: 100 },
    },
    {
      id: 2,
      title: 'Story 2',
      url: 'https://example.com/2',
      score: 20,
      time: 1620000001,
      by: 'author2',
      kids: [],
      type: 'story',
      descendants: 0,
      author: { id: 'author2', karma: 200 },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch stories and return them sorted by score', async () => {
    mockGetRandomTopStories.mockResolvedValue(mockStories);

    render(<TestComponent />);

    // Initially should show loading
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    // Wait for stories to load
    await waitFor(() => {
      expect(screen.getByTestId('stories')).toBeInTheDocument();
    });

    // Check if stories are sorted by score (ascending: 5, 10, 20)
    const storyElements = screen.getAllByTestId(/^story-/);
    expect(storyElements).toHaveLength(3);
    
    // Verify order by checking the text content
    expect(storyElements[0]).toHaveTextContent('Story 3 - Score: 5');
    expect(storyElements[1]).toHaveTextContent('Story 1 - Score: 10');
    expect(storyElements[2]).toHaveTextContent('Story 2 - Score: 20');

    // Verify the service was called
    expect(mockGetRandomTopStories).toHaveBeenCalledTimes(1);
  });

  it('should handle errors gracefully', async () => {
    const errorMessage = 'API is down';
    mockGetRandomTopStories.mockRejectedValue(new Error(errorMessage));

    render(<TestComponent />);

    // Initially should show loading
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });

    // Check if error message is displayed
    expect(screen.getByTestId('error')).toHaveTextContent(errorMessage);

    // Verify the service was called
    expect(mockGetRandomTopStories).toHaveBeenCalledTimes(1);
  });

  it('should handle non-Error objects in catch block', async () => {
    mockGetRandomTopStories.mockRejectedValue('String error');

    render(<TestComponent />);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });

    // Should show generic error message
    expect(screen.getByTestId('error')).toHaveTextContent('An error occurred');
  });

  it('should start in loading state', () => {
    mockGetRandomTopStories.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<TestComponent />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.queryByTestId('stories')).not.toBeInTheDocument();
    expect(screen.queryByTestId('error')).not.toBeInTheDocument();
  });

  it('should handle empty stories array', async () => {
    mockGetRandomTopStories.mockResolvedValue([]);

    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('stories')).toBeInTheDocument();
    });

    // Should show stories container but no individual stories
    expect(screen.getByTestId('stories')).toBeInTheDocument();
    expect(screen.queryAllByTestId(/^story-/)).toHaveLength(0);
  });
});
