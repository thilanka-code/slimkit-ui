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
    $: activeClass = isChildrenVisible ? "is-selected" : ""; //If children are visible make parent active

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

<style type="text/scss" lang="scss">
    .parent-menu {
        text-transform: uppercase;
    }

    .colored-link {
        $slimkit-sidebar-text-color: black !default;
        color: $slimkit-sidebar-text-color;
        &:hover {
            $slimkit-sidebar-hover-menu-bg: #ddd !default;
            background-color: $slimkit-sidebar-hover-menu-bg;
            $slimkit-sidebar-hover-menu-text: black !default;
            color: $slimkit-sidebar-hover-menu-text;
        }
    }
    /** is-selected must be defined after colored-link! */
    .is-selected {
        $blue: hsl(217, 71%, 53%) !default;
        $slimkit-sidebar-active-menu-color: $blue !default;
        background-color: $slimkit-sidebar-active-menu-color;
        // color: findColorInvert($slimkit-sidebar-active-menu-color);
        color: white;
    }
</style>

{#if link}
    <a
        href={link}
        on:click|preventDefault={clickHandler}
        class="colored-link"
        class:is-selected={$activeLink == link}>{item}</a>
{:else}
    <p class="parent-menu">
        <a on:click={clickHandler} class="colored-link" class:is-selected={isChildrenVisible}>{item}
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
