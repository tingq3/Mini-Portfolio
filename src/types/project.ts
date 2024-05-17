/** Status of project development */
type ProjectStatus = "In-progress" | "Active" | "Complete" | "Incomplete";

/** Represents a project */
export type Project = {
  /** User-facing name of the project */
  name: string
  /** Short description of the project */
  description: string
  /** Status of project development */
  status: ProjectStatus
  /** Array of language slugs used by the project */
  languages: string[]
  /** Array of framework slugs used by the project */
  frameworks: string[]
  /** Array of skill slugs used by the project */
  skills: string[]
  /** URL of the GitHub repo of the project */
  repo?: string
  /** URL of the site demonstrating the project */
  site?: string
  /** URL of the documentation site for the project */
  docs?: string
  /** Information about the package distribution of the project */
  package?: {
    /** Installation command */
    command: string
    /** URL for viewing the project's package listing */
    url: string
  }
}
