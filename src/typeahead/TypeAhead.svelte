<!-- 
    @parameters:

items: [{value, text}] 

TODO: Add item navigation by arrow keys?

-->
<script>

    import { onMount } from 'svelte';
    import { createEventDispatcher } from 'svelte';
    
	const dispatch = createEventDispatcher();
    
    export let items;
    
    let isLoading = !Array.isArray(items);
    
    $: _items = [];
    
    let isVisible;

    onMount(() => {
        
        Promise.resolve(items).then((val) => {
            _items = val;
            isLoading = false;
        });
        
    });
    
    $: hoverIndex = isVisible?hoverIndex:-1;
    let instantHide;
    let itemSelected;
    let ulElement; //<ul>
        let userInput = "";
        $: filtered = _items
        .sort((a, b) => a.text.localeCompare(b.text))
        .filter((itemVal) => {
            return userInput.length > 0 &&
            itemVal.text.toLowerCase().startsWith(userInput.toLowerCase());
        })
        .map((itemObj) => {
            let itemTxt = itemObj.text;
            let searchIndex = itemTxt
            .toLowerCase()
                .indexOf(userInput.toLowerCase());
                let obj = {};
                obj.startingText = itemTxt.substring(0, searchIndex);
                obj.matchingText = itemTxt.substring(
                    searchIndex,
                    searchIndex + userInput.length
                    );
            obj.endText = itemTxt.substring(
                searchIndex + userInput.length,
                itemTxt.length
                );
                obj.text = itemTxt;
                obj.value = itemObj.value;
                
                return obj;
            });
            
        function onSelect(v) {
            console.log(v);
            
            userInput = v.text;
            instantHide = true;
            isVisible = false; // It's better if this can be hidden without animation?
            itemSelected = {text: v.text, value: v.value};
        dispatch('selected', {
            ...itemSelected
        });
    }

    function keyUp(event) {
        itemSelected = null;
        if (event.key === "Escape") {
            isVisible = false;
        } else if (event.key === "ArrowDown") {
            if(hoverIndex < filtered.length-1) {
                arrowSelect("ArrowDown");
                if(hoverIndex != filtered.length-1) {
                    hoverIndex++;
                }
            }
        } else if (event.key === "ArrowUp") {
            if(hoverIndex > 0) {
                arrowSelect("ArrowUp");
                if(hoverIndex != 0) {
                    hoverIndex--;
                }
            }
        } else if (event.key === "Enter") {
            // if(hov)
            onSelect(filtered[hoverIndex]);
        } else if (filtered.length != 0) {
            isVisible = true;
        } else {
            isVisible = false;
        }
    }

    function arrowSelect(key) {
        let listEles = ulElement.querySelectorAll('li');
        let ul_Bounds = ulElement.getBoundingClientRect();
        let li_Bounds;
        if(key === "ArrowDown") {
            if(hoverIndex >= 0) {
                listEles[hoverIndex].classList.remove("li-hover");
            }
            listEles[hoverIndex+1].classList.add("li-hover");
            
            li_Bounds = listEles[hoverIndex+1].getBoundingClientRect()
            
            if((li_Bounds.top + li_Bounds.height) > (ul_Bounds.top + ul_Bounds.height)){ //Should scroll
                
                listEles[hoverIndex+1].scrollIntoView(false);
            }
            
        } else if (key === "ArrowUp") {
            if(hoverIndex != 0) {
                listEles[hoverIndex].classList.remove("li-hover");
            }
            listEles[hoverIndex-1].classList.add("li-hover");
            li_Bounds = listEles[hoverIndex-1].getBoundingClientRect()
            if(li_Bounds.top < ul_Bounds.top){ //Should scroll
                listEles[hoverIndex-1].scrollIntoView();
            }
        }
    }

    function windowClick(e) {
        if (
            e.target.id !== "_sv_lib_typahd_container" &&
            e.target.id !== "_sv_lib_typahd_input" &&
            e.target.id !== "_sv_lib_typahd_resultList_item"
        ) {
            if (!itemSelected) {
                isVisible = false;
                userInput = "";
            }
        }
    }
</script>

<style>
    ul._sv-lib_resultList {
        display: block;

        list-style: none;
        width: 100%;
        overflow: hidden;
        overflow-y: scroll;
        z-index: 100;
        position: absolute;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    }

    ul.hide {
        max-height: 0;
        transition: max-height 0.25s ease-out;
    }

    ul.hide-fast {
        max-height: 0;
        transition: max-height 0.001s ease-out;
    }

    ul.visible {
        max-height: 12em;
        transition: max-height 0.25s ease-in;
    }

    ul._sv-lib_resultList li {
        display: block;
        background: white;
        padding: 10px;
        font-size: 1.2rem;
        border-radius: 2px;
    }

    ul._sv-lib_resultList li:hover {
        background: #eeeeee;
        cursor: "context-menu";
    }

    ul._sv-lib_resultList :global(li.li-hover) { /* Svelte compiler removes as unused styles (happens in dynamic styling) */
        background: #eeeeee;
        cursor: "context-menu";
    }

    div.type-container {
        position: relative;
    }
</style>

{hoverIndex}
{JSON.stringify(itemSelected)}
<div
    class="control type-container"
    id="_sv_lib_typahd_container"
    class:is-loading={isLoading}>
    <input
        type="text"
        bind:value={userInput}
        on:keyup={keyUp}
        class="input"
        id="_sv_lib_typahd_input"
        autocomplete="off" />
    
    <ul bind:this={ulElement}
        class="_sv-lib_resultList"
        id="_sv_lib_typahd_resultList"
        class:hide={!isVisible && !instantHide}
        class:hide-fast={!isVisible && instantHide}
        class:visible={isVisible}>
        {#each filtered as item}
            <li on:click={onSelect(item)} id="_sv_lib_typahd_resultList_item">
                {item.startingText}<b>{item.matchingText}</b>{item.endText}
            </li>
        {/each}
    </ul>

</div>

<svelte:window on:click={windowClick} />
