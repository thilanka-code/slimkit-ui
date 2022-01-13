<script>
    import Icon from "fa-svelte";
    import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
    import { afterUpdate, onMount } from "svelte";
    export let items = [] // Should be dynamic => [{key: 'col1', value: false}]
    import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

    let popupToggel
    let selectedValues = []
    

    const openFilter = (clickedElement) => {
        //Go to the nearest div as we want to attach it there (not on the svg icon)
        if(!popupToggel) {
            popupToggel = true
        } else if(clickedElement.nodeName == "svg" || clickedElement.nodeName == "path" || clickedElement.classList.contains("icon-container")) {
            popupToggel = false
        }
    };

    const filterSelectionChange = ()=>{
        dispatch('selection', selectedValues)
    }
</script>

<style>
    .filter-menu {
        background-color: rgb(53, 46, 46);
        font-size: small;
        position: absolute;
        width: 100%;
        overflow: auto;
        max-height: 200px;
        left: 0;
    }
</style>

<div on:click={(element) => { openFilter(element.target); } } class="icon-container">
    <Icon icon={faCaretDown} />
        <div hidden='{!popupToggel}' class="filter-menu">
            {#each items as item}
            <input type="checkbox" bind:group={selectedValues} on:change={filterSelectionChange} value={item.key} /><label for="chk">{item.key}</label><br>
            {/each}
        </div>
</div>