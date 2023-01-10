import {Trans} from '@common/i18n/trans';
import {AvatarPlaceholderIcon} from '@common/auth/ui/account-settings/avatar-manager/avatar-placeholder-icon';
import {
  AvatarImageSelector,
  ImageUploaderProps,
} from '@common/ui/images/avatar-image-selector';

interface AvatarManagerProps extends ImageUploaderProps {}
export function AvatarManager({
  title = <Trans message="Profile image" />,
  defaultImage = (
    <AvatarPlaceholderIcon
      viewBox="0 0 48 48"
      className="w-full h-full text-primary/40 bg-primary-light/40 rounded-full"
    />
  ),
  ...props
}: AvatarManagerProps) {
  return (
    <AvatarImageSelector title={title} defaultImage={defaultImage} {...props} />
  );
}
