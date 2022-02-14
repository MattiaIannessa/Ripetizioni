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
        switch(request.getParameter("action")){
            case "getDocenti":

                ArrayList<Docente> queryResult = null;
                try {
                    String param = request.getParameter("id_corso");
                    if(param != null) {  //se nella richiesta c'è id_corso, il client vuole la lista dei docenti di un certo corso
                        queryResult = DocentiDAO.getDocenti(Integer.parseInt(param));      //eseguo la query per ricavare tutti i docenti della materia con id = param
                    }else{
                        throw new SQLException();
                        //queryResult = DocentiDAO.getDocenti();
                    }

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

    public void destroy() {
    }
}