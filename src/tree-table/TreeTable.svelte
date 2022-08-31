<script>
import Icon from "fa-svelte";
import { faPlusSquare, faMinusSquare } from "@fortawesome/free-solid-svg-icons";

    export let value = {} //Value object

    let tableContainerElement

    let rowData = []
    // let elementList = []
    let updating = true

    $:{
        populateTable(value)
    }

    function populateTable(value) { //Refactor var name
        rowData = []
        // elementList = []
        let keys = Object.keys(value)
        let depth = 0
        for(const key of keys){
            let field = value[key]
            let propertyLabel = field.label ? field.label : key
            if(!field.value) {
                rowData.push({ label: propertyLabel, value: "", cssClass: field.cssClass? field.cssClass : "", depth, element: {}, collapsed: false, isChildrenCollapsed: false })
                addRowRecursive(field, depth)
            } else {
                depth = depth > 0 ? depth-- : 0
                if (!field.hidden) {
                    rowData.push({ label: propertyLabel, value: field.value, cssClass: field.cssClass? field.cssClass : "", depth, element: {}, collapsed: false, isChildrenCollapsed: false, isLeaf: true })
                }
            }
        }
        // elementList = rowData.map(v => { return {element: {}}})
        
        setTimeout(() => { //To avoid mis calculation of table container height
            tableContainerElement.style.minHeight = tableContainerElement.offsetHeight + "px"
            
        }, 100);
    }

    const addRowRecursive = (valueObject, parentDepth)=> {
        let childKeys = Object.keys(valueObject)
        ++parentDepth
        for(const childKey of childKeys){
            let field = valueObject[childKey]
            let propertyLabel = field.label ? field.label : childKey
            if(!field.value) {
                rowData.push({label: propertyLabel, value: "", cssClass: field.cssClass? field.cssClass : "", depth: parentDepth, element: {}, collapsed: false, isChildrenCollapsed: false })
                addRowRecursive(field, parentDepth)
            } else {
                if (!field.hidden) {
                    rowData.push({label: propertyLabel, value: field.value, cssClass: field.cssClass? field.cssClass : "", depth: parentDepth, element: {}, collapsed: false, isChildrenCollapsed: false, isLeaf: true })
                }
            }
        }
    }
    
    const onCollapseClicked = (parentIndex)=> {
        
        let parentDepth = rowData[parentIndex].depth
        let isParentCollapsing = !rowData[parentIndex].isChildrenCollapsed
        for (let i = parentIndex + 1; i < rowData.length; i++) {
            if (rowData[i].depth > parentDepth) {
                rowData[i].collapsed = isParentCollapsing
                rowData[i].isChildrenCollapsed = isParentCollapsing
            } else {
                break
            }
        }
        rowData[parentIndex].isChildrenCollapsed = !rowData[parentIndex].isChildrenCollapsed
    }

</script>

<div class="tree-table-container" bind:this={tableContainerElement}>
    <div class="tree-table-header-container">
        <div class="tree-table-header">Property</div>
        <div class="tree-table-header">Value</div>
    </div>
    <div class="tree-table-body-container">

            {#each rowData as data, index}
            <!-- <div class="tree-table-row" bind:this={elementList[index].element} class:tree-table-row-hidden={rowData[index].collapsed}> -->
            <div class="tree-table-row {data.cssClass}" class:tree-table-row-hidden={rowData[index].collapsed}>
                <!-- <div class="tree-table-cell" style="margin-left: {data.depth * 20}px;"> -->
                <div class="tree-table-cell" style="padding-left: {data.depth * 20}px;">
                    {#if !data.isLeaf}
                        <a on:click={()=> onCollapseClicked(index)} class="colored-link">
                            <Icon icon={data.isChildrenCollapsed ? faPlusSquare : faMinusSquare } />
                        </a>
                    {/if}
                    {@html data.label}
                </div>
                <div class="tree-table-cell">{data.value}</div>
            </div>
            {/each}
    </div>
</div>

<style lang="scss">

    $primary-light: red !default;

    .tree-table-container {
        // background-color: $primary-light;
        /* display: grid;
        grid-template-columns: 50% 50%; */
        // min-height: 240px;
    }

    .tree-table-header-container {
        display: grid;
        grid-template-columns: 50% 50%;
        position: sticky;
        top: 0;
    }

    .tree-table-body-container {
        /* display: grid;
        grid-template-columns: 50% 50%; */
    }

    .tree-table-header {
        // background-color: dimgrey;
        padding-left: 8px;
        padding-top: 4px;
        background-color: $primary;
        color: whitesmoke;
        width: auto;
    }

    .tree-table-row {
        display: grid;
        grid-template-columns: 50% 50%;
        /* border-style: none none solid none; */
        border-bottom: 1px solid;
        &:hover {
            background-color: $primary-light;
        }
    }

    .tree-table-row-hidden {
        visibility: collapse;
        grid-template-rows: 0;
    }

    .tree-table-cell {
        border-right: 1px solid;
        border-left: 1px solid;
        padding-left: 8px;
        padding-top: 4px;
    }

</style>
