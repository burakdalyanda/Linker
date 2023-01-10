import React, {ComponentPropsWithoutRef} from 'react';
import {useDialogContext} from './dialog-context';
import {Dialog} from './dialog';
import {DialogBody} from './dialog-body';
import {IconButton} from '../../buttons/icon-button';
import {CloseIcon} from '../../../icons/material/Close';

interface Props extends ComponentPropsWithoutRef<'img'> {}
export function ImageZoomDialog(props: Props) {
  const {close} = useDialogContext();
  return (
    <Dialog size="fullscreen">
      <DialogBody padding="p-0">
        <IconButton
          size="lg"
          color="paper"
          className="absolute top-0 right-0 text-white"
          onClick={() => {
            close();
          }}
        >
          <CloseIcon />
        </IconButton>
        <img {...props} />
      </DialogBody>
    </Dialog>
  );
}
