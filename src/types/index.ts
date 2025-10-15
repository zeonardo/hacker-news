export interface Author {
  id: string;
  karma: number;
}

export interface Story {
  id: number;
  title: string;
  url: string;
  score: number;
  time: number;
  by: string;
  kids: number[];
  type: string;
  descendants: number;
}

export interface StoryWithAuthor extends Story {
  author: {
    id: string;
    karma: number;
  };
}

export interface StoryResponse {
  story: Story;
  author: Author;
}
