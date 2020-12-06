<script>
  import { slide } from "svelte/transition";
  import MenuItem from "./MenuItem.svelte";
  import { onMount, onDestroy } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { activeLink } from "./sidebar-store.js";

  export let cssClass;
  export let menu;
  export let activeIndex;
  export let currentPath;

  let sidebarContainer;
  let isCollapsed;
  const dispatch = createEventDispatcher();
  
  $: {
    dispatch('collapsed', isCollapsed)
  }

  $: dispatch('click', $activeLink);

  // $: activeLink.set({link: currentPath, time: new Date()}); 
  $: activeLink.set(currentPath); 

  let isSmallScreen;
  let topLevelMenuComponents = {}; //Contains all components
  let topMenuItems = [];

  onMount(()=>{
    sidebarContainer.addEventListener('blur', (evt)=>{
    })
    topMenuItems = Object.keys(menu);

    let temp = Object.keys(topLevelMenuComponents);
    while(temp.length > 0) {

    }
  })
  

  export const toggleShow = () => {
    isCollapsed = !isCollapsed;
    if(isSmallScreen && !isCollapsed) {
      sidebarContainer.focus({ preventScroll: true });
    }
  }

  //=============== Make SideBar responsive ===============
  const query = "screen and (max-width: 900px)";
  let mediaQ = window.matchMedia(query);
  isSmallScreen = mediaQ.matches;
  isCollapsed = isSmallScreen;
  dispatch('collapsed', isCollapsed);
  
  const onScreenChange = (evt) => {
    if(evt.media == query){
      isCollapsed = evt.matches;
      isSmallScreen = evt.matches;
    } 
  };
  
  const onFocusOut = () => {
    if (isSmallScreen && !isCollapsed) {
      //Delay is introduced so that actual navigation happend before focus out
      setTimeout(() => {
        isCollapsed = true;
      }, 100);
    }
  }
  
  mediaQ.addEventListener("change", onScreenChange);
  

  onDestroy(()=>mediaQ.removeEventListener("change", onScreenChange))
  // =================================================================

  // $: cssVarStyles = `--hide-width:${}`

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

<!-- {isCollapsed} -->
<!-- {JSON.stringify(topLevelMenuComponents)} -->
<aside id="_sv_lib_sidebar_container"
  class="menu {cssClass}"
  class:collapsed={isCollapsed}
  class:onTop={isSmallScreen}
  bind:this={sidebarContainer}
  on:blur={onFocusOut}
  tabindex="-1">

  <ul class="menu-list">
    {#each topMenuItems as item, index}
      <li>
        <MenuItem bind:this={topLevelMenuComponents[index]}
          {menu}
          {item}
          activeClass={index == activeIndex ? 'is-active' : ''} />
        </li>
        {/each}
      </ul>
    </aside>

<!-- <svelte:window on:click={windowClick} /> -->