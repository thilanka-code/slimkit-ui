<script>
import TreeTable from "../../src/tree-table/TreeTable.svelte";

let value = {
    name: { label: "Name", value: "Thilanka" },
    parties: {
        party1: {
            p11: { value: "1-1", cssClass: "error" },
            p111: { value: "1-1", cssClass: "error", hidden: true },
            p12: { value: "1-2"},
        },
        party2: {
            p21: {value: "2-1", cssClass: "pass"},
        }
    },
    city: { value: "Colombo", hidden: true }
}

// value = undefined

const update = () => {
    value = {
        ...value,    
        Division: { value: "IT"}
    }
}
    
    
    
</script>

<pre>{`
    Display Tree Table

    let bindingValue; //This value will be changed when value is selected or de-selected (null)

    const itemSelected = (evt) => {
        console.log(evt.detail);
    }

    <TypeAhead {items} on:selected={itemSelected} bind:valueSelected={bindingValue} />
    
    Id is {bindingValue}


`}
</pre>

<TreeTable {value} />
<button on:click={update}>update tree table</button>

<style lang="scss">
    :global(){
        .error {
            background-color: $danger;
            // color: white;
        }
        .pass {
            background-color: $success-light;
            // color: white;
        }
        .error:hover {
            color: currentcolor;
        }
        .pass:hover {
            color: currentcolor;
        }
    }
</style>
