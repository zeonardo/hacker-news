import React from 'react';
import { Card, CardContent, Typography, Link, Box } from '@mui/material';
import { Star, Straight } from '@mui/icons-material';
import type { StoryWithAuthor } from '../../types';
import { formatDate } from '../../utils';

interface StoryCardProps {
  story?: StoryWithAuthor;
}

const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  if (!story) return null;

  const formattedDate = formatDate(story.time);

  return (
    <Card
      role="article"
      variant="outlined"
      sx={{ minWidth: 300, cursor: 'pointer', height: '100%' }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Typography
          title={story.title}
          variant="subtitle1"
          component="div"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 'auto',
            pb: 1,
          }}
        >
          <Link href={story.url} color="text.primary" target="_blank" rel="noopener noreferrer">
            {story.title}
          </Link>
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="caption" color="text.secondary">
            {formattedDate}
          </Typography>
          <Typography
            title={`Score: ${story.score}`}
            variant="caption"
            color="text.disabled"
            display="flex"
            alignItems="center"
          >
            {story.score}
            <Star sx={{ color: 'gold', fontSize: 16, ml: 0.5 }} />
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="text.secondary">
            Author:{' '}
            <Typography component="span" color="text.primary" fontSize="inherit">
              {story.author.id}
            </Typography>
          </Typography>
          <Typography
            title={`Karma: ${story.author.karma}`}
            variant="caption"
            color="text.disabled"
            display="flex"
            alignItems="center"
          >
            {story.author.karma}
            <Straight sx={{ color: 'green', fontSize: 16, ml: 0.5 }} />
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StoryCard;
