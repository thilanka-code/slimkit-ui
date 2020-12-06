<script>
    
    import { slide } from 'svelte/transition';
    import { createEventDispatcher } from "svelte";
    import Icon from 'fa-svelte'
    import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
    import { activeLink } from "./sidebar-store.js";
    
    export let menu;
    export let item;
    export let isChildrenVisible = false;
    // let isLeafClicked = false;
    export let activeClass;
    $: activeClass = isChildrenVisible?'is-active':''; //If children are visible make parent active
    
    let link = menu[item].link;
    let childNodes = Object.keys(menu[item]);
    
    const dispatch = createEventDispatcher();
    
    function clickHandler () {
        
        if(link) {
            console.log('dispatching..');
            //Tims is due to trigger change even store value is the same
            // activeLink.set({link: link, time: new Date()}); 
            activeLink.set(link); 
            // isLeafClicked = !isLeafClicked;
        } else {
            isChildrenVisible = !isChildrenVisible;    
        }
    }

</script>

<!-- {JSON.stringify(childNodes)} -->
<!-- {link} -->
<!-- {isVisible} -->

    {#if link}
        <a href="{link}" on:click|preventDefault ={clickHandler} class:leaf-clicked={$activeLink == link}>{item}</a>
    {:else}

        <p class="parent-menu"><a on:click={clickHandler} class={activeClass}>{item} <Icon icon={faCaretRight}></Icon></a></p>

        {#if isChildrenVisible}
            <ul transition:slide="{{ duration: 125 }}">
                {#each childNodes as nestedItem}
                    <li><svelte:self menu={menu[item]} item={nestedItem} {activeClass} /></li>
                {/each}
            </ul>
        {/if}
    {/if}

    <style>
        .parent-menu {
            text-transform: uppercase;
        }

        a.leaf-clicked {
            background-color: #ddd;
            /* color: ivory; */
        }
    </style>