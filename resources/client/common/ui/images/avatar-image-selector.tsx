import {IconButton} from '../buttons/icon-button';
import {openUploadWindow} from '../../uploads/utils/open-upload-window';
import {UploadInputType} from '../../uploads/types/upload-input-config';
import {AddAPhotoIcon} from '../../icons/material/AddAPhoto';
import {Button} from '../buttons/button';
import {UploadedFile} from '../../uploads/uploaded-file';
import {Trans} from '../../i18n/trans';
import {ReactNode} from 'react';

export const MaxImageSize = 1572864;

export interface ImageUploaderProps {
  className?: string;
  onUpload: (file: UploadedFile) => void;
  onRemove: () => void;
  value?: string | null;
  isLoading: boolean;
  title?: ReactNode;
  defaultImage?: ReactNode;
  imageRadius?: string;
}
export function AvatarImageSelector({
  value,
  isLoading,
  onUpload,
  onRemove,
  className,
  title,
  defaultImage,
  imageRadius = 'rounded-full',
}: ImageUploaderProps) {
  return (
    <div className={className}>
      {title && <div className="text-sm mb-18">{title}</div>}
      <div className="w-90 h-90 relative">
        {value ? (
          <img
            src={value}
            className={`w-full h-full object-cover ${imageRadius}`}
            alt=""
          />
        ) : (
          defaultImage
        )}
        <div className="bg-paper shadow-xl absolute -bottom-2 -right-2 rounded-full">
          <IconButton
            disabled={isLoading}
            type="button"
            size="sm"
            color="primary"
            onClick={async () => {
              const files = await openUploadWindow({
                types: [UploadInputType.image],
              });
              onUpload(files[0]);
            }}
          >
            <AddAPhotoIcon />
          </IconButton>
        </div>
      </div>
      <Button
        type="button"
        disabled={isLoading || !value}
        variant="link"
        color="primary"
        size="xs"
        className="mt-18"
        onClick={() => {
          onRemove();
        }}
      >
        <Trans message="Remove image" />
      </Button>
    </div>
  );
}
