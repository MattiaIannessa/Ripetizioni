package servlet;

import DAO.DAO;
import DAO.DocentiDAO;
import com.google.gson.Gson;
import model.Corso;
import model.Docente;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.ArrayList;

@WebServlet(name = "docentiServlet", value = "/docentiServlet")
public class DocentiServlet extends HttpServlet {

    public void init() {
        DAO.registerDriver();
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json;charset=UTF-8");

        Gson gson = new Gson();
        PrintWriter out = response.getWriter();
        String[] doc_arr;
        String docente;

        switch(request.getParameter("action")){
            case "getDocenti":

                ArrayList<Docente> queryResult = null;
                try {
                    String param = request.getParameter("id_corso");
                    if(param != null) {  //se nella richiesta c'è id_corso, il client vuole la lista dei docenti di un certo corso
                        queryResult = DocentiDAO.getDocenti(Integer.parseInt(param));      //eseguo la query per ricavare tutti i docenti della materia con id = param
                    }else{ //se non c'è param, restituisco tutti i docenti presenti nel db
                        //throw new SQLException();
                        queryResult = DocentiDAO.getDocenti();
                    }

                } catch (SQLException e) {
                    out.println(" { \"msg\": \"Query fallita\" }");
                }

                out.println(gson.toJson(queryResult));

                break;
            case "rimuoviDocente":
                int id_docente = Integer.parseInt(request.getParameter("docente"));

                try {
                    if(DocentiDAO.getDocenteFromID(id_docente) == null){
                        out.println(" { \"msg\": \"Il docente selezionato non esiste\" }");
                        break;
                    }
                    DocentiDAO.rimuoviDocente(id_docente);
                } catch (SQLException e) {
                    out.println(" { \"msg\": \"Query fallita\" }");
                }

                out.println(" { \"msg\": \"Docente eliminato con successo\" }");

                break;
            case "inserisciDocente":
                String nome = request.getParameter("nome");
                String cognome = request.getParameter("cognome");

                try {
                    if(DocentiDAO.getIdDocente(nome,cognome) != -1){
                        out.println(" { \"msg\": \"Il docente inserito esiste già\" }");
                        break;
                    }
                    DocentiDAO.inserisciDocente(nome, cognome);
                } catch (SQLException e) {
                    e.printStackTrace();
                    out.println(" { \"msg\": \"Inserimento fallito\" }");
                }

                out.println(" { \"msg\": \"Docente inserito con successo\" }");

                break;
            default:
                out.println(" { \"msg\": \"Invalid action\" }");
                out.flush();
                out.close();
        }
    }

    public void destroy() {
    }
}