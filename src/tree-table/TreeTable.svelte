<script>
import { onMount } from "svelte";

    export let value //Value object

    let rowData = []
    let elementList = []

    onMount(()=>{
        console.log(value);
        let keys = Object.keys(value)
        let depth = 0
        for(const key of keys){
            let field = value[key]
            let propertyLabel = field.label ? field.label : key
            if(!field.value) {
                rowData.push({ label: propertyLabel, value: "", depth, element: {}, collapsed: false, isChildrenCollapsed: false })
                addRowRecursive(field, depth)
            } else {
                depth = depth > 0 ? depth-- : 0
                rowData.push({ label: propertyLabel, value: field.value, depth, element: {}, collapsed: false, isChildrenCollapsed: false })
            }
        }
        elementList = rowData.map(v => { return {element: {}}})
    })

    const addRowRecursive = (valueObject, parentDepth)=> {
        let childKeys = Object.keys(valueObject)
        ++parentDepth
        for(const childKey of childKeys){
            let field = valueObject[childKey]
            let propertyLabel = field.label ? field.label : childKey
            for (let i = 0; i < parentDepth; i++) {
                propertyLabel = "&nbsp;" + "&nbsp;" + propertyLabel
            }
            if(!field.value) {
                rowData.push({label: propertyLabel, value: "", depth: parentDepth, element: {}, collapsed: false, isChildrenCollapsed: false })
                addRowRecursive(field, parentDepth)
            } else {
                rowData.push({label: propertyLabel, value: field.value, depth: parentDepth, element: {}, collapsed: false, isChildrenCollapsed: false })
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
<div class="tree-table-container">
    <div class="tree-table-header-container">
        <div class="tree-table-header">Property</div>
        <div class="tree-table-header">Value</div>
    </div>
    <div class="tree-table-body-container">
        {#each rowData as data, index}
        <div class="tree-table-row" on:click={()=> onCollapseClicked(index)} bind:this={elementList[index].element} class:tree-table-row-hidden={rowData[index].collapsed}>
            <div class="tree-table-cell">{@html data.label} {data.depth}</div>
            <div class="tree-table-cell">{data.value}</div>
        </div>
        {/each}
    </div>
</div>

<style lang="scss">
    .tree-table-container {
        background-color: burlywood;
        /* display: grid;
        grid-template-columns: 50% 50%; */
    }

    .tree-table-header-container {
        display: grid;
        grid-template-columns: 50% 50%;
    }

    .tree-table-body-container {
        /* display: grid;
        grid-template-columns: 50% 50%; */
    }

    .tree-table-header {
        background-color: dimgrey;
        color: whitesmoke;
        width: auto;
    }

    .tree-table-row {
        display: grid;
        grid-template-columns: 50% 50%;
        /* border-style: none none solid none; */
        border-bottom: 1px solid;
        &:hover {
            background-color: red;
        }
    }

    .tree-table-row-hidden {
        visibility: collapse;
        grid-template-rows: 0;
    }



    .tree-table-cell {
        border-right: 1px solid;
        // &:hover {
        //     background-color: greenyellow;
        // }
    }

</style>
