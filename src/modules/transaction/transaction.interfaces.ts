import mongoose, { Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface ITransaction {
  account: mongoose.Types.ObjectId;
  amount: number; // in cents
  transactionId: string;
  transactionType: string; // "reload" or "transfer"
  status: string; // "pending", "success", "cancelled" or "failed"
  errorCode: string;
  errorMessage: string;
  tokenId: string;
}

export interface ITransactionDoc extends ITransaction, Document {}

export interface ITransactionModel extends mongoose.Model<ITransactionDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}
