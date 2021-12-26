<script>
    /**
     * This is a read only data table that can be updated 
    */
    import Icon from "fa-svelte";
    import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
    import { afterUpdate, createEventDispatcher, onMount } from "svelte";
    import FilterMenu from "./FilterMenu.svelte";

    export let resourceList; // Promise that resolves a list
    export let headers = []; //Optinal header label
    export let maxItems = 5;
    export let cssClass = "";
    export let autoScrollOnTableUpdate = true
    export const appendItem = (item) => {
        const new_items = add_url_to_items([item]).map((it)=> {
            return {...it, __index: processedItems.length}
        })
        processedItems = [...processedItems, ...new_items]
        if (autoScrollOnTableUpdate) {
            currentPage = pages
            scrollToBottom()
        }
    }
    let currentPage = 1;
    let pages = 1;
    let lastInputIndex = 0
    $: pageNums = Array.apply(0,Array(pages)).map((_, x)=>x+1)

    const ELEMENT_NAME = "ResourceList";
    let outerMostContainerDiv //This will be bound by svelte - Outer parent
    let scrollableTableContainer //This will be bound by svelte - scroll bar will be applied to this
    let table //This will be bound by svelte - actual table
    
    let searchText;
    let scrollWait //If true no scroll events will be intercepted until set to true : this is to throttle
    let scrollTopLast //Last scrollTop value to determine current scroll direction - will be initialized in afterUpdate by its initial value
    let isLoading = true;
    let processedItems
    let keys; //keys of object array provided
    let filteredList = []; //actual data rendered on table
    let filterMap = {} // {key: uniqueValuesArray[]}
    let rowSelected = -1 //This row will be highlighted
    let ignoreNextScrollEvent
    let lastCall
    let scrollDirection
    let autoScrolled
    let tableResized
    let tabelRowHeight
    let tableContainerHeight
    let headerHeight
    let scrollEdgeOffset // space between scroll bar and edge when jumping to trigger inifinite scroll
    let viewportRows

    const dispatch = createEventDispatcher();

    const pageRight = ()=> {
        currentPage = currentPage == pageNums.length ? currentPage : currentPage + 1
    }

    const pageLeft = ()=> {
        currentPage = currentPage <= 1 ? currentPage : currentPage - 1
    }


    const captureUniqueItemsToFilter = (items)=> {
        
        const maxUniqueValues = 10
        const maxSearchableRows = 1000
        let filterableKeys = keys
        let iterations = 0
        let i = 0
        for(let item of items) {
            if(i>maxSearchableRows) break
            for(const key of filterableKeys) {
                iterations++
                if(filterMap[key]) {
                    if(filterMap[key].indexOf(item[key]) >= 0){ //duplicated value for the key
                        continue
                    }
                    if(filterMap[key].length < maxUniqueValues){
                        filterMap[key] = [...filterMap[key], item[key]]
                    } else {
                        filterableKeys = filterableKeys.filter(x=> x!= key) //remove key from further collecting unique values
                    }
                } else {
                    filterMap[key] = [item[key]]
                }
            }
            if(filterableKeys.length == 0){
                break
            }
            i++
        }
        // console.log(filterMap);
        return {}
    }

    const validateIfObjectKeysMatchHeaders = () => {
        const invalidKeys = keys.filter(
            (it) => it.startsWith("__") && it != "__url"
        );
        if (invalidKeys.length > 0)
            throw (
                ELEMENT_NAME +
                "::Object keys contains invalid key starting with __. Only Object.__url is expected!"
            );
        //Below -1 to avoid meta columns like __url
        if (headers.length > 0 && headers.length != keys.length - 1)
            throw (
                ELEMENT_NAME +
                "::Headers mismatch with provided resource item's keys length"
            );
    };

    $: { //Triggers when search or currentPage changes
        if (tabelRowHeight) {
            viewportRows = Math.round((tableContainerHeight - headerHeight)/tabelRowHeight)
        }
        if (searchText) {
            let i = 0
            let tempList = [];
            for (let item of processedItems) {
                for (let key of keys) {
                    if (item[key] && (item[key] + "").toLowerCase().indexOf(searchText.toLowerCase()) >= 0) {
                        tempList.push(item);
                        break;
                    }
                    i++
                }
            }
            currentPage = 1; //Reset page number every time the user search
            let startIndex = currentPage * maxItems - maxItems;
            let endIndex = startIndex + maxItems;
            let temp = Math.trunc(tempList.length / maxItems);
            pages = tempList.length % maxItems > 0 ? ++temp : temp;
            let paged_items = tempList.slice(startIndex, endIndex)
            if (currentPage != 1 && currentPage == pages && viewportRows > paged_items.length) { //To make scroll appear 
                paged_items = tempList.slice(startIndex-(viewportRows - paged_items.length), endIndex)
            }
            filteredList = paged_items;
        } else {
            let startIndex = currentPage * maxItems - maxItems;
            let endIndex = startIndex + maxItems;
            
            if (processedItems) {
                // filteredList = get_items_for_current_page(processedItems)
                let temp = Math.trunc(processedItems.length / maxItems);
                pages = processedItems.length % maxItems > 0 ? ++temp : temp;
                
                // filteredList = get_items_for_current_page(tempList)
                let paged_items = processedItems.slice(startIndex, endIndex)
                if (currentPage != 1 && currentPage == pages && viewportRows > paged_items.length) { //To make scroll appear 
                    paged_items = processedItems.slice(startIndex-(viewportRows - paged_items.length), endIndex)
                }
                filteredList = paged_items;
            }
        }
    }

    /**
     * @deprecated We can't use this inside a $:{} 
     * @param itemList
     */
    function get_items_for_current_page(itemList) {
        let startIndex = currentPage * maxItems - maxItems;
        if (currentPage == pages.length) {
            console.log('last page');

        }
        let endIndex = startIndex + maxItems;
        let temp = Math.trunc(itemList.length / maxItems);
        pages = itemList.length % maxItems > 0 ? ++temp : temp;
        return itemList.slice(startIndex, endIndex);
    }

    function resizeTable() {
        let tables = [table];
        for (var i = 0; i < tables.length; i++) {
            resizableGrid(tables[i]);
        }
    }

    function add_url_to_items(items) {
        return items.map((it) => {
                // it['id'] = i
                // console.log(i);
                if (!it.__url) {
                    it.__url = "#";
                }
                return it;
            })
    }
    
    onMount(()=>{
        ///// Load initial data /////////////////////
        resourceList.then((items) => {
            currentPage = 1; //Reset page number every time the resourceList changes
            //Pre processing of items
            // const processedItems = items.map((it, i) => {
                // items = []
            processedItems = add_url_to_items(items.slice(lastInputIndex))
                .map((it, i) => {
                    return {...it, __index: i}
                })
            // console.log(processedItems[0]);
            isLoading = false;
            filteredList = processedItems;

            if (processedItems.length > 0) {
                keys = Object.keys(processedItems[0]);
            }

            // Seperate function is needed to prevent infinite reactive loop
            //https://github.com/sveltejs/svelte/issues/4420
            // validateIfObjectKeysMatchHeaders(); //Why is this commented?
            resizeTable();
            captureUniqueItemsToFilter(items) //runs on all items for once promise reolve
            if(autoScrollOnTableUpdate) {
                scrollToBottom()
            }
        });
        ////////////////////////////////////////////////////////////////////
        scrollTopLast = scrollableTableContainer.scrollTop;
        scrollableTableContainer.addEventListener("scroll", ()=>{

            if (ignoreNextScrollEvent) {
                // Ignore this event because it was done programmatically
                ignoreNextScrollEvent = false;
                return;
            }


            // console.log(`not auto scroll bot`);
    
            if(scrollableTableContainer.scrollTop == scrollTopLast) return
            
            if(scrollableTableContainer.scrollTop >= scrollTopLast){
                scrollDirection = 'down'
            }else{
                // console.log(`going up ${scrollableTableContainer.scrollTop} :: last: ${scrollTopLast}`);
                scrollDirection = 'up'
            }
            
            if(!scrollWait){
                scrollWait = true
                if (lastCall) clearTimeout(lastCall);
                lastCall = setTimeout(() => {
                        if(!autoScrolled){
                            if(scrollDirection == 'up' && scrollableTableContainer.scrollTop < 1){
                                // console.log(`loading prev page now page: '${currentPage}' data`);
                                if(currentPage != 1){
                                    pageLeft();
                                    autoScrolled = true 
                                    setTimeout(() => {
                                        //Jump scrollbar
                                        let maxScrollableTop = scrollableTableContainer.scrollHeight - scrollableTableContainer.clientTop
                                        scrollableTableContainer.scrollTop = maxScrollableTop - scrollEdgeOffset
                                    }, 80);

                                }
                            } else if(scrollDirection == 'down' && Math.round(scrollableTableContainer.scrollTop + scrollableTableContainer.offsetHeight) >= scrollableTableContainer.scrollHeight){ //scroll reached end
                                //Rounding is required as in chrome scrollTop is a float
                                if(currentPage != pageNums[pageNums.length-1]){
                                    pageRight();
                                    autoScrolled = true 
                                    // scrollableTableContainer.style.pointerEvents = 'none' // To tame the crazy jumping effect when user press and hold scroll to the edge * cause slowness
                                    setTimeout(() => {
                                        //Jump scrollbar
                                        scrollableTableContainer.scrollTop = scrollEdgeOffset
                                        // scrollableTableContainer.style.pointerEvents = 'auto' // To tame the crazy jumping effect when user press and hold scroll to the edge * cause slowness
                                    }, 80);
                                }
                            }
                                scrollWait = false
                                scrollTopLast = scrollableTableContainer.scrollTop
                            }else {
                                scrollWait = false
                                scrollTopLast = scrollableTableContainer.scrollTop
                                autoScrolled = false
                            }
                        
                    }, 100);
                }
        })

    })

    const onRowSelected = (row) => {
        rowSelected = row.index
        const out_object = {...processedItems[row.index], index: rowSelected}
        delete out_object['__url']
        delete out_object['__index']
        dispatch("rowSelected", { index: row.index, row: out_object});
    }

    /**
     * This code will run on every update to the DOM!
    */
    afterUpdate(() => {
        if (!tabelRowHeight && table.children[1].children[0]) {
            tabelRowHeight = table.children[1].children[0].offsetHeight
        }
        if(tableResized) { //Otherwise this will run everytime when resourceList is set at client side
            resizeTable();
            tableResized = true
        }
    });

    function resizableGrid(table) {
        
        let row = table.getElementsByTagName("tr")[0],
            cols = row ? row.children : undefined;
        if (!cols) return;

        // table.style.overflow = "hidden"; //Sticky header won't work otherwise
        for (var i = 0; i < cols.length; i++) {
            var div = createDiv();
            div.style.height = cols[i].offsetHeight + "px";
            cols[i].appendChild(div);
            setListeners(div);
        }

        function setListeners(div) {
            var pageX, curCol, nxtCol, curColWidth, nxtColWidth;

            div.addEventListener("mousedown", function (e) {
                curCol =
                    e.target.parentElement.getElementsByClassName(
                        "tbl-head-container"
                    )[0];
                nxtCol =
                    curCol.parentElement.nextElementSibling.getElementsByClassName(
                        "tbl-head-container"
                    )[0];
                pageX = e.pageX;

                var padding = paddingDiff(curCol);

                curColWidth = curCol.offsetWidth - padding;
                if (nxtCol) nxtColWidth = nxtCol.offsetWidth - padding;
                // console.log({ curCol, nxtCol, curColWidth, nxtColWidth });
            });

            div.addEventListener("mouseover", function (e) {
                e.target.style.borderRight = "2px solid #0000ff";
            });

            div.addEventListener("mouseout", function (e) {
                e.target.style.borderRight = "";
            });

            document.addEventListener("mousemove", function (e) {
                if (curCol) {
                    var diffX = e.pageX - pageX;
                    if (nxtCol) nxtCol.style.width = nxtColWidth - diffX + "px";

                    curCol.style.width = curColWidth + diffX + "px";
                }
            });

            document.addEventListener("mouseup", function (e) {
                curCol = undefined;
                nxtCol = undefined;
                pageX = undefined;
                nxtColWidth = undefined;
                curColWidth = undefined;
            });
        }

        function createDiv() {
            var div = document.createElement("div");
            div.style.top = 0;
            div.style.right = 0;
            div.style.width = "5px";
            div.style.position = "absolute";
            div.style.cursor = "col-resize";
            div.style.userSelect = "none";
            div.className = "columnSelector";
            return div;
        }

        function paddingDiff(col) {
            if (getStyleVal(col, "box-sizing") == "border-box") {
                return 0;
            }

            var padLeft = getStyleVal(col, "padding-left");
            var padRight = getStyleVal(col, "padding-right");
            return parseInt(padLeft) + parseInt(padRight);
        }

        function getStyleVal(elm, css) {
            return window.getComputedStyle(elm, null).getPropertyValue(css);
        }
    }

    function scrollToBottom() {
        ignoreNextScrollEvent = true;
        let scrollEdgeOffset = Math.round(tabelRowHeight/7) // space between scroll bar and edge when jumping to trigger inifinite scroll
        let maxScrollableTop = scrollableTableContainer.scrollHeight - scrollableTableContainer.clientTop
        scrollableTableContainer.scrollTop = maxScrollableTop - scrollEdgeOffset
    }

</script>

<div class="columns is-multiline data-list-container" bind:this={outerMostContainerDiv}>
    <input
        type="text"
        class="input is-small column is-full"
        bind:value={searchText}
        placeholder="Search"
    />

    <!-- Table based impl -->
    <div class="svelte-elements-datatable-table-container" bind:this={scrollableTableContainer} bind:clientHeight={tableContainerHeight}>
        <table id="mx" class="table is-bordered is-stripedx is-narrow is-hoverablex is-fullwidth {cssClass}" bind:this={table}>
            <thead bind:clientHeight={headerHeight}>
                <tr>
                    {#each headers as label, headerIndex} <!-- headerIndex will be mapped with keys - same order is assumed -->
                        <th class="is-primary">
                            <div class="tbl-head-container">
                                <div style="float: left" class="tbl-head-txt">
                                    {label}
                                </div>
                                <div style="float: right" class="tbl-head-icon">
                                    {#if keys}
                                        <FilterMenu items={filterMap[keys[headerIndex]]}></FilterMenu>
                                    {/if}
                                </div>
                            </div>
                        </th>
                    {/each}
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                {#each filteredList as resource}
                    <tr on:click={(element) => { onRowSelected({element: element.target, index: resource.__index}); } } class:tbl-row-selected={resource.__index == rowSelected} >
                        {#each keys as key}
                            <!-- We will skip keys starting with __ as they are meta columns -->
                            {#if !key.startsWith("__")}<td>{resource[key]}</td
                                >{/if}
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
        
    </div>

    <!-- <div class="filter-menu">
        This is some div
        <input type="checkbox" /><label for="chk">Item1</label><br>
        <input type="checkbox" /><label for="chk">Item1</label><br>
        <input type="checkbox" /><label for="chk">Item1</label><br>
        <input type="checkbox" /><label for="chk">Item1</label><br>
    </div> -->
</div>

<style lang="scss">
    $primary-light: yellow !default;
    * {
        box-sizing: border-box;
    }
    table {
        border-collapse: collapse;
    }
    td,
    th {
        padding: 5px 15px;
        text-align: left;
    }
    table,
    th,
    td {
        border: 1px solid #000;
    }

    .results {
        margin-top: 25px;
    }

    .svelte-elements-datatable-table-container {
        overflow: auto;
        // width: 1200px;
        height: 500px;
    }

    .tbl-row-selected {
        background-color: $primary-light;
        // background-color: red;
    }

    .tbl-head-icon {
        $primary-light: yellow !default;
        color: $primary-light;
        &:hover {
            $primary-dark: yellow !default;
            color: $primary-dark;
            background-color: $primary-light;
        }
    }

    .columnSelector {
        //Resize handle
        :hover {
            border-right: "2px solid #0000f";
        }
    }

    th {
        position: sticky;
        position: -webkit-sticky;
        top: 0;
    }

    td {
        white-space: nowrap;
        padding: 0;
        text-overflow: ellipsis;
        overflow: hidden;
        max-width: 50px; //This is the minimum width a column can resize
    }

    .headers {
        background-color: $primary;
        $primary-invert: green !default;
        color: $primary-invert;
    }

    // .filter-menu {
    //     background-color: rgb(53, 46, 46);
    //     font-size: x-small;
    //     position: absolute;
    //     width: 100%;
    //     display: none;
    //     left: 0;
    // }

    .paging-area {
        margin-top: 48px;
        text-align: center;
    }

    .current-page {
        $primary-light: red !default;
        background-color: $primary-light;
    }

    .empty-row {
        min-height: 48px;
    }

    a :global(.arrows) {
        font-size: x-large;
    }
</style>
