<script>
  import { slide } from "svelte/transition";
  import MenuItem from "./MenuItem.svelte";
  import { onMount, onDestroy } from 'svelte';

  export let cssClass;
  export let menu;
  export let activeIndex;

  let sidebarContainer;
  let isCollapsed;
  let isSmallScreen;

  export const toggleShow = () => {
    isCollapsed = !isCollapsed;
    if(isSmallScreen && !isCollapsed) {
      sidebarContainer.focus();
    }
  }

  //=============== Make SideBar responsive ===============
  const query = "screen and (max-width: 900px)";
  let mediaQ = window.matchMedia(query);
  isSmallScreen = mediaQ.matches;
  isCollapsed = isSmallScreen;
  
  const onScreenChange = (evt) => {
    if(evt.media == query){
      isCollapsed = evt.matches;
      isSmallScreen = evt.matches;
    } 
  };
  
  const onFocusOut = () => {
    if (isSmallScreen && !isCollapsed) {
        isCollapsed = true;
    }
  }
  
  
  mediaQ.addEventListener("change", onScreenChange);
  
  onMount(()=>{
    sidebarContainer.addEventListener('blur', (evt)=>{
    })
  })

  onDestroy(()=>mediaQ.removeEventListener("change", onScreenChange))
  // =================================================================

  // $: cssVarStyles = `--hide-width:${}`
  // class:collapsed-mobile={isCollapsed && window.matchMedia('screen and (max-width: 500px)').matches}
  // class:open-mobile={!isCollapsed && window.matchMedia('screen and (max-width: 500px)').matches}

</script>

<style>
  aside {
    max-width: 300px;
    overflow: hidden; /*So the sliding bit doesn't stick out. */
    /* -webkit-transition: all 0.45s ease-in-out;
    -moz-transition: all 0.45s ease-in-out;
    -o-transition: all 0.45s ease-in-out; */
    /* transition:  max-width 1s ease-in-out; */
    transition: transform 0.25s ease-in;
    /* transition: all 0.45s ease-in-out; */
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    background-color: white;
    z-index: 900;
    height: 100vh;
    /* transform: translateX(0px); */
  }

  aside:focus {
    outline: none;
  }

  aside.collapsed {
    transform: translateX(-300px);
    transition: transform 0.25s ease-out 0s, height 0.25s ease-out 0.25s, max-width 0.25s ease-out 0.15s;
    /* transition: height 0.45s ease-in-out; */
    height: 0;
    max-width: 0;
  }

  aside.onTop {
    /* This will display over on the content on the right; */
      position: absolute;  
  }

  @media screen and (max-width: 900px) {
    
  }
</style>

<!-- {#if !isCollapsed} -->
<aside id="_sv_lib_sidebar_container"
  class="menu {cssClass}"
  class:collapsed={isCollapsed}
  class:onTop={isSmallScreen}
  bind:this={sidebarContainer}
  on:blur={onFocusOut}
  tabindex="-1">

  <ul class="menu-list">
    {#each Object.keys(menu) as item, index}
      <li>
        <MenuItem
          {menu}
          {item}
          isVisible={index == activeIndex}
          activeClass={index == activeIndex ? 'is-active' : ''} />
      </li>
    {/each}
  </ul>
</aside>

<!-- <svelte:window on:click={windowClick} /> -->

<!-- {isCollapsed}
{isSmallScreen} -->

<!-- {/if} -->
<!-- <button on:click={toggleShow}>show + {isCollapsed}</button> -->
<!-- <svelte:window on:click={windowClick} /> -->

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
