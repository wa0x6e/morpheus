import express from 'express';
import { capture } from '@snapshot-labs/snapshot-sentry';
import { rpcError, rpcSuccess } from './helpers/utils';
import hibernate from './lib/hibernate';

const router = express.Router();

router.get('/run', async (req, res) => {
  try {
    rpcSuccess(res, await hibernate(), '');
  } catch (e) {
    capture(e);
    return rpcError(res, 'INTERNAL_ERROR', '');
  }
});

export default router;
