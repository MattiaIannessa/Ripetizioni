package model;

public class Corso {

    private int ID_CORSO;
    private String titolo;

    public Corso(int ID_CORSO, String titolo) {
        this.ID_CORSO = ID_CORSO;
        this.titolo = titolo;
    }

    public int getID_CORSO() {
        return ID_CORSO;
    }

    public String getTitolo() {
        return titolo;
    }

    public void setID_CORSO(int ID_CORSO) {
        this.ID_CORSO = ID_CORSO;
    }

    public void setTitolo(String titolo) {
        this.titolo = titolo;
    }
}
