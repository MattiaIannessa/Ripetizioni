let app = new Vue ({

    el: '#page',
    data: {
        username: null,
        role: null,
        link: "loginServlet"
    },

    mounted(){
        //todo: change this comment, checking what getSession does
        //when app is loaded, check if user is logged and get courses titles.
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

        //return true if user is authenticated
        isAuth:function(){
            if(this.role !== null) {
                if (this.role.localeCompare("Amministratore") || this.role.localeCompare("Cliente")) {
                    this.getPrenotazioniUtente();
                    return true;
                }
            }
            return false;
        },

        //return true if user is logged as admin
        isAmmAuth:function(){

            if(this.role !== null) {
                if(this.role.localeCompare("Amministratore")===0) {
                    this.getPrenotazioni();
                    return true;
                }
            }
            return false;
        },

        //get session info from server. Saves user's role
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
                    app.setRole(null);
                }
            })//end ajax
        },

        //login with username and password
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

        //login as a guest
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
        },

        // Get courses titles from server
        getCorsi:function(){
            $.ajax({
                url: "corsiServlet",
                type: "GET",
                data: {
                    'action': "getCorsi"
                },

                success: function (response) {
                    let data = JSON.parse(JSON.stringify(response));
                    let select = document.getElementById("selectCorso");
                    let selCorsiAmm = document.getElementById("selectCorsoAmm");


                    //remove all elements from 'selectCorso'
                    cleanSelect(select);

                    /* If the logged user is admin, remove all elements from 'selectCorsoAmm' too.
                    * */
                    if(app!=null && app.isAmmAuth()){
                        cleanSelect(selCorsiAmm);
                    }

                    if(!data['msg']){  // If in the response there's not 'msg', the query was successful
                        // Fill 'selectCorso' and, if logged user is admin, 'selectCorsoAmm too.
                        let opt;
                        for(let element in data){
                            opt  = document.createElement("option");
                            opt.value = data[element]['ID_CORSO'];
                            opt.innerText = data[element]['titolo'];
                            if(select !== null)
                                select.append(opt);

                            if(app.isAmmAuth() && selCorsiAmm !== null){
                                opt = document.createElement("option");
                                opt.value = data[element]['ID_CORSO'];
                                opt.innerText = data[element]['titolo'];
                                selCorsiAmm.append(opt);
                            }
                        }
                    }else{
                        alert(data['msg']);
                    }
                    if(app.isAmmAuth() && document.getElementById("selectDocenteAmm") !== null){
                        app.getDocentiAmm();
                        app.getAssocAmm();
                    }
                }
            })//end ajax
        },

        // Same operations of getCorsi
        getDocenti:function(){
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

                    if(!data['msg']){  //se nella risposta non c'è msg, la query è andata a buon fine
                        //popolo il menu a tendina "selectCorso"
                        let select = document.getElementById("selectDocente");
                        fillDocentiSelect(select,data);
                    }else{
                        alert(data['msg']);
                    }
                }
            })//end ajax
        },

        // Get active bookings of selected teacher and fill free slots table
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

                    if(!data['msg']){
                        let table = document.getElementById("slotTable");

                        let rows = table.rows.length;
                        let cols = table.rows[0].cells.length;

                        // Creation of the cells, all free
                        for(let r=1;r<rows;r++){
                            for(let c=1;c<cols;c++){
                                table.rows[r].cells[c].innerHTML = "LIBERO";
                                table.rows[r].cells[c].style.backgroundColor = "green";

                                // Add to all cells an actionListener
                                table.rows[r].cells[c].addEventListener("click", cellListener);
                            }
                        }

                        // For each booking, set the cell as occupied
                        data.forEach(element => {
                            let c = document.getElementById(element['giorno']).cellIndex;
                            let r = document.getElementById(element['ora']).rowIndex;

                            table.rows[r].cells[c].innerHTML = "OCCUPATO";
                            table.rows[r].cells[c].style.backgroundColor = "red";
                        });
                    }else{
                        alert(data['msg']);
                    }
                }
            })//end ajax
        },

        /* Get all the user's bookings from server and visualize them in 'table-prenotazioni-utente' and 'table-storico-utente'
         * tables.
         */
        getPrenotazioniUtente:function(){
                let self = this;
                $.ajax({
                    url: "prenotazioniServlet",
                    type: "GET",
                    data: {
                        'action': "getPrenotazioniByUsername",
                        'username': self.username
                    },

                    success: function (response) {
                        let table = document.getElementById("table-prenotazioni-utente");
                        let table_storico = document.getElementById("table-storico-utente");
                        cleanTable(table);
                        cleanTable(table_storico);

                        let data = JSON.parse(JSON.stringify(response));

                        if (!data['msg']) {
                            let row_i_table = 1;
                            let row_i_storico = 1;

                            if (data.length !== 0)
                                document.getElementById("div-prenotazioni-utente").style.visibility = "visible";

                            let row_table;
                            data.forEach(row_element => {
                                if (row_element['stato'] === "Attiva") { // Insert into 'table-prenotazioni-utente' table
                                    table = document.getElementById("table-prenotazioni-utente");
                                    row_table = table.insertRow(row_i_table);

                                } else { // Insert into "table-storico-utente" table
                                    table = document.getElementById("table-storico-utente");
                                    row_table = table.insertRow(row_i_storico);
                                    row_i_storico++;
                                }

                                fillBookingRow(row_table, row_element);

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

                    if(!data['msg']){  //se nella risposta non c'è msg, la query è andata a buon fine
                        let row_i = 1;

                        if(data.length !== 0)
                            document.getElementById("table-storico-amm").style.visibility = "visible";

                        let row_table;
                        data.forEach(row_element => {
                            table = document.getElementById("table-storico-amm");
                            row_table = table.insertRow(row_i);
                            fillStoricoRowAmm(row_table,row_element);
                            row_i++;
                        });
                    }else{
                        alert(data['msg']);
                    }
                }
            })//end ajax
        },

        inserisciDocente:function(){
            let nome = document.getElementById("nome_docente").value;
            let cognome = document.getElementById("cognome_docente").value;
            if(nome === "" || cognome === "" ){
                alert("Compila tutti i campi");
                return;
            }

            $.ajax({
                url: "docentiServlet",
                type: "POST",
                data: {
                    'nome': nome,
                    'cognome': cognome,
                    'action': "inserisciDocente"
                },

                success: function (response) {
                    //update select
                    app.getDocentiAmm();
                    app.getDocenti();

                    document.getElementById("nome_docente").value = "";
                    document.getElementById("cognome_docente").value = "";
                    let data = JSON.parse(JSON.stringify(response));
                    alert(data['msg']);
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
                    //update menù a tendina
                    app.getCorsi();
                    document.getElementById("titolo_corso").value = "";
                    let data = JSON.parse(JSON.stringify(response));
                    alert(data['msg']);
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

                    if(!data['msg']){
                        fillDocentiSelect(selDocAmm,data);
                    }else{
                        alert(data['msg']);
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
                    app.getAssocAmm();
                    let data = JSON.parse(JSON.stringify(response));
                    alert(data['msg']);
                }
            })//end ajax
        },

        eliminaCorso:function(){
            if(document.getElementById("selectCorsoAmm").value === "Nessun corso"){
                alert("Selezionare il corso da eliminare");
                return;
            }
            $.ajax({
                url: "corsiServlet",
                type: "POST",
                data: {
                    'corso': document.getElementById("selectCorsoAmm").value,
                    'action': "rimuoviCorso"
                },

                success: function (response) {
                    app.getCorsi();
                    app.getAssocAmm(); //update del menù a tendina delle associazioni
                    let data = JSON.parse(JSON.stringify(response));
                    alert(data['msg']);
                }
            })//end ajax
        },

        eliminaDocente:function(){
            if(document.getElementById("selectDocenteAmm").value === "Nessun docente"){
                alert("Selezionare il docente da eliminare");
                return;
            }
            $.ajax({
                url: "docentiServlet",
                type: "POST",
                data: {
                    'docente': document.getElementById("selectDocenteAmm").value,
                    'action': "rimuoviDocente"
                },

                success: function (response) {
                    app.getDocentiAmm();
                    app.getAssocAmm(); //update del menù a tendina delle associazioni
                    let data = JSON.parse(JSON.stringify(response));
                    alert(data['msg']);
                }
            })//end ajax
        },

        getAssocAmm:function(){
            let sel = document.getElementById("selectAssocAmm");
            cleanSelect(sel);

            $.ajax({
                url: "insegnaServlet",
                type: "GET",
                data: {
                    'action': "getInsegna"
                },

                success: function (response) {
                    let data = JSON.parse(JSON.stringify(response));

                    if(!data['msg']){
                        for(let element in data){
                            let opt = document.createElement("option");
                            opt.innerText = data[element]['docente'] +' - '+ data[element]['corso'];
                            sel.append(opt);
                        }
                    }else{
                        alert(data['msg']);
                    }
                }
            })//end ajax
        },

        eliminaAssoc:function(){
            if(document.getElementById("selectAssocAmm").value === "Nessuna associazione"){
                alert("Selezionare la associazione da eliminare");
                return;
            }
            $.ajax({
                url: "insegnaServlet",
                type: "POST",
                data: {
                    'assoc': document.getElementById("selectAssocAmm").value,
                    'action': "rimuoviInsegna"
                },

                success: function (response) {
                    app.getAssocAmm(); //update del menù a tendina delle associazioni
                    let data = JSON.parse(JSON.stringify(response));
                    alert(data['msg']);
                }
            })//end ajax
        }
    }
});