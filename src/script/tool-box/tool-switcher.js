const switcherAttrList = {
  'circle-to-square': {
    cssClassFrom: 'js-tool-box__circle',
    cssClassTo: 'js-tool-box__square',
    settingName: 'square-or-circle',
    settingValueToShow: 'square'
  },
  'square-to-circle': {
    cssClassFrom: 'js-tool-box__square',
    cssClassTo: 'js-tool-box__circle',
    settingName: 'square-or-circle',
    settingValueToShow: 'circle'
  },
  'arrow-to-line': {
    cssClassFrom: 'js-tool-box__arrow',
    cssClassTo: 'js-tool-box__line',
    settingName: 'arrow-or-line',
    settingValueToShow: 'line'
  },
  'line-to-arrow': {
    cssClassFrom: 'js-tool-box__line',
    cssClassTo: 'js-tool-box__arrow',
    settingName: 'arrow-or-line',
    settingValueToShow: 'arrow'
  },
}
export class ToolSwitcher {
  constructor(selector, settings, toolsList) {
    this.switchButtons = document.querySelectorAll(selector)
    this.settings = settings;
    this.toolsList = toolsList;
    this.init();
  }

  init() {
    // TODO: hide hidden by settings
    this.refreshUiBySettings();
    this.switchButtons.forEach(el => {
      const switchType = el.dataset.switchType;
      const {
        cssClassFrom,
        cssClassTo,
        settingName,
        settingValueToShow
      } = switcherAttrList[switchType];
      const toolFrom = this.toolsList[cssClassFrom];
      const toolTo = this.toolsList[cssClassTo];

      el.addEventListener('click', () => {
        toolFrom.deactivate();
        toolFrom.hide();
        toolTo.activate();
        console.log(settingName, settingValueToShow);
        this.settings.setSetting(settingName, settingValueToShow);
      });
    });
  }

  refreshUiBySettings() {
    const arrSettings = ['square-or-circle', 'arrow-or-line'];
    const arrSwAttrList = Object.values(switcherAttrList);
    arrSettings.forEach(settingName => {
      const settingValue = this.settings.getSetting(settingName);
      arrSwAttrList.forEach(attrList => {
        if (attrList.settingName === settingName) {
          const tool = this.toolsList[attrList.cssClassTo];
          if (attrList.settingValueToShow === settingValue) {
            tool.show();
          } else {
            tool.hide();
          }
        }
      });
    });
  }

}