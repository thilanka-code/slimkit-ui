<script>
import { createEventDispatcher, onMount } from "svelte";

import TypeAhead from "../typeahead/TypeAhead.svelte";
import Icon from "fa-svelte";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export let config;
export let data = {headers: [], items: []}
const PREFIX = '__' // Prefix added for dyanmic field bindings

export let insertData; //Data that will be inserted to the table
let selectedInsertData; //This will be inserted to table as current

let typeahead
let dynamicVals = {}
let searchButton // Need this to set focus


const dispatch = createEventDispatcher(); //This will dispatch event 'duplicate' on adding duplicate items to table

  if(data.headers.length < 1) {
    throw Error('FormTable::Empty table headers found!')
  }

  if(config.enableSearch  && !insertData) {
    throw Error('FormTable::Enabling search without search data. Specify insertData!')
  }

  // Update table with initially given items by client
  if(data.items){
    data.items.forEach(row => {
      //For each row object
      bindDynamicValuesInRow(row)
      console.log(dynamicVals); 
    })
  } else {
    data.items = [] // If no values are given initialize with empty (this will avoid undefined error in UI)
  }

  if(config.noDuplicates) { //Validate if the id specfied is included in headers
    let idFound
    for(let header of data.headers) {
      if(header == config.noDuplicates.id){
        idFound = true
        break;
      }
    }
    if(!idFound){
      console.warn('Unique id defined in noDuplicates config "'+config.noDuplicates.id+'" is not found in headers');
    }
  }


/**
 * Compute given row and add data bindings if there are dynamic fields defined.
 * Dynamic fields are identified by {type: 'text'}
 * 
 * @param row New row with dynamic fields ready to be bound by the UI 
 */
function bindDynamicValuesInRow (row) {
    
  data.headers.map(h => h.id).forEach( colId => {
    
      if (row[colId].type) {// If there's a type then it should be modifyable so have to update dynamicVals
        row[PREFIX+colId] = row[colId].value ? row[colId].value : ''
      }
    })
    return row
};

/**
 * Add selected search item to the table
 */
const add = () => {
  if(selectedInsertData){
    if(config.noDuplicates) { //Check if we are adding a duplicate
      let uniqueId = config.noDuplicates.id
      for(let tableItem of data.items) {
        if(selectedInsertData.value[uniqueId] == tableItem[uniqueId]) {
          console.log('Warning: duplicate found');
          dispatch('duplicate')
          return;
        }
      }
    }
   
    data.items = [...data.items, bindDynamicValuesInRow(selectedInsertData.value)]
    selectedInsertData = null;
    typeahead.clear()
    typeahead.focus()
  }
}

const sort = (col) => {
  if(data.items) {
    data.items = data.items.sort((a,b) => a[col] - b[col])
  }
}

/**
 * Returns an array of table rows. Table rows are new objects and not existing data.items
 * This is ideally called in your on submit hook
 */
const getValue = () => {
  let tableRows = []
  const colIds = data.headers.map(h => h.id) // [id, sku, qty]
  data.items.forEach(row => {
    let tableRow = { ...row }
    colIds.forEach( colId => {
      if (tableRow[colId].type) {// If there's a type then it should be modifyable so have to update dynamicVals
        tableRow[colId] = row[PREFIX+colId]
        delete tableRow[PREFIX+colId]
      }
    })
    tableRows.push(tableRow)
})
  console.log(tableRows);
  return tableRows;
}

const onTypeAheadSelect = (it) => {
  selectedInsertData = it.detail
  searchButton.focus()
}
</script>

{#if config.enableSearch}
<div class="columns">
  <div class="column is-four-fifths">
    <TypeAhead
    items={insertData} bind:this={typeahead}
    on:selected={onTypeAheadSelect} />
  </div>
  <div class="column">
  <button class="button is-primary" on:click={add} bind:this={searchButton}><Icon icon={faPlus} /></button>
  </div>
</div>
{/if}
<div class="sk-table-container">
  <table class="table is-striped is-hoverable is-fullwidth">
    <thead>
      <tr>
        {#each data.headers as header}
          <th>{header.label}<button class="button is-white is-small" on:click={sort(header.id)}><Icon icon={faCaretDown} /></button></th>
        {/each}
      </tr>
    </thead>

    <tbody>
      {#each data.items as item, row}
        <tr>
          {#each data.headers as header}
            <td>
              {#if item[header.id].type && item[header.id].type == 'number'}
                <input
                  type="number"
                  class="input is-small"
                  bind:value={item[PREFIX+header.id]} />
                  {:else if item[header.id].type && item[header.id].type == 'text'}
                  <input
                    type="text"
                    class="input is-small"
                    bind:value={item[PREFIX+header.id]} />
              
              {:else}{item[header.id]}{/if}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
  <button class="button" on:click={getValue}>Get Value</button>
</div>
