import { useRef, useEffect, DependencyList } from 'react';

/**
 * Custom hook for scrolling to the bottom of a container
 * This is commonly used in chat interfaces when new messages arrive
 * 
 * @param dependencies Array of dependencies that trigger scrolling when changed
 * @returns Object with ref to attach to the target element, and a function to manually trigger scrolling
 */
export const useScrollToBottom = <T extends HTMLElement>(
  dependencies: DependencyList = [],
  options: { behavior?: ScrollBehavior; block?: ScrollIntoViewOptions['block'] } = {}
) => {
  const ref = useRef<T>(null);
  
  const { behavior = 'smooth', block = 'end' } = options;
  
  // Function to manually trigger scrolling
  const scrollToBottom = () => {
    if (ref.current) {
      ref.current.scrollIntoView({ 
        behavior, 
        block,
      });
    }
  };
  
  // Automatically scroll when dependencies change
  useEffect(() => {
    scrollToBottom();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
  
  return { ref, scrollToBottom };
};

/**
 * Hook for auto-scrolling a scrollable container to the bottom
 * Used when you want to scroll a div with overflow: auto
 * 
 * @param dependencies Array of dependencies that trigger scrolling when changed
 * @returns Object with ref to attach to the scrollable container and functions to control scrolling
 */
export const useScrollableContainer = <T extends HTMLElement>(
  dependencies: DependencyList = [],
  options: { 
    smoothScroll?: boolean;
    scrollThreshold?: number; // How close to bottom (px) should auto-scroll engage
  } = {}
) => {
  const ref = useRef<T>(null);
  const { smoothScroll = true, scrollThreshold = 100 } = options;
  
  // Scroll to bottom of container
  const scrollToBottom = () => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  };
  
  // Smooth scroll to bottom
  const smoothScrollToBottom = () => {
    if (ref.current) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };
  
  // Auto-scroll only if user is already near the bottom
  const scrollToBottomIfNeeded = () => {
    if (ref.current) {
      const { scrollTop, scrollHeight, clientHeight } = ref.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight <= scrollThreshold;
      
      if (isNearBottom) {
        if (smoothScroll) {
          smoothScrollToBottom();
        } else {
          scrollToBottom();
        }
      }
    }
  };
  
  // Auto-scroll when dependencies change
  useEffect(() => {
    scrollToBottomIfNeeded();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
  
  return {
    ref,
    scrollToBottom,
    smoothScrollToBottom,
    scrollToBottomIfNeeded
  };
}; 