import { Control, useFieldArray } from 'react-hook-form';
import { TextFieldElement } from 'react-hook-form-mui';
import { Button } from '@/components/ui';
import { ComplaintCreate } from '../../models';

interface Props {
 control: Control<ComplaintCreate>;
}

export const CreatePorquesForm = ({ control }: Props) => {
 const { fields, append, remove } = useFieldArray({
  control: control as any,
  name: 'causa_raiz.porques',
 });

 return (
  <>
   <div className='mb-5'>
    {/* Descripción */}
    <TextFieldElement
     control={control}
     name="causa_raiz.descripcion"
     label="Descripción de causa raíz"
     required
     fullWidth
     size='small'
    />

    {/* Porqués */}
    {fields.map((field, index) => (
     <div key={field.id} className="flex gap-2 mt-2">
      <TextFieldElement
       control={control}
       name={`causa_raiz.porques.${index}`}
       label={`Por qué ${index + 1}`}
       required
       fullWidth
       size='small'
      />

      <Button
       type="button"
       onClick={() => remove(index)}
       variant="text"
       color="error"
      >
       X
      </Button>
     </div>
    ))}

    <Button
     type="button"
     onClick={() => append('')}
     variant="outlined"
     size="small"
    >
     Agregar porqué
    </Button >

   </div>
  </>
 );
};