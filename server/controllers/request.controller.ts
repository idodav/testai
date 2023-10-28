import { NextFunction, Request, Response } from "express";
import PromiseRouter from "express-promise-router";
import { useLog } from "../lib/log";
import { IRouterConfig } from "./router.interface";
import { RequestService } from "../services/request/request.service";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class RequestController {
  constructor(
    private readonly requestService: RequestService,
    private readonly baseUrl: string = "/sharkio/request",
  ) {}

  getRouter(): IRouterConfig {
    const router = PromiseRouter();
    router.route("/").get(
      /**
       * @openapi
       * /sharkio/request:
       *   get:
       *     tags:
       *      - request
       *     description: Get all requests
       *     responses:
       *       200:
       *         description: Returns requests
       *       500:
       *         description: Server error
       */
      async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.auth.user.id;

        const requests = await this.requestService.getByUser(userId);
        res.status(200).send(requests);
      },
    );

    return { router, path: this.baseUrl };
  }
}
