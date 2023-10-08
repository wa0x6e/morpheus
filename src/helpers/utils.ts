import http from 'node:http';
import https from 'node:https';
import type { Response } from 'express';

const ERROR_CODES: Record<string, number> = {
  RECORD_NOT_FOUND: 404,
  UNAUTHORIZED: 401
};

export function rpcSuccess(res: Response, result: any, id: string | number = '') {
  res.json({
    jsonrpc: '2.0',
    result,
    id
  });
}

export function rpcError(res: Response, e: Error | string, id: string | number) {
  const errorMessage = e instanceof Error ? e.message : e;
  const errorCode = ERROR_CODES[errorMessage] ? ERROR_CODES[errorMessage] : -32603;

  res.status(errorCode > 0 ? errorCode : 500).json({
    jsonrpc: '2.0',
    error: {
      code: errorCode,
      message: errorMessage
    },
    id
  });
}

export async function paginate(callback: (page: number) => Promise<unknown[]>) {
  let page = 1;
  let results: any = [];

  while (true) {
    const _results = await callback(page);
    if (_results.length === 0) {
      break;
    }
    results = results.concat(_results);
    page++;
  }

  return results;
}

const agentOptions = { keepAlive: true };
const httpAgent = new http.Agent(agentOptions);
const httpsAgent = new https.Agent(agentOptions);

function agent(url: string) {
  return new URL(url).protocol === 'http:' ? httpAgent : httpsAgent;
}

export const fetchWithKeepAlive = (uri: any, options: any = {}) => {
  return fetch(uri, { agent: agent(uri), ...options });
};
