import { Button } from '@heroui/react';
import type { DriverBonusMonth } from '../../models';
import { Modal } from '@/components';
import { SaveButton } from '@/components/ui';
import { SelectInput } from '@/components/inputs';
import type { SelectItem } from '@/types';
import { useCreateDriverBonusMutation } from '../../hooks/mutations';
import { useForm } from 'react-hook-form-mui';

const YEAR_OPTIONS: SelectItem[] = [
  { key: 2025, value: '2025' },
  { key: 2026, value: '2026' },
  { key: 2027, value: '2027' },
  { key: 2028, value: '2028' },
  { key: 2029, value: '2029' },
  { key: 2030, value: '2030' },
];

const MONTH_OPTIONS: SelectItem[] = [
  { key: 1, value: 'Enero' },
  { key: 2, value: 'Febrero' },
  { key: 3, value: 'Marzo' },
  { key: 4, value: 'Abril' },
  { key: 5, value: 'Mayo' },
  { key: 6, value: 'Junio' },
  { key: 7, value: 'Julio' },
  { key: 8, value: 'Agosto' },
  { key: 9, value: 'Septiembre' },
  { key: 10, value: 'Octubre' },
  { key: 11, value: 'Noviembre' },
  { key: 12, value: 'Diciembre' },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export const NewPeriodModal = ({ open, onClose }: Props) => {
  const { control, handleSubmit } = useForm<DriverBonusMonth>({
    defaultValues: {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
    },
  });

  const { createDriverBonusMutation } = useCreateDriverBonusMutation();

  const onSubmit = (data: DriverBonusMonth) => {
    createDriverBonusMutation.mutate(
      {
        month: data.month,
        year: data.year,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      isOpen={open}
      onOpenChange={onClose}
      header="Nuevo periodo"
      customFooter={
        <>
          <Button color="default" variant="light" size="sm" onPress={onClose}>
            Cerrar
          </Button>
          <SaveButton
            color="primary"
            size="sm"
            variant="flat"
            className="font-bold"
            radius="full"
            onPress={() => handleSubmit(onSubmit)()}
            isLoading={createDriverBonusMutation.isPending}
          />
        </>
      }
    >
      <div className="p-4">
        <form className="flex flex-col gap-4">
          <SelectInput
            control={control}
            name="month"
            label="Mes"
            rules={{ required: 'Campo requerido' }}
            items={MONTH_OPTIONS}
          />

          <SelectInput
            control={control}
            name="year"
            label="Año"
            rules={{ required: 'Campo requerido' }}
            items={YEAR_OPTIONS}
          />
        </form>
      </div>
    </Modal>
  );
};

