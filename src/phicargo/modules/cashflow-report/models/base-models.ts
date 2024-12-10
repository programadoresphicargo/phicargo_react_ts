export type DaysOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

export type Amount = {
  amount: number;
  confirmed: boolean;
  realAmount: number;
};

export interface Confirmation {
  itemId: number;
  dayOfWeek: DaysOfWeek;
  confirmed: boolean;
  amount: number;
}
