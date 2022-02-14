package DAO;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 *  This class contains all the methods used to access the database, in particular to execute queries concerning
 *  users' login.
 **/

public class LoginDAO {
    public static String login(String username, String password) throws SQLException {
        Connection conn = null;
        String role;

        try {
            conn = DAO.connect();

            Statement st = conn.createStatement();
            ResultSet res = st.executeQuery(" SELECT ruolo FROM utente WHERE username='" + username + "' AND password='" + password + "' ");
            if (res.next())
                role = res.getString("ruolo");
            else
                role = "no_ut";
        }finally{
            if(conn!=null)
                conn.close();
        }

        return role;
    }
}
