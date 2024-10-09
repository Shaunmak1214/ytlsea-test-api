import express, { Router } from 'express';
import { auth } from '../../modules/auth';
import * as transactionController from '../../modules/transaction/transaction.controller';

const router: Router = express.Router();

router.route('/').post(auth('manageTransactions'), transactionController.createTransaction);
router.route('/').get(auth('getTransactions'), transactionController.getTransactions);
router.route('/:transactionId').get(auth('getTransactions'), transactionController.getTransaction);
router.route('/:transactionId').patch(auth('manageTransactions'), transactionController.updateTransaction);
router.route('/:transactionId').delete(auth('manageTransactions'), transactionController.deleteTransaction);

export default router;
