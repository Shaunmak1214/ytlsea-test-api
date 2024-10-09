import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { ITransactionDoc, ITransactionModel } from './transaction.interfaces';

const transactionSchema = new mongoose.Schema<ITransactionDoc, ITransactionModel>(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    transactionId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    transactionType: {
      type: String,
      required: true,
      trim: true,
      enum: ['reload', 'transfer'],
    },
    status: {
      type: String,
      required: true,
      trim: true,
      enum: ['pending', 'success', 'cancelled', 'failed'],
    },
    errorCode: {
      type: String,
      required: true,
      trim: true,
    },
    errorMessage: {
      type: String,
      required: true,
      trim: true,
    },
    tokenId: {
      type: String,
      ref: 'Token',
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
transactionSchema.plugin(toJSON);
transactionSchema.plugin(paginate);

const Transaction = mongoose.model<ITransactionDoc, ITransactionModel>('Transaction', transactionSchema);

export default Transaction;
