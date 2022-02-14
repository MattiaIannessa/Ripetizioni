package model;

public class Docente {
    private int id_docente;
    private String nome;
    private String cognome;

    public Docente(int id_docente, String nome, String cognome) {
        this.id_docente = id_docente;
        this.nome = nome;
        this.cognome = cognome;
    }

    public int getId_docente() {
        return id_docente;
    }

    public String getNome() {
        return nome;
    }

    public String getCognome() {
        return cognome;
    }

    public void setId_docente(int id_docente) {
        this.id_docente = id_docente;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setCognome(String cognome) {
        this.cognome = cognome;
    }
}
