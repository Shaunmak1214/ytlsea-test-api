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
    description: {
      type: String,
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
      required: false,
      trim: true,
    },
    errorMessage: {
      type: String,
      required: false,
      trim: true,
    },
    tokenId: {
      type: String,
      ref: 'Token',
      required: true,
      trim: true,
    },
    to: {
      type: String,
      required: false,
      trim: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
transactionSchema.plugin(toJSON);
transactionSchema.plugin(paginate);

/**
 * Check if transaction id is taken
 * @param {string} transactionId - The transaction id
 * @param {ObjectId} [excludeTransactionId] - The id of the transaction to be excluded
 * @returns {Promise<boolean>}
 */
transactionSchema.static(
  'isTransactionIdTaken',
  async function (transactionId: string, excludeTransactionId: mongoose.ObjectId): Promise<boolean> {
    const transaction = await this.findOne({ transactionId, _id: { $ne: excludeTransactionId } });
    return !!transaction;
  }
);

const Transaction = mongoose.model<ITransactionDoc, ITransactionModel>('Transaction', transactionSchema);

export default Transaction;
