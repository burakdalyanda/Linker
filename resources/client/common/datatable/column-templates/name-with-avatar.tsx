import React, {ReactNode} from 'react';
import {Avatar} from '../../ui/images/avatar';

interface Props {
  image?: string;
  label: ReactNode;
  description: ReactNode;
}
export function NameWithAvatar({image, label, description}: Props) {
  return (
    <div className="flex items-center gap-12 w-max">
      {image && <Avatar size="md" src={image} />}
      <div>
        <div>{label}</div>
        <div className="text-muted text-xs">{description}</div>
      </div>
    </div>
  );
}
