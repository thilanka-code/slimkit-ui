<script>
    // import { slide } from "svelte/transition";

    export let items = [];
    let isVisible;

    let userInput = "";
    $: filtered = items
        .sort()
        .filter((itemVal) =>
        userInput.length > 0 && itemVal.toLowerCase().startsWith(userInput.toLowerCase())
        )
        .map((itemVal) => {
            let searchIndex = itemVal
                .toLowerCase()
                .indexOf(userInput.toLowerCase());
            let obj = {};
            obj.startingText = itemVal.substring(0, searchIndex);
            obj.matchingText = itemVal.substring(
                searchIndex,
                searchIndex + userInput.length
            );
            obj.endText = itemVal.substring(
                searchIndex + userInput.length,
                itemVal.length
            );
            obj.text = itemVal;

            return obj;
        });

    items = [
        "Papaya",
        "Persimmon",
        "Paw Paw",
        "Prickly Pear",
        "Peach",
        "Pomegranate",
        "Pineapple",
    ];

    function onSelect(v) {
        userInput = v;
    }

    function keyUp(event) {

        if (event.key === "Escape") {
            isVisible = false;
        } else if (filtered.length != 0) {
            // document.getElementsByClassName('resultList')[0].style.display = 'block'
            // document.getElementsByClassName('resultList')[0].style.height = '12em'
            // document.getElementsByClassName('resultList')[0].style.opacity = 100
            isVisible = true;
        } else {
            console.log("uuuuuuu");
            isVisible = false;
        }
    }

    window.addEventListener("click", function (e) {
        if (
            !document.getElementById("sv-lib-type-container").contains(e.target)
        ) {
            // document.getElementsByClassName('resultList')[0].style.display = 'none'
            isVisible = false;
            // filtered = [];
            // Clicked outside the search box
        }
    });

    document.addEventListener("keydown", function (event) {
        const key = event.key; // Or const {key} = event; in ES6+
        if (key === "Escape") {
            // filtered = [];
            // isVisible = false;
        } else {
        }
    });
</script>

<style>
    ul.resultList {
        display: block;
        
        list-style: none;
        /* width: 30rem; */
        width: 100%;
        /* transition: width 0.3s; */
        /* margin: auto; */
        max-height: 12em;
        overflow: hidden;
        overflow-y: scroll;
        z-index: 100;
        position: absolute;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    }

    ul.hide {
        /* height: 0em;
        -webkit-transition: height, 0.2s linear;
        -moz-transition: height, 0.2s linear;
        -ms-transition: height, 0.2s linear;
        -o-transition: height, 0.2s linear;
        transition: height, 0.2s linear; */
        max-height: 0;
        transition: max-height 0.25s ease-out;
    }

    ul.visible {
        /* max-height: 500px;
        -webkit-transition: height, 0.2s linear;
        -moz-transition: height, 0.2s linear;
        -ms-transition: height, 0.2s linear;
        -o-transition: height, 0.2s linear;
        transition: height, 0.2s linear; */
        max-height: 12em;
        transition: max-height 0.25s ease-in;
    }

    ul.resultList li {
        display: block;
        background: white;
        /* margin: 10px auto; */
        padding: 10px;
        font-size: 1.2rem;
        border-radius: 2px;
    }

    ul.resultList li:hover {
        background: #eeeeee;
        cursor: "context-menu";
    }

    div.type-container {
        position: relative;
    }
</style>

<div class="type-container" id="sv-lib-type-container">
    <input type="text" bind:value={userInput} on:keyup={keyUp} class="input" />
    <!-- {#if isVisible} -->
    <!-- <ul class="resultList" transition:slide="{{ duration: 175 }}"> -->
    <ul class="resultList" class:hide={!isVisible} class:visible={isVisible}>
        {#each filtered as item}
            <li class="option" on:click={onSelect(item.text)}>
                {item.startingText}<b>{item.matchingText}</b>{item.endText}
            </li>
        {/each}
    </ul>
    <!-- {/if} -->
</div>
<br />
<br />
<!-- <label>xxxxxxxxxxxxxxxxxxx</label><input type="text" /> -->
