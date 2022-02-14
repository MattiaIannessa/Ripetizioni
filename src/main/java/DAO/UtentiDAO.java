package DAO;

import model.Prenotazione;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

public class UtentiDAO {
    public static int getIdUtente(String username) throws SQLException {
        int id = -1;

        try (Connection conn = DAO.connect()) {

            Statement st = conn.createStatement();
            ResultSet rs = st.executeQuery("SELECT ID FROM utente WHERE USERNAME = '"+username+"' ");
            if(rs.next()){
                id = rs.getInt("ID");
            }
        }

        return id;
    }

}
