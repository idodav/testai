import { v4 } from "uuid";
import { InterceptedRequest } from "../intercepted-request";
import {
  Collection,
  CreateCollectionBody,
  UpdateCollectionBody,
} from "./collection.types";

export class CollectionManager {
  private collections: Map<Collection["id"], Collection>;

  constructor() {
    this.collections = new Map();
  }

  get(id: Collection["id"]) {
    return this.collections.get(id);
  }

  getAll() {
    const collections = Array.from(this.collections.values());
    return collections;
  }

  async create(collectionCreateBody: CreateCollectionBody) {
    const newCollection = {
      id: v4(),
      requests: [],
      ...collectionCreateBody,
    };

    this.collections.set(newCollection.id, newCollection);
  }

  async update(collectionUpdateBody: UpdateCollectionBody) {
    const collection = this.collections.get(collectionUpdateBody.id);

    if (!collection) {
      throw new Error("Collection not found");
    }
    const newCollection: Collection = {
      ...collection,
      ...collectionUpdateBody,
    };

    this.collections.set(collectionUpdateBody.id, newCollection);
  }

  async remove(id: Collection["id"]) {
    this.collections.delete(id);
  }

  async addRequest(id: Collection["id"], request: InterceptedRequest) {
    const collection = this.collections.get(id);
    if (collection === undefined) {
      throw new Error("collection not found");
    }
    collection?.requests?.push(request);
    this.collections.set(id, collection);
  }
}