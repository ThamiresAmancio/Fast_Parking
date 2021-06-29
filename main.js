
const openAdicionar = () => document.querySelector('#adicionar').classList.add("active")

const openModal = () => document.querySelector('#modal_comprov').classList.add("active")

const closeModal = () => document.querySelector('#modal_comprov').classList.remove('active')

const readDb = () => JSON.parse(localStorage.getItem('db')) ?? [];

const readDBPrice = () => JSON.parse(window.localStorage.getItem('price')) ?? [];

const setDB = (db) => localStorage.setItem('db', JSON.stringify(db))


const insertDB = (client) => {
    const db = readDb()
    db.push(client)
    setDB(db)
}

const updateClient = ({nome, placa},index) => {
    const db = readDb()
    const newCClients = {
        nome,
        placa,
        data:db[index].data,
        hora:db[index].hora
    }
    db[index] = newCClients
    setDB(db)
}

const clearTable = () => {
    const recordClient = document.querySelector('#table tbody')
    while (recordClient.firstChild) {
        recordClient.removeChild(recordClient.lastChild)
    }
}
const createRow = (client, index) => {

    const recordClient = document.querySelector('#table tbody')
    const newTr = document.createElement('tr')
    newTr.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.placa}</td>
        <td>${client.data}</td>
        <td>${client.hora}</td>
        <td>
            <button class="button green" type="button" data-action="comprovante ${index}" id="comprovante">Comprovante</button>
            <button class="button blue" type="button" id="editar" data-action="editar-${index}">Editar</button>
            <button class="button red" type="button" id="saida" data-action="saida-${index}">Saída</button>
        </td>
    `
    recordClient.appendChild(newTr)
}

const updateTable = () => {
    clearTable()
    const db = readDb()
    db.forEach(createRow)
}

const clearInput = () => {
    document.querySelector('#nome').value = ''
    document.querySelector('#placa').value = ''
}

const data = () => {
    const dataHora = new Date();
    const dia = dataHora.getDate();
    const mes = dataHora.getMonth();
    const ano = dataHora.getFullYear();

    const dataC = dia + '/' + (mes + 1) + '/' + ano;

    return dataC
}


const hora = () => {
    const dataHora = new Date();

    const hora = dataHora.getHours();
    const min = dataHora.getMinutes();
    const seg = dataHora.getSeconds();

    const horaC = hora + ':' + min + ':' + seg;

    return horaC

}


const isValid = () => document.querySelector('#inputs').reportValidity()

const adicionarClient = () => {



    if (isValid()) {
            const newCClients = {
                nome: document.querySelector('#nome').value,
                placa: document.querySelector('#placa').value,
                data: data(),
                hora: hora()
            }
            const index = document.querySelector('#nome').dataset.index
            if (index == '') {
                insertDB(newCClients)
            } else {
                updateClient(newCClients, index)
            }
        }
        
        clearInput()
        updateTable()
    
}

 const get = (number) => {

     number = number.replace(/(^.{3}$)/,'$1-')
     number = number.replace(/(^.{9}$)/,'')
     return number
 }


 const mask  =(event) =>{
    event.target.value = get (event.target.value)
  }

 

 const getPreco = (index)=>{
     const dbPreco = readDBPrice()
     const db = readDb()

     let horasClientes = db[index].hora
     let totalHora = 0
     let primeiraHora = dbPreco[0].primeiraHora.replace(",", ".")
     let demaisHora = dbPreco[0].demaisHoras.replace(",", ".")

     const horas = parseInt(horasClientes.substr(0,2)) * 3600
     const minutos = parseInt(horasClientes.substr(3,4)) * 60

     const horasIniciadas = parseInt(hora().substr(0,2)) * 3600
     const minutesIniciados = parseInt(hora().substr(3,4)) * 60

     const segundos = ((horasIniciadas + minutesIniciados)) - (horas + minutos) 

     const horasEstacionadas = segundos/3600


     if(horasEstacionadas <= 1){
         totalHora = primeiraHora
         console.log(totalHora)
     }else{
         totalHora = parseInt(primeiraHora) + (demaisHora * Math.trunc(horasEstacionadas))
        console.log(totalHora)
     }
     return totalHora
 }


 

const formComprovante = (index) => {
    const db = readDb();
    const input = Array.from(document.querySelectorAll('#form_comprovante input'));
    input[0].value = db[index].nome;
    input[1].value = db[index].placa;
    input[2].value = db[index].data;
    input[3].value = db[index].hora;


}


const saida = (index) => {
    const db = readDb()

    const totalHora = getPreco(index)

    const resp = confirm(`O valor total de ${db[index].nome}  foi R$${totalHora}?`)

    if (resp) {
        db.splice(index, 1)
        setDB(db)
        updateTable()
    }
}


const editar = (index) => {
    const db = readDb()
     document.querySelector('#nome').value = db[index].nome
      document.querySelector('#placa').value = db[index].placa
     document.querySelector('#nome').dataset.index = index
}


const actionButttons = (event) => {
    const element = event.target
    if (element.type === 'button') {
        const action = element.dataset.action.split('-')
        if (action[0] === 'editar') {
            editar(action[1])
             }else(
                saida(action[1])
             )
        }
    }


const buttonComp = (event) => {
    const button = event.target;
    if (button.id === "comprovante") {
        const index = button.dataset.action.split(' ');
        openModal();
        formComprovante(index[1]);
    }
}
document.querySelector('#close')
    .addEventListener('click', () => { closeModal(); clearInput() })

document.querySelector('#cancelar')
    .addEventListener('click', () => { closeModal(); clearInput() })

document.querySelector('#adicionar').addEventListener('click', adicionarClient)
document.querySelector('#table').addEventListener('click', actionButttons)
document.querySelector('#table').addEventListener('click', buttonComp)

 document.querySelector('#placa').addEventListener('keyup',mask)

updateTable()