import {ProgressCircle} from './progress-circle';
import React from 'react';

export function FullPageLoader() {
  return (
    <div className="flex items-center justify-center h-full w-full flex-auto">
      <ProgressCircle isIndeterminate aria-label="Loading page..." />
    </div>
  );
}
