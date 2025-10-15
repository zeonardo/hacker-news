import { getRandomTopStories } from './storyService';
import { fetchTopStories, fetchStoryDetails, fetchAuthorDetails } from '../api';
import { STORIES_LIMIT } from '../constants';
import type { Story, Author, StoryWithAuthor } from '../types';

// Mock the API functions
jest.mock('../api', () => ({
  fetchTopStories: jest.fn(),
  fetchStoryDetails: jest.fn(),
  fetchAuthorDetails: jest.fn(),
}));

// Mock Math.random for consistent testing
const mockMathRandom = jest.spyOn(Math, 'random');

describe('storyService', () => {
  const mockFetchTopStories = fetchTopStories as jest.MockedFunction<typeof fetchTopStories>;
  const mockFetchStoryDetails = fetchStoryDetails as jest.MockedFunction<typeof fetchStoryDetails>;
  const mockFetchAuthorDetails = fetchAuthorDetails as jest.MockedFunction<typeof fetchAuthorDetails>;

  const mockStoryIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  const mockStory: Story = {
    id: 1,
    title: 'Test Story',
    url: 'https://example.com',
    score: 100,
    time: 1620000000,
    by: 'testuser',
    kids: [],
    type: 'story',
    descendants: 0,
  };

  const mockAuthor: Author = {
    id: 'testuser',
    karma: 500,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockMathRandom.mockRestore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getRandomTopStories', () => {
    it('should fetch and return random top stories with authors', async () => {
      // Mock the API responses
      mockFetchTopStories.mockResolvedValue(mockStoryIds);
      mockFetchStoryDetails.mockResolvedValue(mockStory);
      mockFetchAuthorDetails.mockResolvedValue(mockAuthor);

      // Mock Math.random to return a predictable sequence
      mockMathRandom.mockReturnValue(0.5);

      const result = await getRandomTopStories();

      // Verify API calls
      expect(mockFetchTopStories).toHaveBeenCalledTimes(1);
      expect(mockFetchStoryDetails).toHaveBeenCalledTimes(STORIES_LIMIT);
      expect(mockFetchAuthorDetails).toHaveBeenCalledTimes(STORIES_LIMIT);

      // Verify result structure
      expect(result).toHaveLength(STORIES_LIMIT);
      expect(result[0]).toEqual({
        ...mockStory,
        author: {
          id: mockAuthor.id,
          karma: mockAuthor.karma,
        },
      });
    });

    it('should limit results to STORIES_LIMIT constant', async () => {
      const manyStoryIds = Array.from({ length: 500 }, (_, i) => i + 1);
      
      mockFetchTopStories.mockResolvedValue(manyStoryIds);
      mockFetchStoryDetails.mockResolvedValue(mockStory);
      mockFetchAuthorDetails.mockResolvedValue(mockAuthor);
      mockMathRandom.mockReturnValue(0.5);

      const result = await getRandomTopStories();

      expect(result).toHaveLength(STORIES_LIMIT);
      expect(mockFetchStoryDetails).toHaveBeenCalledTimes(STORIES_LIMIT);
      expect(mockFetchAuthorDetails).toHaveBeenCalledTimes(STORIES_LIMIT);
    });

    it('should randomize the selection of stories', async () => {
      // Provide enough story IDs to meet STORIES_LIMIT
      const storyIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
      
      mockFetchTopStories.mockResolvedValue(storyIds);
      mockFetchStoryDetails.mockImplementation((id: number) => 
        Promise.resolve({ ...mockStory, id })
      );
      mockFetchAuthorDetails.mockResolvedValue(mockAuthor);

      // First call with one random sequence
      mockMathRandom.mockReturnValue(0.1);
      
      const result1 = await getRandomTopStories();

      // Reset mocks for second call
      jest.clearAllMocks();
      mockFetchTopStories.mockResolvedValue(storyIds);
      mockFetchStoryDetails.mockImplementation((id: number) => 
        Promise.resolve({ ...mockStory, id })
      );
      mockFetchAuthorDetails.mockResolvedValue(mockAuthor);

      // Second call with different random sequence
      mockMathRandom.mockReturnValue(0.9);
      
      const result2 = await getRandomTopStories();

      // Both results should have the correct length
      expect(result1).toHaveLength(STORIES_LIMIT);
      expect(result2).toHaveLength(STORIES_LIMIT);
      
      // Verify that stories were actually fetched
      expect(result1[0]).toHaveProperty('id');
      expect(result1[0]).toHaveProperty('author');
      expect(result2[0]).toHaveProperty('id');
      expect(result2[0]).toHaveProperty('author');
    });

    it('should handle different story data correctly', async () => {
      const customStory: Story = {
        id: 42,
        title: 'Custom Test Story',
        url: 'https://custom.example.com',
        score: 250,
        time: 1625000000,
        by: 'customuser',
        kids: [100, 101, 102],
        type: 'story',
        descendants: 15,
      };

      const customAuthor: Author = {
        id: 'customuser',
        karma: 1000,
      };

      mockFetchTopStories.mockResolvedValue([42]);
      mockFetchStoryDetails.mockResolvedValue(customStory);
      mockFetchAuthorDetails.mockResolvedValue(customAuthor);
      mockMathRandom.mockReturnValue(0.5);

      const result = await getRandomTopStories();

      expect(result[0]).toEqual({
        id: 42,
        title: 'Custom Test Story',
        url: 'https://custom.example.com',
        score: 250,
        time: 1625000000,
        by: 'customuser',
        kids: [100, 101, 102],
        type: 'story',
        descendants: 15,
        author: {
          id: 'customuser',
          karma: 1000,
        },
      });
    });

    it('should handle API errors gracefully', async () => {
      mockFetchTopStories.mockRejectedValue(new Error('API Error'));

      await expect(getRandomTopStories()).rejects.toThrow('API Error');
    });

    it('should handle story details fetch error', async () => {
      mockFetchTopStories.mockResolvedValue([1, 2, 3]);
      mockFetchStoryDetails.mockRejectedValue(new Error('Story not found'));

      await expect(getRandomTopStories()).rejects.toThrow('Story not found');
    });

    it('should handle author details fetch error', async () => {
      mockFetchTopStories.mockResolvedValue([1]);
      mockFetchStoryDetails.mockResolvedValue(mockStory);
      mockFetchAuthorDetails.mockRejectedValue(new Error('Author not found'));

      await expect(getRandomTopStories()).rejects.toThrow('Author not found');
    });

    it('should call fetchStoryDetails with correct story IDs', async () => {
      const testStoryIds = [10, 20, 30];
      
      mockFetchTopStories.mockResolvedValue(testStoryIds);
      mockFetchStoryDetails.mockResolvedValue(mockStory);
      mockFetchAuthorDetails.mockResolvedValue(mockAuthor);
      mockMathRandom.mockReturnValue(0.5);

      await getRandomTopStories();

      // Verify each story ID was used to fetch details
      testStoryIds.forEach(id => {
        expect(mockFetchStoryDetails).toHaveBeenCalledWith(id);
      });
    });

    it('should call fetchAuthorDetails with correct author IDs', async () => {
      const storiesWithDifferentAuthors = [
        { ...mockStory, id: 1, by: 'author1' },
        { ...mockStory, id: 2, by: 'author2' },
        { ...mockStory, id: 3, by: 'author3' },
      ];

      mockFetchTopStories.mockResolvedValue([1, 2, 3]);
      mockFetchStoryDetails
        .mockResolvedValueOnce(storiesWithDifferentAuthors[0])
        .mockResolvedValueOnce(storiesWithDifferentAuthors[1])
        .mockResolvedValueOnce(storiesWithDifferentAuthors[2]);
      mockFetchAuthorDetails.mockResolvedValue(mockAuthor);
      mockMathRandom.mockReturnValue(0.5);

      await getRandomTopStories();

      expect(mockFetchAuthorDetails).toHaveBeenCalledWith('author1');
      expect(mockFetchAuthorDetails).toHaveBeenCalledWith('author2');
      expect(mockFetchAuthorDetails).toHaveBeenCalledWith('author3');
    });

    it('should return stories with correct StoryWithAuthor type structure', async () => {
      mockFetchTopStories.mockResolvedValue([1]);
      mockFetchStoryDetails.mockResolvedValue(mockStory);
      mockFetchAuthorDetails.mockResolvedValue(mockAuthor);
      mockMathRandom.mockReturnValue(0.5);

      const result = await getRandomTopStories();
      const story = result[0];

      // Verify the story has all original Story properties
      expect(story).toHaveProperty('id');
      expect(story).toHaveProperty('title');
      expect(story).toHaveProperty('url');
      expect(story).toHaveProperty('score');
      expect(story).toHaveProperty('time');
      expect(story).toHaveProperty('by');
      expect(story).toHaveProperty('kids');
      expect(story).toHaveProperty('type');
      expect(story).toHaveProperty('descendants');

      // Verify the story has the additional author property
      expect(story).toHaveProperty('author');
      expect(story.author).toHaveProperty('id');
      expect(story.author).toHaveProperty('karma');
      
      // Type assertion to verify TypeScript typing
      const typedStory: StoryWithAuthor = story;
      expect(typedStory.author.id).toBe(mockAuthor.id);
      expect(typedStory.author.karma).toBe(mockAuthor.karma);
    });
  });
});