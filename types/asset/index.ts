import { ActionStatusType } from "../context";

export type UserCashOut = {
  cashInOutId: string;
  currency: string;
  absAmount: string;
  requestDay: string;
  requestDate: string;
  eventDay: string;
  valueDay: string;
  statusType: ActionStatusType;
  updateDate: string;
  cashflowId: number;
};

export type UserRegCashOut = {
  currency: string;
  absAmount: string;
};
