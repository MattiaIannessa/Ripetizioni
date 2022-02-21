package DAO;

import model.Corso;
import model.Docente;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

/**
 *  This class contains all the methods used to access the database, in particular to execute queries concerning teachers.
 **/

public class DocentiDAO {

    public static void inserisciDocente(String nome, String cognome) throws SQLException {

        try (Connection conn = DAO.connect()) {
            Statement st = conn.createStatement();
            st.executeUpdate("INSERT INTO `Docente` (`ID_DOCENTE`, `Nome`, `Cognome`) VALUES (NULL, '" + nome + "', '" + cognome + "');");
        }
    }

    public static int getIdDocente(String nome, String cognome) throws SQLException{
        Connection conn = null;
        int id = -1;

        try{
            conn = DAO.connect();

            Statement st = conn.createStatement();
            ResultSet res = st.executeQuery("SELECT ID_DOCENTE FROM docente WHERE nome='"+nome+"' AND cognome='"+cognome+"';");
            if(res.next())
                id = res.getInt("ID_DOCENTE");
        }finally{
            if(conn != null)
                conn.close();
        }

        return id;
    }

    public static Docente getDocenteFromID(int id) throws SQLException{
        Connection conn = null;
        Docente out = null;

        try{
            conn = DAO.connect();

            Statement st = conn.createStatement();
            ResultSet res = st.executeQuery("SELECT * FROM docente WHERE ID_DOCENTE="+id+" ;");
            if(res.next())
                out = new Docente(id, res.getString("NOME"), res.getString("COGNOME"));
        }finally{
            if(conn != null)
                conn.close();
        }

        return out;
    }

    public static void rimuoviDocente(int id) throws SQLException{
        Connection conn = null;

        try{
            conn = DAO.connect();

            Statement st = conn.createStatement();
            st.executeUpdate("DELETE FROM docente WHERE id_docente="+id+";");
        }finally{
            if(conn != null)
                conn.close();
        }
    }

    //restituisce i docenti che insegnano il corso con id = param
    public static ArrayList<Docente> getDocenti(int param) throws SQLException {
        ArrayList<Docente> out = new ArrayList<>();

        try (Connection conn = DAO.connect()) {

            Statement st = conn.createStatement();
            ResultSet rs = st.executeQuery("SELECT docente.ID_DOCENTE, NOME, COGNOME FROM docente JOIN insegna i on docente.ID_DOCENTE = i.ID_DOCENTE " +
                                               "WHERE ID_CORSO = "+param+" ");
            while (rs.next()) {
                out.add(new Docente(rs.getInt("ID_DOCENTE"), rs.getString("NOME"), rs.getString("COGNOME")));
            }
        }

        return out;
    }

    public static ArrayList<Docente> getDocenti() throws SQLException {
        ArrayList<Docente> out = new ArrayList<>();

        try (Connection conn = DAO.connect()) {

            Statement st = conn.createStatement();
            ResultSet rs = st.executeQuery("SELECT * FROM docente ");
            while (rs.next()) {
                out.add(new Docente(rs.getInt("ID_DOCENTE"), rs.getString("NOME"), rs.getString("COGNOME")));
            }
        }

        return out;
    }
}
