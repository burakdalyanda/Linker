import {useForm, UseFormReturn} from 'react-hook-form';
import {useDialogContext} from '@common/ui/overlays/dialog/dialog-context';
import {DialogBody} from '@common/ui/overlays/dialog/dialog-body';
import {DialogFooter} from '@common/ui/overlays/dialog/dialog-footer';
import {Button} from '@common/ui/buttons/button';
import {Dialog} from '@common/ui/overlays/dialog/dialog';
import {DialogHeader} from '@common/ui/overlays/dialog/dialog-header';
import {Form} from '@common/ui/forms/form';
import {Trans} from '@common/i18n/trans';
import {useCrupdateBiolinkWidget} from '@app/dashboard/biolink/biolink-editor/requests/use-crupdate-biolink-widget';
import {Biolink, BiolinkWidget} from '@app/dashboard/biolink/biolink';
import {ReactNode} from 'react';
import {
  WidgetList,
  WidgetType,
} from '@app/dashboard/biolink/biolink-editor/content/widgets/widget-list';

interface CrupdateWidgetDialogProps {
  biolink: Biolink;
  type: WidgetType;
  widget?: BiolinkWidget;
  children?: ReactNode;
  defaultValues?: BiolinkWidget['config'];
  // allow children to transform or validate values before submitting
  onSubmit?: (
    values: BiolinkWidget['config'],
    form: UseFormReturn<BiolinkWidget['config']>
  ) => Promise<BiolinkWidget['config'] | undefined> | void;
}
export function CrupdateWidgetDialog({
  biolink,
  widget,
  type,
  defaultValues,
  children,
  onSubmit,
}: CrupdateWidgetDialogProps) {
  const widgetListItem = WidgetList[type];
  const form = useForm<BiolinkWidget['config']>({
    defaultValues: widget?.config || defaultValues,
  });
  const {formId, close} = useDialogContext();
  const addWidget = useCrupdateBiolinkWidget(biolink.id, form);

  return (
    <Dialog>
      <DialogHeader>
        <Trans {...widgetListItem.name} />
      </DialogHeader>
      <DialogBody>
        <Form
          form={form}
          id={formId}
          onSubmit={async values => {
            const transformedValues = onSubmit
              ? await onSubmit(values, form)
              : values;
            if (!transformedValues) {
              return;
            }
            addWidget.mutate(
              {
                widgetId: widget?.id,
                config: transformedValues,
                type,
                // put socials widget at the end (when creating a new widget), everything else at the start
                position:
                  !widget && type === WidgetType.Socials
                    ? biolink.content.length + 1
                    : undefined,
              },
              {onSuccess: () => close()}
            );
          }}
        >
          {children}
        </Form>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          onClick={() => {
            close();
          }}
        >
          <Trans message="Cancel" />
        </Button>
        <Button
          variant="flat"
          color="primary"
          type="submit"
          form={formId}
          disabled={addWidget.isLoading || !form.formState.isDirty}
        >
          {widget ? <Trans message="Update" /> : <Trans message="Add" />}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
