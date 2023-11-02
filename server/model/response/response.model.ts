import {
  Column,
  DataSource,
  Entity,
  PrimaryGeneratedColumn,
  Repository,
} from "typeorm";
import { useLog } from "../../lib/log";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

@Entity({ name: "response" })
export class InterceptedResponse {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: "user_id" })
  userId: string;

  @Column({ name: "sniffer_id" })
  snifferId: string;

  @Column({ name: "invocation_id" })
  invocationId: string;

  @Column({ type: "varchar" })
  body: Record<string, any>;

  @Column({ type: "varchar" })
  headers: Record<string, any>;

  @Column({ type: "int" })
  status: number;
}

export class ResponseRepository {
  repository: Repository<InterceptedResponse>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = appDataSource.manager.getRepository(InterceptedResponse);
  }
}