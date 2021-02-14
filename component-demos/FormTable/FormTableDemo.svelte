<script>
    import { FormTable } from "../../src/index";

    let config = {
        enableSearch: true,
        // noDuplicates: { id: 'id'}
    };

    let data = {
        headers: [
            {id: 'id', label: '#'}, // id maps to object key in item
            {id: 'sku', label: 'Item SKU'}, 
            {id: 'qty', label: 'qty'},
            {id: 'price', label: 'Price'}, 
            {id: 'discount', label: 'Discount'}, 
            {id: 'total', label: 'Total'}
        ],
    }

    let tableItems = [
        { id: '1', sku: 'X001', qty: {value: 1000, type: 'number'}, price: 550.00, discount: 10, total: 550000},
        { id: '2', sku: 'X002', qty: {value: 500, type: 'number'}, price: 200.00, discount: 10, total: 550000},
        { id: '3', sku: 'X003', qty: {value: 250, type: 'number'}, price: 100.00, discount: 10, total: 550000},
    ]

    let promise = new Promise((resolve, reject)=> {
        setTimeout(()=>resolve(tableItems.map(i => {return {text: i.sku, value: i}})), 1000)
        // resolve()
    })

    let insertData = promise

</script>


<FormTable {config} {data} {insertData}></FormTable>
