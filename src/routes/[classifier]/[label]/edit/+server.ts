import type { Label } from '$types';
import { json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
  const label: Label = await request.json();

  // TODO: Update label contents
  console.log('Update label:', label);

  return json({}, { status: 200 });
}
