import {FormTextField} from '@common/ui/forms/input-field/text-field/text-field';
import {Trans} from '@common/i18n/trans';
import {useActiveUpload} from '@common/uploads/uploader/use-active-upload';
import {
  AvatarImageSelector,
  MaxImageSize,
} from '@common/ui/images/avatar-image-selector';
import {UploadInputType} from '@common/uploads/types/upload-input-config';
import {useFormContext} from 'react-hook-form';
import {FileUploadProvider} from '@common/uploads/uploader/file-upload-provider';
import {Disk} from '@common/uploads/types/backend-metadata';
import {FormChipField} from '@common/ui/forms/input-field/chip-field/form-chip-field';
import {CrupdateLinkFormValues} from '@app/dashboard/links/forms/crupdate-link-form';

export function LinkSeoFields() {
  return (
    <div>
      <div className="block md:flex gap-24">
        <FileUploadProvider>
          <ImageField />
        </FileUploadProvider>
        <div className="flex-auto my-24 md:my-0">
          <FormTextField
            name="name"
            label={<Trans message="Title" />}
            className="mb-24"
          />
          <FormTextField
            inputElementType="textarea"
            name="description"
            rows={2}
            label={<Trans message="description" />}
          />
        </div>
      </div>
      <FormChipField
        name="tags"
        label={<Trans message="Tags" />}
        valueKey="name"
      />
    </div>
  );
}

function ImageField() {
  const {uploadFile, uploadStatus} = useActiveUpload();
  const {setValue, watch} = useFormContext<CrupdateLinkFormValues>();
  const imageUrl = watch('image');
  return (
    <AvatarImageSelector
      className="flex-shrink-0"
      imageRadius="rounded"
      defaultImage={<div className="bg-alt w-full h-full rounded" />}
      value={imageUrl}
      onUpload={file => {
        uploadFile(file, {
          metadata: {
            disk: Disk.public,
            diskPrefix: 'link',
          },
          restrictions: {
            maxFileSize: MaxImageSize,
            allowedFileTypes: [UploadInputType.image],
          },
          showToastOnRestrictionFail: true,
          onSuccess: ({url}) => {
            setValue('image', url, {shouldDirty: true});
          },
        });
      }}
      onRemove={() => {
        setValue('image', null, {shouldDirty: true});
      }}
      isLoading={uploadStatus === 'inProgress'}
    />
  );
}
