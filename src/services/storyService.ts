import { fetchTopStories, fetchStoryDetails, fetchAuthorDetails } from '../api';
import { STORIES_LIMIT } from '../constants';
import type { StoryWithAuthor } from '../types';

export const getRandomTopStories = async (): Promise<StoryWithAuthor[]> => {
  const topStoryIds = await fetchTopStories();
  const randomStoryIds = topStoryIds.sort(() => 0.5 - Math.random()).slice(0, STORIES_LIMIT);

  return Promise.all(
    randomStoryIds.map(async (id) => {
      const story = await fetchStoryDetails(id);
      const author = await fetchAuthorDetails(story.by);

      return {
        ...story,
        author: {
          id: author.id,
          karma: author.karma,
        },
      };
    })
  );
};
