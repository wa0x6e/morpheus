import networks from '@snapshot-labs/snapshot.js/src/networks.json';
import { type Space } from '../../../helpers/snapshot';

const testnets = Object.values(networks)
  .filter((network: any) => network.testnet)
  .map((network: any) => network.key);

export default async function process(spaces: Space[]) {
  return spaces
    .filter(withTestnetNetwork)
    .filter(withoutProposalValidations)
    .filter(withTicketStrategyWithoutValidation);
}

function withTestnetNetwork(space: Space) {
  return testnets.includes(space.network);
}

// don’t have proposal validation / authors only
function withoutProposalValidations(space: Space) {
  return false;
}

// ticket strategy without validation
function withTicketStrategyWithoutValidation(space: Space) {
  return false;
}
