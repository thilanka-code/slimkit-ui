<script>
    import TypeAhead from "../../src/typeahead/TypeAhead.svelte";
    
    let items = new Promise((resolves) => {
        setTimeout(()=>{
            resolves([
                { id: "1", sku: "X001", price: 550.0, __url: './store_items/01'},
                { id: "2", sku: "X002", price: 200.0 }, //If there's no url then it should defaults to #
                { id: "3", sku: "X003", price: 100.0, __url: './store_items/01'},
                { id: "4", sku: "X004", price: 100.0, __url: './store_items/01'},
                { id: "5", sku: "X005", price: 100.0, __url: './store_items/01'},
            ].map(it=> { return {text: it.sku, value: it.id}}));
        }, 1000)
    });

    
    let bindingValue

    const itemSelected = (evt) => {
        console.log(evt.detail);
    }
    
</script>

<pre>{`
    let items = new Promise((resolves) => {
        setTimeout(()=>{
            resolves([
                { id: "1", sku: "X001", },
                { id: "2", sku: "X002", },
                { id: "3", sku: "X003", },
            ].map(it=> { return {text: it.sku, value: it.id}}));
        }, 1000)
    });

    let bindingValue; //This value will be changed when value is selected or de-selected (null)

    const itemSelected = (evt) => {
        console.log(evt.detail);
    }

    <TypeAhead {items} on:selected={itemSelected} bind:valueSelected={bindingValue} />
    
    Id is {bindingValue}


`}
</pre>

<TypeAhead {items} on:selected={itemSelected} bind:valueSelected={bindingValue} />

Id is {bindingValue}
