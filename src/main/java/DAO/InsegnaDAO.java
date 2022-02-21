package DAO;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

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
}
