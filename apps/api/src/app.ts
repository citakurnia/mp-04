import express, { urlencoded, Express, json } from 'express';
import { FE_URL, PORT } from './config';
import type { RouteItems } from './interfaces/routesInterface';
import { ErrorHandler } from './middlewares/errorHandler';
import path from 'path';
import cors from 'cors';

export default class App {
  private readonly app: Express;

  constructor(routes: Array<RouteItems>) {
    this.app = express();
    this.configure();
    this.routes(routes);
    this.handleError();
  }

  private configure(): void {
    this.app.use(
      cors({
        origin: FE_URL,
        credentials: true,
      }),
    );
    this.app.use(json());
    this.app.use(
      '/images',
      express.static(path.join(path.dirname(__dirname), 'public')),
    );
    // this.app.use(urlencoded({ extended: true }));
  }

  private handleError(): void {
    this.app.use(ErrorHandler);
  }

  private routes(routes: Array<RouteItems>): void {
    routes.forEach((route) => {
      this.app.use('/api', route.router);
    });
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
