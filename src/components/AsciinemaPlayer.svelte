<script lang="ts">
    import { onMount } from 'svelte';
    import 'asciinema-player/dist/bundle/asciinema-player.css';
    import * as AsciinemaPlayer from 'asciinema-player';

    /** URL of the Asciinema recording */
    export let castUrl: string;

    onMount(() => {
        const player = AsciinemaPlayer.create(castUrl, document.getElementById('asciinema-player'));

        return () => {
            player.dispose();
        };
    })

</script>

<div id="asciinema-player">
</div>
