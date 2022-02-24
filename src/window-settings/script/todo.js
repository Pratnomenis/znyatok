window.api.loadSettings();

const form = document.querySelector('.js-wel-form');
form.addEventListener('submit', (e) => {
    e.stopPropagation();
    e.preventDefault();

    const formEntries = new FormData(form).entries();
    const formData = Object.assign(...Array.from(formEntries, ([x, y]) => ({
        [x]: y
    })));

    formData.chbAutoload = formData.chbAutoload === 'on';
    formData.chbShotOnPS = formData.chbShotOnPS === 'on';

    window.api.confirmSettings(formData);
    return false;
});



// (() => {
//     // TODO: add os identifier
//     const isDarwin = true;

class HotKey {
    constructor() {
        this.reset();
    }

    reset() {
        this.metaKeys = {
            shift: {
                active: false,
                electronName: 'Shift'
            },
            control: {
                active: false,
                electronName: 'Control'
            },
            option: {
                active: false,
                electronName: 'Option'
            },
            command: {
                active: false,
                electronName: 'Command'
            },
            alt: {
                active: false,
                electronName: 'Alt'
            },
            window: {
                active: false,
                electronName: 'Super'
            }
        };

        this.mainKey = null;
    }

    get dictionaty() {
        if (isDarwin) {
            return {
                Shift: 'shift',
                Control: 'control',
                Alt: 'option',
                Meta: 'command'
            }
        } else {
            // TODO: check windows\linux key
            return {
                Shift: 'shift',
                Control: 'control',
                Alt: 'alt',
                Meta: 'window'
            }
        }
    }

    isExtraKey(key) {
        return key in this.dictionaty;
    }

    switchOn(eventKey) {
        const {
            key,
            code
        } = eventKey;

        if (this.isExtraKey(key)) {
            const name = this.dictionaty[key];
            this.metaKeys[name].active = true;
            this.mainKey = null;
        } else {
            this.mainKey = this.keyCodeToElectron(code);
        }
    }

    switchOff(eventKey) {
        const {
            key,
            code
        } = eventKey;

        if (this.isExtraKey(key)) {
            const name = this.dictionaty[key];
            this.metaKeys[name].active = false;

            const pressedButtons = Object
                .keys(this.metaKeys)
                .filter(key => key.active)

            if (pressedButtons.length === 0) {
                this.reset();
            }
        }
    }

    keyCodeToElectron(keyCode) {
        const replacers = [{ // TODO: check if it work
                rexp: /^(Backquote|IntlBackslash)$/,
                replacer: '~'
            },
            {
                rexp: /^Equal$/,
                replacer: 'Plus'
            },
            {
                rexp: /^CapsLock$/,
                replacer: 'Capslock'
            },
            { // TODO: CHECK ON linux\windows
                rexp: /^NumLock/,
                replacer: 'Numlock'
            },
            { // TODO: CHECK ON linux\windows
                rexp: /^ScrollLock$/,
                replacer: 'ScrollLock'
            },
            {
                rexp: /^NumpadEnter$/,
                replacer: 'Enter'
            },
            {
                rexp: /^NumpadDecimal$/,
                replacer: 'numdec'
            },
            {
                rexp: /^NumpadAdd$/,
                replacer: 'numadd'
            },
            {
                rexp: /^NumpadSubtract$/,
                replacer: 'numsub'
            },
            {
                rexp: /^NumpadMultiply$/,
                replacer: 'nummult'
            },
            {
                rexp: /^NumpadMultiply$/,
                replacer: 'numdiv'
            },
            {
                rexp: /^Numpad(.+)$/,
                replacer: 'num$1'
            },
            {
                rexp: /^(Key|Digit|Arrow)(.+)$/,
                replacer: '$2'
            }
        ];

        replacers.forEach(t => {
            keyCode = keyCode.replace(t.rexp, t.replacer);
        })

        return keyCode;
    }

    getResult() {
        let arrResult = Object
            .keys(this.metaKeys)
            .filter(key => this.metaKeys[key].active)
            .map(key => this.metaKeys[key].electronName);

        arrResult.push(this.mainKey);

        return arrResult.join('+');
    }
}

class HotkeyTranslator {
    static electronToVisual(strElectronHotkey) {
        // TODO: 
        return strElectronHotkey;
    }
}

//     const inpMakeShot = document.getElementById('hkMakeShot');
//     const inpMakeShotVisual = document.getElementById('hkvMakeShot');

//     const hotKey = new HotKey();

//     inpMakeShotVisual.addEventListener('keydown', (e) => {
//       console.log(e)
//       e.preventDefault();
//       hotKey.switchOn(e);
//       refreshInputs();
//       return false;
//     }, true);

//     inpMakeShotVisual.addEventListener('keyup', (e) => {
//       e.preventDefault();
//       hotKey.switchOff(e);
//       return false;
//     }, true);

//     function refreshInputs() {
//       const electronShortcut = hotKey.getResult();
//       const visualShortcut = HotkeyTranslator.electronToVisual(electronShortcut);
//       inpMakeShot.value = electronShortcut;
//       inpMakeShotVisual.value = visualShortcut;
//       inpMakeShotVisual.focus();
//     }
//   })();