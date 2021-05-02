<script>

    export let title = 'Error occurred'
    export let show_popup = false;
    export let message_text = '';
    export let type = 'info'

    $: yesButtonText = type == 'confirm' ? 'Yes' : 'Ok'
    let noButtonText = 'No';

    let userCallback; // only for confirm

    /**
     * Show confirmation message box. Only last opened ui will be shown!
     * 
     * @param callback
     * @param queryText
     * @param boxTitle
     */
     export const showConfirm = (callback, queryText='Confirm operation?', boxTitle='Confirmation') => {
        
        message_text = queryText
        title = boxTitle
        type = 'confirm'
        userCallback = callback
        show_popup = true
    }

    /**
     * Show message box. Only last opened ui will be shown!
     * @param infoText
     * @param boxTitle
     */
    export const showInfo = (infoText, boxTitle='Info') => {
        message_text = infoText
        title = boxTitle
        type = 'info'
        show_popup = true
    } 

    /**
     * Show success box. Only last opened ui will be shown!
     * @param infoText
     * @param boxTitle
     */
    export const showSuccess = (infoText, boxTitle='Success') => {
        message_text = infoText
        title = boxTitle
        type = 'success'
        show_popup = true
    } 

    /**
     * Show success box. Only last opened ui will be shown!
     * @param errorText
     * @param boxTitle
     */
    export const showError = (errorText, boxTitle='Error') => {
        message_text = errorText
        title = boxTitle
        type = 'error'
        show_popup = true
    } 

    const onAction = (action) => {
        if (action == 0){
            if(type == 'confirm'){
                userCallback()
            }
        }
        show_popup = false
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
                    on:click={() => onAction(0)}>{yesButtonText}</button>
            {#if type == 'confirm'}
                <button class="button is-outlined is-pulled-right" on:click={() => onAction(1)}>{noButtonText}</button>
            {/if}
            </div>
        </footer>
    </div>
</div>
