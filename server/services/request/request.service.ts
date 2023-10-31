import {
  InterceptedRequest,
  RequestRepository,
} from "../../model/request/request.model";
import { InvocationRepository } from "../../model/invocation/invocation.model";
import { Request as ExpressRequest } from "express";

type TreeNodeKey = string;
interface RequestTreeNode {
  name: TreeNodeKey;
  callCount: number;
  metadata: RequestMetadata;
  next?: Record<TreeNodeKey, RequestTreeNode>;
}

interface RequestMetadata {
  suspectedPath: boolean;
}

export class RequestService {
  constructor(
    private readonly repository: RequestRepository,
    private readonly invocationRepository: InvocationRepository,
  ) {}

  async getByUser(userId: string) {
    return this.repository.repository.find({
      where: {
        userId,
      },
    });
  }

  async getBySnifferId(snifferId: string) {
    const requests = await this.repository.repository.find({
      where: {
        snifferId,
      },
    });

    return requests;
  }

  async getById(id: string) {
    return this.repository.repository.findOne({ where: { id } });
  }

  async getRequestsTree(snifferId: string) {
    // const requests = await this.getAll(snifferId);
    const requests = await this.repository.repository.find({
      where: {
        snifferId,
      },
    });
    console.log("requests", requests);

    const result = {
      name: "/",
      metadata: {
        suspectedPath: true,
      },
      callCount: 0,
    } as RequestTreeNode;

    for (const request of requests) {
      const url = new URL(request.url);
      const pathParts = url.pathname.split("/");

      // Ensure the URL path is mapped to the current root
      let currentLevel = result;
      for (const part of pathParts) {
        // Ignore the main part of the URL because it represents root
        if (part === "") {
          continue;
        }

        if (currentLevel.next === undefined) {
          currentLevel.next = {};
        }

        if (currentLevel.next[part] === undefined) {
          currentLevel.next[part] = {
            name: part,
            metadata: {
              suspectedPath: true,
            },
            callCount: 0,
          };
        }

        currentLevel = currentLevel.next[part];
      }

      // Update the corresponding endpoint
      ++currentLevel.callCount;
      currentLevel.metadata.suspectedPath = false;
    }

    return result;
  }

  async create(req: ExpressRequest, snifferId: string, userId: string) {
    const newRequest = this.repository.repository.create({
      snifferId,
      userId,
      url: req.path,
      method: req.method,
      headers: req.headers,
      body: req.body,
    });
    return this.repository.repository.save(newRequest);
  }

  async findOrCreate(req: ExpressRequest, snifferId: string, userId: string) {
    const request = await this.repository.repository.findOne({
      where: {
        snifferId,
        userId,
        url: req.path,
        method: req.method,
      },
    });

    if (request !== null) {
      return request;
    }

    return this.create(req, snifferId, userId);
  }

  async addInvocation(request: InterceptedRequest) {
    const theInvocation = this.invocationRepository.repository.create({
      requestId: request.id,
      snifferId: request.snifferId,
      userId: request.userId,
      method: request.method,
      body: request.body,
      headers: request.headers,
      url: request.url,
    });

    return this.invocationRepository.repository.save(theInvocation);
  }

  async getInvocations(request: InterceptedRequest) {
    return this.invocationRepository.repository.find({
      where: {
        requestId: request.id,
        snifferId: request.snifferId,
        userId: request.userId,
        method: request.method,
        url: request.url,
      },
    });
  }
}

export default RequestService;