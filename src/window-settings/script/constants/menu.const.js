export const menuConst = (() => {
    const aliases = {
        colors: 'colors',
        general: 'general',
        hotkeys: 'hotkeys',
        tools: 'tools',
    };

    return {
        aliases,
        list: [{
                alias: aliases.general,
                label: 'General'
            },
            {
                alias: aliases.hotkeys,
                label: 'Hot Keys'
            },
            {
                alias: aliases.tools,
                label: 'Tools'
            },
            {
                alias: aliases.colors,
                label: 'Colors'
            },
        ]
    }
})();