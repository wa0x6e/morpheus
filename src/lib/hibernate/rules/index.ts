import inactive from './inactive';
import stale from './stale';
import misconfigured from './misconfigured';
import type { Space } from '../../../helpers/snapshot';

export const RULES: Record<string, (spaces: Space[]) => Promise<Space[]>> = {
  MISCONFIGURED: misconfigured,
  INACTIVE: inactive,
  STALE: stale
};
