import type { Space } from '../../../helpers/snapshot';

const DELAY = 60 * 24 * 60 * 60; // 60 days

/**
 * Return spaces that never had any activities, and are older than 2 months
 */
export default async function process(spaces: Space[]) {
  const offset = Math.floor(Date.now() / 1e3) - DELAY;

  return spaces.filter(space => space.created_at < offset && space.proposalsCount === 0);
}
