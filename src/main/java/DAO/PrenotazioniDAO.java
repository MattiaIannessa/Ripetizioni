package DAO;

import model.Docente;
import model.Prenotazione;

import java.sql.*;
import java.util.ArrayList;

/**
 *  This class contains all the methods used to access the database, in particular to execute queries concerning
 *  bookings.
 **/

public class PrenotazioniDAO {
    public static ArrayList<Prenotazione> getPrenotazioni() throws SQLException {

        ArrayList<Prenotazione> out = new ArrayList<>();

        try (Connection conn = DAO.connect()) {

            Statement st = conn.createStatement();
            ResultSet rs = st.executeQuery("SELECT * FROM prenotazioni");
            while (rs.next()) {
                String utente = UtentiDAO.getUtenteByID(rs.getString("ID_UTENTE"));
                Docente docente = DocentiDAO.getDocenteFromID(rs.getInt("ID_DOCENTE"));
                String corso = CorsiDAO.getCorsoByID(rs.getInt("ID_CORSO"));

                out.add(new Prenotazione(rs.getInt("ID_PRENOTAZIONE"), corso, utente,
                        docente.getNome()+" "+docente.getCognome(), rs.getString("GIORNO"),
                        rs.getString("ORA"), rs.getString("STATO")));
            }

        }

        return out;
    }

    /**restituisce le prenotazioni del docente con id = id_docente**/
    public static ArrayList<Prenotazione> getPrenotazioniDocente(int id_docente) throws SQLException {

        ArrayList<Prenotazione> out = new ArrayList<>();

        try (Connection conn = DAO.connect()) {

            Statement st = conn.createStatement();
            ResultSet rs = st.executeQuery("SELECT * FROM prenotazioni WHERE ID_DOCENTE = "+id_docente+" AND STATO = 'Attiva'");
            while (rs.next()) {
                out.add(new Prenotazione(rs.getInt("ID_PRENOTAZIONE"), rs.getString("ID_CORSO"), rs.getString("ID_UTENTE"),
                        rs.getString("ID_DOCENTE"), rs.getString("GIORNO"),
                        rs.getString("ORA"), rs.getString("STATO")));
            }
        }

        return out;
    }

    public static int prenota(int id_corso, String username, int id_docente, String giorno, String ora) throws SQLException {

        int out = -1;
        try (Connection conn = DAO.connect()) {

            int id_utente = UtentiDAO.getIdUtente(username);

            String sql = "INSERT INTO prenotazioni (ID_CORSO, ID_UTENTE, ID_DOCENTE, GIORNO, ORA, STATO) " +
                    " VALUES ("+id_corso+","+id_utente+","+id_docente+",'"+giorno+"','"+ora+"','Attiva' )";

            PreparedStatement st = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            st.executeUpdate();
            ResultSet res = st.getGeneratedKeys();

            if(res.next()){
                if(res.next())
                    out = res.getInt(1);
            }
        }
        return out;
    }

    /**restituisce le prenotazioni dell'utente con username = username**/
    public static ArrayList<Prenotazione> getPrenotazioniUtente(String username) throws SQLException {
        ArrayList<Prenotazione> out = new ArrayList<>();
        int id_utente = UtentiDAO.getIdUtente(username);

        try (Connection conn = DAO.connect()) {

            Statement st = conn.createStatement();
            ResultSet rs = st.executeQuery("SELECT * FROM prenotazioni WHERE ID_UTENTE = "+id_utente+"");

            /* invio la risposta con id_corso e id_docente già sostituiti con titolo e nome, cognome del docente
             * per semplificarne la visualizzazione
             */
            while (rs.next()) {

                //ricavo i dati in base agli id
                Docente docente = DocentiDAO.getDocenteFromID(rs.getInt("ID_DOCENTE"));
                String docenteStr = docente.getNome()+" "+docente.getCognome();
                String corsoStr = CorsiDAO.getCorsoByID(rs.getInt("ID_CORSO"));

                out.add(new Prenotazione(rs.getInt("ID_PRENOTAZIONE"), corsoStr, rs.getString("ID_UTENTE"),
                        docenteStr, rs.getString("GIORNO"),
                        rs.getString("ORA"), rs.getString("STATO")));
            }
        }
        return out;
    }

    public static void eliminaPrenotazione(int id_prenotazione) throws SQLException{
        /*int id_utente = UtentiDAO.getIdUtente(username);
        int id_corso = CorsiDAO.getIdCorso(corso);
        int id_docente = DocentiDAO.getIdDocente(nomeDocente,cognomeDocente);*/

        try (Connection conn = DAO.connect()) {

            Statement st = conn.createStatement();
            int rs = st.executeUpdate("DELETE FROM prenotazioni WHERE ID_PRENOTAZIONE="+id_prenotazione+" ");

            if(rs!=1)
                throw new SQLException("Query fallita");
        }
    }

    public static void disdiciPrenotazione(int id_prenotazione) throws SQLException{
        /*int id_utente = UtentiDAO.getIdUtente(username);
        int id_corso = CorsiDAO.getIdCorso(corso);
        int id_docente = DocentiDAO.getIdDocente(nomeDocente,cognomeDocente);*/

        try (Connection conn = DAO.connect()) {

            Statement st = conn.createStatement();
            int rs = st.executeUpdate(" UPDATE prenotazioni SET STATO = 'Disdetta' WHERE ID_PRENOTAZIONE="+id_prenotazione+" ");

            if(rs!=1)
                throw new SQLException("Query fallita");
        }
    }

    public static void segnaComeEffettuataPrenotazione(int id_prenotazione) throws SQLException {
        try (Connection conn = DAO.connect()) {

            Statement st = conn.createStatement();
            int rs = st.executeUpdate(" UPDATE prenotazioni SET STATO = 'Effettuata' WHERE ID_PRENOTAZIONE="+id_prenotazione+" ");

            if(rs!=1)
                throw new SQLException("Query fallita");
        }
    }
}
