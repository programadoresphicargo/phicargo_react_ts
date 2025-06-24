export type ChecklistItem = {
  type: 'boolean' | 'file' | 'text';
  defaultValue?: string;
  label: string;
  name: string;
  photoCount?: number;
};
