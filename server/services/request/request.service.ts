import { RequestRepository } from "../../model/request/request.model";
import { Request as ExpressRequest } from "express";

export class RequestService {
  constructor(private readonly repository: RequestRepository) {}

  async getByUser(userId: string) {
    return this.repository.repository.find({
      where: {
        userId,
      },
    });
  }

  async add(req: ExpressRequest, snifferId?: string, userId?: string) {
    const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

    const newRequest = await this.repository.repository.create({
      url: fullUrl,
      body: req.body,
      headers: req.headers,
      method: req.method,
      snifferId,
      userId,
    });
    await this.repository.repository.save(newRequest);
  }

  async remove() {}

  async update() {}
}

export default RequestService;
