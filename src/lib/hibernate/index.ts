import { RULES, type FilterRule } from './rules';
import { type Space, fetchSpaces } from '../../helpers/snapshot';
import { paginate } from '../../helpers/utils';
import { hibernateSpace, reactivateSpace } from './utils';
import { capture } from '@snapshot-labs/snapshot-sentry';

type HibernateList = Record<string, Space[]>;

export async function check(spaces?: Space[] | Space, rules: FilterRule = RULES) {
  const spacesToHibernate: HibernateList = {};
  spaces ||= await fetchAllAwakeSpaces();
  spaces = Array.isArray(spaces) ? spaces : [spaces];

  for (const [rule, processor] of Object.entries(rules)) {
    spacesToHibernate[rule] = await processor(spaces);

    if (spacesToHibernate[rule].length > 0) {
      const ids = spacesToHibernate[rule].map(space => space.id);
      spaces = spaces.filter(space => !ids.includes(space.id));
    }
  }

  return {
    count: Object.values(spacesToHibernate)
      .map(list => list.length)
      .reduce((a, b) => a + b, 0),
    spaces: spacesToHibernate
  };
}

export async function reactivate(space: Space) {
  if (!space.hibernated) {
    return true;
  }

  const result = await check(space, { MISCONFIGURED: RULES['MISCONFIGURED'] });

  return result.count > 0 ? false : reactivateSpace(space);
}

export async function hibernate(spaces?: Space[]) {
  spaces ||= Object.values((await check()).spaces).flat();
  let successCount = 0;

  for (const space of spaces) {
    try {
      await hibernateSpace(space);
      successCount++;
    } catch (e: any) {
      capture(e);
    }
  }
  console.log({
    success: successCount,
    total: spaces.length
  });
}

async function fetchAllAwakeSpaces() {
  try {
    const spaces: Space[] = await paginate(fetchSpaces);

    return spaces.filter(space => !space.hibernated);
  } catch (e: any) {
    capture(e);
    return [];
  }
}
