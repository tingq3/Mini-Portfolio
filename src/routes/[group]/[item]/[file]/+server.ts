import sanitize from 'sanitize-filename';
import fs from 'fs/promises';
import { error } from '@sveltejs/kit';
import mime from 'mime-types';
import { getDataDir } from '$lib/server/data/dataDir';

export async function GET(req: import('./$types.js').RequestEvent) {
  const { group, item, file } = req.params;

  // Sanitise the filename to prevent unwanted access to the server's filesystem
  const filename = sanitize(file);

  // Get the path of the file to serve
  const filePath = `${getDataDir()}/${group}/${item}/${filename}`;

  // Ensure file exists
  await fs.access(filePath, fs.constants.R_OK).catch(() => error(404));

  // Read the contents of the file
  const content = await fs.readFile(filePath);
  let mimeType = mime.contentType(filename);
  if (!mimeType) {
    mimeType = 'text/plain';
  }

  req.setHeaders({
    'Content-Type': mimeType,
    'Content-Length': content.length.toString(),
  });

  return new Response(content);
}
