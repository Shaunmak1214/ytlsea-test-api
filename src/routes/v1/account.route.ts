import express, { Router } from 'express';
import { auth } from '../../modules/auth';
import * as accountController from '../../modules/account/account.controller';

const router: Router = express.Router();

router.route('/').post(auth('manageAccounts'), accountController.createAccount);
router.route('/').get(auth('getAccounts'), accountController.getAccounts);
router.route('/by-user-id').get(auth('getAccounts'), accountController.getAccountByUser);
router.route('/:accountId').get(auth('getAccounts'), accountController.getAccount);
router.route('/:accountId').patch(auth('manageAccounts'), accountController.updateAccount);
router.route('/:accountId').delete(auth('manageAccounts'), accountController.deleteAccount);

export default router;
