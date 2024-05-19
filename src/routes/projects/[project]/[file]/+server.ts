import sanitize from 'sanitize-filename';
import fs from 'fs';
import { error } from '@sveltejs/kit';
import mime from 'mime-types';

export function GET({ params, setHeaders }) {
  const { project, file } = params;

  // Sanitise the filename to prevent unwanted access to the server's filesystem
  const filename = sanitize(file);

  // Get the path of the file to serve
  const filePath = `data/projects/${project}/${filename}`;

  if (!fs.existsSync(filePath)) {
    throw error(404);
  }

  // Read the contents of the file
  const content = fs.readFileSync(filePath);
  let mimeType = mime.contentType(filename);
  if (!mimeType) {
    mimeType = 'text/plain';
  }

  setHeaders({
    'Content-Type': mimeType,
    'Content-Length': content.length.toString(),
  });

  return new Response(content);
}
