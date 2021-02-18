
<script>

    import Icon from "fa-svelte";
    import { faEdit } from "@fortawesome/free-solid-svg-icons";

    export let resourceList // Promise that resolves a list
    export let maxItems = 5

    let searchText
    let isLoading =true
    let resources
    let keys
    let filteredList = []

    resourceList.then(items=> {

        console.log(items);
        isLoading=false
        resources = items
        filteredList = items
        if(items.length > 0) {
            keys = Object.keys(items[0])
        }
    })

    $: {
        if(searchText) {
            let tempList = []
            // filteredList = []
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

    const search = (text)=>{
        
    }
    // let x = await resourceList.get()

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
            // $beige-light: magenta !default;
            // background-color: $hover-color;
            background-color: $primary-light;
            // color: $text;
        }
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
            {#each filteredList as resource}
                <div class="column is-full resource-row">
                    <div class="columns">
                        {#each keys as key}
                            <div class="column">{resource[key]}</div>
                        {/each}
                        <!-- Resource action buttons below -->
                        <div class="column action-buttons">
                            <button class="button is-small">
                                <Icon icon={faEdit}/>
                            </button>
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
<!-- </div> -->