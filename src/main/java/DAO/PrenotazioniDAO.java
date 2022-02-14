package DAO;

import model.Corso;
import model.Docente;
import model.Prenotazione;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
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
                out.add(new Prenotazione(rs.getString("ID_CORSO"), rs.getString("ID_UTENTE"),
                        rs.getString("ID_DOCENTE"), rs.getString("GIORNO"),
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
                out.add(new Prenotazione(rs.getString("ID_CORSO"), rs.getString("ID_UTENTE"),
                        rs.getString("ID_DOCENTE"), rs.getString("GIORNO"),
                        rs.getString("ORA"), rs.getString("STATO")));
            }
        }

        return out;
    }

    public static void prenota(int id_corso, String username, int id_docente, String giorno, String ora) throws SQLException {
        try (Connection conn = DAO.connect()) {

            int id_utente = UtentiDAO.getIdUtente(username);

            Statement st = conn.createStatement();
            st.executeUpdate("INSERT INTO prenotazioni (ID_CORSO, ID_UTENTE, ID_DOCENTE, GIORNO, ORA, STATO) " +
                                                " VALUES ("+id_corso+","+id_utente+","+id_docente+",'"+giorno+"','"+ora+"','Attiva' )" );

            }
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

                out.add(new Prenotazione(corsoStr, rs.getString("ID_UTENTE"),
                        docenteStr, rs.getString("GIORNO"),
                        rs.getString("ORA"), rs.getString("STATO")));
            }
        }
        return out;
    }
}
