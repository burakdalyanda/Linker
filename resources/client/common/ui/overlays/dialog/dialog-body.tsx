import React, {forwardRef, ReactNode} from 'react';
import clsx from 'clsx';
import {DialogSize} from './dialog';

interface DialogBodyProps {
  children: ReactNode;
  className?: string;
  padding?: string | null;
  size?: DialogSize;
}
export const DialogBody = forwardRef<HTMLDivElement, DialogBodyProps>(
  (props, ref) => {
    const {children, className} = props;
    return (
      <div
        ref={ref}
        className={clsx(
          className,
          getPadding(props),
          'overflow-y-auto overflow-x-hidden text-sm'
        )}
      >
        {children}
      </div>
    );
  }
);

function getPadding({size, padding}: DialogBodyProps) {
  if (padding) {
    return padding;
  }
  switch (size) {
    case 'xs':
      return 'p-14';
    case 'sm':
      return 'p-18';
    default:
      return 'px-24 py-20';
  }
}
