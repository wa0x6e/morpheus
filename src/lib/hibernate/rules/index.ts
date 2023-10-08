import inactive from './inactive';
import stale from './stale';
import misconfigured from './misconfigured';
import type { Space } from '../../../helpers/snapshot';

export type FilterRule = Record<string, (spaces: Space[]) => Promise<Space[]>>;

export const RULES: FilterRule = {
  MISCONFIGURED: misconfigured,
  INACTIVE: inactive,
  STALE: stale
};
