import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import * as accountService from './account.service';
import ApiError from '../errors/ApiError';

export const createAccount = catchAsync(async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }

  const body = {
    ...req.body,
    user: user.id,
  };

  const account = await accountService.createAccount(body);
  res.status(httpStatus.CREATED).send(account);
});

export const getAccounts = catchAsync(async (req: Request, res: Response) => {
  const filter = req.query;
  const options = req.query;
  const result = await accountService.queryAccounts(filter, options);
  res.send(result);
});

export const getAccount = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['accountId'] === 'string') {
    const account = await accountService.getAccountById(new mongoose.Types.ObjectId(req.params['accountId']));
    if (!account) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
    }
    res.send(account);
  }
});

export const getAccountByUser = catchAsync(async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }

  const account = await accountService.getAccountsByUserId(user._id);
  if (!account) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
  }
  res.send(account);
});

export const updateAccount = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['accountId'] === 'string') {
    const account = await accountService.updateAccountById(new mongoose.Types.ObjectId(req.params['accountId']), req.body);
    res.send(account);
  }
});

export const deleteAccount = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['accountId'] === 'string') {
    await accountService.deleteAccountById(new mongoose.Types.ObjectId(req.params['accountId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});
