package DAO;

import model.Insegna;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

public class InsegnaDAO {
    public static void rimuoviInsegna(int id_docente, int id_corso) throws SQLException {

        try (Connection conn = DAO.connect()) {
            Statement st = conn.createStatement();
            st.executeUpdate("DELETE FROM insegna WHERE ID_DOCENTE=" + id_docente + " AND ID_CORSO=" + id_corso + ";");
        }
    }

    public static void inserisciInsegna(int id_docente, int id_corso) throws SQLException {
        System.out.println("inserisciInsegna DAO");
        try (Connection conn = DAO.connect()) {
            Statement st = conn.createStatement();
            st.executeUpdate("INSERT INTO insegna (`ID_DOCENTE`, `ID_CORSO`) VALUES ('" + id_docente + "', '" + id_corso + "');");
        }
    }

    public static ArrayList<Insegna> getInsegna() throws SQLException {
        ArrayList<Insegna> out = new ArrayList<>();

        try (Connection conn = DAO.connect()) {
            Statement st = conn.createStatement();
            ResultSet res = st.executeQuery(" SELECT c.TITOLO,d.NOME,d.COGNOME FROM insegna JOIN corso c on insegna.ID_CORSO = c.ID_CORSO join docente d on d.ID_DOCENTE = insegna.ID_DOCENTE; ");
            while(res.next()){
                out.add(new Insegna(res.getString("NOME")+" "+res.getString("COGNOME"), res.getString("TITOLO")));
            }
        }
        return out;
    }
}
