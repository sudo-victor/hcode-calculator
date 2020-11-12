class CalcController {

    constructor() {

        this._audio = new Audio('click.mp3')
        this._audioOnOff = false
        this._lastoperator = ""
        this._lastNumber = ""

        this._operation = []
        this._locale = "pt-br"
        this._displayCalcEl = document.querySelector("#display")
        this._dateEl = document.querySelector("#data")
        this._timeEl = document.querySelector("#hora")
        this._currentDate;
        this.initialize()
        this.initButtonEvents()
        this.initKeyboard()

    }

    copyToClipboard() {

        let input = document.createElement("input")

        input.value = this.displayCalc

        document.body.appendChild(input)

        input.select()

        document.execCommand("Copy")

        input.remove()

    }

    pasteFromClipboard() {

        document.addEventListener("paste", event => {

            let text = event.clipboardData.getData('text')

            this.displayCalc = parseFloat(text)

            console.log(text)

        })

    }

    toggleAudio() {

        this._audioOnOff = !this._audioOnOff

    }

    playAudio() {

        if (this._audioOnOff) {
            this._audio.currentTime = 0
            this._audio.play()
        }
    }

    initialize() {

        this.setDisplayDateTime()

        setInterval(() => {
            this.setDisplayDateTime()
        }, 1000)

        this.pasteFromClipboard()
        this.setLastNumberToDisplay()

        document.querySelectorAll(".btn-ac").forEach(btn => {

            btn.addEventListener('dblclick', event => {
                console.log("duplo click")
                this.toggleAudio()

            })

        })
    }

    initKeyboard() {
        document.addEventListener("keyup", (event) => {
            this.playAudio()

            switch (event.key) {
                case "Escape":
                    this.clearAll();
                    break;

                case "Backspace":
                    this.clearEntry()
                    break;

                case "+":
                case "-":
                case "*":
                case "/":
                case "%":
                    this.addOperatoration('+')
                    break;

                case "Enter":
                case "=":
                    this.calc()
                    break;

                case ".":
                case ",":
                    this.addDot()
                    break;

                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    this.addOperatoration(parseInt(event.key))
                    break;

                case "c":
                    if (event.ctrlKey) this.copyToClipboard()
                    break

            }


        })
    }

    addEventListenerAll(element, events, fn) {
        events.split(" ").forEach(event => {

            element.addEventListener(event, fn, false)

        })
    }

    clearAll() {
        this._operation = []
        this._lastNumber = ''
        this._lastOperator = ''

        this.setLastNumberToDisplay()
    }

    clearEntry() {
        this._operation.pop()

        this.setLastNumberToDisplay()
    }

    getLastOperation() {
        return this.operation[this.operation.length - 1]
    }

    setLastOperation(value) {
        this.operation[this.operation.length - 1] = value
    }

    isOperator(value) {

        return (['+', '-', '*', '%', '/'].indexOf(value) > -1)
    }

    getResult() {
        try {
            return eval(this.operation.join(""))
        } catch (e) {
            setTimeout(() => {
                this.setError()
            }, 1)
        }
    }

    calc() {

        let last = ""
        this._lastOperator = this.getLastItem()

        if (this.operation.length < 3) {
            let firstItem = this.operation[0]

            this._operation = [firstItem, this._lastOperator, this._lastNumber]
        }

        if (this.operation.length > 3) {

            last = this._operation.pop()
            this._lastNumber = this.getResult()

        } else if (this.operation.length == 3) {
            this._lastNumber = this.getLastItem(false)
        }

        let result = this.getResult()

        if (last === "%") {

            result /= 100;
            this.clearAll()
            this.operation = result

        } else {

            this.clearAll()
            this.operation = result

            if (last) this.operation = last

        }

        this.setLastNumberToDisplay()

    }

    pushOperation(value) {
        this.operation = value

        if (this.operation.length > 3) {

            this.calc()
        }
    }

    getLastItem(isOperator = true) {
        let lastItem;

        for (let i = this.operation.length - 1; i >= 0; i--) {

            if (this.isOperator(this.operation[i]) == isOperator) {
                lastItem = this.operation[i]
                break
            }

        }

        if (!lastItem) {
            lastItem = isOperator ? this._lastOperator : this._lastNumber
        }

        return lastItem
    }

    setLastNumberToDisplay() {

        let lastNumber = this.getLastItem(false)

        if (!lastNumber) lastNumber = 0

        this.displayCalc = lastNumber

    }

    addOperatoration(value) {

        // Verifica se o ultimo valor do array nao for um número
        if (isNaN(this.getLastOperation())) {

            // Se o valor atual for um operador terá que substituir o ultimo operador
            if (this.isOperator(value)) {

                this.setLastOperation(value)

            } else { // A primeira vez que clicar em um número 

                this.pushOperation(value)
                this.setLastNumberToDisplay(value)

            }

        } else { // Se o ultimo valor do array for um número cairá aqui

            // Se o valor atual for um operador adicionará no array
            if (this.isOperator(value)) {

                this.pushOperation(value)

            } else { // Senão for um operador será um número e deverá fazer a concatenação com o último número

                let newValue = this.getLastOperation().toString() + value.toString() // Faz a concatenação do ultimo numero com o numero atual
                this.setLastOperation(newValue)

                // Atualizar display
                this.setLastNumberToDisplay()
            }

        }

    }

    setError() {
        this.displayCalc = "Error"
    }

    addDot() {

        let lastOperation = this.getLastOperation()

        if (typeof lastOperation === "string" && lastOperation.split("").indexOf(".") > -1) {
            return
        }

        if (this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation("0.")
        } else {
            this.setLastOperation(lastOperation.toString() + ".")
        }

        this.setLastNumberToDisplay()
    }

    execBtn(value) {
        this.playAudio()

        switch (value) {
            case "ac":
                this.clearAll();
                break;

            case "ce":
                this.clearEntry()
                break;

            case "soma":
                this.addOperatoration('+')
                break;

            case "subtracao":
                this.addOperatoration('-')
                break;

            case "divisao":
                this.addOperatoration('/')
                break;

            case "multiplicacao":
                this.addOperatoration('*')
                break;

            case "porcento":
                this.addOperatoration('%')
                break;

            case "igual":
                this.calc()
                break;

            case "ponto":
                this.addDot()
                break;

            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                this.addOperatoration(parseInt(value))
                break;

            default:
                this.setError()
                break;

        }

    }

    initButtonEvents() {
        let buttons = document.querySelectorAll("#buttons > g, #parts > g")

        buttons.forEach((btn, index) => {
            this.addEventListenerAll(btn, "click drag", e => {
                let text = btn.className.baseVal.replace("btn-", "")

                this.execBtn(text)
            })

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
                btn.style.cursor = "pointer"
            })
        })

    }

    setDisplayDateTime() {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        })
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale)
    }

    get displayTime() {
        return this._timeEl.innerHTML
    }

    set displayTime(value) {
        return this._timeEl.innerHTML = value
    }

    get displayDate() {
        return this._dateEl.innerHTML
    }

    set displayDate(value) {
        return this._dateEl.innerHTML = value
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value) {
        if (value.toString().length > 10) {
            this.setError()

            return false
        }
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate() {
        return new Date();
    }

    set currentDate(value) {
        this._currentDate = value
    }

    get operation() {
        return this._operation
    }

    set operation(value) {
        this._operation.push(value)
    }

}