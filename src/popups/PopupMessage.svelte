<script>
    export let title = 'Error occurred'
    export let show_popup;
    export let message_text = '';
    export let type = 'info'

    export const show = () => {
        show_popup = true
    }
    
</script>

<div class="modal" class:is-active={show_popup} style="z-index: 1000">
    <div class="modal-background" />
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">{title}</p>
            <button
                class="delete"
                aria-label="close"
                on:click={(e) => (show_popup = false)} />
        </header>
        <section class="modal-card-body">
            {@html message_text}
        </section>
        <footer class="modal-card-foot">
            <div class="column">
            <button class:is-info="{type == 'info'}" class:is-danger="{type == 'error'}" class:is-warning="{type == 'warning'}" 
                class:is-success="{type == 'success'}" class="button is-outlined is-pulled-right"
                    on:click={(e) => (show_popup = false)}>Ok</button>
            </div>
        </footer>
    </div>
</div>
