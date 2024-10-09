import mongoose, { Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface IAccount {
  accountName: string;
  accountNumber: string;
  accountType: string;
  currency: string;
  balance: number;
  isActive: boolean;
  token: string;
  provider: string;
  preferred: string;
  authorizedAmount: number;
  user: mongoose.Types.ObjectId;
}

export interface IAccountDoc extends IAccount, Document {}

export interface IAccountModel extends mongoose.Model<IAccountDoc> {
  isAccountNumberTaken(accountNumber: string, excludeAccountId?: mongoose.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}
