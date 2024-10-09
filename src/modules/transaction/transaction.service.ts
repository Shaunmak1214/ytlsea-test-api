import httpStatus from 'http-status';
import mongoose from 'mongoose';
import validator from 'validator';
import payNetResCodes from '../../config/error_codes';
import Transaction from './transaction.model';
import ApiError from '../errors/ApiError';
import { ITransaction, ITransactionDoc } from './transaction.interfaces';
import { QueryResult } from '../paginate/paginate';
import { generateTransactionId, randomErrorCode } from '../utils/transactions';
import * as accountService from '../account/account.service';

/**
 * Create a transaction
 * @param {ITransaction} transaction
 * @returns {Promise<ITransactionDoc>}
 */
export const createTransaction = async (transaction: ITransaction): Promise<ITransactionDoc> => {
  const transactionId = generateTransactionId(transaction.transactionType);
  if (await Transaction.isTransactionIdTaken(transactionId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Transaction ID already taken');
  }

  // check account balance
  const account = await accountService.getAccountById(new mongoose.Types.ObjectId(transaction.account));
  if (!account) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account not found');
  }

  if (transaction.transactionType === 'transfer' && account.balance < transaction.amount) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient balance');
  }

  if (transaction.transactionType === 'reload' && transaction.amount > account.authorizedAmount) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient authorized amount to reload');
  }

  if (transaction.transactionType === 'transfer' && transaction.to && !validator.isMobilePhone(transaction.to)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid phone number');
  }

  const accounts = await accountService.getAccountsByUserId(account.user._id);
  if (!accounts) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Accounts not found');
  }

  const transactionCreated = await Transaction.create({
    ...transaction,
    transactionId,
    status: 'pending',
  });

  // simulate paynet error
  const errorCode = randomErrorCode(25);

  if (errorCode !== payNetResCodes['00']) {
    Object.assign(transactionCreated, { status: 'failed', errorCode, errorMessage: errorCode });
    await transactionCreated.save();

    throw new ApiError(httpStatus.BAD_REQUEST, errorCode);
  }

  // update balance of account
  if (transaction.transactionType === 'transfer') {
    Object.assign(account, { balance: account.balance - transaction.amount });
    await account.save();
  } else {
    Object.assign(account, { balance: account.balance + transaction.amount });
    await account.save();
  }

  Object.assign(transactionCreated, { status: 'success' });
  await transactionCreated.save();

  return transactionCreated;
};

/**
 * Query for transactions
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryTransactions = async (filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult> => {
  const transactions = await Transaction.paginate(filter, options);
  return transactions;
};

/**
 * Get transaction by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<ITransactionDoc | null>}
 */
export const getTransactionById = async (id: mongoose.Types.ObjectId): Promise<ITransactionDoc | null> =>
  Transaction.findById(id);

/**
 * Update transaction by id
 * @param {mongoose.Types.ObjectId} transactionId
 * @param {ITransaction} updateBody
 * @returns {Promise<ITransactionDoc | null>}
 */
export const updateTransactionById = async (
  transactionId: mongoose.Types.ObjectId,
  updateBody: ITransaction
): Promise<ITransactionDoc | null> => {
  const transaction = await getTransactionById(transactionId);
  if (!transaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }
  Object.assign(transaction, updateBody);
  await transaction.save();
  return transaction;
};

/**
 * Delete transaction by id
 * @param {mongoose.Types.ObjectId} transactionId
 * @returns {Promise<ITransactionDoc | null>}
 */
export const deleteTransactionById = async (transactionId: mongoose.Types.ObjectId): Promise<ITransactionDoc | null> => {
  const transaction = await getTransactionById(transactionId);
  if (!transaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }

  Object.assign(transaction, { status: 'cancelled' });
  await transaction.save();

  return transaction;
};
