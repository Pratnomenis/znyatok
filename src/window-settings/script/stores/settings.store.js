import {
    Store
} from "./store.js";
import {
    settingsConst
} from "../constants/settings.const.js";

class SettingsStore extends Store {
    constructor(state) {
        super(state);
    }
}

export const settingsStore = new SettingsStore(settingsConst);