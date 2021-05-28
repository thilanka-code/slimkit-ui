<script>
  // import { slide } from "svelte/transition";
  import MenuItem from "./MenuItem.svelte";
  import { onMount, onDestroy, tick } from "svelte";
  import { createEventDispatcher } from "svelte";
  import { activeLink } from "./sidebar-store.js";
  import { clickOutside } from "../utils/clickOutside.js";

  export let cssClass;
  export let menu;
  export let activeIndex;
  export let currentPath;
  export let ie11=false;

  let sidebarContainer;
  let isCollapsed;
  let isSmallScreen;
  let topLevelMenuComponents = {}; //Contains all components
  let topMenuItems = [];
  const dispatch = createEventDispatcher();

  $: {
    dispatch("collapsed", isCollapsed);
  }

  $: dispatch("click", $activeLink);

  $: {
    activeLink.set(currentPath);
    // Should open the target menu!
    if (menu && Object.keys(topLevelMenuComponents).length > 0) {
      expandCurrentPathMenu();
    }
  }

  async function expandCurrentPathMenu() {
    const topMenus = Object.keys(menu);
    const targetItemPath = [];
    let pathFoundInSidebar
    for (let i = 0; i < topMenus.length; i++) {
      const subMenu = menu[topMenus[i]];

      if (
        subMenu &&
        findAndConstructTargetMenuPath(
          subMenu,
          targetItemPath,
          topLevelMenuComponents[i]
        )
      ) {
        // Target menu item found
        targetItemPath.unshift(i);
        pathFoundInSidebar = true
        break;
      }
    }
    if (pathFoundInSidebar) { //Only expand menu when path is found in sidebar data.
      topLevelMenuComponents[targetItemPath[0]].showChildren();
      await tick(); // Wait for the next UI update
      let tempChildComps = topLevelMenuComponents[
        targetItemPath[0]
      ].getChildren();

      // Expand child nodes - we are skiping already expanded [0]
      for (let i = 1; i < targetItemPath.length; i++) {
        if (Object.keys(tempChildComps).length > 0) {
          tempChildComps[targetItemPath[i]].showChildren();
          await tick();
          tempChildComps = tempChildComps[targetItemPath[i]].getChildren();
        }
      }
    }
  }

  function findAndConstructTargetMenuPath(
    menuItem,
    targetItemPath,
    topLevelMenuComponents
  ) {
    if (menuItem.link && menuItem.link == $activeLink) {
      //Target leaf node found
      return true;
    } else if (!menuItem.link) {
      let childMenus = Object.keys(menuItem);

      for (let i = 0; i < childMenus.length; i++) {
        const innerMenuItem = menuItem[childMenus[i]];

        if (
          findAndConstructTargetMenuPath(
            innerMenuItem,
            targetItemPath,
            topLevelMenuComponents
          )
        ) {
          targetItemPath.unshift(i); // Expandable parent menu item found
          return true;
        }
      }
    } else return false;
  }

  onMount(() => {
    sidebarContainer.addEventListener("blur", (evt) => {});
    topMenuItems = Object.keys(menu);
  });

  export const toggleShow = () => {
    isCollapsed = !isCollapsed;
    if (isSmallScreen && !isCollapsed) {
      sidebarContainer.focus({ preventScroll: true });
    }
  };

  //=============== Make SideBar responsive ===============
  const query = "screen and (max-width: 900px)";
  let mediaQ = window.matchMedia(query);
  isSmallScreen = mediaQ.matches;
  isCollapsed = isSmallScreen;
  dispatch("collapsed", isCollapsed);

  const onScreenChange = (evt) => {
    if (evt.media == query) {
      isCollapsed = evt.matches;
      isSmallScreen = evt.matches;
    }
  };

const onFocusOut = () => {
  if (isSmallScreen && !isCollapsed) {
        isCollapsed = true;
    }
  };
  
  if(ie11){
    mediaQ.addListener("change", onScreenChange);
  } else {
    mediaQ.addEventListener("change", onScreenChange); //This will not work in IE 11 and webview
  }

  onDestroy(() => {
    if(ie11){
      mediaQ.removeListener("change", onScreenChange)
    } else {
      mediaQ.removeEventListener("change", onScreenChange)
    }
  });
  // =================================================================

  // $: cssVarStyles = `--hide-width:${}`
</script>

<style type="text/scss" lang="scss" global>
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
    $slimkit-sidebar-background: white !default;
    // $slimkit-sidebar-text-color: yellow !default;
    background-color: $slimkit-sidebar-background;
    // color: $slimkit-sidebar-text-color;
    z-index: 900;
    height: 100vh;
    /* transform: translateX(0px); */
  }

  aside:focus {
    outline: none;
  }

  aside.collapsed {
    transform: translateX(-300px);
    transition: transform 0.25s ease-out 0s, height 0.25s ease-out 0.25s,
      max-width 0.25s ease-out 0.15s;
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

<!-- {JSON.stringify(menu)} -->
<!-- {isCollapsed} -->
<!-- {JSON.stringify(topLevelMenuComponents)} -->
<aside
  id="_sv_lib_sidebar_container"
  class="menu {cssClass}"
  class:collapsed={isCollapsed}
  class:onTop={isSmallScreen}
  bind:this={sidebarContainer}
  on:click_outside={onFocusOut}
  use:clickOutside={ie11}
  tabindex="-1">
  <ul class="menu-list">
    {#each topMenuItems as item, index}
      <li>
        <MenuItem
          bind:this={topLevelMenuComponents[index]}
          {menu}
          {item}
          activeClass={index == activeIndex ? 'is-selected' : ''} />
      </li>
    {/each}
  </ul>
</aside>

<!-- <svelte:window on:click={windowClick} /> -->