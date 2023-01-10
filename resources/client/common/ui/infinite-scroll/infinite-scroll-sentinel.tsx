import {AnimatePresence, m} from 'framer-motion';
import {ProgressCircle} from '../progress/progress-circle';
import React, {Fragment, useEffect, useRef} from 'react';
import {opacityAnimation} from '../animation/opacity-animation';

interface InfiniteScrollSentinelProps {
  onIntersection: () => void;
  isFetchingNextPage: boolean;
  hasNextPage?: boolean;
}
export function InfiniteScrollSentinel({
  onIntersection,
  isFetchingNextPage,
  hasNextPage,
}: InfiniteScrollSentinelProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinelEl = sentinelRef.current;
    if (!sentinelEl) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        onIntersection();
      }
    });
    observer.observe(sentinelEl);
    return () => {
      observer.unobserve(sentinelEl);
    };
  }, [onIntersection, hasNextPage]);

  return (
    <Fragment>
      <span ref={sentinelRef} aria-hidden />
      <AnimatePresence>
        {isFetchingNextPage && (
          <m.div
            className="flex justify-center mt-24 w-full"
            {...opacityAnimation}
          >
            <ProgressCircle isIndeterminate aria-label="loading" />
          </m.div>
        )}
      </AnimatePresence>
    </Fragment>
  );
}
