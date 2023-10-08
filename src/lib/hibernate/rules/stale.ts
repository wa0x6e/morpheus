import { capture } from '@snapshot-labs/snapshot-sentry';
import { fetchLastProposal, type Space } from '../../../helpers/snapshot';

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

async function lastProposalEndedBefore(space: Space, timestamp: number) {
  try {
    const lastProposal = await fetchLastProposal(space.id);

    return !lastProposal || lastProposal.end < timestamp;
  } catch (e: any) {
    capture(e);
    return false;
  }
}
