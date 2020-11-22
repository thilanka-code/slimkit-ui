import { SideBar } from "../src/index";

let menu = {
    "resource monitorx": {
        "Dashboard": { link: "/dashboard" },
        "Customers X": { link: "/cus" },
    },
    "administrationx": {
        "Team Settings": { link: "/sett" },
        "Manage Your Team ": {
            "Memberz": { link: "/memz" },
            "Pluginz": { link: "/plugz" },
        }
    },
    "Settings": {
        "Option1": { link: "/a1"},
        "Option2": { link: "/a1"},
        "Option3": { link: "/a1"},
    },
    "Contact": {
        "Map": { link: "/map" },
    }
}

export default {
    title: 'Sidebar',
    component: SideBar,
    props: {
        cssClass: 'xy',
        menu: menu,
    }
}

export const me = () => ({
    title: 'Sidebar2',
    Component: SideBar,
    props: {
        cssClass: 'xxxy',
        menu: menu,
        activeIndex: 1
    }
});

// export default comp;