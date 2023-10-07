import { fetchLastProposal, type Space } from '../../../helpers/snapshot';

const DELAY = 180 * 24 * 60 * 60; // 6 months

/**
 * Return spaces that have not been active in the last 6 months
 */
export default async function process(spaces: Space[]) {
  const offset = Math.floor(Date.now() / 1e3) - DELAY;

  return spaces
    .filter(space => space.created_at < offset)
    .filter(async space => await lastProposalEndedBefore(space, offset));
}

async function lastProposalEndedBefore(space: Space, timestamp: number) {
  const lastProposal = await fetchLastProposal(space.id);

  return !lastProposal || lastProposal.end < timestamp;
}
