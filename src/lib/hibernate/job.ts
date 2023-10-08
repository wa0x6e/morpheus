import { Cron } from 'croner';
import { hibernate } from './index';

export default function schedule() {
  Cron('0 0 */6 * * *', hibernate);
}
