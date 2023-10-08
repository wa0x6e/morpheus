import express from 'express';
import { capture } from '@snapshot-labs/snapshot-sentry';
import { rpcSuccess, rpcError } from './helpers/utils';
import { check, reactivate } from './lib/hibernate';
import { fetchSpace } from './helpers/snapshot';
import { verifyReactivate } from './helpers/verify';

const router = express.Router();

router.post('/preview', async (req, res) => {
  try {
    rpcSuccess(res, await check());
  } catch (e) {
    capture(e);
    return rpcError(res, 'INTERNAL_ERROR', '');
  }
});

router.post('/check', async (req, res) => {
  const space = await fetchSpace(req.body.id);

  if (!space) {
    return rpcError(res, 'RECORD_NOT_FOUND', '');
  }

  try {
    const result = await check(space);
    rpcSuccess(
      res,
      { hibernate: result.count > 0, reason: Object.keys(result.spaces)[0] },
      space.id
    );
  } catch (e) {
    capture(e);
    return rpcError(res, 'INTERNAL_ERROR', '');
  }
});

router.post('/reactivate', async (req, res) => {
  const { id, params } = req.body;

  if (!verifyReactivate(params.space, params.address, params.signature)) {
    return rpcError(res, 'UNAUTHORIZED', id);
  }

  const space = await fetchSpace(id);

  if (!space) {
    return rpcError(res, 'RECORD_NOT_FOUND', '');
  }

  try {
    rpcSuccess(res, await reactivate(space));
  } catch (e) {
    capture(e);
    return rpcError(res, 'INTERNAL_ERROR', '');
  }
});

export default router;
