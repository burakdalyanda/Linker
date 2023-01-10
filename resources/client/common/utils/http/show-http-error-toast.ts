import {toast} from '../../ui/toast/toast';
import {getAxiosErrorMessage} from './get-axios-error-message';
import {message} from '../../i18n/message';

const defaultErrorMessage = message('There was an issue. Please try again.');

export function showHttpErrorToast(
  err: unknown,
  defaultMessage = defaultErrorMessage,
  field?: string
) {
  toast.danger(getAxiosErrorMessage(err, field) || defaultMessage, {
    action: (err as any).response?.data?.action,
  });
}
