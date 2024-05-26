import type { Label } from '$types';
import fs from 'node:fs/promises';
import { getData } from '.';
import OrdRec from '$lib/OrderedRecord';

export async function saveLabel(label: Label) {
  const labelDir = `data/${label.classifier}/${label.slug}`;

  // Update server-side data
  OrdRec.fromItems(
    OrdRec.fromItems(getData().classifiers).get(label.classifier).labels
  ).set(label.slug, label);

  // info.json
  // Need to add the trailing newline manually
  await fs.writeFile(
    `${labelDir}/info.json`,
    JSON.stringify(label.info, null, 2) + '\n',
  );

  // README.md
  await fs.writeFile(
    `${labelDir}/README.md`,
    // Remove trailing space and add a trailing new-line
    label.readme.trim().split('\n').map(l => l.trimEnd()).join('\n') + '\n',
  );
}
