"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UP_ARR_KEY_CODE = 38;
const RIGHT_ARR_KEY_CODE = 39;
const DOWN_ARR_KEY_CODE = 40;
const LEFT_ARR_KEY_CODE = 37;
const W_KEY_CODE = 87;
const A_KEY_CODE = 65;
const S_KEY_CODE = 83;
const D_KEY_CODE = 68;
const SPACE_KEY_CODE = 32;
function isUpPressed(keyCode) {
    return keyCode === W_KEY_CODE || keyCode === UP_ARR_KEY_CODE;
}
function isRightPressed(keyCode) {
    return keyCode === D_KEY_CODE || keyCode === RIGHT_ARR_KEY_CODE;
}
function isDownPressed(keyCode) {
    return keyCode === S_KEY_CODE || keyCode === DOWN_ARR_KEY_CODE;
}
function isLeftPressed(keyCode) {
    return keyCode === A_KEY_CODE || keyCode === LEFT_ARR_KEY_CODE;
}
function isSpacePressed(keyCode) {
    return keyCode === SPACE_KEY_CODE;
}
var InputKey;
(function (InputKey) {
    InputKey[InputKey["None"] = -1] = "None";
    InputKey[InputKey["Up"] = 0] = "Up";
    InputKey[InputKey["Right"] = 1] = "Right";
    InputKey[InputKey["Down"] = 2] = "Down";
    InputKey[InputKey["Left"] = 3] = "Left";
    InputKey[InputKey["Space"] = 4] = "Space";
})(InputKey = exports.InputKey || (exports.InputKey = {}));
function getInputKey(keyCode) {
    let result = InputKey.None;
    if (isUpPressed(keyCode)) {
        result = InputKey.Up;
    }
    else if (isRightPressed(keyCode)) {
        result = InputKey.Right;
    }
    else if (isDownPressed(keyCode)) {
        result = InputKey.Down;
    }
    else if (isLeftPressed(keyCode)) {
        result = InputKey.Left;
    }
    else if (isSpacePressed(keyCode)) {
        result = InputKey.Space;
    }
    return result;
}
exports.getInputKey = getInputKey;
