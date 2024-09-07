import { Payement } from "./Payement";

export class Eleve{
    id! : number;
    nom! : string;
    prenom! : string;
    dateNaissance! : Date;
    niveau! : string;
    classe! : string;
    prive! : boolean;
    transfere! : string;
    matricule! : string;
    prenomPere! : string;
    nomPere! : string;
    prenomMere! : string;
    nomMere! : string;
    tel1! : string;
    tel2! : string;
    photoPath! : string;
    photoName! : string;
    paiements: Payement[] = [];
}