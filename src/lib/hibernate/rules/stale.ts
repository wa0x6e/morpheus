import type { Space } from '../../../helpers/snapshot';
import { lastProposalEndedBefore } from './utils';

const OFFSET = 180 * 24 * 60 * 60; // 6 months

/**
 * Return spaces that have not been active in the last 6 months
 */
export default async function process(spaces: Space[]) {
  const cutoff = Math.floor(Date.now() / 1e3) - OFFSET;

  return spaces
    .filter(space => space.created_at < cutoff)
    .filter(async space => await lastProposalEndedBefore(space, cutoff));
}
