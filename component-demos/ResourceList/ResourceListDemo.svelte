<script>
    import ResourceList from "../../src/resource-list/ResourceList.svelte";
    let resources = new Promise((resolves) => {
        setTimeout(()=>{
            resolves([
                { id: "1", sku: "X001", price: 550.0 },
                { id: "2", sku: "X002", price: 200.0 },
                { id: "3", sku: "X003", price: 100.0 },
                { id: "4", sku: "X004", price: 100.0 },
                { id: "5", sku: "X005", price: 100.0 },
                { id: "4", sku: "X004", price: 100.0 },
                { id: "4", sku: "X004", price: 100.0 },
                { id: "4", sku: "X004", price: 100.0 },
                { id: "4", sku: "X004", price: 100.0 },
                { id: "4", sku: "X004", price: 100.0 },
                { id: "4", sku: "X004", price: 100.0 },
                { id: "4", sku: "X004", price: 100.0 },
                { id: "4", sku: "X004", price: 100.0 },
                { id: "4", sku: "X004", price: 100.0 },
                { id: "4", sku: "X004", price: 100.0 },
            ]);
        }, 1000)
    });
    
</script>

<style>
    /* ResourceList {
        min-height: 50px;
    } */
</style>

<ResourceList resourceList={resources} />
