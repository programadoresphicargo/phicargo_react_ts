import { Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { ReactNode, memo, useState } from 'react';
import type {
  RecordColumnComment,
  RecordComment,
  RecordCommentCreate,
} from '../../models/record-model';
import { SubmitHandler, useForm } from 'react-hook-form';
import dayjs, { Dayjs } from 'dayjs';

import { FaEdit } from 'react-icons/fa';
import { FaRegSave } from 'react-icons/fa';
import { IconButton } from '@mui/material';
import { IoMdInformationCircle } from 'react-icons/io';
import { TextareaInput } from '@/phicargo/modules/core/components/inputs/TextareaInput';
import { useRecords } from '../../hook/useRecords';

interface Props {
  value: ReactNode;
  date: Dayjs;
  recordColumn: RecordColumnComment;
  recordId: number;
  comment: RecordComment | null;
}

export const CommentCell = memo(
  ({ value, recordId, comment, recordColumn, date }: Props) => {
    const [isReadOnly, setIsReadOnly] = useState(true);

    const { control, handleSubmit } = useForm<RecordCommentCreate>({
      defaultValues: comment
        ? comment
        : { comment: '', recordColumn: recordColumn },
    });

    const { editCommentMutation } = useRecords();

    const onSave: SubmitHandler<RecordCommentCreate> = (data) => {
      console.log({ id: recordId, comment: data });
      editCommentMutation.mutate(
        { id: recordId, comment: data },
        {
          onSuccess: () => {
            setIsReadOnly(true);
          },
        },
      );
    };

    const onToggleEdit = () => {
      setIsReadOnly((prev) => !prev);
    };

    return (
      <div className="flex flex-row gap-2 items-center">
        <span>{value}</span>
        <Popover placement="top" showArrow color="default">
          <PopoverTrigger>
            <button className="text-gray-500 hover:text-gray-700">
              <IoMdInformationCircle className="w-5 h-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="pb-3 px-3 text-small w-96 font-bold uppercase">
              <div className="flex justify-between items-center gap-2">
                <IconButton
                  color="primary"
                  aria-label="edit"
                  disabled={date.isBefore(dayjs(), 'day')}
                  onClick={onToggleEdit}
                >
                  <FaEdit />
                </IconButton>
                <IconButton
                  color="primary"
                  aria-label="save"
                  onClick={handleSubmit(onSave)}
                >
                  <FaRegSave />
                </IconButton>
              </div>
              <div className="flex items-center gap-2">
                <TextareaInput
                  control={control}
                  name="comment"
                  label="Comentario"
                  minRows={5}
                  isUpperCase
                  isDisabled={isReadOnly}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);

