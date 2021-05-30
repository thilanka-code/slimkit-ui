
<script>

    import Icon from "fa-svelte";
    import { faEdit, faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";

    export let resourceList // Promise that resolves a list
    export let headers = [] //Optinal header label
    export let maxItems = 5
    let currentPage = 1
    let pages = 1
    $: pageNums = Array.apply(0,Array(pages)).map((_, x)=>x+1)
    let emptyRows = [] // To counter changing height problem

    const ELEMENT_NAME = 'ResourceList'

    let searchText
    let isLoading =true
    let resources
    let keys
    let filteredList = []

    $:{
        resourceList.then(items=> {
            currentPage = 1 //Reset page number every time the resourceList changes
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
            // Seperate function is needed to prevent infinite reactive loop
            //https://github.com/sveltejs/svelte/issues/4420
            validateIfObjectKeysMatchHeaders()
        })
    }

    const validateIfObjectKeysMatchHeaders = () => {
        const invalidKeys = keys.filter(it => it.startsWith('__') && it != '__url')
        if(invalidKeys.length > 0) throw ELEMENT_NAME + "::Object keys contains invalid key starting with __. Only Object.__url is expected!"
        //Below -1 to avoid meta columns like __url
        if(headers.length > 0 && headers.length != keys.length - 1) throw ELEMENT_NAME + "::Headers mismatch with provided resource item's keys length"
    }

    const pageLeft = ()=> {
        currentPage = currentPage <= 1 ? currentPage : currentPage - 1
    }

    const pageRight = ()=> {
        currentPage = currentPage == pageNums.length ? currentPage : currentPage + 1
    }

    $: {
        if(searchText) {
            let tempList = []
            for(let item of resources) {
                for(let key of keys) {
                    // console.log((item[key] + '').toLowerCase()).includes(searchText.toLowerCase()));
                    if (item[key] && ((item[key] + '').toLowerCase()).indexOf(searchText.toLowerCase()) >= 0) {
                        tempList.push(item)
                        break;
                    }
                }
            }
            currentPage = 1 //Reset page number every time the user search
            let startIndex = (currentPage*maxItems)-maxItems
            let endIndex = startIndex + maxItems
            let temp = Math.trunc(tempList.length/maxItems)
            pages = tempList.length%maxItems > 0 ? ++temp : temp
            filteredList = tempList.slice(startIndex, endIndex)

        } else {
            let startIndex = (currentPage*maxItems)-maxItems;
            let endIndex = startIndex + maxItems;
            if(resources) {
                let temp = Math.trunc(resources.length/maxItems)
                pages = resources.length%maxItems > 0 ? ++temp : temp
                filteredList = resources.slice(startIndex, endIndex) //Consider paging
            }
        }
        let tempEmptyRows = []
        for (let i = filteredList.length; i < maxItems; i++) {
            tempEmptyRows.push({})
        }
        emptyRows = tempEmptyRows
    }

</script>

<style lang="scss">
    .results {
        margin-top: 25px;
    }
    .resource-row {
        :hover {
            $primary-light: red !default;
            background-color: $primary-light;
        }
    }

    .headers {
        background-color: $primary;
        $primary-invert: green !default;
        color: $primary-invert;
    }

    .paging-area {
        margin-top: 48px;
        text-align: center;
    }

    .current-page {
        $primary-light: red !default;
        background-color: $primary-light;
    }

    .empty-row {
        min-height: 48px;
    }

    a :global(.arrows) {
        font-size: x-large;
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

            {#each emptyRows as emptRow}
                <div class="column is-full empty-row">

                </div>
            {/each}

            <!-- Paging area below -->
            <div class="column paging-area is-full">
                <div class="columns">
                    <div class="column is-one-quarter"></div>
                    
                    <div class="column">
                        <div class="columns is-centered">
                            <div class="column is-1"><a on:click={pageLeft}><Icon class="arrows" icon={faCaretLeft}/></a></div>
                            {#each pageNums as pgNum}
                            <div class="column is-1"><a class="{currentPage == pgNum ? 'is-outlined': 'is-white'} button" on:click={()=>currentPage = pgNum}>{pgNum}</a></div>
                            {/each}
                            <div class="column is-1"><a on:click={pageRight}><Icon class="arrows" icon={faCaretRight}/></a></div>
                        </div>
                    </div>
                    <div class="column is-one-quarter"></div>
                </div>
            </div>
        {/if}    
            
    </div>