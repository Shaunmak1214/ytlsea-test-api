import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Account from './account.model';
import ApiError from '../errors/ApiError';
import { IAccount, IAccountDoc } from './account.interfaces';
import { QueryResult } from '../paginate/paginate';
import { generateAccountToken } from '../utils/transactions';

/**
 * Create a account
 * @param {IAccount} account
 * @returns {Promise<IAccountDoc>}
 */
export const createAccount = async (account: IAccount): Promise<IAccountDoc> => {
  if (await Account.isAccountNumberTaken(account.accountNumber)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account number already taken');
  }

  // create token for account
  const token = generateAccountToken();

  const accountCreated = await Account.create({
    ...account,
    token,
  });

  if (!accountCreated.preferred) {
    return accountCreated;
  }
  const preferredAccounts = await Account.find({ preferred: true, user: account.user });

  const accountsToUnPreferred = preferredAccounts.filter((acc: IAccountDoc) => acc.id !== accountCreated.id);

  await Promise.all(
    accountsToUnPreferred.map(async (acc: IAccountDoc) => {
      Object.assign(acc, { preferred: false });
      await acc.save();
    })
  );

  return accountCreated;
};

/**
 * Query for accounts
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryAccounts = async (filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult> => {
  const accounts = await Account.paginate(filter, options);
  return accounts;
};

/**
 * Get account by user id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IAccountDoc | null>}
 */
export const getAccountByUserId = async (userId: mongoose.Types.ObjectId): Promise<IAccountDoc | null> =>
  Account.findOne({ user: userId, preferred: 'true' });

/**
 * Get accounts by user id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IAccountDoc | null>}
 */
export const getAccountsByUserId = async (userId: mongoose.Types.ObjectId): Promise<IAccountDoc[] | null> =>
  Account.find({ user: userId });

/**
 * Get account by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IAccountDoc | null>}
 */
export const getAccountById = async (id: mongoose.Types.ObjectId): Promise<IAccountDoc | null> => Account.findById(id);

/**
 * Get account by account number
 * @param {string} accountNumber
 * @returns {Promise<IAccountDoc | null>}
 */
export const getAccountByAccountNumber = async (accountNumber: string): Promise<IAccountDoc | null> =>
  Account.findOne({ accountNumber });

/**
 * Update account by id
 * @param {mongoose.Types.ObjectId} accountId
 * @param {IAccount} updateBody
 * @returns {Promise<IAccountDoc | null>}
 */
export const updateAccountById = async (
  accountId: mongoose.Types.ObjectId,
  updateBody: IAccount
): Promise<IAccountDoc | null> => {
  const account = await getAccountById(accountId);
  if (!account) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
  }
  if (updateBody.accountNumber && (await Account.isAccountNumberTaken(updateBody.accountNumber))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account number already taken');
  }
  Object.assign(account, updateBody);
  await account.save();
  return account;
};

/**
 * Delete account by id
 * @param {mongoose.Types.ObjectId} accountId
 * @returns {Promise<IAccountDoc | null>}
 */
export const deleteAccountById = async (accountId: mongoose.Types.ObjectId): Promise<IAccountDoc | null> => {
  const account = await getAccountById(accountId);
  if (!account) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
  }

  Object.assign(account, { isActive: false });
  await account.save();

  return account;
};
