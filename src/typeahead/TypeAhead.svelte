<!-- 
    @parameters:

items: [{value, text}] 

TODO: Add item navigation by arrow keys?

-->
<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let items; //Promise that returns an array
    let itemSelected;
    export let valueSelected = undefined; //Same as itemSelected but only id will be provided. This is used for bind:valueSelected
    export const clear = () => {
        userInput = "";
    };
    export const selectItem = (item) => {
        //Set the selected item
        onSelect(item);
    };

    let searchBox;
    export let isDirty = false;

    export const focus = () => {
        searchBox.focus();
    };

    let isLoading = true;

    let isVisible;

    $: hoverIndex = isVisible ? hoverIndex : -1;
    let instantHide;
    let ulElement; //<ul>
    let userInput = "";
    let filtered = [];
    $: {
        if (items) {
            Promise.resolve(items).then((arr) => {
                isLoading = false
                filtered = arr
                    .sort((a, b) => a.text.localeCompare(b.text))
                    .filter((itemVal) => {
                        return (
                            userInput.length > 0 &&
                            itemVal.text
                                .toLowerCase()
                                .indexOf(userInput.toLowerCase()) > -1
                        );
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
            }).catch(err=>{
                console.error('Error when loading items');
                console.error(err);
            });
        }
    }

    function onSelect(v) {
        if (v) {
            //Prevent errors on hitting enter on empty box
            userInput = v.text;
            instantHide = true;
            isVisible = false; // It's better if this can be hidden without animation?
            itemSelected = { text: v.text, value: v.value };
            valueSelected = v.value;
            dispatch("selected", {
                ...itemSelected,
            });
        }
    }

    function keyUp(event) {
        isDirty = true;
        itemSelected = null;
        valueSelected = null;
        if (event.key === "Escape") {
            isVisible = false;
        } else if (event.key === "ArrowDown") {
            if (hoverIndex < filtered.length - 1) {
                arrowSelect("ArrowDown");
                if (hoverIndex != filtered.length - 1) {
                    hoverIndex++;
                }
            }
        } else if (event.key === "ArrowUp") {
            if (hoverIndex > 0) {
                arrowSelect("ArrowUp");
                if (hoverIndex != 0) {
                    hoverIndex--;
                }
            }
        } else if (event.key === "Enter") {
            //This can be triggered on empty string. Should handle it on onSelect
            onSelect(filtered[hoverIndex]);
        } else if (filtered.length != 0) {
            isVisible = true;
        } else {
            isVisible = false;
        }
    }

    function arrowSelect(key) {
        let listEles = ulElement.querySelectorAll("li");
        let ul_Bounds = ulElement.getBoundingClientRect();
        let li_Bounds;
        if (key === "ArrowDown") {
            if (hoverIndex >= 0) {
                listEles[hoverIndex].classList.remove("li-hover");
            }
            listEles[hoverIndex + 1].classList.add("li-hover");

            li_Bounds = listEles[hoverIndex + 1].getBoundingClientRect();

            if (
                li_Bounds.top + li_Bounds.height >
                ul_Bounds.top + ul_Bounds.height
            ) {
                //Should scroll

                listEles[hoverIndex + 1].scrollIntoView(false);
            }
        } else if (key === "ArrowUp") {
            if (hoverIndex != 0) {
                listEles[hoverIndex].classList.remove("li-hover");
            }
            listEles[hoverIndex - 1].classList.add("li-hover");
            li_Bounds = listEles[hoverIndex - 1].getBoundingClientRect();
            if (li_Bounds.top < ul_Bounds.top) {
                //Should scroll
                listEles[hoverIndex - 1].scrollIntoView();
            }
        }
    }

    function windowClick(e) {
        if (
            e.detail !== 0 && //Mouse click not keyboard click
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

{#await items}
    Loading TypeAhead..
{:then X}
    <div
        class="control type-container"
        id="_sv_lib_typahd_container"
        class:is-loading={isLoading}
    >
        <input
            type="text"
            bind:this={searchBox}
            bind:value={userInput}
            on:keyup={keyUp}
            class="input"
            id="_sv_lib_typahd_input"
            autocomplete="off"
        />

        <ul
            bind:this={ulElement}
            class="_sv-lib_resultList"
            id="_sv_lib_typahd_resultList"
            class:hide={!isVisible && !instantHide}
            class:hide-fast={!isVisible && instantHide}
            class:visible={isVisible}
        >
            {#each filtered as item}
                <li
                    on:click={onSelect(item)}
                    id="_sv_lib_typahd_resultList_item"
                >
                    {item.startingText}<b>{item.matchingText}</b>{item.endText}
                </li>
            {/each}
        </ul>
    </div>
{/await}

<svelte:window on:click={windowClick} />

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

    ul._sv-lib_resultList :global(li.li-hover) {
        /* Svelte compiler removes as unused styles (happens in dynamic styling) */
        background: #eeeeee;
        cursor: "context-menu";
    }

    div.type-container {
        position: relative;
    }
</style>
