import {PopupMessage} from "../src/index";

let basicProps = {
    type: 'info',
    title: 'sample title',
    message_text: 'Hello World!'
}

export default {
    title: 'Popup Message',
    component: PopupMessage
    // props: basicProps
}

export const defaultPopup = ()=> ({
    title: 'Popup Messagez',
    Component: PopupMessage,
    data: {...basicProps, show_popup: true},
    argTypes: {
        width: { 
          control: { type: 'range', min: 400, max: 1200, step: 50 },
        },
      },
})