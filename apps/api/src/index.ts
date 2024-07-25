import App from './app';
import { AuthRoute } from './routers/authRoute';
import { EventRoute } from './routers/eventRoute';
import { ReferralRoute } from './routers/referralRoute';
import { RewardRoute } from './routers/rewardRoute';

function main() {
  const app = new App([
    new AuthRoute(),
    new EventRoute(),
    new RewardRoute(),
    new ReferralRoute(),
  ]);

  app.start();
}

main();
