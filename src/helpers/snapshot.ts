import { gql, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { fetchWithKeepAlive } from './utils';

const httpLink = createHttpLink({
  uri: `${process.env.HUB_URL || 'https://hub.snapshot.org'}/graphql`,
  fetch: fetchWithKeepAlive
});

const authLink = setContext((_, { headers }) => {
  const apiHeaders: Record<string, string> = {};
  const apiKey = process.env.KEYCARD_API_KEY;

  if (apiKey && apiKey.length > 0) {
    apiHeaders['x-api-key'] = apiKey;
  }

  return {
    headers: {
      ...headers,
      ...apiHeaders
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    addTypename: false
  }),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache'
    }
  }
});

export type Strategy = {
  name: string;
};

export type VoteValidation = {
  name: string;
};

export type Space = {
  id: string;
  proposalsCount: number;
  created_at: number;
  hibernated: boolean;
  network: number;
  strategies: Strategy[];
  voteValidation: VoteValidation;
  validation: { name: string };
  filters: {
    minScore: number;
    onlyMembers: boolean;
  };
};

const SPACE_QUERY = gql`
  query Spaces($perPage: Int, $id: String, $pivot: Int) {
    spaces(
      first: $perPage
      where: { id: $id, created_at_gt: $pivot }
      orderBy: "created_at"
      orderDirection: asc
    ) {
      id
      proposalsCount
      created_at
      network
      hibernated
      strategies {
        name
      }
      voteValidation {
        name
      }
    }
  }
`;

export async function fetchSpaces(pivot = 0) {
  const PER_PAGE = 1e3;

  const {
    data: { spaces }
  }: { data: { spaces: Space[] | null } } = await client.query({
    query: SPACE_QUERY,
    variables: {
      perPage: PER_PAGE,
      pivot
    }
  });

  return spaces || [];
}

export async function fetchSpace(id: string) {
  const {
    data: { spaces }
  }: { data: { spaces: Space[] | null } } = await client.query({
    query: SPACE_QUERY,
    variables: {
      id
    }
  });

  return (spaces || [])[0];
}

export type Proposal = {
  id: string;
  end: number;
};

const PROPOSAL_QUERY = gql`
  query Proposals($space: String) {
    proposals(first: 1, where: { space: $space }, orderBy: "end", orderDirection: desc) {
      id
      end
    }
  }
`;

export async function fetchLastProposal(space: string) {
  const {
    data: { proposals }
  }: { data: { proposals: Proposal[] | null } } = await client.query({
    query: PROPOSAL_QUERY,
    variables: {
      space
    }
  });

  return (proposals || [])[0];
}
