import { TypeAhead } from "../src/index";
import { action } from '@storybook/addon-actions';

const items = [
    "Papaya1",
    "Papaya2",
    "Papaya3",
    "Persimmon",
    "Paw Paw",
    "Prickly Pear",
    "Peach",
    "Pomegranate",
    "Pineapple",
];

function changeItems() {
    
    items = new Promise((resolve, reject)=> {
        setTimeout(()=>resolve(itemz), 5000)
        // resolve()
    }
    );
    
}

export default {
    title: 'Typeahead',
    component: TypeAhead
}

const itemz = [
    {text:"P100", value: "pppppp100"},
    {text:"P1", value: "pppppp1"},
    {text:"P2kkkkkk", value: "pppppp2"},
    {text:"P2", value: "pppppp2"},
    {text:"P2yyyyyyy", value: "pppppp2"},
    {text:"P2", value: "pppppp2"},
    {text:"P212", value: "pppppp2"},
    {text:"P2rt", value: "pppppp2"},
    {text:"P2", value: "pppppp2"},
];

let promise = new Promise((resolve, reject)=> {
    setTimeout(()=>resolve(itemz), 1000)
    // resolve()
}
);

// function selected(v) {
//     console.log(v);
// }

const actionsData = {
    selected: action('selected'),
  };

export const withArrayItems = () => ({

    title: 'TypeAhead',
    Component: TypeAhead,
    props: {items: itemz},
    //  on: {
    //      selected: {...actionsData}
    //  }
    on: {...actionsData}
})

export const withPromise = () => ({
    title: 'TypeAhead',
    Component: TypeAhead,
    props: {items: promise},
     on: {
         selected: {...actionsData}
     }
})