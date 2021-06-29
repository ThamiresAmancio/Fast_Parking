

'use strict'

function readDBPrice() {
    return JSON.parse(window.localStorage.getItem('price')) ?? [];
  }

const setDBPrice = (price) => localStorage.setItem('price', JSON.stringify(price))

const insertDBPrice = (registerPrice) => {
    const dbPrice = readDBPrice()
    dbPrice.push(registerPrice)
    setDBPrice(dbPrice)
}

const clearInputPrice = () => {
    document.querySelector('#primeiraHora').value = ''
    document.querySelector('#demaisHora').value = ''
}

const isValidFormPrice = () => document.querySelector('.form').reportValidity()

const savePrice = () => {
    if (isValidFormPrice) {
        const dbPrice = readDBPrice()

        const price = {
            primeiraHora: document.querySelector('#primeiraHora').value,
            demaisHoras: document.querySelector('#demaisHora').value
        }

        if (dbPrice == '') {
            insertDBPrice(price)
        } else {
            dbPrice[0] = price
            setDBPrice(dbPrice)

        }

        clearInputPrice()
    }
}

const priceMask = (number) => {
    number = number.replace(/\D/g, "")
    number = number.replace(/(\d{1})(\d{5})$/, "$1.$2")
    number = number.replace(/(\d{1})(\d{1,2})$/, "$1,$2")
    return number
}

const applyMask = (event) => {
    event.target.value = priceMask(event.target.value)
}

document.querySelector('#adicionar').addEventListener('click', savePrice)
document.querySelector('#primeiraHora').addEventListener('keyup', applyMask)
document.querySelector('#demaisHora').addEventListener('keyup', applyMask)