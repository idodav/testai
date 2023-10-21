import z from "zod";
import { SnifferConfig } from "../types/types";

export type SnifferConfigSetup = SnifferConfig & { isStarted: boolean };

const snifferConfigValidator = z.object({
  name: z.string().nullable().optional(),
  port: z.number().nullable().optional(),
  downstreamUrl: z.string().nullable().optional(),
  id: z.string(),
  userId: z.string().uuid(),
  isStarted: z.boolean().nullable().optional(),
});

export const sniffersConfigValidator = z.array(snifferConfigValidator);