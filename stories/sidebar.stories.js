import { SideBar } from "../src/index";

let menu = {
    "resource monitorx": {
        "Dashboard": { link: "#dashboard" },
        "Customers X": { link: "#cus" },
    },
    "administrationx": {
        "Team Settings": { link: "#sett" },
        "Manage Your Team ": {
            "Memberz": { link: "/memz" },
            "Pluginz": { link: "/plugz" },
        },
        "Global Team ": {
            "new": { link: "/new" },
            "old": { link: "/old" },
        },
    },
    "Settings": {
        "Option1": { link: "/a1" },
        "Option2": { link: "/a1" },
        "Option3": { link: "/a1" },
    },
    "Contact": {
        "Map": { link: "/map" },
    }
}

let basicProps = {
    cssClass: 'xxxy',
    menu: menu,
}

export default {
    title: 'Sidebar',
    component: SideBar,
    props: basicProps
}

export const defaultSideBar = () => ({
    title: 'Sidebar2',
    Component: SideBar,
    props: basicProps
});

export const basicSideBar = () => ({
    title: 'Sidebar2',
    Component: SideBar,
    props: Object.assign({ activeIndex: 1 }, basicProps)
});

// export default comp;