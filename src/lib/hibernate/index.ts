import { RULES } from './rules';
import { type Space, fetchSpaces } from '../../helpers/snapshot';

type HibernateList = Record<string, Space[]>;

export default async function run() {
  let spaces = (await fetchAllSpaces()).filter(space => !space.hibernating);
  const spacesToHibernate: HibernateList = {};

  for (const ruleName of Object.keys(RULES)) {
    spacesToHibernate[ruleName] = await RULES[ruleName](spaces);

    if (spacesToHibernate[ruleName].length > 0) {
      const ids = spacesToHibernate[ruleName].map(space => space.id);
      spaces = spaces.filter(space => !ids.includes(space.id));
    }
  }

  hibernateSpaces(spacesToHibernate);

  return '';
}

async function fetchAllSpaces() {
  let page = 1;
  let spaces: Space[] = [];

  while (true) {
    const _spaces = await fetchSpaces(page);
    if (_spaces.length === 0) {
      break;
    }
    spaces = spaces.concat(_spaces);
    page++;

    break;
  }

  return spaces;
}

async function hibernateSpaces(list: HibernateList) {
  for (const ruleName of Object.keys(list)) {
    // send a request to sequencer to hibernate the space
  }
}
