<script>
    import MenuItem from "./MenuItem.svelte";
    export let cssClass;
    export let menu;
    export let activeIndex;

</script>

<style>
    aside  {
		max-width: 200px;
	}
</style>


<aside class="menu {cssClass}">
    <ul class="menu-list">
        {#each Object.keys(menu) as item, index}
            <li><MenuItem {menu} {item} isVisible={index==activeIndex} activeClass={index==activeIndex?"is-active":""}/></li>
        {/each}
    </ul>
</aside>

<button class="button is-large">Hello</button>

<!-- <aside class="menu {cssClass}">
    <ul class="menu-list">
        {#each Object.keys(menu) as key}
            {#if menu[key].link}
                <li><a href="/#{menu[key].link}">{key}</a></li>
            {:else}
                <p class="menu-label">{key}</p>
                <ul class="menu-list">
                    {#each Object.keys(menu[key]) as key_lvl_1}
                        {#if menu[key][key_lvl_1].link}
                            <li><a href="/#{menu[key][key_lvl_1].link}">{key_lvl_1}</a></li>
                        {:else}
                            <li><a>{key_lvl_1} cx</a>
                            <ul class="menu-list">
                                {#each Object.keys(menu[key][key_lvl_1]) as key_lvl_2}
                                    {#if menu[key][key_lvl_1][key_lvl_2].link}
                                        <li><a href="/#{menu[key][key_lvl_1][key_lvl_2].link}">{key_lvl_2} yy</a></li>
                                    {:else}
                                    {/if}
                                {/each}
                            </ul></li>
                        {/if}
                    {/each}
                </ul>
            {/if}
        {/each}
    </ul>
</aside> -->