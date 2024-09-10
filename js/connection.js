import { calculate, OPERATIONS } from './calculator_math.js';

let a = "";
let b = ""; 
let operation = "";
let finish = false;

const calcButtons = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."]);
const calcOperations = new Set([OPERATIONS.addition, OPERATIONS.subtraction, OPERATIONS.multiply, OPERATIONS.division]);
const outputResult = document.querySelector(".field");
const decimalePlaces = 4;
const maxLength = 8;

document.querySelector(".clear").onclick = clearCalculator;
document.querySelector(".del").onclick = handleDelete;

function clearCalculator() {
    a = "";
    b = "";
    operation = "";
    finish = false;
    outputResult.textContent = "0";    
} 

function handleDelete() {
    if (finish) {
        a = a.slice(0, -1);
        outputResult.textContent = a || "0";
        if (a === "") {
            finish = false;
        }
    } else if (operation === "") {
        a = a.slice(0, -1);
        outputResult.textContent = a || "0";
    } else {
        b = b.slice(0, -1);
        outputResult.textContent = b || "0";
    }
}

document.querySelector(".buttons").onclick = (event) => {  
    let btnPressed = event.target.textContent;  

    if (!event.target.classList.contains("btn") || event.target.classList.contains("clear")) return;    

    if (finish) handleFinishState(btnPressed);
    else if (btnPressed === "+/-") handleToggleSign();
    else if (btnPressed === "√") handleSquareRoot();
    else if (calcButtons.has(btnPressed)) handleNumberInput(btnPressed);
    else if (calcOperations.has(btnPressed)) handleOperationInput(btnPressed);
    else if (btnPressed === "=") handleEqual();
};

function handleFinishState(btnPressed) {
    if (calcButtons.has(btnPressed)) {
        a = btnPressed === "0" ? "0" : btnPressed;
        b = "";
        operation = "";
        finish = false;
        outputResult.textContent = a;
    } else if (calcOperations.has(btnPressed)) {
        operation = btnPressed;
        outputResult.textContent = operation;
        finish = false;
    } else if (btnPressed === "√") {
        handleSquareRoot();
    }
}

function handleToggleSign() {
    if (b === "" && operation === "") {
        a = toggleSign(a);
        outputResult.textContent = a;
    } else if (a !== "" && b !== "") {
        b = toggleSign(b);
        outputResult.textContent = b;
    }
}

function toggleSign(value) {
    return (-parseFloat(value)).toString();
}

function handleSquareRoot() {
    if (finish) {
        a = calculateSquareRoot(a);
        outputResult.textContent = a;

        finish = false;
        b = "";
        operation = "";
    } else if (operation === "") {
        a = calculateSquareRoot(a);
        outputResult.textContent = a;
    } else if (b !== "") {
        b = calculateSquareRoot(b);
        outputResult.textContent = b;
    }
}

function calculateSquareRoot(value) {
    const number = parseFloat(value);
    if (isNaN(number)) return "Error";

    let result = number >= 0 ? Math.sqrt(number) : "Error";

    if (typeof result === "number") {
        result = result.toFixed(decimalePlaces);
        result = parseFloat(result).toString();
    }
    return result;
}

function handleNumberInput(btnPressed) {
    if (operation === "") {  
        a = handleInput(a, btnPressed);
        outputResult.textContent = a;
    } else {  
        b = handleInput(b, btnPressed);
        outputResult.textContent = b;
    }
}

function handleInput(currentValue, btnPressed) {
    if (currentValue.length >= maxLength && !(btnPressed === "." && !currentValue.includes("."))) {
        return currentValue;
    }

    if (btnPressed === "." && currentValue.includes(".")) return currentValue;
    if (currentValue === "0" && btnPressed !== ".") return btnPressed;
    return currentValue + btnPressed;
}

function handleOperationInput(btnPressed) {
    if (a !== "" && b === "") {
        operation = btnPressed;
        outputResult.textContent = operation;
    } else if (a !== "" && b !== "") {
        const result = calculateResult();
        if (result !== "Error") {
            a = result;
            b = "";
        }
        operation = btnPressed;
        finish = false;
    }
}

function handleEqual() {
    if (a !== "" && b !== "" && operation !== "") {
        const result = calculateResult();
        if (result !== "Error") {
            a = result;
        }
        b = "";
        operation = "";
        finish = true;
    }
}

function calculateResult() {
    let result = calculate(a, b, operation);

    result = (result !== "Error" && !isNaN(result))
        ? Number(parseFloat(result).toFixed(decimalePlaces))
        : "Error";

    result = result.toString();

    if (result.length > maxLength) {
        let number = parseFloat(result);

        if (Math.abs(number) >= 1e8 || Math.abs(number) < 1e-4) {
            result = number.toExponential(decimalePlaces - 2); 
        } else {

            let integerPartLength = Math.floor(number).toString().length;

            if (integerPartLength >= maxLength) {
                result = number.toExponential(decimalePlaces - 2);
            } else {
                let allowedDecimalPlaces = maxLength - integerPartLength - 1;
                result = number.toFixed(allowedDecimalPlaces);
            }
        }
    }

    if (result.indexOf('.') !== -1) {
        result = result.replace(/\.?0+$/, '');
    }

    outputResult.textContent = result === "Error" ? "Error" : result;
    return result;
}

