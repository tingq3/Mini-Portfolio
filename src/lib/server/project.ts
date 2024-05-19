import { create } from 'superstruct';
import fs from 'node:fs';
import path from 'node:path';
import { Project, type TProjectMap } from '$types';

const BASE = 'data/projects';

// Functions for loading data
// ==================================================

let projects: string[] = [];
let projectInfo: TProjectMap = {};

/**
 * Load list of available projects
 */
function loadProjectList() {
  const dirInfo = fs.readdirSync(BASE);
  const projects = [];

  for (const entry of dirInfo) {
    if (fs.statSync(path.join(BASE, entry)).isDirectory()) {
      projects.push(entry);
    }
  }

  return projects;
}

/**
 * Load project info from its info.json file
 */
function loadProjectInfo(slug: string) {
  const info = fs.readFileSync(`${BASE}/${slug}/info.json`);
  const proj = JSON.parse(info.toString());
  return create({
    ...proj,
    slug,
    readme: loadProjectReadme(slug),
    hasDemo: checkForDemoRecording(slug),
  }, Project);
}

/**
 * Load project README.md
 */
function loadProjectReadme(slug: string) {
  const readme = fs.readFileSync(`${BASE}/${slug}/README.md`);
  return readme.toString();
}

/**
 * Returns whether there is a demo recording for the given project
 */
function checkForDemoRecording(slug: string) {
  return fs.existsSync(`${BASE}/${slug}/demo.asciinema`);
}

export function reloadProjectData() {
  projects = loadProjectList();
  projectInfo = {};
  for (const proj of projects) {
    projectInfo[proj] = loadProjectInfo(proj);
  }
  // Sort list by sort order specified in info files
  projects.sort((a, b) => getProjectInfo(b).sort - getProjectInfo(a).sort);
}

// Functions for accessing data
// ==================================================

export function getProjectSlugs(): string[] {
  return projects;
}

export function getProjectInfo(slug: string) {
  return projectInfo[slug];
}

export function getProjectsAsMap() {
  return projectInfo;
}

export function getProjectsAsArray() {
  return projects.map(p => getProjectInfo(p));
}

// Load all project data
// ==================================================
reloadProjectData();
