import { useEffect, useState, useCallback } from 'react';

export function useCarouselItems() {
  const getItems = useCallback(() => {
    if (window.matchMedia('(min-width: 1440px)').matches) return 4;
    if (window.matchMedia('(min-width: 1024px)').matches) return 3;
    if (window.matchMedia('(min-width: 600px)').matches) return 2;
    return 1;
  }, []);

  const [items, setItems] = useState(getItems);

  useEffect(() => {
    const handler = () => setItems(getItems);

    const queries = [
      window.matchMedia('(min-width: 600px)'),
      window.matchMedia('(min-width: 1024px)'),
      window.matchMedia('(min-width: 1440px)'),
    ];

    queries.forEach((q) => q.addEventListener('change', handler));
    return () => queries.forEach((q) => q.removeEventListener('change', handler));
  }, [getItems]);

  return items;
}
