import React from 'react';
import type { StoryWithAuthor } from '../../types';
import StoryCard from '../StoryCard';
import StorySkeleton from '../Skeleton';
import Carousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import '../../styles/alice-carousel-custom.css';
import { useCarouselItems } from '../../hooks/useCarouselItems';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { Box } from '@mui/material';

interface StorySliderProps {
  stories?: StoryWithAuthor[];
  isLoading?: boolean;
}

const StorySlider: React.FC<StorySliderProps> = ({ stories, isLoading }) => {
  const itemsToShow = useCarouselItems();

  if (isLoading || !stories?.length) {
    return <StorySkeleton itemCount={itemsToShow} />;
  }

  const sortedStories = [...stories].sort((a, b) => a.score - b.score);

  return (
    <Box sx={{ maxWidth: '100%', paddingY: 20, bgcolor: '#000' }}>
      <Carousel
        controlsStrategy="responsive"
        disableDotsControls={true}
        paddingLeft={20}
        paddingRight={20}
        autoPlay={false}
        infinite={true}
        responsive={{
          0: { items: 1 },
          600: { items: 2 },
          1024: { items: 3 },
          1440: { items: 4 },
        }}
        renderPrevButton={() => <ArrowBackIos />}
        renderNextButton={() => <ArrowForwardIos />}
        items={sortedStories.map((story) => (
          <div key={story.id} className="carousel_item">
            <StoryCard story={story} />
          </div>
        ))}
      />
    </Box>
  );
};

export default StorySlider;
