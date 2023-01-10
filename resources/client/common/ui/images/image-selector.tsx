import React, {ReactNode, useId, useRef} from 'react';
import clsx from 'clsx';
import {Button} from '../buttons/button';
import {appearanceState} from '../../admin/appearance/appearance-store';
import {Trans} from '../../i18n/trans';
import {useActiveUpload} from '../../uploads/uploader/use-active-upload';
import {UploadInputType} from '../../uploads/types/upload-input-config';
import {useController} from 'react-hook-form';
import {mergeProps} from '@react-aria/utils';
import {ProgressBar} from '../progress/progress-bar';
import {Disk} from '../../uploads/types/backend-metadata';
import {toast} from '@common/ui/toast/toast';
import {Field} from '@common/ui/forms/input-field/field';
import {getInputFieldClassNames} from '@common/ui/forms/input-field/get-input-field-class-names';
import {FileEntry} from '@common/uploads/file-entry';
import {useAutoFocus} from '@common/ui/focus/use-auto-focus';

const TwoMB = 2 * 1024 * 1024;

interface ImageSelectorProps {
  className?: string;
  label?: ReactNode;
  description?: ReactNode;
  invalid?: boolean;
  errorMessage?: ReactNode;
  required?: boolean;
  value?: string;
  onChange?: (newValue: string) => void;
  highlightSelector?: string;
  defaultValue?: string;
  diskPrefix: string;
  showRemoveButton?: boolean;
  autoFocus?: boolean;
}
export function ImageSelector({
  className,
  label,
  description,
  value,
  onChange,
  highlightSelector,
  defaultValue,
  diskPrefix,
  showRemoveButton,
  invalid,
  errorMessage,
  required,
  autoFocus,
}: ImageSelectorProps) {
  const {
    uploadFile,
    selectAndUploadFile,
    entry,
    percentage,
    uploadStatus,
    deleteEntry,
    isDeletingEntry,
  } = useActiveUpload();

  const inputRef = useRef<HTMLInputElement>(null);

  useAutoFocus({autoFocus}, inputRef);

  const fieldId = useId();
  const labelId = label ? `${fieldId}-label` : undefined;
  const descriptionId = description ? `${fieldId}-description` : undefined;

  const imageUrl = value || entry?.url;

  const uploadOptions = {
    restrictions: {
      allowedFileTypes: [UploadInputType.image],
      maxFileSize: TwoMB,
    },
    metadata: {
      diskPrefix,
      disk: Disk.public,
    },
    onSuccess: (entry: FileEntry) => {
      onChange?.(entry.url);
    },
    onError: (message?: string) => {
      if (message) {
        toast.danger(message);
      }
    },
  };

  const inputFieldClassNames = getInputFieldClassNames({
    description,
    descriptionPosition: 'top',
    invalid,
  });
  const uploadButton = (
    <Field
      fieldClassNames={inputFieldClassNames}
      errorMessage={errorMessage}
      invalid={invalid}
    >
      <input
        ref={inputRef}
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
        required={required}
        accept={UploadInputType.image}
        type="file"
        disabled={uploadStatus === 'inProgress'}
        onChange={e => {
          if (e.target.files?.length) {
            uploadFile(e.target.files[0], uploadOptions);
          }
        }}
        className={clsx(
          inputFieldClassNames.input,
          'py-8',
          'file:bg-primary file:text-on-primary file:border-none file:rounded file:text-sm file:font-semibold file:px-10 file:h-24 file:mr-10'
        )}
      />
      {uploadStatus === 'inProgress' && (
        <ProgressBar
          className="absolute bottom-0 left-0 right-0"
          size="xs"
          isIndeterminate
        />
      )}
    </Field>
  );

  const replaceButton = (
    <Button
      onClick={() => {
        selectAndUploadFile(uploadOptions);
      }}
      disabled={uploadStatus === 'inProgress'}
      className="mr-10"
      variant="outline"
      color="primary"
      size="xs"
    >
      <Trans message="Replace" />
    </Button>
  );

  const removeButton = (
    <Button
      variant="outline"
      color="danger"
      size="xs"
      disabled={isDeletingEntry}
      onClick={() => {
        deleteEntry({
          onSuccess: () => onChange?.(''),
        });
      }}
    >
      <Trans message="Remove" />
    </Button>
  );

  return (
    <div
      className={clsx('text-sm', className)}
      onClick={() => {
        appearanceState().preview.setHighlight(highlightSelector);
      }}
    >
      {label && (
        <div id={labelId} className={inputFieldClassNames.label}>
          {label}
        </div>
      )}
      {description && (
        <div className={inputFieldClassNames.description}>{description}</div>
      )}
      <div>
        {!imageUrl ? (
          uploadButton
        ) : (
          <div aria-labelledby={labelId} aria-describedby={descriptionId}>
            <div className="h-80 border rounded bg-chip p-6 relative overflow-hidden">
              <img
                className="h-full mx-auto rounded object-contain"
                src={imageUrl}
                alt=""
              />
              {uploadStatus === 'inProgress' && (
                <ProgressBar
                  value={percentage}
                  size="xs"
                  className="absolute left-0 bottom-0 w-full"
                  aria-label="upload progress"
                />
              )}
            </div>
            <div className="mt-10">
              {replaceButton}
              {showRemoveButton && removeButton}
              {defaultValue && value !== defaultValue && (
                <Button
                  variant="outline"
                  color="primary"
                  size="xs"
                  onClick={() => {
                    onChange?.(defaultValue);
                  }}
                >
                  <Trans message="Use default" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface FormImageSelectorProps extends ImageSelectorProps {
  name: string;
}
export function FormImageSelector(props: FormImageSelectorProps) {
  const {
    field: {onChange, value = null},
    fieldState: {invalid, error},
  } = useController({
    name: props.name,
  });

  const formProps: Partial<ImageSelectorProps> = {
    onChange,
    value,
    invalid,
    errorMessage: error ? <Trans message="Please select an image." /> : null,
  };

  return <ImageSelector {...mergeProps(formProps, props)} />;
}
