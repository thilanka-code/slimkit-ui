<script>
    
import { FormTable, PopupMessage } from "../../src/index";

    let config = {
        enableSearch: true,
        noDuplicates: { id: 'id'}
    };

    let show_popup

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
    }

    let tableItems = [
        { id: '1', sku: 'X001', qty: {type: 'number'}, comment: {type: 'text'}, price: 550.00, discount: 10, total: 550000},
        { id: '2', sku: 'X002', qty: {type: 'number'}, comment: {type: 'text'}, price: 200.00, discount: 10, total: 550000},
        { id: '3', sku: 'X003', qty: {type: 'number'}, comment: {type: 'text'}, price: 100.00, discount: 10, total: 550000},
    ]

    let promise = new Promise((resolve, reject)=> {
        setTimeout(()=>resolve(tableItems.map(i => {return {text: i.sku, value: i}})), 1000)
    })

    let insertData = promise

    const onDuplicateEntry = () => {
        show_popup = true
    }

</script>


<FormTable {config} {data} {insertData} on:duplicate={onDuplicateEntry}></FormTable>
<PopupMessage message_text="Duplicate entry!" type="error" {show_popup} />