import networks from '@snapshot-labs/snapshot.js/src/networks.json';
import { type Space } from '../../../helpers/snapshot';
import { lastProposalEndedBefore, uniqueSpacesById } from './utils';

const OFFSET = 60 * 24 * 60 * 60; // 2 months

const TESTNETS = Object.values(networks)
  .filter((network: any) => network.testnet)
  .map((network: any) => network.key);

const FILTERS = [
  withTestnetNetwork,
  withoutProposalValidations,
  withTicketStrategyWithoutValidation
];

export default async function process(spaces: Space[]) {
  const cutoff = Math.floor(Date.now() / 1e3) - OFFSET;
  const result = FILTERS.flatMap(filter => spaces.filter(filter));

  return uniqueSpacesById(result).filter(
    async space => await lastProposalEndedBefore(space, cutoff)
  );
}

function withTestnetNetwork(space: Space) {
  return TESTNETS.includes(space.network);
}

function withoutProposalValidations(space: Space) {
  const hasProposalValidation =
    (space.validation?.name && space.validation.name !== 'any') ||
    space.filters?.minScore ||
    space.filters?.onlyMembers;

  return !hasProposalValidation;
}

function withTicketStrategyWithoutValidation(space: Space) {
  const hasTicket = space.strategies.some(strategy => strategy.name === 'ticket');
  const hasVotingValidation =
    space.voteValidation?.name && !['any', 'basic'].includes(space.voteValidation.name);

  return hasTicket && !hasVotingValidation;
}
