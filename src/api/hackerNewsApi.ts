import axios from 'axios';
import type { Author, Story } from '../types';

const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

export const fetchTopStories = async (): Promise<number[]> => {
  const response = await axios.get(`${BASE_URL}/topstories.json`);
  return response.data;
};

export const fetchStoryDetails = async (id: number): Promise<Story> => {
  const response = await axios.get(`${BASE_URL}/item/${id}.json`);
  return response.data;
};

export const fetchAuthorDetails = async (id: string): Promise<Author> => {
  const response = await axios.get(`${BASE_URL}/user/${id}.json`);
  return response.data;
};
