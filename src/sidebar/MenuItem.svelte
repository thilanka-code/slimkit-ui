<script>

    // import MenuItem from "./MenuItem";
    // import { MenuItem } from "./MenuItem.svelte";
    import { slide } from 'svelte/transition';
    import { onMount } from "svelte";
    import Icon from 'fa-svelte'
    import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
    

    export let menu;
    export let item;
    export let isVisible = false
    export let activeClass;

    let link = menu[item].link;
    let childNodes = Object.keys(menu[item]);
    // let childNodes;

    // if(!link && isVisible) {
    //     // console.log('Link is: '+link);
    //     console.log('booooom');
    //     // console.log(Object.keys(menu[item]));
    //     childNodes = Object.keys(menu[item])
    // }


    
    function clickHandler () {
        
        isVisible = !isVisible;    
        activeClass = isVisible?'is-active':''
    }


</script>

<!-- {JSON.stringify(childNodes)} -->
<!-- {link} -->
<!-- {isVisible} -->

    {#if link}
        {#if isVisible}<a href="/#{link}">{item}</a>{/if}
    {:else}

        <!-- <p class="parent-menu"><a on:click={clickHandler} class={activeClass}>{item} <Icon icon={faArrowRight}></Icon></a></p> -->
        <p class="parent-menu"><a on:click={clickHandler} class={activeClass}>{item} <Icon icon={faCaretRight}></Icon></a></p>

        {#if isVisible}
            <ul transition:slide="{{ duration: 125 }}">
                {#each childNodes as nestedItem}
                    <li><svelte:self menu={menu[item]} item={nestedItem} {isVisible} {activeClass}/></li>
                {/each}
            </ul>
        {/if}
    {/if}

    <style>
        .parent-menu {
            text-transform: uppercase;
        }
    </style>