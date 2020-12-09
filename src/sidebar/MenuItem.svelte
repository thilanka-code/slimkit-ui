<script>
    import { slide } from "svelte/transition";
    import { createEventDispatcher } from "svelte";
    import Icon from "fa-svelte";
    import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
    import { activeLink } from "./sidebar-store.js";

    export let menu;
    export let item;
    export let isChildrenVisible = false;
    export let activeClass;
    export let parent = this;
    let childComponents = {}; // Contains child components of this parent so that childs can be collapsed
    $: activeClass = isChildrenVisible ? "is-active" : ""; //If children are visible make parent active

    let link = menu[item].link;

    let childNodes = Object.keys(menu[item]);

    const dispatch = createEventDispatcher();

    function clickHandler() {
        if (link) {
            activeLink.set(link);
        } else {
            isChildrenVisible = !isChildrenVisible;
        }
    }

    export const getLink = () => link;
    export const getChildren = () => childComponents;
    export const showChildren = () => (isChildrenVisible = true);
</script>

<style>
    .parent-menu {
        text-transform: uppercase;
    }

    a.leaf-clicked {
        background-color: #ddd;
    }
</style>

{#if link}
    <a
        href={link}
        on:click|preventDefault={clickHandler}
        class:leaf-clicked={$activeLink == link}>{item}</a>
{:else}
    <p class="parent-menu">
        <a on:click={clickHandler} class:is-active={isChildrenVisible}>{item}
            <Icon icon={faCaretRight} /></a>
    </p>

    {#if isChildrenVisible}
        <ul transition:slide={{ duration: 125 }}>
            {#each childNodes as nestedItem, index}
                <li>
                    <svelte:self
                        menu={menu[item]}
                        item={nestedItem}
                        {activeClass}
                        {parent}
                        bind:this={childComponents[index]} />
                </li>
            {/each}
        </ul>
    {/if}
{/if}
