<script>
import SvgTable from "../../src/svg-table/SvgTable.svelte";
import { writable } from "svelte/store";


const create_dummy_tbl_data = () => {
    const data = []
    for (let i = 0; i < 1; i++) {
        data.push({ id: "" + i, name: "Auto Comp", prot: "FIX", col1:"one", col2:"tw", col3:"thr",col4:"four",col5:"five", });
    }
    return data
}

let client_data = writable(create_dummy_tbl_data())

let table_options = {
    max_width: "2000"
}

const more_data = () => {
    console.log('MORE data');
    // client_data.update(ar=>{
    //     ar.push({ id: "xx", name: "ABC", prot: "XYZ" })
    //     return ar
    // })
    // console.log(client_data);
    
    client_data = [{ id: "xx", name: "ABC", prot: "XYZ" }]
    // console.log(client_data);

    // client_data.set(()=>{
    //     return [{ id: "xx", name: "ABC", prot: "XYZ" }]
    //     return ar
    // })
}

client_data = create_dummy_tbl_data()

let column_labels = ["ID", "Component Name", "Details", "col1", "col2", "Desc1", "desc2", "desc3"]

    
    
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

<SvgTable {client_data} {column_labels} {table_options} />
<!-- <button class="button" on:click={()=> more_data()}>More data</button> -->
<button class="button" on:click={more_data}>More data</button>

<style>
    #svg-table-container {
        height: 400px;
        /* width: 1100px; */
        /* margin-top: 100px; */
        /* overflow: scroll; */
    }
</style>