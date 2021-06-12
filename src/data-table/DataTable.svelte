<script>
    import Icon from "fa-svelte";
    import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
    import { afterUpdate, onMount } from "svelte";

    export let resourceList; // Promise that resolves a list
    export let headers = []; //Optinal header label
    export let maxItems = 5;
    export let cssClass = "";
    let currentPage = 1;
    let pages = 1;
    $: pageNums = Array.apply(0,Array(pages)).map((_, x)=>x+1)

    const ELEMENT_NAME = "ResourceList";
    let outerMostContainerDiv //This will be bound by svelte - Outer parent
    let scrollableTableContainer //This will be bound by svelte - scroll bar will be applied to this
    let dataTableElement //This will be bound by svelte - actual table
    let headerTableElement //This will be bound by svelte - actual table header
    let tblHeadContainerElement //This will be bound by svelte - actual table header
    let headerTableContainerElement //This will be bound by svelte - actual table header
    
    let searchText;
    let searchTextElement
    let scrollWait //If true no scroll events will be intercepted until set to true : this is to throttle
    let scrollTopLast //Last scrollTop value to determine current scroll direction - will be initialized in afterUpdate by its initial value
    let isLoading = true;
    let resources; //what's this? same as processedItems used to calculate paging
    let keys; //keys of object array provided
    let filteredList = []; //actual data rendered on table
    let filterMap = {} // {key: uniqueValuesArray[]}
    let columnFilter = {} // {key: [] } key = column id

    $: {
        resourceList.then((items) => {
            currentPage = 1; //Reset page number every time the resourceList changes
            //Pre processing of items
            // const processedItems = items.map((it, i) => {
            const processedItems = items.map((it) => {
                // it['id'] = i
                // console.log(i);
                if (!it.__url) {
                    it.__url = "#";
                }
                return it;
            });
            isLoading = false;
            resources = processedItems;
            filteredList = processedItems;

            if (processedItems.length > 0) {
                keys = Object.keys(processedItems[0]);
            }
            // Seperate function is needed to prevent infinite reactive loop
            //https://github.com/sveltejs/svelte/issues/4420
            // validateIfObjectKeysMatchHeaders(); //Why is this commented?
            // resizeTable();
            captureUniqueItemsToFilter(items) //runs on all items for once promise reolve
        });
    }

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

    $: {
        if (searchText) {
            let i = 0
            let tempList = [];
            for (let item of resources) {
                for (let key of keys) {
                    if (item[key] && (item[key] + "").toLowerCase().indexOf(searchText.toLowerCase()) >= 0) {
                        tempList.push(item);
                        break;
                    }
                    i++
                }
            }
            // console.log("Done searching.. Iterations: "+i);
            currentPage = 1; //Reset page number every time the user search
            let startIndex = currentPage * maxItems - maxItems;
            let endIndex = startIndex + maxItems;
            let temp = Math.trunc(tempList.length / maxItems);
            pages = tempList.length % maxItems > 0 ? ++temp : temp;
            filteredList = tempList.slice(startIndex, endIndex);
        } else {
            let startIndex = currentPage * maxItems - maxItems;
            let endIndex = startIndex + maxItems;
            // console.log(`curPage: ${currentPage} max: ${maxItems} start: ${startIndex} end: ${endIndex} pages: ${pages}`);
            if (resources) {
                let temp = Math.trunc(resources.length / maxItems);
                pages = resources.length % maxItems > 0 ? ++temp : temp;
                filteredList = resources.slice(startIndex, endIndex); //Consider paging
            }
        }
    }

    function resizeTable() {
        let tables = [headerTableElement];
        for (var i = 0; i < tables.length; i++) {
            resizableGrid(tables[i]);
        }
    }
    
    let lastCall
    let scrollDirection
    let autoScrolled
    onMount(()=>{
        window.onscroll = function() {
            // console.log('scrolling');
            // updateTableHeaderPositions()
        };

        scrollTopLast = scrollableTableContainer.scrollTop;
        scrollableTableContainer.addEventListener("scroll", ()=>{

            // var translate = "translate(0,"+scrollableTableContainer.scrollTop+"px)";
            // scrollableTableContainer.querySelector("thead").style.transform = translate;

            // var translate = "translate(0,"+scrollableTableContainer.scrollTop+"px)";


            // const allTh = scrollableTableContainer.querySelectorAll("th");
            // for( let i=0; i < allTh.length; i++ ) {
            //     allTh[i].style.transform = translate;
            // }

            // console.log(`sc rec: `);

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
                            // console.log(translate);
                            const tabelRowHeight = dataTableElement.children[0].children[0].offsetHeight //table -> body -> tr
                            // const tabelHeaderRowHeight = table.children[0].children[0].offsetHeight //table -> head -> tr

                            // let viewportStartRow = Math.round(scrollableTableContainer.scrollTop/tabelRowHeight)
                            
                            // let viewportEndRow = Math.round((scrollableTableContainer.scrollTop + scrollableTableContainer.offsetHeight - tabelHeaderRowHeight - 1)/tabelRowHeight)
                            // console.log(`scroll direction: ${scrollDirection} last pos: ${scrollTopLast} scrollTop: ${scrollableTableContainer.scrollTop} offsetHeight: ${scrollableTableContainer.offsetHeight} scrollHeightcur: ${scrollableTableContainer.scrollHeight} Page: ${currentPage}`);
                            let scrollEdgeOffset = Math.round(tabelRowHeight/7) // space between scroll bar and edge when jumping to trigger inifinite scroll
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

    /**
     * This code will run on every update to the DOM!
    */
    afterUpdate(() => {
        resizeTable();
        // updateTableHeaderPositions()
        // headerTableElement.style.width = scrollableTableContainer.offsetWidth + "px"
        headerTableContainerElement.style.width = scrollableTableContainer.offsetWidth + "px"

        // let headerCols = [headerTableElement.getElementsByTagName('td')[0], headerTableElement.getElementsByTagName('td')[1], headerTableElement.getElementsByTagName('td')[2], headerTableElement.getElementsByTagName('td')[3], headerTableElement.getElementsByTagName('td')[4], headerTableElement.getElementsByTagName('td')[5], headerTableElement.getElementsByTagName('td')[6],headerTableElement.getElementsByTagName('td')[7],headerTableElement.getElementsByTagName('td')[8],headerTableElement.getElementsByTagName('td')[9],headerTableElement.getElementsByTagName('td')[10],headerTableElement.getElementsByTagName('td')[11],]
        let headerCols = Array.from(headerTableElement.getElementsByTagName('td'))//.splice(2)
        const rowCells = scrollableTableContainer.getElementsByTagName('td')
        console.log(rowCells);
        for(let i=0; i < headerCols.length && rowCells.length >= headerCols.length; i++){
            applySourceCellWidth(rowCells[i], headerCols[i])
            // headerCols[i].style.minWidth = rowCells[i].offsetWidth + "px"
            // headerCols[i].style.width = rowCells[i].offsetWidth + "px"
            // if(headerCols[i].offsetWidth > rowCells[i].offsetWidth){
            //     headerCols[i].style.maxWidth = rowCells[i].offsetWidth + "px"
            // }
        }
        
    })

    function updateTableHeaderPositions() {
        let cols = dataTableElement.getElementsByTagName('th')
        for(let i = 0; i < cols.length-1; i++){
            // th.style.left = ++l + "px";
            // console.log(table.children[1].children[0].children[0]);
            if(dataTableElement.children[1].children[0]){
                    // console.log(table.children[1].children[0].children[i]);
                    // let colData = table.getElementsByTagName('td')[i].getBoundingClientRect()
                    let colData = dataTableElement.children[1].children[0].children[i].getBoundingClientRect()
                    cols[i].style.top = (searchTextElement.getBoundingClientRect().top + searchTextElement.getBoundingClientRect().height) + "px"
                    cols[i].style.left = colData.left + "px"
                    // let width = colData.offsetWidth - parseFloat(window.getComputedStyle(ths[i]).paddingLeft)
                    let horizontalPadding = parseFloat(window.getComputedStyle(cols[i]).paddingLeft) + parseFloat(window.getComputedStyle(cols[i]).paddingRight)
                    let width = colData.width - horizontalPadding
                    // let pdRight = 
                    // console.log(width);
                    // cols[i].style.width = width + "px"
                    // ths[i].width = colData.offsetWidth + "px"
            }
        }
        // table.getElementsByTagName('tbody')[0].style.transform = "translateY(33px)"
    }

    function updateTableHeaderPositions2() {
        let cols = dataTableElement.getElementsByTagName('th')
        for(let i = 0; i < cols.length-1; i++){
            // th.style.left = ++l + "px";
            // console.log(table.children[1].children[0].children[0]);
            if(dataTableElement.children[1].children[0]){
                    // console.log(table.children[1].children[0].children[i]);
                    // let colData = table.getElementsByTagName('td')[i].getBoundingClientRect()
                    let colData = dataTableElement.children[1].children[0].children[i].getBoundingClientRect()
                    cols[i].style.top = colData.top + "px"
                    cols[i].style.left = colData.left + "px"
                    // let width = colData.offsetWidth - parseFloat(window.getComputedStyle(ths[i]).paddingLeft)
                    let horizontalPadding = parseFloat(window.getComputedStyle(cols[i]).paddingLeft) + parseFloat(window.getComputedStyle(cols[i]).paddingRight)
                    let width = colData.width - horizontalPadding
                    // let pdRight = 
                    // console.log(width);
                    cols[i].style.width = width + "px"
                    // ths[i].width = colData.offsetWidth + "px"
            }
        }
        // table.getElementsByTagName('tbody')[0].style.transform = "translateY(33px)"
    }



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
            var pageX, curCol, curDataTblCol, nxtCol, nxtDataTblCol, curColWidth, nxtColWidth;

            div.addEventListener("mousedown", function (e) {
                curCol =
                    e.target.parentElement.getElementsByClassName(
                        "tbl-head-container"
                    )[0];
                    // [e.target.parentElement.children].

                    const index = [...Array.from(e.target.parentElement.parentElement.children)].indexOf(e.target.parentElement);
                    // console.log(index);
                    // console.log(Array.from(e.target.parentElement.parentElement.children));
                    // console.log(dataTableElement.children[0].children[0].children[index]);
                    curDataTblCol = dataTableElement.children[0].children[0].children[index]
                    nxtCol =
                    curCol.parentElement.nextElementSibling.getElementsByClassName(
                        "tbl-head-container"
                        )[0];
                        nxtDataTblCol = dataTableElement.children[0].children[0].children[index + 1]
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
                    let diffX = e.pageX - pageX;
                    if(diffX)
                    console.log(`diff: ${e.pageX - pageX}`);
                    if (nxtCol) {
                        applyCellWidth(nxtCol, nxtColWidth - diffX)
                        // nxtCol.style.width = nxtColWidth - diffX + "px";
                        // nxtDataTblCol.style.minWidth = nxtColWidth - diffX + "px";
                        applyCellWidth(nxtDataTblCol, nxtColWidth - diffX)
                    }
                    
                    applyCellWidth(curCol, curColWidth + diffX)
                    // curCol.style.width = curColWidth + diffX + "px";
                    //set width of same column in next table
                    console.log('prev width: ' + curDataTblCol.offsetWidth + 'setting new width: '+curColWidth + diffX);
                    applyCellWidth(curDataTblCol, curColWidth + diffX)
                    // curDataTblCol.style.minWidth = curColWidth + diffX + "px";
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
            // div.style.top = 0;
            // div.style.right = 0;
            // div.style.width = "5px";
            // div.style.position = "absolute";
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

    function applySourceCellWidth(source, target) {
        console.log('prev width: ' + target.offsetWidth + 'setting new width: '+source.offsetWidth);
        applyCellWidth(target, source.offsetWidth)
        // target.style.minWidth = source.offsetWidth + "px"
        //     target.style.width = source.offsetWidth + "px"
        //     if(target.offsetWidth > source.offsetWidth){
        //         target.style.maxWidth = source.offsetWidth + "px"
        //     }
    }

    function applyCellWidth(target, width) {
        target.style.minWidth = width + "px"
            target.style.width = width + "px"
            if(target.offsetWidth > width){
                target.style.maxWidth = width + "px"
            }
    }

    const openFilter = (clickedElement) => {
        //Go to the nearest div as we want to attach it there (not on the svg icon)
        while (
            clickedElement.nodeName != "DIV" ||
            clickedElement.classList.contains("filter-menu")
        ) {
            clickedElement = clickedElement.parentElement;
        }

        if (clickedElement.children.length > 1) { //Already poped! Hide it
            if (clickedElement.children[1].style.display == "block") {
                clickedElement.children[1].style.display = "none";
            } else {
                clickedElement.children[1].style.display = "block";
            }
            return;
        } else {
            let templateMenu = outerMostContainerDiv
                .getElementsByClassName("filter-menu")[0];
            let menu = document.createElement("div");
            menu.style.display = "block";
            menu.classList = [...menu.classList, "filter-menu"];
            menu.innerHTML = templateMenu.innerHTML;
            menu.style.position = "absolute";
            menu.style.backgroundColor = "#3d3e40"; //Better if we can style this in css using classes. But it doesn't work
            menu.style.left = 0;
            menu.style.width = "100%";
            menu.onclick = (event) => {
                event.stopPropagation(); //otherwise clicking on checkbox may immidiately close it
            };
            clickedElement.appendChild(menu);
        }
    };
</script>

<div class="columns is-multiline data-list-container" bind:this={outerMostContainerDiv}>
    <input
        type="text"
        class="input is-small column is-full"
        bind:value={searchText}
        bind:this={searchTextElement}
        placeholder="Search"
    />
    <div class="header-table-parent-container" bind:this={headerTableContainerElement}>
        <div class="header-inner">
            <table class="svelte-elements-header-table" style="height: 57px; width: auto;" cellpadding="0" cellspacing="0" bind:this={headerTableElement}>
                <!-- <tr> -->
                    <tr class="is-primary">
                    {#each headers as label}
                    <td class="is-primary">
                        <div class="tbl-head-container is-primary" bind:this={tblHeadContainerElement}>
                            <div style="float: left" class="tbl-head-txt">
                                {label}
                            </div>
                            <div style="float: right" class="tbl-head-icon">
                                <div
                                on:click={(element) => {
                                    openFilter(element.target);
                                }}
                                >
                                <Icon icon={faCaretDown} />
                            </div>
                        </div>
                    </div>
                    </td>
                    {/each}
                                <!-- </tr> -->
                            <!-- <th>Details</th>             -->
                </tr>
            </table>
        </div>
    </div>
    <!-- Table based impl -->
    <div class="svelte-elements-datatable-table-container" bind:this={scrollableTableContainer}>
        <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth {cssClass}" bind:this={dataTableElement}>
            <!-- <thead>
                <tr>
                    {#each headers as label}
                        <th class="is-primary">
                            <div class="tbl-head-container">
                                <div style="float: left" class="tbl-head-txt">
                                    {label}
                                </div>
                                <div style="float: right" class="tbl-head-icon">
                                    <div
                                        on:click={(element) => {
                                            openFilter(element.target);
                                        }}
                                    >
                                        <Icon icon={faCaretDown} />
                                    </div>
                                </div>
                            </div>
                        </th>
                    {/each}
                    <th>Details</th>
                </tr>
            </thead> -->
            <tbody>
                {#each filteredList as resource}
                    <tr>
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

    <div class="filter-menu">
        This is some div
        <input type="checkbox" /><label for="chk">Item1</label><br>
        <input type="checkbox" /><label for="chk">Item1</label><br>
        <input type="checkbox" /><label for="chk">Item1</label><br>
        <input type="checkbox" /><label for="chk">Item1</label><br>
    </div>
</div>

<style lang="scss">
    // * {
    //     box-sizing: border-box;
    // }
    // table {
    //     border-collapse: collapse;
    //     width: 100%
    // }
    // tbody {
    //     overflow: auto;
    //     height: 500px;
    // }
    // thead {
    //     display: table;
    //      float: left;
    //      width: 100%;
    // }
    // thead tr {
    //      display: table-row;
    //      width: 100%;
    //      }
    //      tbody tr {
    //      display: table;
    //      width: 100%;
    //      }
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

    th {
        position: fixed;
    }

    .results {
        margin-top: 25px;
    }

    .svelte-elements-datatable-table-container {
        overflow: auto;
        height: 500px;
        width: 100%;
        td {
            max-width: 50px; 
        }
    }

    .header-table-parent-container{
        // overflow: auto;
        // background-color: red;
    position: relative;
    height: 57px;
    overflow: hidden;
    // width: 452px;
    margin: 0px auto;
    }
    .header-inner {
        position: absolute;
    left: 0;
    right: 0;
    // bottom: -17px; /* Increase/Decrease this value for cross-browser compatibility */
    overflow-x: scroll;
    }

    .svelte-elements-header-table {
        td{
            // width: auto;
        }
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
        border-right: "2px solid #42ca10";
        :hover {
            border-right: "2px solid #0000f";
        }
    }

    // th {
    //     position: sticky;
    //     position: -webkit-sticky;
    //     top: 0;
    // }

    td {
        white-space: nowrap;
        padding: 0;
        text-overflow: ellipsis;
        overflow: hidden;
        // max-width: 50px; //This is the minimum width a column can resize
    }

    
    .filter-menu {
        background-color: rgb(53, 46, 46);
        position: absolute;
        width: 100%;
        display: none;
        left: 0;
    }


    a :global(.arrows) {
        font-size: x-large;
    }
</style>
