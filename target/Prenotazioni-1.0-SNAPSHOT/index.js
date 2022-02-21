let app = new Vue ({

    el: '#page',
    data: {
        username: null,
        role: null,
        link: "loginServlet"
    },

    mounted(){
        this.getSession();
        this.getCorsi();
    },

    methods:{
        setUsername:function(usr){
            this.username = usr;
        },

        setRole:function(rl){
            if(rl === null){
                this.role = null;
                return;
            }

            if(typeof rl !== 'string')
                throw new Error("Type error");
            else{
                //rimuove tutti gli spazi bianchi dalla stringa rl
                this.role = rl.replace(/\s+/g, '');
            }

        },

        getRole:function(){
            return this.role;
        },

        isAuth:function(){
            if(this.role !== null) {
                //console.log(this.role.localeCompare("Cliente"));
                if (this.role.localeCompare("Amministratore") || this.role.localeCompare("Cliente")) {
                    //document.getElementById("div-prenotazioni-utente").style.visibility = "hidden";
                    this.getPrenotazioniUtente();
                    return true;
                }
            }
            return false;
        },

        isAmmAuth:function(){

            if(this.role !== null) {
                //console.log(this.role.localeCompare("Amministratore"));

                if(this.role.localeCompare("Amministratore")===0) {
                    //document.getElementById("div-prenotazioni-utente").style.visibility = "hidden";
                    this.getPrenotazioni();
                    return true;
                }
            }
            return false;
        },

        getSession:function() {
            let self = this;
            $.ajax({
                url: "loginServlet",
                type: "GET",
                data: {
                    'action': "getSession"
                },

                success: function (response) {
                    let data = JSON.parse(JSON.stringify(response));

                    if(data.role === 'null'){
                        self.setRole(null);
                    }else{
                        self.setRole(data.role);
                    }
                }
            })//end ajax
        },

        logout:function(){
            $.ajax({
                url: "loginServlet",
                type: "POST",
                data: {
                    'action': "Logout"
                },

                success: function() {
                    //let data = JSON.parse(JSON.stringify(response));
                    app.setRole(null);
                }
            })//end ajax
        },

        login:function(){
            $.ajax({
                url: "loginServlet",
                type: "POST",
                data: {
                    'username': document.getElementById("username").value,
                    'password': document.getElementById("password").value,
                    'action': "Login"
                },

                success: function (response) {

                    let data = JSON.parse(JSON.stringify(response));

                    if(data.role === 'null'){
                        alert(data.msg);
                    }else{
                        app.setUsername(data.username);
                        app.setRole(data.role);
                        app.getCorsi();
                    }
                }
            })//end ajax

        },

        guestLogin:function(){
            $.ajax({
                url: "loginServlet",
                type: "POST",
                data: {
                    'action': "GuestLogin"
                },

                success: function (response) {
                    let data = JSON.parse(JSON.stringify(response));
                    if(data.role !== 'null'){
                        app.setRole("ospite");
                        app.getCorsi();
                    }
                }
            })//end ajax

        },//end guestLogin:function

        //gestione del menu a tendina "selectCorso"
        getCorsi:function(){
            $.ajax({
                url: "corsiServlet",
                type: "GET",
                data: {
                    'action': "getCorsi"
                },

                success: function (response) {
                    let data = JSON.parse(JSON.stringify(response));

                    //svuoto selectCorso per non avere dati incorretti
                    let select = document.getElementById("selectCorso");
                    cleanSelect(select);

                    //se l'utente loggato è amministratore, popolo anche il menù a tendina nella sezione amministrazione
                    // contenente i corsi
                    let selCorsiAmm;
                    if(app!=null && app.isAmmAuth()){
                        selCorsiAmm = document.getElementById("selectCorsoAmm");
                        cleanSelect(selCorsiAmm);
                    }

                    if(!data.msg){  //se nella risposta non c'è msg, la query è andata a buon fine
                        //popolo il menu a tendina "selectCorso"
                        for(let element in data){
                            let opt = document.createElement("option");
                            opt.value = data[element].ID_CORSO;
                            opt.innerText = data[element].titolo;
                            if(select !== null)
                                select.append(opt);

                            if(app.isAmmAuth() && selCorsiAmm !== null){
                                let optAmm = document.createElement("option");
                                optAmm.value = data[element].ID_CORSO;
                                optAmm.innerText = data[element].titolo;
                                selCorsiAmm.append(optAmm);
                            }
                        }
                    }else{
                        alert(data.msg);
                    }
                }
            })//end ajax

            /*if(this.isAmmAuth()){
                this.getDocentiAmm();
            }*/
        },

        //gestione del menu a tendina "selectDocente"
        getDocenti:function(){
            //svuoto il menu a tendina "selectDocente"
            let sele = document.getElementById("selectDocente");
            cleanSelect(sele);

            //let idCorsoSelezionato = document.getElementById("selectCorso").value;
            $.ajax({
                url: "docentiServlet",
                type: "POST",
                data: {
                    'action': "getDocenti",
                    'id_corso': document.getElementById("selectCorso").value
                },

                success: function (response) {
                    let data = JSON.parse(JSON.stringify(response));

                    if(!data.msg){  //se nella risposta non c'è msg, la query è andata a buon fine
                        //popolo il menu a tendina "selectCorso"
                        let select = document.getElementById("selectDocente");
                        for(let element in data){
                            let opt = document.createElement("option");
                            opt.value = data[element].id_docente;
                            opt.innerText = data[element].nome+" "+data[element].cognome;
                            select.append(opt);
                        }
                    }else{
                        alert(data.msg);
                    }
                }
            })//end ajax
        },

        //recupero le prenotazioni attive del docente selezionato per popolare la tabella degli slot disponibili
        getPrenotazioniDocente:function(){
            $.ajax({
                url: "prenotazioniServlet",
                type: "GET",
                data: {
                    'action': "getPrenotazioniByIDDocente",
                    'id_docente': document.getElementById("selectDocente").value
                },

                success: function (response) {

                    let data = JSON.parse(JSON.stringify(response));

                    if(!data.msg){  //se nella risposta non c'è msg, la query è andata a buon fine
                        let table = document.getElementById("slotTable");

                        let rows = table.rows.length;
                        let cols = table.rows[0].cells.length;

                        //creo le celle, marcandole tutti come libere
                        for(let r=1;r<rows;r++){
                            for(let c=1;c<cols;c++){
                                table.rows[r].cells[c].innerHTML = "LIBERO";
                                table.rows[r].cells[c].style.backgroundColor = "green";

                                //aggiungo ad ogni cella un action listener
                                table.rows[r].cells[c].addEventListener("click", cellListener);
                            }
                        }

                        data.forEach(element => {
                            let c = document.getElementById(element.giorno).cellIndex;
                            let r = document.getElementById(element.ora).rowIndex;

                            table.rows[r].cells[c].innerHTML = "OCCUPATO";
                            table.rows[r].cells[c].style.backgroundColor = "red";
                        });
                    }else{
                        alert(data.msg);
                    }
                }
            })//end ajax
        },

        /* Estrae tutte le prenotazioni dal db e le visualizza nella tabella "table-storico-amm"
        * */
        getPrenotazioniUtente:function(){
            //document.getElementById("div-prenotazioni-utente").style.visibility = "hidden";
            //if(this.isAuth()){
                let self = this;
                $.ajax({
                    url: "prenotazioniServlet",
                    type: "GET",
                    data: {
                        'action': "getPrenotazioniByUsername",
                        'username': self.username
                    },

                    success: function (response) {
                        //svuoto la tabella
                        let table = document.getElementById("table-prenotazioni-utente");
                        let table_storico = document.getElementById("table-storico-utente");
                        cleanTable(table);
                        cleanTable(table_storico);

                        let data = JSON.parse(JSON.stringify(response));

                        if (!data.msg) {  //se nella risposta non c'è msg, la query è andata a buon fine
                            let row_i_table = 1;
                            let row_i_storico = 1;

                            if (data.length !== 0)
                                document.getElementById("div-prenotazioni-utente").style.visibility = "visible";

                            let row_table;
                            data.forEach(row_element => {

                                if (row_element.stato === "Attiva") { //inserisco nella tabella "table-prenotazioni-utente"
                                    table = document.getElementById("table-prenotazioni-utente");
                                    row_table = table.insertRow(row_i_table);

                                } else { //inserisco nella tabella "table-storico-utente"
                                    table = document.getElementById("table-storico-utente");
                                    row_table = table.insertRow(row_i_storico);
                                    row_i_storico++;
                                }

                                row_table.insertCell(0).innerHTML = row_element.id_prenotazione;
                                row_table.insertCell(1).innerHTML = row_element.giorno;
                                row_table.insertCell(2).innerHTML = row_element.ora;
                                row_table.insertCell(3).innerHTML = row_element.docente;
                                row_table.insertCell(4).innerHTML = row_element.corso;
                                row_table.insertCell(5).innerHTML = row_element.stato;

                                if (row_element.stato === "Attiva") {
                                    let elimina_cell = row_table.insertCell(6);
                                    elimina_cell.innerHTML = "Disdici";
                                    elimina_cell.addEventListener("click", disdiciCellListener);

                                    let eff_cell = row_table.insertCell(7);
                                    eff_cell.innerHTML = "Segna come effettuata";
                                    eff_cell.addEventListener("click", effCellListener);
                                    row_i_table++;
                                }

                            });


                        } else {
                            alert(data.msg);
                        }
                    }

                })//end ajax
        },


        getPrenotazioni:function(){
            let self = this;
            $.ajax({
                url: "prenotazioniServlet",
                type: "GET",
                data: {
                    'action': "getPrenotazioni"
                },

                success: function (response) {
                    //svuoto la tabella
                    let table = document.getElementById("table-storico-amm");

                    cleanTable(table);

                    let data = JSON.parse(JSON.stringify(response));

                    if(!data.msg){  //se nella risposta non c'è msg, la query è andata a buon fine
                        let row_i = 1;

                        if(data.length !== 0)
                            document.getElementById("table-storico-amm").style.visibility = "visible";

                        let row_table;
                        data.forEach(row_element => {
                            table = document.getElementById("table-storico-amm");
                            row_table = table.insertRow(row_i);

                            row_table.insertCell(0).innerHTML = row_element.id_prenotazione;
                            row_table.insertCell(1).innerHTML = row_element.utente;
                            row_table.insertCell(2).innerHTML = row_element.giorno;
                            row_table.insertCell(3).innerHTML = row_element.ora;
                            row_table.insertCell(4).innerHTML = row_element.docente;
                            row_table.insertCell(5).innerHTML = row_element.corso;
                            row_table.insertCell(6).innerHTML = row_element.stato;

                            row_i++;
                        });
                    }else{
                        alert(data.msg);
                    }
                }
            })//end ajax
        },

        inserisciDocente:function(){
            if(document.getElementById("nome_docente").value === "" || document.getElementById("cognome_docente").value === "" ){
                alert("Compila tutti i campi");
                return;
            }

                $.ajax({
                url: "docentiServlet",
                type: "POST",
                data: {
                    'nome': document.getElementById("nome_docente").value,
                    'cognome': document.getElementById("cognome_docente").value,
                    'action': "inserisciDocente"
                },

                success: function (response) {
                    document.getElementById("nome_docente").value = "";
                    document.getElementById("cognome_docente").value = "";
                    let data = JSON.parse(JSON.stringify(response));
                    alert(data.msg);
                }
            })//end ajax
        },

        inserisciCorso:function(){
            if(document.getElementById("titolo_corso").value === ""){
                alert("Inserisci il titolo del corso che vuoi inserire");
                return;
            }
            $.ajax({
                url: "corsiServlet",
                type: "POST",
                data: {
                    'corso': document.getElementById("titolo_corso").value,
                    'action': "inserisciCorso"
                },

                success: function (response) {
                    document.getElementById("titolo_corso").value = "";
                    let data = JSON.parse(JSON.stringify(response));
                    alert(data.msg);
                }
            })//end ajax
        },

        getDocentiAmm:function(){
            $.ajax({
                url: "docentiServlet",
                type: "POST",
                data: {
                    'action': "getDocenti"
                },

                success: function (response) {
                    let data = JSON.parse(JSON.stringify(response));

                    let selDocAmm = document.getElementById("selectDocenteAmm");
                    cleanSelect(selDocAmm);

                    if(!data.msg){  //se nella risposta non c'è msg, la query è andata a buon fine
                        //popolo il menu a tendina "selectCorso"

                        for(let element in data){
                            let optDocAmm = document.createElement("option");
                            optDocAmm.value = data[element].id_docente;
                            optDocAmm.innerText = data[element].nome+" "+data[element].cognome;
                            selDocAmm.append(optDocAmm);
                        }
                    }else{
                        alert(data.msg);
                    }
                }
            })//end ajax

        },

        associa:function(){
            $.ajax({
                url: "insegnaServlet",
                type: "POST",
                data: {
                    'corso': document.getElementById("selectCorsoAmm").value,
                    'docente': document.getElementById("selectDocenteAmm").value,
                    'action': "inserisciInsegna"
                },

                success: function (response) {
                    cleanSelect(document.getElementById("selectDocenteAmm"));
                    let data = JSON.parse(JSON.stringify(response));
                    alert(data.msg);
                }
            })//end ajax
        }
    }

});

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
   // let table_storico = document.getElementById("table-storico-utente");
    let row_i = table.rows.length;
    //table_storico.insertRow(row_i).innerHTML = table.rows[row];
    let row_new = table.insertRow(row_i);
    row_new.insertCell(0).innerHTML = row.cells[0].innerHTML;
    row_new.insertCell(1).innerHTML = row.cells[1].innerHTML;
    row_new.insertCell(2).innerHTML = row.cells[2].innerHTML;
    row_new.insertCell(3).innerHTML = row.cells[3].innerHTML;
    row_new.insertCell(4).innerHTML = row.cells[4].innerHTML;
    row_new.insertCell(5).innerHTML = row.cells[5].innerHTML;
}

function cleanSelect(select){
    if(select !== null)
        for(let i=select.options.length-1;i>0;i--){
            select.remove(i);
        }
}