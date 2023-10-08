import networks from '@snapshot-labs/snapshot.js/src/networks.json';
import { type Space } from '../../../helpers/snapshot';

const TESTNETS = Object.values(networks)
  .filter((network: any) => network.testnet)
  .map((network: any) => network.key);

const FILTERS = [
  withTestnetNetwork,
  withoutProposalValidations,
  withTicketStrategyWithoutValidation
];

export default async function process(spaces: Space[]) {
  const result = FILTERS.flatMap(filter => spaces.filter(filter));
  const ids = new Set(result.map(space => space.id));

  return result.filter(space => ids.has(space.id));
}

function withTestnetNetwork(space: Space) {
  return TESTNETS.includes(space.network);
}

// don’t have proposal validation / authors only
function withoutProposalValidations(space: Space) {
  return false;
}

// ticket strategy without validation
function withTicketStrategyWithoutValidation(space: Space) {
  return false;
}
