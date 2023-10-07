import express from 'express';
import { capture } from '@snapshot-labs/snapshot-sentry';
import { rpcError } from './helpers/utils';
import hibernate from './lib/hibernate';

const router = express.Router();

router.get('/run', async (req, res) => {
  try {
    res.json(await hibernate());
  } catch (e) {
    capture(e);
    return rpcError(res, 'INTERNAL_ERROR', '');
  }
});

export default router;
