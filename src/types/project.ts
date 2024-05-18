import { any, array, defaulted, enums, number, object, optional, string, type Infer } from "superstruct";

/** Status of project development */
const ProjectStatus = enums(["In-progress", "Active", "Complete", "Incomplete"]);

/** Represents a project */
export const Project = object({
  /** Slug of project, added during loading */
  slug: string(),
  /** Readme of project, added during loading */
  readme: string(),
  /** User-facing name of the project */
  name: string(),
  /** Short description of the project */
  description: string(),
  /** Sort value */
  sort: defaulted(number(), 0),
  /** Color to use for ProjectCards */
  color: string(),
  /** Status of project development */
  status: ProjectStatus,
  /** Array of language slugs used by the project */
  languages: array(string()),
  /** Array of framework slugs used by the project */
  frameworks: array(string()),
  /** Array of skill slugs used by the project */
  skills: array(string()),
  /** URL of the GitHub repo of the project */
  repo: optional(string()),
  /** URL of the site demonstrating the project */
  site: optional(string()),
  /** URL of the documentation site for the project */
  docs: optional(string()),
  /** Information about the package distribution of the project */
  package: optional(object({
    /** Installation command */
    command: string(),
    /** URL for viewing the project's package listing */
    url: string(),
  })),
  "$schema": any(),
});

export type TProject = Infer<typeof Project>;
