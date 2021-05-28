/** Dispatch event on click outside of node */
export function clickOutside(node, ie11) {

    const handleClick = event => {
        if (node && !node.contains(event.target) && !event.defaultPrevented) {
            let event;
            //To support IE 11 custom event creation is changed to two steps instead of 
            if(ie11){
                event = document.createEvent('CustomEvent');
                event.initCustomEvent('click_outside', true, false)
            } else {
                event = new CustomEvent('click_outside', node);
            }
            node.dispatchEvent(
                event
                // new CustomEvent('click_outside', node) //Does not support IE11
            )
        }
    }

    document.addEventListener('click', handleClick, true);

    return {
        destroy() {
            document.removeEventListener('click', handleClick, true);
        }
    }
}