package servlet;

import DAO.CorsiDAO;
import DAO.DAO;
import com.google.gson.Gson;
import model.Corso;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.ArrayList;

@WebServlet(name = "corsiServlet", value = "/corsiServlet")
public class CorsiServlet extends HttpServlet {

    private HttpSession session = null;

    public void init() {
        DAO.registerDriver();
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        Gson gson = new Gson();
        PrintWriter out = response.getWriter();
        String corso;
        switch(request.getParameter("action")){
            case "rimuoviCorso":
                corso = request.getParameter("corso");

                try {
                    int id_corso = CorsiDAO.getIdCorso(corso);
                    CorsiDAO.rimuoviCorso(id_corso);
                } catch (SQLException e) {
                    out.println(" { \"msg\": \"Rimozione fallita\" }");
                }

                out.println(" { \"msg\": \"Corso rimosso con successo\" }");

                break;

            case "inserisciCorso":
                corso = request.getParameter("corso");
                try {
                    if(CorsiDAO.getIdCorso(corso)!=-1){
                        out.println(" { \"msg\": \"Un corso con un titolo uguale esiste già\" }");
                        break;
                    }else{
                        CorsiDAO.inserisciCorso(corso);
                    }

                } catch (SQLException e) {
                    out.println(" { \"msg\": \"Inserimento fallito\" }");
                }

                out.println(" { \"msg\": \"Corso inserito con successo\" }");

                break;
            default:
                out.println(" { \"msg\": \"Invalid action\" }");
                out.flush();
                out.close();
        }
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException{
        response.setContentType("application/json;charset=UTF-8");
        Gson gson = new Gson();
        PrintWriter out = response.getWriter();
        switch(request.getParameter("action")){
            case "getCorsi":

                ArrayList<Corso> queryResult = null;
                try {
                    queryResult = CorsiDAO.getCorsi();      //eseguo la query per ricavare tutti i corsi
                } catch (SQLException e) {
                    out.println(" { \"msg\": \"Query fallita\" }");
                }

                out.println(gson.toJson(queryResult));

                break;
            default:
                out.println(" { \"msg\": \"Invalid action\" }");
                out.flush();
                out.close();
        }
    }

    public void destroy() {}

}
