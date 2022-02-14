package servlet;

import DAO.DAO;
import DAO.LoginDAO;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

@WebServlet(name = "loginServlet", value = "/loginServlet")
public class LoginServlet extends HttpServlet {

    private HttpSession session = null;

    public void init() {
        DAO.registerDriver();
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        //Gson gson = new Gson();
        response.setContentType("application/json;charset=UTF-8");

        PrintWriter out = response.getWriter();
        session = request.getSession(false);

        switch(request.getParameter("action")){
            case "Login":
                if(request.getSession(false) != null){
                    out.println("{ \"msg\": \" Hai già eseguito il login, se vuoi cambiare utente effettua prima il logout\", \"role\": \"null\" }");
                    out.flush();
                    out.close();
                    break;
                }

                String username = request.getParameter("username");
                String password = request.getParameter("password");
                String role = "ospite";
                if(username != null)
                {
                    try{
                        role = LoginDAO.login(username,password);
                    }catch(SQLException exc){
                        out.println(exc);
                    }
                    if(role.equals("no_ut")){
                        out.println("{ \"msg\": \"Username o password errati\", \"role\": \"null\" }");
                    }else{
                        session = request.getSession();
                        session.setAttribute("userName", username);
                        session.setAttribute("userRole", role);
                        out.println("{ \"msg\": \"Login effettuato con successo\",\"role\": \" "+role+" \" }");
                    }
                    out.flush();
                    out.close();
                }
                break;

            case "GuestLogin":
                if(request.getSession(false) != null){
                    out.println("{ \"msg\": \" Hai già eseguito il login, se vuoi cambiare utente effettua prima il logout\" , \"role\": \"null\"}");
                    out.flush();
                    out.close();
                    break;
                }
                session = request.getSession();
                session.setAttribute("userRole", "ospite");
                out.println("{ \"msg\": \"Hai eseguito il login con il ruolo di ospite\", \"role\": \"ospite\"  }");
                out.flush();
                out.close();
                break;

            case "Logout":
                if(request.getSession(false) != null){
                    session.invalidate();
                    out.println(" { \"msg\": \"Logout effettuato con successo\" }");
                }else{
                    out.println(" { \"msg\": \"Nessuna sessione attiva\" }");
                }
                out.flush();
                out.close();

                break;
            default:
                out.println(" { \"msg\": \"Azione non valida\" }");
        }
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException{
        response.setContentType("application/json;charset=UTF-8");
        //Gson gson = new Gson();
        PrintWriter out = response.getWriter();
        switch(request.getParameter("action")){
            case "getSession":  //returns session data
                //String response;
                if(request.getSession(false) != null){

                    out.println("{ \"username\": \" "+session.getAttribute("userName") +" \", \"role\": \" "+session.getAttribute("userRole") +" \" }");
                }
                    //out.println(session.getAttribute("userName")+"|"+session.getAttribute("userRole"));
                else{
                    out.println("{\"username\": \"null\", \"role\": \"null\"}");
                }

                    //out.println("{ \"username\": \"null\", \"role\": \"null\" }");
                out.flush();
                out.close();
                break;
            default:
                out.println("invalid action");
                out.flush();
                out.close();
        }
    }

    public void destroy() {}

}
