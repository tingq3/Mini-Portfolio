import { dev } from '$app/environment';
import { error, json } from '@sveltejs/kit';
import type { Label } from '$types';
import { saveLabel } from '$lib/server/saveData.js';

export async function POST({ request, cookies }) {
  const label: Label = await request.json();

  // Check that we're running in dev mode
  if (!dev) {
    throw error(403, 'Must be running in dev mode to edit data');
  }

  // Save label contents to disk
  await saveLabel(label);

  return json({}, { status: 200 });
}
