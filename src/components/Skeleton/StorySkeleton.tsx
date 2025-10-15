import React from 'react';
import { Box, Skeleton, Stack } from '@mui/material';

interface StorySkeletonProps {
  itemCount?: number;
}

const StorySkeleton: React.FC<StorySkeletonProps> = ({ itemCount = 1 }) => (
  <Stack
    direction="row"
    alignItems="stretch"
    minHeight={100}
    spacing={2}
    sx={{ overflowX: 'auto', paddingX: 2 }}
  >
    {Array.from({ length: itemCount }).map((_, index) => (
      <Box key={`skeleton-${index}`} minWidth={300} width="100%" py={'.5rem'} px={2}>
        <Skeleton variant="text" width="100%" height={'2rem'} />
        <Skeleton variant="text" width="80%" height={'2rem'} />
        <Box display="flex" justifyContent={'space-between'} my={1}>
          <Skeleton variant="text" width="50%" />
          <Skeleton variant="text" width="30%" />
        </Box>
        <Box display="flex" justifyContent={'space-between'}>
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="30%" />
        </Box>
      </Box>
    ))}
  </Stack>
);

export default StorySkeleton;
