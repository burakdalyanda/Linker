import {useForm} from 'react-hook-form';
import {useId} from 'react';
import {User} from '../../../user';
import {AccountSettingsPanel} from '../account-settings-panel';
import {Button} from '../../../../ui/buttons/button';
import {Form} from '../../../../ui/forms/form';
import {FormTextField} from '../../../../ui/forms/input-field/text-field/text-field';
import {useUpdateAccountDetails} from './update-account-details';
import {AvatarManager} from '../avatar-manager/avatar-manager';
import {Trans} from '../../../../i18n/trans';
import {useUploadAvatar} from '../avatar-manager/upload-avatar';
import {useRemoveAvatar} from '../avatar-manager/remove-avatar';

interface Props {
  user: User;
}
export function BasicInfoPanel({user}: Props) {
  const uploadAvatar = useUploadAvatar({user});
  const removeAvatar = useRemoveAvatar({user});
  const formId = useId();
  const form = useForm<Partial<Omit<User, 'subscriptions'>>>({
    defaultValues: {
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      avatar: user.avatar,
    },
  });
  const watchedAvatar = form.watch('avatar');
  const updateDetails = useUpdateAccountDetails(form);

  return (
    <AccountSettingsPanel
      title={<Trans message="Update name and profile image" />}
      actions={
        <Button
          type="submit"
          variant="flat"
          color="primary"
          form={formId}
          disabled={updateDetails.isLoading || !form.formState.isValid}
        >
          <Trans message="Save" />
        </Button>
      }
    >
      <Form
        form={form}
        className="flex flex-col flex-col-reverse md:flex-row items-center gap-40 md:gap-80"
        onSubmit={newDetails => {
          updateDetails.mutate(newDetails);
        }}
        id={formId}
      >
        <div className="flex-auto w-full">
          <FormTextField
            className="mb-24"
            name="first_name"
            label={<Trans message="First name" />}
          />
          <FormTextField
            name="last_name"
            label={<Trans message="Last name" />}
          />
        </div>
        <AvatarManager
          className="md:mr-80"
          value={watchedAvatar}
          isLoading={uploadAvatar.isLoading || removeAvatar.isLoading}
          onUpload={file => {
            uploadAvatar.mutate(
              {file},
              {
                onSuccess: response => {
                  form.setValue('avatar', response.user.avatar);
                },
              }
            );
          }}
          onRemove={() => {
            removeAvatar.mutate(undefined, {
              onSuccess: () => {
                form.setValue('avatar', undefined);
              },
            });
          }}
        />
      </Form>
    </AccountSettingsPanel>
  );
}
