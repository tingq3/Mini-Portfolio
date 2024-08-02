import { error, json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
  return json({}, { status: 418 });
}
