import snapshot from '@snapshot-labs/snapshot.js';
import { hibernate } from './index';

const INTERVAL = 6 * 60 * 60 * 1e3;

export default async function run() {
  await hibernate();
  await snapshot.utils.sleep(INTERVAL);
  run();
}
