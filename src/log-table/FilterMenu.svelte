<script>
    import Icon from "fa-svelte";
    import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
    import { afterUpdate, onMount } from "svelte";
    export let items // Should be dynamic

    let popupToggel

    const openFilter = (clickedElement) => {
        //Go to the nearest div as we want to attach it there (not on the svg icon)
        console.log(clickedElement);
        if(!popupToggel) {
            popupToggel = true
        } else if(clickedElement.nodeName == "svg" || clickedElement.nodeName == "path" || clickedElement.classList.contains("icon-container")) {
            popupToggel = false
            console.log(popupToggel);

        }
    };
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
            <input type="checkbox" /><label for="chk">{item}</label><br>
            {/each}
        </div>
</div>