package servlet;

import DAO.DocentiDAO;
import DAO.PrenotazioniDAO;
import com.google.gson.Gson;
import model.Docente;
import model.Prenotazione;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.ArrayList;

@WebServlet(name = "prenotazioniServlet", value = "/prenotazioniServlet")
public class PrenotazioniServlet extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json;charset=UTF-8");

        Gson gson = new Gson();
        PrintWriter out = response.getWriter();
        ArrayList<Prenotazione> queryResult;

        switch(request.getParameter("action")){
            case "getPrenotazioniByIDDocente":
                queryResult = null;
                try {
                    queryResult = PrenotazioniDAO.getPrenotazioniDocente(Integer.parseInt(request.getParameter("id_docente")));      //eseguo la query per ricavare tutte le prenotazioni del docente con id_docente = param
                } catch (SQLException e) {
                    out.println(" { \"msg\": \"Query fallita\" }");
                }

                out.println(gson.toJson(queryResult));
                break;
            case "getPrenotazioniByUsername":
                queryResult = null;
                try {
                    String us = (String) request.getSession(false).getAttribute("userName");
                    queryResult = PrenotazioniDAO.getPrenotazioniUtente(us);
                } catch (SQLException e) {
                    out.println(" { \"msg\": \"Query fallita\" }");
                }

                out.println(gson.toJson(queryResult));
                break;
        }
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json;charset=UTF-8");

        Gson gson = new Gson();
        PrintWriter out = response.getWriter();
        switch (request.getParameter("action")) {

            case "doPrenota":
                try {
                    int id_corso = Integer.parseInt(request.getParameter("id_corso"));
                    int id_docente = Integer.parseInt(request.getParameter("id_docente"));
                    String giorno = request.getParameter("giorno");
                    String ora = request.getParameter("ora");

                    String role = (String) request.getSession(false).getAttribute("userRole");
                    if(!role.equals("Amministratore") && !role.equals("Cliente")  ) {
                        out.println(" { \"msg\": \"Non possiedi l'autorizzazione per questa operazione\" }");
                        break;
                    }
                    else{
                        String username = (String) request.getSession(false).getAttribute("userName");

                        PrenotazioniDAO.prenota(id_corso, username, id_docente, giorno,ora);
                    }


                } catch (SQLException e) {
                    e.printStackTrace();
                    out.println(" { \"msg\": \"Query fallita\" }");
                }

                out.println(" { \"msg\": \"OK\" }");
                break;
            default:
                out.println(" { \"msg\": \"Invalid action\" }");
                out.flush();
                out.close();
        }
    }

    public void destroy() {}
}
