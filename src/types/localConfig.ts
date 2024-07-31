import { nullable, object, optional, string, type Infer } from "superstruct";

export const ConfigLocalJsonStruct = object({
  repo: nullable(object({
    url: string(),
    branch: string(),
  })),
});

export type ConfigLocalJson = Infer<typeof ConfigLocalJsonStruct>;
