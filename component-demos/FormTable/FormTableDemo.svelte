<script>
    import { onMount } from "svelte";

    import { FormTable, PopupMessage } from "../../src/index";

    let config = {
        enableSearch: true,
        noDuplicates: { id: "id" },
    };

    let show_popup;

    let data = {
        headers: [
            { id: "id", label: "#" }, // id maps to object key in item
            { id: "sku", label: "Item SKU" },
            { id: "qty", label: "qty" },
            { id: "comment", label: "comment" },
            { id: "price", label: "Price" },
            { id: "discount", label: "Discount" },
            { id: "total", label: "Total" },
        ],
    };

    let insertData = Promise.resolve([]);

    onMount(async () => {
        insertData = getItemsForSearch();
    });

    const onDuplicateEntry = () => {
        show_popup = true;
    };

    function getItemsForSearch() {
        let tableItems = [
            { id: '1', sku: 'X001', qty: {type: 'number'}, comment: {type: 'text'}, price: 550.00, discount: 10, total: 550000},
            { id: '2', sku: 'X002', qty: {type: 'number'}, comment: {type: 'text'}, price: 200.00, discount: 10, total: 550000},
            { id: '3', sku: 'X003', qty: {type: 'number'}, comment: {type: 'text'}, price: 100.00, discount: 10, total: 550000},
        ]

        return new Promise((resolve, reject)=> {
            // reject('Shit happen') // This is left to test promise rejection behaviour
            resolve(tableItems.map(i => {return {text: i.sku, value: i}}))
        })
    }

    function getItemsForSearchFromServer() {
        const url = "http://localhost:8000/api/v1/stock_items";
        return fetch(url)
            .then((response) => response.json())
            .then((arr) =>
                arr.map((val) => {
                    return { value: val, text: val.name };
                })
            );
    }
</script>

<pre>{`

let config = { enableSearch: true, noDuplicates: { id: 'id'} }

let data = {
    headers: [
        {id: 'id', label: '#'}, // id maps to object key in item
        {id: 'sku', label: 'Item SKU'},
        {id: 'qty', label: 'qty'},
        {id: 'comment', label: 'comment'},
        {id: 'price', label: 'Price'}, 
        {id: 'discount', label: 'Discount'}, 
        {id: 'total', label: 'Total'}
    ],
    items: []
}

let insertData = Promise.resolve([]); //This will be for TypeAhead input

onMount(async () => {
    let tableItems = [
            { id: '1', sku: 'X001', qty: {type: 'number'}, comment: {type: 'text'}, price: 550.00, discount: 10, total: 550000},
            { id: '2', sku: 'X002', qty: {type: 'number'}, comment: {type: 'text'}, price: 200.00, discount: 10, total: 550000},
            { id: '3', sku: 'X003', qty: {type: 'number'}, comment: {type: 'text'}, price: 100.00, discount: 10, total: 550000},
    ]
    
    insertData = new Promise((resolve, reject)=> {
            resolve(tableItems.map(i => {return {text: i.sku, value: i}}))
    }
    
});


<FormTable {config} {data} {insertData} on:duplicate={onDuplicateEntry}></FormTable>
`


}</pre>

<FormTable {config} {data} {insertData} on:duplicate={onDuplicateEntry} />
<PopupMessage message_text="Duplicate entry!" type="error" {show_popup} />
