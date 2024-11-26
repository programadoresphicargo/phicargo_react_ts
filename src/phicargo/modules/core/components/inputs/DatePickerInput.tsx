import { Controller, FieldValues } from "react-hook-form";
import { DatePicker, DateValue } from "@nextui-org/react";
import dayjs, { Dayjs } from "dayjs";

import { CustomInputProps } from "../../../core/types/global-types";
import { parseDateTime } from "@internationalized/date";
import { useMemo } from "react";

interface DatePickerInputProps<T extends FieldValues>
  extends CustomInputProps<T> {
  hideTimeZone?: boolean;
  initialValue?: Dayjs;
}

export const DatePickerInput = <T extends FieldValues>(
  props: DatePickerInputProps<T>
) => {
  const { 
    control, 
    name, 
    className, 
    label, 
    rules, 
    hideTimeZone, 
    initialValue 
  } = props;

  const initial = useMemo(() => {
    if (initialValue) {
      return parseDateTime(initialValue.format("YYYY-MM-DDTHH:mm:ss")); 
    }
    return null;
  }, [initialValue])

  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { name, onChange }, fieldState }) => (
          <DatePicker
            className={className}
            label={label}
            variant="faded"
            hideTimeZone={hideTimeZone || true}
            showMonthAndYearPickers
            size="sm"
            name={name}
            defaultValue={initial}
            onChange={(date: DateValue | null) => {
              const newDate = date ? dayjs(date.toString()) : null;
              onChange(newDate);
            }}
            isInvalid={fieldState.invalid}
            errorMessage={fieldState.error ? fieldState.error.message : null}
          />
        )}
      />
    </>
  );
};
