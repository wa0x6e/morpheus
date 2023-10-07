import type { Space } from '../../../helpers/snapshot';

const OFFSET = 60 * 24 * 60 * 60; // 60 days

/**
 * Return spaces that never had any activities, and are older than 2 months
 */
export default async function process(spaces: Space[]) {
  const cutoff = Math.floor(Date.now() / 1e3) - OFFSET;

  return spaces.filter(space => space.created_at < cutoff && space.proposalsCount === 0);
}
