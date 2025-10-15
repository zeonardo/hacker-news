import React from 'react';
import { useStories } from './hooks';
import StorySlider from './components/StorySlider';
import Header from './components/Header';
import { Container, Typography } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';
import Footer from './components/Footer';

const App: React.FC = () => {
  const { stories, loading } = useStories();

  return (
    <Container maxWidth={false} disableGutters className="app">
      <main>
        <Header />
        <Typography variant="h1" align="center" fontSize="2rem" py={4}>
          Top Stories
        </Typography>
        <StorySlider stories={stories} isLoading={loading} />
        <Footer />
      </main>
    </Container>
  );
};

export default App;
