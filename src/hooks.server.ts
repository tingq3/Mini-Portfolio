// This file runs on app start-up...... well,,, kinda
// it runs on the first request in dev mode, which is super duper annoying
// since it means our data doesn't get validated until we've waited a good 5
// seconds for the server to start up.
import { reloadData } from '$lib/server';

// reloadData();
