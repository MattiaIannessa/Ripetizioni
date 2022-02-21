package servlet;

import DAO.CorsiDAO;
import DAO.DocentiDAO;
import DAO.InsegnaDAO;
import com.google.gson.Gson;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

@WebServlet(name = "insegnaServlet", value = "/insegnaServlet")
public class InsegnaServlet extends HttpServlet {

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        Gson gson = new Gson();
        PrintWriter out = response.getWriter();
        String corso;
        String[] docente;
        switch(request.getParameter("action")){
            case "rimuoviInsegna":
                corso = request.getParameter("materia");
                docente = request.getParameter("docente").split(" ");
                try {
                    int id_corso = CorsiDAO.getIdCorso(corso);
                    int id_docente = DocentiDAO.getIdDocente(docente[0], docente[1]);
                    InsegnaDAO.rimuoviInsegna(id_docente, id_corso);
                } catch (SQLException e) {
                    out.println(" { \"msg\": \"Query fallita\" }");
                }

                out.println(" { \"msg\": \"OK\" }");

                break;

            case "inserisciInsegna":
                int id_corso = Integer.parseInt(request.getParameter("corso"));
                int id_docente = Integer.parseInt(request.getParameter("docente"));

                try {
                    InsegnaDAO.inserisciInsegna(id_docente, id_corso);
                } catch (SQLException e) {
                    out.println(" { \"msg\": \"Associazione fallita\" }");
                }

                out.println(" { \"msg\": \"Associazione inserita con successo\" }");

                break;
            default:
                out.println(" { \"msg\": \"Invalid action\" }");
                out.flush();
                out.close();
        }
    }
}
