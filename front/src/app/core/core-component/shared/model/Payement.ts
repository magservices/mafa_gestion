import { Eleve } from "./Eleve";
import { Mois } from "./Mois";

export class Payement{
   id! : number;
   anneeScolaire! : Date;
   fretIncription!:number;
   fretTotal!: number;
   fretMois! : Date;
   status!: string;
   eleve! : Eleve;
   mois: Mois[] = [];

}