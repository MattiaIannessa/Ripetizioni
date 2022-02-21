package DAO;

import model.Corso;
import model.Docente;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

public class CorsiDAO {

    public static ArrayList<Corso> getCorsi() throws SQLException {
        ArrayList<Corso> out = new ArrayList<>();

        try (Connection conn = DAO.connect()) {

            Statement st = conn.createStatement();
            ResultSet rs = st.executeQuery("SELECT * FROM corso");
            while (rs.next()) {
                out.add(new Corso(rs.getInt("ID_CORSO"), rs.getString("TITOLO")));
            }

        }

        return out;
    }

    public static String getCorsoByID(int id) throws SQLException {
        Connection conn = null;
        String out = null;

        try{
            conn = DAO.connect();

            Statement st = conn.createStatement();
            ResultSet res = st.executeQuery("SELECT * FROM corso WHERE ID_CORSO="+id+" ;");
            if(res.next())
                out = res.getString("TITOLO");
        }catch(Exception e){
            return null;
        }finally{
            if(conn != null)
                conn.close();
        }

        return out;
    }

    public static int getIdCorso(String titolo) throws SQLException {
        int out = -1;

        try (Connection conn = DAO.connect()) {
            Statement st = conn.createStatement();
            ResultSet res = st.executeQuery("SELECT ID_CORSO FROM corso WHERE TITOLO='"+titolo+"' ;");
            if(res.next()){
                out = res.getInt("ID_CORSO");
            }


        }
        return out;
    }

    public static void rimuoviCorso(int id) throws SQLException{

        try (Connection conn = DAO.connect()) {
            Statement st = conn.createStatement();
            st.executeUpdate("DELETE FROM corso WHERE ID_CORSO=" + id + ";");
        }
    }

    public static void inserisciCorso(String titolo) throws SQLException {
        try (Connection conn = DAO.connect()) {
            Statement st = conn.createStatement();
            st.executeUpdate("INSERT INTO corso (`ID_CORSO`, `TITOLO`) VALUES (NULL, '" + titolo + "');");
        }
    }
}
