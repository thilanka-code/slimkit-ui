<script>
    import Icon from "fa-svelte";
    import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
    import { afterUpdate } from "svelte";

    export let resourceList; // Promise that resolves a list
    export let headers = []; //Optinal header label
    export let maxItems = 5;
    export let cssClass = "";
    let currentPage = 1;
    let pages = 1;
    
    let emptyRows = []; // To counter changing height problem

    const ELEMENT_NAME = "ResourceList";

    let searchText;
    let isLoading = true;
    let resources;
    let keys;
    let filteredList = [];

    $: {
        resourceList.then((items) => {
            currentPage = 1; //Reset page number every time the resourceList changes
            //Pre processing of items
            const processedItems = items.map((it) => {
                if (!it.__url) {
                    it.__url = "#";
                }
                return it;
            });
            isLoading = false;
            resources = processedItems;
            filteredList = processedItems;

            if (items.length > 0) {
                keys = Object.keys(items[0]);
            }
            // Seperate function is needed to prevent infinite reactive loop
            //https://github.com/sveltejs/svelte/issues/4420
            validateIfObjectKeysMatchHeaders();
            resizeTable();
        });
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
            let tempList = [];
            console.log(resources.length);
            console.log(keys);
            for (let item of resources) {
                for (let key of keys) {
                    // console.log((item[key] + '').toLowerCase()).includes(searchText.toLowerCase()));
                    if (
                        key == "hash" &&
                        item[key] &&
                        (item[key] + "")
                            .toLowerCase()
                            .indexOf("MSG0f9ff2f8".toLowerCase()) >= 0
                    ) {
                        console.log(item[key]);
                    }
                    if (
                        item[key] &&
                        (item[key] + "")
                            .toLowerCase()
                            .indexOf(searchText.toLowerCase()) >= 0
                    ) {
                        tempList.push(item);
                        console.log("gotcha..");
                        break;
                    }
                }
            }
            console.log("Done searching..");
            currentPage = 1; //Reset page number every time the user search
            let startIndex = currentPage * maxItems - maxItems;
            let endIndex = startIndex + maxItems;
            let temp = Math.trunc(tempList.length / maxItems);
            pages = tempList.length % maxItems > 0 ? ++temp : temp;
            filteredList = tempList.slice(startIndex, endIndex);
        } else {
            let startIndex = currentPage * maxItems - maxItems;
            let endIndex = startIndex + maxItems;
            if (resources) {
                let temp = Math.trunc(resources.length / maxItems);
                pages = resources.length % maxItems > 0 ? ++temp : temp;
                filteredList = resources.slice(startIndex, endIndex); //Consider paging
            }
        }
        let tempEmptyRows = [];
        for (let i = filteredList.length; i < maxItems; i++) {
            tempEmptyRows.push({});
        }
        emptyRows = tempEmptyRows;
    }

    function resizeTable() {
        let tables = [document.getElementById("mx")];
        for (var i = 0; i < tables.length; i++) {
            resizableGrid(tables[i]);
        }
    }

    afterUpdate(() => {
        resizeTable();
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
                // curCol.parentElement.parentElement //th
                nxtCol =
                    curCol.parentElement.nextElementSibling.getElementsByClassName(
                        "tbl-head-container"
                    )[0];
                pageX = e.pageX;

                var padding = paddingDiff(curCol);

                curColWidth = curCol.offsetWidth - padding;
                if (nxtCol) nxtColWidth = nxtCol.offsetWidth - padding;
                console.log({ curCol, nxtCol, curColWidth, nxtColWidth });
            });

            div.addEventListener("mouseover", function (e) {
                // console.log(e.target);
                e.target.style.borderRight = "2px solid #0000ff";
            });

            div.addEventListener("mouseout", function (e) {
                e.target.style.borderRight = "";
            });

            document.addEventListener("mousemove", function (e) {
                if (curCol) {
                    var diffX = e.pageX - pageX;
                    // console.log({curCol, nxtCol, pageX, diffX});

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

    const openFilter = (clickedElement) => {
        //Go to the nearest div as we want to attach it there (not on the svg icon)
        while (
            clickedElement.nodeName != "DIV" ||
            clickedElement.classList.contains("filter-menu")
        ) {
            clickedElement = clickedElement.parentElement;
        }

        if (clickedElement.children.length > 1) {
            if (clickedElement.children[1].style.display == "block") {
                clickedElement.children[1].style.display = "none";
            } else {
                clickedElement.children[1].style.display = "block";
            }
            return;
        } else {
            let templateMenu = document
                .getElementsByClassName("data-list-container")[0]
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

<div class="columns is-multiline data-list-container">
    <input
        type="text"
        class="input is-small column is-full"
        bind:value={searchText}
        placeholder="Search"
    />

    <!-- Table based impl -->
    <div class="table-container">
        <table id="mx" class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth {cssClass}">
            <thead>
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
            </thead>
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
        <input type="checkbox" /><label for="chk">Item1</label>
    </div>
</div>

<style lang="scss">
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

    .table-container {
        overflow: auto;
        // width: 1200px;
        height: 500px;
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

    .filter-menu {
        background-color: rgb(53, 46, 46);
        position: absolute;
        width: 100%;
        display: none;
        left: 0;
    }

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
