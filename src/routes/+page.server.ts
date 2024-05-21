import { getData } from '$lib/server';
import { redirect } from '@sveltejs/kit';

export function load() {
  // When loading the main page, redirect them to the default classifier page
  throw redirect(308, `/${getData().config.defaultClassifier}`);
}
