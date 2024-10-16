import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import * as transactionService from './transaction.service';
import * as accountService from '../account/account.service';
import ApiError from '../errors/ApiError';
import Account from '../account/account.model';

export const createTransaction = catchAsync(async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }

  const account = await accountService.getAccountByAccountNumber(req.body.account);
  if (!account) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account not found');
  }

  if (account.user._id.toString() !== user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  const transaction = await transactionService.createTransaction({
    ...req.body,
    account: account._id,
    tokenId: account.token,
  });
  res.status(httpStatus.CREATED).send(transaction);
});

export const getTransactions = catchAsync(async (req: Request, res: Response) => {
  const filter = req.query;
  const options = req.query;
  const result = await transactionService.queryTransactions(filter, options);
  res.send(result);
});

export const getTransactionsByUser = catchAsync(async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }

  const account = await Account.findOne({ user: user._id, preferred: true });
  if (!account) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
  }

  const transactions = await transactionService.getTransactionsByAccountId(account._id);
  if (!transactions) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }
  res.send(transactions);
});

export const getTransaction = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['transactionId'] === 'string') {
    const transaction = await transactionService.getTransactionById(
      new mongoose.Types.ObjectId(req.params['transactionId'])
    );
    if (!transaction) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
    }
    res.send(transaction);
  }
});

export const updateTransaction = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['transactionId'] === 'string') {
    const transaction = await transactionService.updateTransactionById(
      new mongoose.Types.ObjectId(req.params['transactionId']),
      req.body
    );
    res.send(transaction);
  }
});

export const deleteTransaction = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['transactionId'] === 'string') {
    await transactionService.deleteTransactionById(new mongoose.Types.ObjectId(req.params['transactionId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});
