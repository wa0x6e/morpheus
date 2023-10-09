import { capture } from '@snapshot-labs/snapshot-sentry';
import { fetchLastProposal, type Space } from '../../../helpers/snapshot';

export async function lastProposalEndedBefore(space: Space, timestamp: number) {
  try {
    const lastProposal = await fetchLastProposal(space.id);

    return !lastProposal || lastProposal.end < timestamp;
  } catch (e: any) {
    capture(e);
    return false;
  }
}

export function uniqueSpacesById(spaces: Space[]) {
  const ids = new Set(spaces.map(space => space.id));

  return spaces.filter(space => ids.has(space.id));
}
