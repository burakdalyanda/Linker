import {ComponentPropsWithRef} from 'react';

export const LinkStyle =
  'text-primary hover:underline hover:text-primary-dark focus:ring focus:ring-2 focus:ring-offset-2 outline-none rounded transition-colors';

interface ExternalLinkProps extends ComponentPropsWithRef<'a'> {}
export function ExternalLink({
  children,
  className,
  target = '_blank',
  ...domProps
}: ExternalLinkProps) {
  return (
    <a className={LinkStyle} target={target} {...domProps}>
      {children}
    </a>
  );
}
