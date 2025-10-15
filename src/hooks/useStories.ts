import { useEffect, useState } from 'react';
import type { StoryWithAuthor } from '../types';
import { getRandomTopStories } from '../services/storyService';

export const useStories = () => {
  const [stories, setStories] = useState<StoryWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const stories = await getRandomTopStories();
        setStories(stories.sort((a, b) => a.score - b.score));
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  return { stories, loading, error };
};
