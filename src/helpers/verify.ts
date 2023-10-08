import { verifyTypedData } from '@ethersproject/wallet';
import { getAddress } from '@ethersproject/address';
import type { TypedDataField } from '@ethersproject/abstract-signer';

export const ReactivateType = {
  Reactivate: [
    { name: 'address', type: 'address' },
    { name: 'space', type: 'string' }
  ]
};

const NAME = 'snapshot';
const VERSION = '0.1.4';

export const domain = {
  name: NAME,
  version: VERSION
};

function verify(
  message: Record<string, any>,
  signer: string,
  signature: string,
  type: Record<string, Array<TypedDataField>>
) {
  try {
    return signer === verifyTypedData(domain, type, message, signature);
  } catch (e) {
    return false;
  }
}

export function verifyReactivate(space: string, address: string, signature: string) {
  return verify(
    {
      space,
      address: getAddress(address)
    },
    getAddress(address),
    signature,
    ReactivateType
  );
}
