import express, { Router } from 'express';
import { auth } from '../../modules/auth';
import * as transactionController from '../../modules/transaction/transaction.controller';
import checksumMiddleware from '../../modules/validate/checksum.validation';

const router: Router = express.Router();

router.route('/').post(auth('manageTransactions'), checksumMiddleware(), transactionController.createTransaction);
router.route('/').get(auth('getTransactions'), transactionController.getTransactions);
router.route('/by-user-id').get(auth('getTransactions'), transactionController.getTransactionsByUser);
router.route('/:transactionId').get(auth('getTransactions'), transactionController.getTransaction);
router.route('/:transactionId').patch(auth('manageTransactions'), transactionController.updateTransaction);
router.route('/:transactionId').delete(auth('manageTransactions'), transactionController.deleteTransaction);

export default router;
