"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const semantic_ui_react_1 = require("semantic-ui-react");
function NumericOnlyInput(props) {
    const [error, setError] = react_1.useState(false);
    function updateAndCheckIfNumber(userInput) {
        let userInputNumber;
        try {
            userInputNumber = parseInt(userInput);
        }
        catch (_a) {
            setError(true);
        }
        typeof (userInputNumber) === "number" ? props.handleChange(userInputNumber, props.placeholder) : ;
    }
    return (react_1.default.createElement(semantic_ui_react_1.Input, { style: { marginRight: '5px' }, error: error, onChange: (event, data) => updateAndCheckIfNumber(data.value), placeholder: props.placeholder }));
}
exports.NumericOnlyInput = NumericOnlyInput;
//# sourceMappingURL=components.js.map