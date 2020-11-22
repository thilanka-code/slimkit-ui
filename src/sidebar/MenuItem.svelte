<script>

    import MenuItem from "./MenuItem";
    import { slide } from 'svelte/transition';
    export let menu;
    export let item;
    export let isVisible = false
    export let activeClass;

    function clickHandler () {
        // menu[item].isVisible = !menu[item].isVisible
        isVisible = !isVisible;    
        activeClass = isVisible?'is-active':''
    }

</script>

    {#if menu[item].link}
        {#if isVisible}<a href="/#{menu[item].link}">{item}</a>{/if}
    {:else}

        <p class="menu-label"><a on:click={clickHandler} class={activeClass}>{item}</a></p>

        {#if isVisible}
            <ul transition:slide="{{ duration: 275 }}">
                {#each Object.keys(menu[item]) as nestedItem}
                    <li><MenuItem menu={menu[item]} item={nestedItem} {isVisible} /></li>
                {/each}
            </ul>
        {/if}
    {/if}