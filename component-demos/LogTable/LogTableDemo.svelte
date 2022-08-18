<script>
    import LogTable from "../../src/log-table/LogTable.svelte";
    
    import { data } from "./data.json";
    let myDataTable
    let resources = new Promise((resolves) => {
        let modified = []
        modified = data.slice(100,101).map((x, i)=>{
            return {...x, timestamp: i+''}
        })
        resolves([]);
        console.log('DataTable Resource Data Length:'+modified.length);
    });
    let autoScrollOnTableUpdate = true
    $: updateBtnText = autoScrollOnTableUpdate ? "Stop auto update" : "Auto update"
    let buffer =[]
    let iteration = 0 
    let sample_record = data.slice(0,1)[0]
    // console.log(sample_record);
    let start = new Date()
    let tblHeight = "280px"
    setTimeout(() => {
        let cancel = setInterval(() => {
        if (iteration == 40){
            console.log("Duration: "+(new Date() - start));
             clearInterval(cancel)
        }
        // buffer.push(sample_record)
        myDataTable.appendItem({...sample_record, timestamp: iteration})
        // resources = new Promise((resolves) => {
        //     console.log('prom: '+iteration);
        //     resolves([sample_record]);
        // });
        // console.log(iteration);
        iteration++;
    }, 1);
    }, 1000);

    const rowSelected = (row) => {
        console.log("CLIENT: ");
        console.log(row.detail);
    }
    

    let headers = [
        // "id",
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

    const clear = () => {
        myDataTable.clear()
    }

</script>

<style lang="scss">
    :global(.log-viewer-tbl){
        font-style: italic;
    }
    #logTable {
        // max-width: 1000px;
        // max-height: 500px;
        // overflow: scroll;
        height: 300px;
    }
</style>

<pre>{`
    let items = [
        { id: "1", sku: "X001", price: 550.0, __url: './store_items/01'},
        { id: "2", sku: "X002", price: 200.0 }, //If there's no url then it should defaults to #
    ]
    let resources = new Promise((r)=>r(items))
    let headers = ['ID', 'SKU', 'PRICE']

    <LogTable resourceList={resources} {headers} maxItems="50" cssClass="log-viewer-tbl" />


`}
</pre>
<!-- 
<button on:click={x}>gett</button> -->

<div class="column" id="logTable">
    <LogTable bind:this={myDataTable} 
    resourceList={resources}
    {headers} maxItems={500} 
    updateTimeout={500} 
    tableHeight={tblHeight}
    cssClass="log-viewer-tbl" 
    {autoScrollOnTableUpdate} 
    on:rowSelected={rowSelected}/>

    <div class="column">
        <button on:click={()=>autoScrollOnTableUpdate = !autoScrollOnTableUpdate}>{updateBtnText}</button>
        <button on:click={clear}>clear</button>
    </div>
</div>
