import express from 'express'
import morgan from 'morgan'
import * as dotenv from 'dotenv'

import connect from './database/connect' 
import { errorHandler } from './utils/errors/errorHandler'
import userRoute from './routes/userRoute'
import listRoute from "./routes/listRoute";
import {verifyToken} from './utils/verifyToken'

dotenv.config();

class App {
  public app: express.Application;
  public port: string | number;
  public url: string;

  constructor() {
    this.app = express();
    this.port = process.env.APP_PORT || 3000;
    this.url = process.env.Mongo_DB as string;
    //config
    this.configureMiddleware();
    // 서버열기
    this.connectDB(this.url);

    this.openServer()

    
    //세팅 라우트
    this.configureRouter();
    //세팅 에러핸들러
    this.configureErrorHandling();
  }

  private configureMiddleware() {
    this.app.use(express.json());
    this.app.use(morgan("combined"));
  }

  private openServer() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }

  private configureRouter() {
    this.app.use("/api/v2/user", userRoute);
    this.app.use("*", verifyToken);
    this.app.use("/api/v2/list", listRoute);
  }

  private configureErrorHandling() {
    this.app.use(errorHandler);
  }

  private connectDB(url: string) {
    connect(url)
  }
}

new App();


