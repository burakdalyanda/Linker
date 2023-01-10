import {useForm} from 'react-hook-form';
import React from 'react';
import {FormTextField} from '../../ui/forms/input-field/text-field/text-field';
import {CreateUserPayload, useCreateUser} from './requests/create-user';
import {AvatarManager} from '../../auth/ui/account-settings/avatar-manager/avatar-manager';
import {useDeleteFileEntries} from '../../uploads/requests/delete-file-entries';
import {CrupdateUserForm} from './crupdate-user-form';
import {useActiveUpload} from '../../uploads/uploader/use-active-upload';
import {FileUploadProvider} from '../../uploads/uploader/file-upload-provider';
import {UploadedFile} from '../../uploads/uploaded-file';
import {Trans} from '../../i18n/trans';
import {UploadInputType} from '../../uploads/types/upload-input-config';
import {Disk} from '../../uploads/types/backend-metadata';
import {MaxImageSize} from '../../ui/images/avatar-image-selector';

export function CreateUserPage() {
  const form = useForm<CreateUserPayload>();
  const createUser = useCreateUser(form);

  const avatarManager = (
    <FileUploadProvider>
      <AvatarUploader />
    </FileUploadProvider>
  );

  return (
    <CrupdateUserForm
      onSubmit={newValues => {
        createUser.mutate(newValues);
      }}
      form={form}
      title={<Trans message="Add new user" />}
      isLoading={createUser.isLoading}
      avatarManager={avatarManager}
    >
      <FormTextField
        className="mb-30"
        name="email"
        type="email"
        label={<Trans message="Email" />}
      />
      <FormTextField
        className="mb-30"
        name="password"
        type="password"
        label={<Trans message="Password" />}
      />
    </CrupdateUserForm>
  );
}

function AvatarUploader() {
  const {uploadFile, uploadStatus} = useActiveUpload();
  const deleteFileEntries = useDeleteFileEntries();
  const {watch, setValue} = useForm<CreateUserPayload>();
  const watchedAvatarUrl = watch('avatar');

  const handleUpload = (file: UploadedFile) => {
    uploadFile(file, {
      metadata: {
        disk: Disk.public,
        diskPrefix: 'avatars',
      },
      restrictions: {
        maxFileSize: MaxImageSize,
        allowedFileTypes: [UploadInputType.image],
      },
      showToastOnRestrictionFail: true,
      onSuccess: ({url}) => {
        setValue('avatar', url);
      },
    });
  };

  const handleDelete = () => {
    if (!watchedAvatarUrl) return;
    deleteFileEntries.mutate({
      paths: [watchedAvatarUrl],
      deleteForever: true,
    });
  };

  return (
    <AvatarManager
      value={watchedAvatarUrl}
      isLoading={uploadStatus === 'inProgress' || deleteFileEntries.isLoading}
      onUpload={handleUpload}
      onRemove={handleDelete}
    />
  );
}
