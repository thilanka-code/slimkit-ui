import { FormTable } from "../src/index.js";

let basicProps = {
    config: {
        enableSearch: true
    }
}

export default {
    title: 'Form-Table',
    component: FormTable,
    props: basicProps
}

export const defaultTable = ()=> ({
    title: 'Form-Table1',
    Component: FormTable,
    props: basicProps
})