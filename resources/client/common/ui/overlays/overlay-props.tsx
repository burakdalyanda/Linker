import {
  CSSProperties,
  PointerEventHandler,
  ReactElement,
  Ref,
  RefObject,
} from 'react';
import {FocusScopeProps} from '@react-aria/focus';

export interface OverlayProps
  extends Omit<FocusScopeProps, 'children' | 'contain'> {
  children: ReactElement;
  style?: CSSProperties;
  isDismissable: boolean;
  isOpen: boolean;
  onClose: (value?: any) => void;
  triggerRef: RefObject<HTMLElement>;
  arrowRef?: Ref<HTMLElement>;
  arrowStyle?: CSSProperties;
  onPointerLeave?: PointerEventHandler<HTMLElement>;
  onPointerEnter?: PointerEventHandler<HTMLElement>;
}
