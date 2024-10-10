import mongoose, { Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface ITransaction {
  account: mongoose.Types.ObjectId;
  description?: string;
  amount: number;
  transactionId: string;
  transactionType: string; // "reload" or "transfer"
  status: string; // "pending", "success", "cancelled" or "failed"
  errorCode?: string;
  errorMessage?: string;
  tokenId: string;
  to?: string; // phone number
  createdAt?: Date;
}

export interface ITransactionDoc extends ITransaction, Document {}

export interface ITransactionModel extends mongoose.Model<ITransactionDoc> {
  isTransactionIdTaken(transactionId: string, excludeTransactionId?: mongoose.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}
