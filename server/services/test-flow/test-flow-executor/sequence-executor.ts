import { AxiosResponse } from "axios";
import { TestFlowEdge } from "../../../model/entities/test-flow/TestFlowEdge";
import { TestFlowNode } from "../../../model/entities/test-flow/TestFlowNode";
import { RequestService } from "../../request/request.service";
import {
  AssertionResult,
  NodeResponseValidator,
} from "./node-response-validator";
import { ITestFlowExecutor } from "./test-flow-executor.service";
import { TestFlowReporter } from "../test-flow-reporter.service";
import { useLog } from "../../../lib/log";
import { TestFlowNodeRun } from "../../../model/entities/test-flow/TestFlowNodeRun";
import { TestFlowService } from "../test-flow.service";

const logger = useLog({ dirname: __dirname, filename: __filename });

export type ExecutionResult = {
  node: TestFlowNode;
  response: AxiosResponse;
  assertionResult: AssertionResult;
}[];

export class SequenceExecutor implements ITestFlowExecutor {
  constructor(
    private readonly requestService: RequestService,
    private readonly nodeResponseValidator: NodeResponseValidator,
    private readonly testFlowReporter: TestFlowReporter,
    private readonly testFlowService: TestFlowService,
  ) {}

  async execute(
    ownerId: string,
    flowId: string,
    flowRunId: string,
    nodes: TestFlowNode[],
    nodeRuns: TestFlowNodeRun[],
    edges: TestFlowEdge[],
  ): Promise<ExecutionResult> {
    const sortedNodes = this.testFlowService.sortNodesByEdges(
      nodeRuns,
      edges,
    ) as TestFlowNodeRun[];

    try {
      const result: ExecutionResult = [];

      for (let i = 0; i < nodes.length; i++) {
        const nodeRun = sortedNodes[i];

        const { method, url, headers, body, subdomain } = nodeRun;
        const response = await this.requestService.execute({
          method,
          url: url ?? "/",
          headers: headers || {},
          body,
          subdomain,
        });

        const assertionResult = await this.nodeResponseValidator.assert(
          nodeRun,
          response,
        );

        await this.testFlowReporter.reportNodeRun(
          ownerId,
          flowId,
          flowRunId,
          nodeRun,
          assertionResult,
          {
            headers: response.headers,
            body: response.data,
            status: response.status,
          },
        );

        const resultItem = { node: nodeRun, response, assertionResult };

        result.push(resultItem);

        if (!assertionResult.success) {
          break;
        }
      }

      return result;
    } catch (e) {
      logger.error(e);
      throw new Error("Failed to run test flow");
    }
  }
}
