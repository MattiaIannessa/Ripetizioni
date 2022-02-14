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
        }finally{
            if(conn != null)
                conn.close();
        }

        return out;
    }
}
