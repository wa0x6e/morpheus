import express from 'express';
import { capture } from '@snapshot-labs/snapshot-sentry';
import { rpcError } from './helpers/utils';
import { check, reactivate } from './lib/hibernate';
import { fetchSpace } from './helpers/snapshot';

const router = express.Router();

router.post('/preview', async (req, res) => {
  try {
    res.json(await check());
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
    res.json({ hibernate: result.count > 0, reason: Object.keys(result.spaces)[0] });
  } catch (e) {
    capture(e);
    return rpcError(res, 'INTERNAL_ERROR', '');
  }
});

router.post('/reactive', async (req, res) => {
  const space = await fetchSpace(req.body.id);

  if (!space) {
    return rpcError(res, 'RECORD_NOT_FOUND', '');
  }

  try {
    res.json(await reactivate(space));
  } catch (e) {
    capture(e);
    return rpcError(res, 'INTERNAL_ERROR', '');
  }
});

export default router;
