function addition(a, b) {
    return (+a) + (+b);
}

function subtraction(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function division(a, b) {
    return b === 0 ? "Error" : a / b;
}

export const OPERATIONS = {
    addition: "+",
    subtraction: "-",
    multiply: "×",
    division: "÷"
};

export function calculate(a, b, operation) {
    a = parseFloat(a);
    b = parseFloat(b);
    let result = null;

    switch (operation) {
        case OPERATIONS.addition:
            result = addition(a, b);
            break;

        case OPERATIONS.subtraction:
            result = subtraction(a, b);
            break;

        case OPERATIONS.multiply:
            result = multiply(a, b);
            break;

        case OPERATIONS.division:
            if (b === 0) {
                result = "Error";
            } else {
                result = division(a, b);
            }
            break;

        default:
            break;
    }
    return result;
}