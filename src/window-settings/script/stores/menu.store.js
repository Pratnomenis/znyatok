import {
    Store
} from "./store.js";

import {
    menuConst
} from "../constants/menu.const.js";

class MenuStore extends Store {
    constructor(settings) {
        super(settings);
    }
}

export const menuStore = new MenuStore({
    selectedAlias: menuConst.list[0].alias
});