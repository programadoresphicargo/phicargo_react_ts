export type ChecklistItem = {
  type: 'boolean' | 'photo' | 'text';
  defaultValue?: string;
  label: string;
  name: string;
  photoCount?: number;
};
