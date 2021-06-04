<script>
    import DataTable from "../../src/data-table/DataTable.svelte";
    
    import { data } from "./data.json";

    let resources = new Promise((resolves) => {
        resolves(data);
        console.log('resssssssssssss');
    });
    

    let headers = [
        "timestamp",
        "logLevel",
        "threadID",
        "classFunc",
        "eventID",
        "sessionName",
        "hash",
        "protocol",
        "protocolInLogLine",
        "msgName",
        "navigatableLocation",
        "navigatableHash",
        "isValidation",
        "isSessionValidation",
        "isMessageError",
        "dynamicColumns",
        "dynamicValues",
    ];

</script>

<style lang="scss">
    :global(.log-viewer-tbl){
        font-style: italic;
    }
    /* #logTable {
        max-width: 1000px;
        max-height: 500px;
        overflow: scroll;
    } */
</style>

<pre>{`
    let items = [
        { id: "1", sku: "X001", price: 550.0, __url: './store_items/01'},
        { id: "2", sku: "X002", price: 200.0 }, //If there's no url then it should defaults to #
    ]
    let resources = new Promise((r)=>r(items))
    let headers = ['ID', 'SKU', 'PRICE']

    <DataTable resourceList={resources} {headers} maxItems="50" cssClass="log-viewer-tbl" />


`}
</pre>
<!-- 
<button on:click={x}>gett</button> -->

<div class="column" id="logTable">
    <DataTable resourceList={resources} {headers} maxItems="50" cssClass="log-viewer-tbl" />
</div>
