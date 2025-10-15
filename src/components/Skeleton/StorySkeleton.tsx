import React from 'react';
import { Box, Skeleton, Stack } from '@mui/material';

interface StorySkeletonProps {
  itemCount?: number;
}

const skeletonTheme = { bgcolor: 'grey.500' };

const StorySkeleton: React.FC<StorySkeletonProps> = ({ itemCount = 1 }) => (
  <Stack
    direction="row"
    alignItems="stretch"
    minHeight={100}
    spacing={2}
    sx={{ overflowX: 'auto', paddingX: 2, bgcolor: 'black' }}
  >
    {Array.from({ length: itemCount }).map((_, index) => (
      <Box
        key={`skeleton-${index}`}
        minWidth={300}
        width="100%"
        py={'.5rem'}
        px={2}
        sx={{ maxWidth: '100%', paddingY: 20, bgcolor: '#000' }}
      >
        <Skeleton sx={{ ...skeletonTheme }} variant="text" width="100%" height={'2rem'} />
        <Skeleton sx={{ ...skeletonTheme }} variant="text" width="80%" height={'2rem'} />
        <Box display="flex" justifyContent={'space-between'} my={1}>
          <Skeleton sx={{ ...skeletonTheme }} variant="text" width="50%" />
          <Skeleton sx={{ ...skeletonTheme }} variant="text" width="30%" />
        </Box>
        <Box display="flex" justifyContent={'space-between'}>
          <Skeleton sx={{ ...skeletonTheme }} variant="text" width="40%" />
          <Skeleton sx={{ ...skeletonTheme }} variant="text" width="30%" />
        </Box>
      </Box>
    ))}
  </Stack>
);

export default StorySkeleton;
