import { object, string, type Infer } from 'superstruct';

/** Main configuration for the portfolio, data/config.json */
export const MainConfig = object({
  /** Name of the person to use within the website. */
  name: string(),
  /** Info text (loaded from info.md) */
  info: string(),
});

export type TMainConfig = Infer<typeof MainConfig>;
