package DAO;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DAO {

    private static final String url1 = "jdbc:mysql://localhost:3306/ripetizioni";
    private static final String user = "root";
    private static final String password = "";

    public static void registerDriver() {
        try {
            DriverManager.registerDriver(new com.mysql.jdbc.Driver());
            System.out.println("Driver correttamente registrato");
        } catch (SQLException e) {
            System.out.println("Errore: " + e.getMessage());
        }
    }

    public static Connection connect() throws SQLException {
        return DriverManager.getConnection(url1, user, password);
    }
}
