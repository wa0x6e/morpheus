import type { Space } from '../../helpers/snapshot';
import { fetchWithKeepAlive } from '../../helpers/utils';

const SEQUENCER_API_URL = process.env.SEQUENCER_API_URL || 'https://seq.snapshot.org';
const SEQUENCER_API_SECRET = process.env.SEQUENCER_API_SECRET || '';

export async function hibernateSpace(space: Space) {
  return dispathSequencerAction('hibernate', space.id);
}

export function reactivateSpace(space: Space) {
  return dispathSequencerAction('reactivate', space.id);
}

async function dispathSequencerAction(action: string, value: string) {
  const res = await fetchWithKeepAlive(SEQUENCER_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', secret: SEQUENCER_API_SECRET },
    body: JSON.stringify({
      action,
      value
    })
  });

  if (res.status !== 200) throw new Error(`Failed to ${action} space`);

  return true;
}
