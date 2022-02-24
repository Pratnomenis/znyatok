import {
    Row
} from "../elements/row.component.js";
import {
    Col
} from "../elements/col.component.js";

import {
    Color
} from "../elements/color.settings-component.js";
import {
    Hotkey
} from "../elements/hotkey.settings-component.js";
import {
    Range
} from "../elements/range.settings-component.js";
import {
    Select
} from "../elements/select.settings-component.js";
import {
    Switcher
} from "../elements/switch.settings-component.js";
import {
    SettingLine
} from "../elements/setting-line.component.js";

const e = React.createElement;

export class GeneralTab extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return e(
            React.Fragment,
            null,
            e(Row, null,
                e(Col, null, 'Color'),
                e(Color, null)
            ),
            e(Row, null,
                e(Col, null, 'Hotkey'),
                e(Hotkey, null)
            ),
            e(Row, null,
                e(Col, null, 'Range simple'),
                e(Range, null)
            ),
            e(Row, null,
                e(Col, null, 'Range cool'),
                e(Range, {
                    min: 20,
                    max: 80,
                    step: 10,
                    dataMark: '%'
                })
            ),
            e(Row, null,
                e(Col, null, 'Select'),
                e(Select, null)
            ),
            e(Row, null,
                e(Col, null, 'Switcher'),
                e(Switcher, null)

            ),
            e(Row, null,
                e(Col, null, 'Hello'),
                e(Col, null, 'World')
            ),
            e(Row, null,
                e(Col, null, 'Hello'),
                e(Col, null, 'Washa mama')
            ),
            e(Row, null,
                e(Col, null, 'Hello'),
                e(Col, null, 'Washa sestra')
            )
        );
    }
}