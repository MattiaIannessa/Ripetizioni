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
            if(this.role !== null)
                if(this.role.localeCompare("Amministratore") ||this.role.localeCompare("Cliente")){
                    //document.getElementById("div-prenotazioni-utente").style.visibility = "hidden";
                    this.getPrenotazioniUtente();
                    return true;
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
                    let sele = document.getElementById("selectCorso");
                    if(sele !== null)
                        for(let i=sele.options.length-1;i>0;i--){
                            sele.remove(i);
                        }

                    if(!data.msg){  //se nella risposta non c'è msg, la query è andata a buon fine
                        //popolo il menu a tendina "selectCorso"
                        let select = document.getElementById("selectCorso");
                        for(let element in data){
                            let opt = document.createElement("option");
                            opt.value = data[element].ID_CORSO;
                            opt.innerText = data[element].titolo;
                            if(select !== null)
                                select.append(opt);
                        }
                    }else{
                        alert(data.msg);
                    }
                }
            })//end ajax
        },

        //gestione del menu a tendina "selectDocente"
        getDocenti:function(){

            //svuoto il menu a tendina "selectDocente"
            let sele = document.getElementById("selectDocente");
            for(let i=sele.options.length-1;i>0;i--){
                sele.remove(i);
            }

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

        //recupero le prenotazioni dell'utente loggato
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
                        if(table !== null)
                            for(let i=table.rows.length-1;i>0;i--){
                                table.deleteRow(i);
                            }

                        let data = JSON.parse(JSON.stringify(response));

                        if(!data.msg){  //se nella risposta non c'è msg, la query è andata a buon fine
                            let row_i = 1;

                            if(data.length !== 0)
                                document.getElementById("div-prenotazioni-utente").style.visibility = "visible";

                            data.forEach(row_element => {
                                let row = table.insertRow(row_i);

                                row.insertCell(0).innerHTML = row_element.giorno;
                                row.insertCell(1).innerHTML = row_element.ora;
                                row.insertCell(2).innerHTML = row_element.docente;
                                row.insertCell(3).innerHTML = row_element.corso;
                                row.insertCell(4).innerHTML = row_element.stato;
                                let elimina_cell = row.insertCell(5);
                                elimina_cell.innerHTML = "Elimina";
                                elimina_cell.addEventListener("click", eliminaCellListener);
                                if(row_element.stato === "Attiva")
                                    row.insertCell(6).innerHTML = "Segna come effettuata";

                                row_i++;
                            });

                            //  document.getElementById("div-prenotazioni-utente").style.visibility = "visible";
                        }else{
                            alert(data.msg);
                        }
                    }
                })//end ajax
            //}
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

/* event listener per le celle della tabella degli slot */
function eliminaCellListener(){
    let table = document.getElementById("table-prenotazioni-utente");

    let row = ($(this).parent().parent().children().index($(this).parent()));

    //la funzione in dao e servlet è da implementare
    $.ajax({
        url: "prenotazioniServlet",
        type: "POST",
        data: {
            'action': "rimuoviPrenotazione",
            'giorno': table.rows[row].cells[0].innerHTML,
            'ora': table.rows[row].cells[1].innerHTML,
            'docente': table.rows[row].cells[2].innerHTML,
            'corso': table.rows[row].cells[3].innerHTML,
            'stato': table.rows[row].cells[4].innerHTML
        },

        success: function(response) {
            let data = JSON.parse(JSON.stringify(response));

            if(data.msg === 'OK'){
                table.rows[row].remove();
            }else{
                alert(data.msg);
            }
        }
    })//end ajax
}