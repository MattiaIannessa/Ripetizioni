package model;

public class Utente {
    private int id;
    private String nome;
    private String cognome;
    private String account;
    private String password;
    private String ruolo;

    public Utente(int id, String nome, String cognome, String account, String password, String ruolo) {
        this.id = id;
        this.nome = nome;
        this.cognome = cognome;
        this.account = account;
        this.password = password;
        this.ruolo = ruolo;
    }

    public int getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getCognome() {
        return cognome;
    }

    public String getAccount() {
        return account;
    }

    public String getPassword() {
        return password;
    }

    public String getRuolo() {
        return ruolo;
    }
}
