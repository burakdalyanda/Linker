import React, {forwardRef, useEffect, useRef} from 'react';
import {m} from 'framer-motion';
import {mergeProps, useObjectRef} from '@react-aria/utils';
import {PopoverAnimation} from './popover-animation';
import {OverlayProps} from './overlay-props';
import {useOverlayViewport} from './use-overlay-viewport';
import {FocusScope} from '@react-aria/focus';
import {useOverlay} from '@react-aria/overlays';

export const Popover = forwardRef<HTMLDivElement, OverlayProps>(
  (
    {
      children,
      style,
      autoFocus = false,
      restoreFocus = true,
      isDismissable,
      isOpen,
      onClose,
      triggerRef,
      arrowRef,
      arrowStyle,
      onPointerLeave,
      onPointerEnter,
    },
    ref
  ) => {
    const viewPortStyle = useOverlayViewport();
    const objRef = useObjectRef(ref);
    const scrollCallbackRef = useRef<(e: Event) => void>();

    const {overlayProps} = useOverlay(
      {
        isDismissable,
        isOpen,
        onClose,
        shouldCloseOnInteractOutside: el => {
          // prevent closing on trigger click popover
          if (triggerRef.current) {
            return !triggerRef.current.contains?.(el);
          }
          return true;
        },
      },
      objRef
    );

    // close popover on scroll
    useEffect(() => {
      if (!isOpen) {
        return;
      }

      const onScroll = (e: Event) => {
        // Ignore if scrolling a scrollable region outside the trigger's tree.
        const target = e.target;

        if (!triggerRef.current) {
          return;
        }

        // always close context menu on scroll as there's no trigger node
        if (!(triggerRef.current instanceof Node)) {
          onClose();
          return;
        }

        // window is not a Node and doesn't have contain, but window contains everything
        if (!(target instanceof Node) || target.contains(triggerRef.current)) {
          onClose();
        }
      };

      // wait for floating-ui positioning to complete, otherwise scroll event
      // might be fired on popover open and popover will close automatically
      setTimeout(() => {
        if (scrollCallbackRef.current) return;
        scrollCallbackRef.current = onScroll;
        window.addEventListener('scroll', scrollCallbackRef.current, true);
      }, 10);
      return () => {
        if (scrollCallbackRef.current) {
          window.removeEventListener('scroll', scrollCallbackRef.current, true);
        }
      };
    }, [isOpen, onClose, triggerRef]);

    return (
      <m.div
        className="z-popover isolate max-h-384"
        role="presentation"
        ref={objRef}
        style={{...viewPortStyle, ...style, position: 'fixed'}}
        {...PopoverAnimation}
        {...mergeProps(overlayProps as any, {onPointerLeave, onPointerEnter})}
      >
        <FocusScope
          restoreFocus={restoreFocus}
          autoFocus={autoFocus}
          contain={false}
        >
          {children}
        </FocusScope>
      </m.div>
    );
  }
);
