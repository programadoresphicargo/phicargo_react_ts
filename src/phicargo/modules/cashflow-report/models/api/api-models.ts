export interface AmountApi {
  amount: number;
  confirmed: boolean;
  real_amount: number;
}


export interface CollectRegisterApi {
  id: number;
  client_id: number;
  client_name: string;
  company_id: number;
  company_name: string;
  week_id: number;
  monday_amount: AmountApi;
  tuesday_amount: AmountApi;
  wednesday_amount: AmountApi;
  thursday_amount: AmountApi;
  friday_amount: AmountApi;
  saturday_amount: AmountApi;
  observations: string;
  total_confirmed_amount: number;
  migrated_from_week_id: number | null;
}

export interface PaymentApi {
  id: number;
  monday_amount: AmountApi;
  tuesday_amount: AmountApi;
  wednesday_amount: AmountApi;
  thursday_amount: AmountApi;
  friday_amount: AmountApi;
  saturday_amount: AmountApi;
  provider_id: number;
  provider_name: string;
  company_id: number;
  company_name: string;
  week_id: number;
  observations: string;
  concept: string;
  total_confirmed_amount: number;
  migrated_from_week_id: number | null;
}

