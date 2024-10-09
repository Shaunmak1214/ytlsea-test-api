import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { IAccountDoc, IAccountModel } from './account.interfaces';

const accountSchema = new mongoose.Schema<IAccountDoc, IAccountModel>(
  {
    accountName: {
      type: String,
      required: true,
      trim: true,
    },
    accountNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    accountType: {
      type: String,
      required: true,
      trim: true,
    },
    currency: {
      type: String,
      required: true,
      enum: ['MYR', 'USD', 'EUR', 'GBP'],
      trim: true,
    },
    balance: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    token: {
      type: String,
      required: true,
      trim: true,
    },
    tokenExpiry: {
      type: String,
      required: true,
      trim: true,
    },
    provider: {
      type: String,
      required: true,
      trim: true,
    },
    limit: {
      type: String,
      required: true,
      trim: true,
    },
    preferred: {
      type: String,
      required: true,
      trim: true,
    },
    authorizedAmount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
accountSchema.plugin(toJSON);
accountSchema.plugin(paginate);

/**
 * Check if account number is taken
 * @param {string} accountNumber - The account number
 * @param {ObjectId} [excludeAccountId] - The id of the account to be excluded
 * @returns {Promise<boolean>}
 */
accountSchema.static(
  'isAccountNumberTaken',
  async function (accountNumber: string, excludeAccountId: mongoose.ObjectId): Promise<boolean> {
    const account = await this.findOne({ accountNumber, _id: { $ne: excludeAccountId } });
    return !!account;
  }
);

const Account = mongoose.model<IAccountDoc, IAccountModel>('Account', accountSchema);

export default Account;
