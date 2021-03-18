<script>
    import { menu } from "./sidebar-data.js";
    import { SideBar } from "../../src/index.js";

    let mySideBar
    // let isSideBarCollapsed = true;
    let activeIndex =0;
    let currentPath = "/";

    function activeLink(event) {
      console.log('active link= '+event.detail);
	}

    function sidebarCollapsed(evt) {
		isSideBarCollapsed = evt.detail;
	}

</script>
<SideBar {menu} cssClass="column" bind:this={mySideBar} on:collapsed={sidebarCollapsed} 
{activeIndex} on:click={activeLink} {currentPath}/>

<button class="button" on:click={mySideBar.toggleShow}>Toggle Sidebar</button>