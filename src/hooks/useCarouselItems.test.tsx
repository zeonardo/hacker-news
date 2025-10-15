import React from 'react';
import { render, act } from '@testing-library/react';
import { useCarouselItems } from './useCarouselItems';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Test component that uses the hook
function TestComponent({ onItemsChange }: { onItemsChange: (items: number) => void }) {
  const items = useCarouselItems();
  
  React.useEffect(() => {
    onItemsChange(items);
  }, [items, onItemsChange]);
  
  return <div data-testid="test-component">{items}</div>;
}

describe('useCarouselItems', () => {
  let matchMediaSpy: jest.SpyInstance;

  beforeEach(() => {
    // Reset any previous mocks
    matchMediaSpy?.mockRestore();
  });

  afterEach(() => {
    matchMediaSpy?.mockRestore();
  });

  it('returns 1 item for mobile screens (< 600px)', () => {
    matchMediaSpy = jest.spyOn(window, 'matchMedia').mockImplementation((query: string) => {
      const matches = {
        '(min-width: 600px)': false,
        '(min-width: 1024px)': false,
        '(min-width: 1440px)': false,
      }[query] || false;

      return {
        matches,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      } as MediaQueryList;
    });

    let capturedItems = 0;
    const onItemsChange = jest.fn((items: number) => {
      capturedItems = items;
    });

    render(<TestComponent onItemsChange={onItemsChange} />);
    
    expect(capturedItems).toBe(1);
  });

  it('returns 2 items for tablet screens (600px - 1023px)', () => {
    matchMediaSpy = jest.spyOn(window, 'matchMedia').mockImplementation((query: string) => {
      const matches = {
        '(min-width: 600px)': true,
        '(min-width: 1024px)': false,
        '(min-width: 1440px)': false,
      }[query] || false;

      return {
        matches,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      } as MediaQueryList;
    });

    let capturedItems = 0;
    const onItemsChange = jest.fn((items: number) => {
      capturedItems = items;
    });

    render(<TestComponent onItemsChange={onItemsChange} />);
    
    expect(capturedItems).toBe(2);
  });

  it('returns 3 items for desktop screens (1024px - 1439px)', () => {
    matchMediaSpy = jest.spyOn(window, 'matchMedia').mockImplementation((query: string) => {
      const matches = {
        '(min-width: 600px)': true,
        '(min-width: 1024px)': true,
        '(min-width: 1440px)': false,
      }[query] || false;

      return {
        matches,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      } as MediaQueryList;
    });

    let capturedItems = 0;
    const onItemsChange = jest.fn((items: number) => {
      capturedItems = items;
    });

    render(<TestComponent onItemsChange={onItemsChange} />);
    
    expect(capturedItems).toBe(3);
  });

  it('returns 4 items for large desktop screens (>= 1440px)', () => {
    matchMediaSpy = jest.spyOn(window, 'matchMedia').mockImplementation((query: string) => {
      const matches = {
        '(min-width: 600px)': true,
        '(min-width: 1024px)': true,
        '(min-width: 1440px)': true,
      }[query] || false;

      return {
        matches,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      } as MediaQueryList;
    });

    let capturedItems = 0;
    const onItemsChange = jest.fn((items: number) => {
      capturedItems = items;
    });

    render(<TestComponent onItemsChange={onItemsChange} />);
    
    expect(capturedItems).toBe(4);
  });

  it('updates items count when screen size changes', () => {
    // Global state for all media queries
    const globalQueryStates = {
      '(min-width: 600px)': false,
      '(min-width: 1024px)': false,
      '(min-width: 1440px)': false,
    };

    // Store all change handlers that get registered
    const allChangeHandlers: ((event: MediaQueryListEvent) => void)[] = [];

    matchMediaSpy = jest.spyOn(window, 'matchMedia').mockImplementation((query: string) => {
      return {
        get matches() { 
          return globalQueryStates[query as keyof typeof globalQueryStates] || false; 
        },
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn((type: string, handler: (event: MediaQueryListEvent) => void) => {
          if (type === 'change') {
            allChangeHandlers.push(handler);
          }
        }),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      } as MediaQueryList;
    });

    let capturedItems = 0;
    const onItemsChange = jest.fn((items: number) => {
      capturedItems = items;
    });

    render(<TestComponent onItemsChange={onItemsChange} />);

    // Initially should be 1 (mobile)
    expect(capturedItems).toBe(1);

    // Simulate screen size change to tablet (600px+)
    act(() => {
      globalQueryStates['(min-width: 600px)'] = true;
      // Trigger the first handler (should be for 600px query)
      if (allChangeHandlers[0]) {
        allChangeHandlers[0]({} as MediaQueryListEvent);
      }
    });

    expect(capturedItems).toBe(2);

    // Simulate screen size change to desktop (1024px+)
    act(() => {
      globalQueryStates['(min-width: 1024px)'] = true;
      // Trigger the second handler (should be for 1024px query)
      if (allChangeHandlers[1]) {
        allChangeHandlers[1]({} as MediaQueryListEvent);
      }
    });

    expect(capturedItems).toBe(3);

    // Simulate screen size change to large desktop (1440px+)
    act(() => {
      globalQueryStates['(min-width: 1440px)'] = true;
      // Trigger the third handler (should be for 1440px query)
      if (allChangeHandlers[2]) {
        allChangeHandlers[2]({} as MediaQueryListEvent);
      }
    });

    expect(capturedItems).toBe(4);
  });

  it('adds and removes event listeners properly', () => {
    const addEventListenerSpy = jest.fn();
    const removeEventListenerSpy = jest.fn();

    matchMediaSpy = jest.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: addEventListenerSpy,
      removeEventListener: removeEventListenerSpy,
      dispatchEvent: jest.fn(),
    } as MediaQueryList));

    const { unmount } = render(<TestComponent onItemsChange={jest.fn()} />);

    // Check that event listeners were added for all breakpoints
    expect(addEventListenerSpy).toHaveBeenCalledTimes(3);
    expect(addEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function));

    // Unmount the component
    unmount();

    // Check that event listeners were removed
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(3);
    expect(removeEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function));
  });
});