<script>

    import MenuItem from "./MenuItem.svelte";
    export let cssClass;
    export let menu;
    export let activeIndex;

</script>

<style>
    aside  {
		max-width: 300px;
	}
</style>


<aside class="menu {cssClass}">
    <ul class="menu-list">
        {#each Object.keys(menu) as item, index}
            <li><MenuItem {menu} {item} isVisible={index==activeIndex} activeClass={index==activeIndex?"is-active":""}/></li>
        {/each}
    </ul>
</aside>

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

<!-- <aside class="menu">
    <p class="menu-label">
      General
    </p>
    <ul class="menu-list">
      <li><a>Dashboard</a></li>
      <li><a>Customers</a></li>
    </ul>
    <p class="menu-label">
      Administration
    </p>
    <ul class="menu-list">
      <li><a>Team Settings</a></li>
      <li>
        <a on:click={clickHandler} class="is-active">Manage Your Team</a>
        {#if isVisibleX}
        <ul transition:slide="{{ duration: 175 }}">
          <li><a>Members</a></li>
          <li><a>Plugins</a></li>
          <li><a>Add a member</a></li>
        </ul>
        {/if}
      </li>
      <li><a>Invitations</a></li>
      <li><a>Cloud Storage Environment Settings</a></li>
      <li><a>Authentication</a></li>
    </ul>
    <p class="menu-label">
      Transactions
    </p>
    <ul class="menu-list">
      <li><a>Payments</a></li>
      <li><a>Transfers</a></li>
      <li><a>Balance</a></li>
    </ul>
  </aside> -->