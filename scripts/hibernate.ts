import 'dotenv/config';
import { hibernate } from '../src/lib/hibernate';

async function main() {
  if (process.argv.length < 1) {
    console.error(`Usage: yarn ts-node scripts/hibernate.ts`);
    return process.exit(1);
  }

  const results = await hibernate();

  console.log(results);
}

(async () => {
  try {
    await main();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
