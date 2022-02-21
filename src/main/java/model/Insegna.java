package model;

public class Insegna {
    private final String docente;
    private final String corso;

    public Insegna(String id_docente, String id_corso) {
        this.docente = id_docente;
        this.corso = id_corso;
    }

    public String getDocente() {
        return docente;
    }

    public String getCorso() {
        return corso;
    }
}
