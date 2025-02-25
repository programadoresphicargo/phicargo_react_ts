export interface ContactApi {
  id: number;
  customer: boolean;
  supplier: boolean;
  name: string;
  street: string | null;
}

