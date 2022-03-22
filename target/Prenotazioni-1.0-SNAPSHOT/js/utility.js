/* Invocazione della servlet "prenotazioniServlet" per fare una prenotazione */
function prenota(giorno, ora, table, row, col){
    let cell = table.rows[row].cells[col];

    $.ajax({
        url: "prenotazioniServlet",
        type: "POST",
        data: {
            'action': "doPrenota",
            'id_corso': document.getElementById("selectCorso").value,
            'id_docente': document.getElementById("selectDocente").value,
            'giorno': giorno,
            'ora': ora
        },

        success: function(response) {
            let data = JSON.parse(JSON.stringify(response));

            if(data.msg === 'OK'){
                cell.innerHTML = "OCCUPATO";
                cell.style.backgroundColor = "red";
                //todo: review this. Is a little inefficient
                app.getPrenotazioniUtente();
            }else{
                alert(data.msg);
            }
        }
    })//end ajax
}

/* event listener per le celle della tabella degli slot */
function cellListener(){
    let table = document.getElementById("slotTable");

    let col = $(this).parent().children().index($(this));
    let row = ($(this).parent().parent().children().index($(this).parent()))+1;

    let col_header = table.rows[0].cells[col].innerHTML;
    let row_header = table.rows[row].cells[0].innerHTML;

    /* se la cella cliccata è uno slot libero */
    if(table.rows[row].cells[col].innerHTML === 'LIBERO'){
        prenota(col_header,row_header, table, row, col);
    }
}

function disdiciCellListener(){
    let table = document.getElementById("table-prenotazioni-utente");
    let row_index = ($(this).parent().parent().children().index($(this).parent()));
    let row = table.rows[row_index];

    $.ajax({
        url: "prenotazioniServlet",
        type: "POST",
        data: {
            'action': "disdiciPrenotazione",
            'id_prenotazione': row.cells[0].innerHTML,
        },

        success: function(response) {
            let data = JSON.parse(JSON.stringify(response));

            if(data.msg === 'OK'){

                row.cells[5].innerHTML = "Disdetta";
                addRow(document.getElementById("table-storico-utente"),row);
                if(app.isAmmAuth()){
                    addRow(document.getElementById("table-storico-amm"),row);
                }
                row.remove();

            }else{
                alert(data.msg);
            }
        }
    })//end ajax
}

function effCellListener(){
    let table = document.getElementById("table-prenotazioni-utente");
    let row_index = ($(this).parent().parent().children().index($(this).parent()));
    let row = table.rows[row_index];

    $.ajax({
        url: "prenotazioniServlet",
        type: "POST",
        data: {
            'action': "segnaComeEffettuataPrenotazione",
            'id_prenotazione': row.cells[0].innerHTML,
        },

        success: function(response) {
            let data = JSON.parse(JSON.stringify(response));

            if(data.msg === 'OK'){
                row.cells[5].innerHTML = "Effettuata";
                addRow(document.getElementById("table-storico-utente"),row);
                if(app.isAmmAuth()){
                    addRow(document.getElementById("table-storico-amm"),row);
                }
                row.remove();

            }else{
                alert(data.msg);
            }
        }
    })//end ajax
}

function cleanTable(table){
    if(table !== null)
        for(let i=table.rows.length-1;i>0;i--){
            table.deleteRow(i);
        }
}

/* aggiunge una riga row alla tabella table */
function addRow(table, row){
    let row_i = table.rows.length;
    let row_new = table.insertRow(row_i);
    for(let i = 0; i < 6; i++){
        row_new.insertCell(i).innerHTML = row.cells[i].innerHTML;
    }
}

function cleanSelect(select){
    if(select !== null)
        for(let i=select.options.length-1;i>0;i--){
            select.remove(i);
        }
}

function fillBookingRow(row_table,row_element) {
    row_table.insertCell(0).innerHTML = row_element['id_prenotazione'];
    row_table.insertCell(1).innerHTML = row_element['giorno'];
    row_table.insertCell(2).innerHTML = row_element['ora'];
    row_table.insertCell(3).innerHTML = row_element['docente'];
    row_table.insertCell(4).innerHTML = row_element['corso'];
    row_table.insertCell(5).innerHTML = row_element['stato'];
}

function fillStoricoRowAmm(row_table,row_element) {
    row_table.insertCell(0).innerHTML = row_element.id_prenotazione;
    row_table.insertCell(1).innerHTML = row_element.utente;
    row_table.insertCell(2).innerHTML = row_element.giorno;
    row_table.insertCell(3).innerHTML = row_element.ora;
    row_table.insertCell(4).innerHTML = row_element.docente;
    row_table.insertCell(5).innerHTML = row_element.corso;
    row_table.insertCell(6).innerHTML = row_element.stato;
}

function fillDocentiSelect(select,data){
    for(let element in data){
        let opt = document.createElement("option");
        opt.value = data[element]['id_docente'];
        opt.innerText = data[element]['nome']+" "+data[element]['cognome'];
        select.append(opt);
    }
}