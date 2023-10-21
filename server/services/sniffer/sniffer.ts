// import { json } from "body-parser";
// import express, {
//   Express,
//   NextFunction,
//   Request,
//   RequestHandler,
//   Response,
// } from "express";
// import * as http from "http";
// import { createProxyMiddleware } from "http-proxy-middleware";
// import { Invocation } from "../../types";
// import MockManager from "./mock/mock-manager";
// import MockMiddleware from "./mock/mock-middleware";
// import cors from "cors";
// import { InterceptedRequests } from "../../services/intercepted-requests";
// import { useLog } from "../../lib/log";
// import { RequestModel } from "../../model/request/request.model";

// const log = useLog({
//   dirname: __dirname,
//   filename: __filename,
// });

// export type SnifferConfig = {
//   name: string;
//   port: number;
//   downstreamUrl: string;
//   id: string;
// };

// export class Sniffer {
//   private id: string;
//   private app: Express;
//   private interceptedRequests: InterceptedRequests;
//   private requestModel: RequestModel;
//   private config: SnifferConfig;
//   private server?: http.Server;
//   private proxyMiddleware: RequestHandler;
//   private isStarted: boolean;
//   private mockManager: MockManager;
//   private mockMiddleware: MockMiddleware;
//   private userId: string;

//   constructor(config: SnifferConfig, userId: string) {
//     this.config = config;
//     this.app = express();
//     this.id = config.id;
//     this.isStarted = false;
//     this.mockManager = new MockManager();
//     this.requestModel = new RequestModel();
//     this.interceptedRequests = new InterceptedRequests(
//       this.requestModel,
//       this.id
//     );
//     this.mockMiddleware = new MockMiddleware(this.mockManager);
//     this.userId = userId;

//     this.proxyMiddleware = createProxyMiddleware({
//       target: config.downstreamUrl,
//       secure: false,
//       logLevel: "debug",
//       autoRewrite: true,
//       changeOrigin: true,
//     });

//     this.setup();
//   }

//   async requestInterceptor(req: Request, res: Response, next: NextFunction) {
//     log.info("Request logged", {
//       config: this.config,
//       method: req.method,
//       url: req.url,
//     });

//     await this.requestModel.upsertRequest(req, this.config.id);
//     next();
//   }

//   getApp() {
//     return this.app;
//   }

//   getPort() {
//     return this.config.port;
//   }

//   setup() {
//     this.app.use(json());
//     this.app.use(cors({ origin: "*" }));
//     this.app.use(this.requestInterceptor.bind(this));
//     this.app.use(this.mockMiddleware.mock.bind(this));
//     this.app.use(this.proxyMiddleware);
//   }

//   execute(url: string, method: string, invocation: Invocation) {
//     const snifferUrl = `http://localhost:${this.getPort()}${url}`;
//     return this.interceptedRequests.execute(
//       snifferUrl,
//       method,
//       invocation,
//       this.config.name
//     );
//   }

//   async changeConfig(newConfig: SnifferConfig) {
//     log.info("Stopping server", {
//       config: this.config,
//     });
//     await this.stop();
//     log.info("Changing config", {
//       config: this.config,
//     });
//     this.config = newConfig;
//     log.info("Starting server with new config", {
//       config: this.config,
//     });
//     await this.start();
//   }

//   start() {
//     log.info("Starting sniffer", { config: this.config });
//     return new Promise((resolve, reject) => {
//       this.server = this.app
//         .listen(this.config.port, () => {
//           log.info("Started sniffing", { config: this.config });
//           this.isStarted = true;
//           return resolve(undefined);
//         })
//         .on("error", (error) => {
//           log.error("Failed to start sniffer for proxy", {
//             config: this.config,
//             error: error.message,
//           });
//           return reject(error);
//         })
//         .on("clientError", (error) => {
//           log.error("A clientError has occurred", { error: error.message });
//           return reject(error);
//         });
//     });
//   }

//   stop() {
//     return new Promise((resolve, reject) => {
//       log.info("Stopping sniffer", { config: this.config });
//       this.server?.close((error) => {
//         if (error) {
//           log.error("couldn't stop the sniffer", {
//             config: this.config,
//             error: error.message,
//           });
//           return reject(error);
//         }
//         this.isStarted = false;
//         log.info("Stopped sniffer", { config: this.config });
//         return resolve(undefined);
//       });
//     });
//   }

//   async editSniffer(newConfig: SnifferConfig) {
//     if (this.isStarted) {
//       await this.stop();
//     }
//     this.config = newConfig;
//   }

//   async stats(userId: string) {
//     const { config, isStarted, id, interceptedRequests } = this;
//     return {
//       id,
//       config,
//       isStarted,
//       mocks: await this.mockManager.getAllMocks(userId),
//       interceptedRequests: interceptedRequests.stats(),
//     };
//   }

//   getConfig() {
//     return this.config;
//   }

//   getIsStarted() {
//     return this.isStarted;
//   }

//   getMiddleware() {
//     return this.proxyMiddleware;
//   }

//   getId() {
//     return this.id;
//   }

//   getMockManager() {
//     return this.mockManager;
//   }
// }
