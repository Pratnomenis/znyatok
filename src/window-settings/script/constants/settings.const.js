export const settingsConst = (() => {
    const currSettings = window.api.getAllSettings();

    return {
        'start-with-system': currSettings['start-with-system'],
        'shot-on-prnt-scr': currSettings['shot-on-prnt-scr'],
        'hotkey-screenshot': currSettings['hotkey-screenshot'],
        'tray-icon-type': currSettings['tray-icon-type'],
        'color-0': currSettings['color-0'],
        'color-1': currSettings['color-1'],
        'color-2': currSettings['color-2'],
        'color-3': currSettings['color-3'],
        'color-4': currSettings['color-4'],
        'color-5': currSettings['color-5'],
        'color-6': currSettings['color-6'],
        'color-7': currSettings['color-7'],
        'color-8': currSettings['color-8'],
        'color-9': currSettings['color-9'],
        'color-10': currSettings['color-10'],
        'color-11': currSettings['color-11'],
        'color-opacity': currSettings['color-opacity'],
        'schema-hotkeys': currSettings['schema-hotkeys'],
        'schema-colors': currSettings['schema-colors'],
        // TODO: add to settings

        // TODO: will be done later
        'shot-only-active-screen': true,

        // Internal

        'tray-icon-type_options': [{
                value: 'black',
                label: 'Black'
            },
            {
                value: 'white',
                label: 'White'
            },
            {
                value: 'color',
                label: 'Colorful'
            },
        ],

        'schema-hotkeys_options': [{
                value: 'default',
                label: 'Default - Znyatok',
                valueList: {
                    'hotkey-screenshot': currSettings.defaultSettings['hotkey-screenshot']
                }
            },
            {
                value: 'custom',
                label: 'Custom',
                keyList: ['hotkey-screenshot']
            },
        ],

        'schema-colors_options': [{
                value: 'default',
                label: 'Default',
                valueList: {
                    'color-0': currSettings.defaultSettings['color-0'],
                    'color-1': currSettings.defaultSettings['color-1'],
                    'color-2': currSettings.defaultSettings['color-2'],
                    'color-3': currSettings.defaultSettings['color-3'],
                    'color-4': currSettings.defaultSettings['color-4'],
                    'color-5': currSettings.defaultSettings['color-5'],
                    'color-6': currSettings.defaultSettings['color-6'],
                    'color-7': currSettings.defaultSettings['color-7'],
                    'color-8': currSettings.defaultSettings['color-8'],
                    'color-9': currSettings.defaultSettings['color-9'],
                    'color-10': currSettings.defaultSettings['color-10'],
                    'color-11': currSettings.defaultSettings['color-11'],
                    'color-opacity': currSettings.defaultSettings['color-opacity'],
                }
            },
            {
                value: 'custom',
                label: 'Custom',
                keyList: ['color-0', 'color-1', 'color-2', 'color-3', 'color-4', 'color-5', 'color-6', 'color-7', 'color-8', 'color-9', 'color-10', 'color-11', 'color-opacity']
            },
        ],
    };
})()