package model;

public class Prenotazione {
    /* Corso, utente e docente, che nel db sono interi, qui sono stringhe, in modo da poter usare questa classe per
     * conservare prenotazioni con gli id numerici o con i valori testuali.
     * */
    private int id_prenotazione;
    private String corso;
    private String utente;
    private String docente;
    private String giorno;
    private String ora;
    private String stato;

    public Prenotazione(int id_prenotazione, String corso, String utente, String docente, String giorno, String ora, String stato) {
        this.id_prenotazione = id_prenotazione;
        this.corso = corso;
        this.utente = utente;
        this.docente = docente;
        this.giorno = giorno;
        this.ora = ora;
        this.stato = stato;
    }

    public String getCorso() {
        return corso;
    }

    public String getUtente() {
        return utente;
    }

    public String getDocente() {
        return docente;
    }

    public String getGiorno() {
        return giorno;
    }

    public String getOra() {
        return ora;
    }

    public String getStato() {
        return stato;
    }

    public void setCorso(String corso) {
        this.corso = corso;
    }

    public void setUtente(String utente) {
        this.utente = utente;
    }

    public void setDocente(String docente) {
        this.docente = docente;
    }

    public void setGiorno(String giorno) {
        this.giorno = giorno;
    }

    public void setOra(String ora) {
        this.ora = ora;
    }

    public void setStato(String stato) {
        this.stato = stato;
    }

    @Override
    public String toString() {
        return "Prenotazione{" +
                "corso='" + corso + '\'' +
                ", utente='" + utente + '\'' +
                ", docente='" + docente + '\'' +
                ", giorno='" + giorno + '\'' +
                ", ora='" + ora + '\'' +
                ", stato='" + stato + '\'' +
                '}';
    }
}
