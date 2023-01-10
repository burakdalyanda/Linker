import {useMutation} from '@tanstack/react-query';
import {toast} from '../../../../ui/toast/toast';
import {BackendResponse} from '../../../../http/backend-response/backend-response';
import {UploadedFile} from '../../../../uploads/uploaded-file';
import {User} from '../../../user';
import {message} from '../../../../i18n/message';
import {apiClient} from '../../../../http/query-client';
import {getAxiosErrorMessage} from '../../../../utils/http/get-axios-error-message';
import {showHttpErrorToast} from '../../../../utils/http/show-http-error-toast';

interface Response extends BackendResponse {
  user: User;
}

interface Payload {
  file: UploadedFile;
}

interface UserProps {
  user: User;
}

function UploadAvatar({file}: Payload, user: User): Promise<Response> {
  const payload = new FormData();
  payload.set('file', file.native);
  return apiClient
    .post(`users/${user.id}/avatar`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(r => r.data);
}

export function useUploadAvatar({user}: UserProps) {
  return useMutation((payload: Payload) => UploadAvatar(payload, user), {
    onSuccess: () => {
      toast(message('Uploaded avatar'));
    },
    onError: err => {
      const message = getAxiosErrorMessage(err, 'file');
      if (message) {
        toast.danger(message);
      } else {
        showHttpErrorToast(err);
      }
    },
  });
}
