import express from "express";
import cookieParser from "cookie-parser";
import { dbConnection } from "@database";
import { ErrorMiddleware } from "@middleware";
import { routes } from "./routes";
import { PORT } from "./config";
import { i18n } from "./utils";
import cors from "cors";
export class App {
  public app: express.Application;
  public env: string;
  public port: number;

  constructor() {
    this.app = express();
    this.env = "development";
    this.port = parseInt(PORT || "5000", 10);

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoute();
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running on Port ${this.port}`);
    });
  }

  private async connectToDatabase() {
    await dbConnection();
  }

  private initializeMiddlewares() {
    this.app.use(cors({ origin: "*", credentials: true }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(i18n.init);
  }

  private initializeRoute() {
    routes.forEach((route) => {
      this.app.use("/", route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }
}
