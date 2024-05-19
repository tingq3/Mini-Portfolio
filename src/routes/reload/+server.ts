import { dev } from '$app/environment';
import { reloadData } from '$lib/server';
import { error, json } from '@sveltejs/kit';

export function POST() {
  if (dev) {
    console.log('Reloading data...');
    reloadData();
    return json({});
  } else {
    throw error(403);
  }
}
