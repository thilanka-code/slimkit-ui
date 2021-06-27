<script>
import TreeTable from "../../src/tree-table/TreeTable.svelte";

let value = {
    name: { label: "Name", value: "Thilanka" },
    parties: {
        party1: {
            p11: { value: "1-1"},
            p12: { value: "1-2"},
        },
        party2: {
            p21: {value: "2-1"},
        }
    },
    city: { value: "Colombo"}
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
