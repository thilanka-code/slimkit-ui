
<script>

    import Icon from "fa-svelte";
    import { faEdit } from "@fortawesome/free-solid-svg-icons";

    export let resourceList // Promise that resolves a list
    export let headers = [] //Optinal header label
    export let maxItems = 5

    const ELEMENT_NAME = 'ResourceList'

    let searchText
    let isLoading =true
    let resources
    let keys
    let filteredList = []

    resourceList.then(items=> {

        //Pre processing of items
        const processedItems = items.map(it=> {
            if(!it.__url){
                it.__url = '#'
            }
            return it;
        })
        isLoading=false
        resources = processedItems
        filteredList = processedItems
        if(items.length > 0) {
            keys = Object.keys(items[0])
        }
        const invalidKeys = keys.filter(it => it.startsWith('__') && it != '__url')
        if(invalidKeys.length > 0) throw ELEMENT_NAME + "::Object keys contains invalid key starting with __. Only Object.__url is expected!"
        //Below -1 to avoid meta columns like __url
        if(headers.length > 0 && headers.length != keys.length - 1) throw ELEMENT_NAME + "::Headers mismatch with provided resource item's keys length"
    })

    $: {
        if(searchText) {
            let tempList = []
            for(let item of resources) {
                for(let key of keys) {
                    if (item[key] && (item[key] + '').includes(searchText)) {
                        tempList.push(item)
                        break;
                    }
                }
            }
            filteredList = tempList
        } else filteredList = resources
    }

</script>

<style lang="scss">
    .results {
        margin-top: 25px;
        // min-height: 300px;
        // height: 100vh;
    }
    .resource-row {
        // max-height: 100px;
        :hover {
            background-color: $primary-light;
        }
    }

    .headers {
        background-color: $primary;
        color: $primary-invert;
    }

    // .action-buttons {
    //     display: none;
    //     :hover {
    //         display: inline;
    //     }
    // }

</style>

<div class="columns">
    <input type="text" class="input column" bind:value={searchText} placeholder="Search"/>
</div>
    <div class="results columns is-multiline">
        {#if isLoading}
            <div class="column">...Loading</div>
        {:else}

            {#if headers.length > 0}
                <div class="column is-full">
                    <div class="columns headers">
                        {#each headers as label}
                            <div class="column">{label}</div>
                        {/each}
                        <div class="column">Details</div>
                    </div>
                </div>
            {/if}
            {#each filteredList as resource}
                <div class="column is-full resource-row">
                    <div class="columns">
                        {#each keys as key}
                            <!-- We will skip keys starting with __ as they are meta columns -->
                            {#if !key.startsWith('__')}<div class="column">{resource[key]}</div>{/if} 
                        {/each}
                        <!-- Resource action buttons below -->
                        <div class="column action-buttons">
                            <a class="buttonx is-link is-small" href={resource.__url}>
                                <Icon icon={faEdit}/>
                            </a>
                            <!-- <button class="button is-small">
                                <Icon icon={faEdit} class="fab" />
                            </button>
                            <button class="button is-small">
                                <Icon icon={faEdit} class="fab" />
                            </button> -->
                        </div>
                    </div>
                </div>
            {/each}
        {/if}    
            
    </div>