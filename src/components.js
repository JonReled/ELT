"use strict";
exports.__esModule = true;
var react_1 = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
function NumericOnlyInput(props) {
    var _a = react_1.useState(false), error = _a[0], setError = _a[1];
    function updateAndCheckIfNumber(userInput) {
        userInput.match(/^[0-9]+$/) !== null ? setError(true) : setError(false);
        props.handleChange(userInput, props.placeholder);
    }
    return (<semantic_ui_react_1.Input style={{ marginRight: '5px' }} error={error} onChange={function (event, data) { return updateAndCheckIfNumber(data.value); }} placeholder={props.placeholder}/>);
}
exports.NumericOnlyInput = NumericOnlyInput;
