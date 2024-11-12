import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {forkJoin, Observable} from 'rxjs';
import {Eleve} from "../model/Eleve";
import {environment, establishment} from "../../../../../environments/environment";
import {StudentPayment} from "../model/StudentPayment";
import {Establishment} from "../../../../admin/admin-component/shared/models/establishment";
import {catchError} from "rxjs/operators";
import * as XLSX from 'xlsx';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import { Router } from '@angular/router';
import { generateStudentId } from '../utilis/studentID';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private http: HttpClient,private router:Router) {
  }

  createStudent(eleveData: Eleve, photo: File): Observable<Eleve> {
    const formData: FormData = new FormData();
    formData.append('eleveData', JSON.stringify(eleveData));
    formData.append('photo', photo);

    const headers = new HttpHeaders({
      // Add any custom headers here if needed
    });

    return this.http.post<Eleve>(`${environment.apiUrl}/eleve/create`, formData, {headers});
  }


  updateStudent(eleveData: Eleve,id:number, photo: File): Observable<Eleve> {
    const formData: FormData = new FormData();
    formData.append('eleveData', JSON.stringify(eleveData));
    formData.append('photo', photo);

    const headers = new HttpHeaders({
      // Add any custom headers here if needed
    });

    return this.http.post<Eleve>(`${environment.apiUrl}/eleve/${id}`, formData, {headers});
  }
// Ajouter un paiement


  getAllStudent(): Observable<Eleve[]> {
    return this.http.get<Eleve[]>(`${environment.apiUrl}/eleve/establishment/${establishment.key}`);
  }


  getStudentByID(id: number): Observable<Eleve> {
    return this.http.get<Eleve>(`${environment.apiUrl}/eleve/${id}`);
  }
  getPayByID(id: number): Observable<StudentPayment> {
    return this.http.get<StudentPayment>(`${environment.apiUrl}/student_payment/${id}`);
  }

  updatePayment(payment: StudentPayment, id: number): Observable<StudentPayment> {
    return this.http.post<StudentPayment>(`${environment.apiUrl}/student_payment/${id}`,payment);
  }
  // Ajouter un paiement
  createPayment(payment: StudentPayment, registerStudentId: number): Observable<StudentPayment> {
    return this.http.post<StudentPayment>(`${environment.apiUrl}/student_payment/create`, {
      ...payment,
      register_student_id: registerStudentId
    });
  }

  

  // Récupérer tous les paiements
  getAllPayments(): Observable<StudentPayment[]> {
    return this.http.get<StudentPayment[]>(`${environment.apiUrl}/student_payment/establishment/${establishment.key}`);
  }

  // Méthode pour récupérer un établissement par ID
  getByName(name: string): Observable<Establishment> {
    return this.http.get<Establishment>(`${environment.apiUrl}/establishment/name/${name}`);
  }
  // Delete Eleve
  deleteEleve(id:number): Observable<any>{
    return this.http.delete<void>(`${environment.apiUrl}/eleve/${id}`);
  }
  // Delete Eleve Payement
  deletePay(id:number): Observable<any>{
    return this.http.delete<void>(`${environment.apiUrl}/student_payment/${id}`);
  } 
  

uploadFile(fileXlsx: File, establishment: string, transfere: string): Promise<boolean> {
  return this.readExcelFile(fileXlsx)
    .then((jsonData: any) => {
      const lyceeClasses = ['10èCG', '11èL', '11èSc', '11èSES','TSS', 'TSECO', 'TSEXP','TSE', 'TLL', 'TAL'];
      const allEleves: Eleve[] = [];
      
      // Parcours de chaque feuille dans le fichier Excel
      Object.keys(jsonData).forEach(sheetName => {
        const sheetData = jsonData[sheetName];

        // Transformer les données JSON de la feuille en objets de type Eleve
        const eleves: Eleve[] = sheetData.map((data: any) => {
          if (!data['NOM'] || data['NOM'].trim() === '' ||
          !data['PRENOMS'] || data['PRENOMS'].trim() === '' ||
          !data['N°MLE'] || data['N°MLE'].trim() === '' ||
          !data['CLASSE                23-24'] || data['CLASSE                23-24'].trim() === ''
        ) {
            return undefined; // Ignorer cette itération et passer à l'élément suivant
          }
          const eleve = new Eleve();
          eleve.nom = data['NOM'];
          eleve.prenom = data['PRENOMS'];
          eleve.matricule = data['N°MLE'];
          eleve.classe = data['CLASSE                23-24'];
          eleve.transfere = transfere;
          eleve.establishment = establishment;
          eleve.userKey = "high school";
          eleve.studentID = generateStudentId();
          eleve.nomPere = '';
          eleve.prenomPere = '';
          eleve.nomMere = '';
          eleve.prenomMere = '';
          eleve.tel1 = '00 00 00 00';
          eleve.tel2 = '';

          if (lyceeClasses.includes(eleve.classe)) {
            eleve.niveau = 'Lycee';
          } else {
            eleve.niveau = 'Professionnel';
          }

          return eleve;
        }).filter((eleve: Eleve | undefined) => eleve !== undefined);

        // Ajouter les élèves de la feuille courante au tableau global
        allEleves.push(...eleves);
      });
      // Création des élèves dans le système
      return forkJoin(
        allEleves.map((eleve) => {
          const photo = new File([''], ''); // Remplacer par la vraie photo si disponible
          return this.createStudent(eleve, photo);
        })
      ).toPromise(); // Convertit l'observable forkJoin en promesse
    })
    .then(() => {
      // Si toutes les requêtes réussissent
      this.router.navigateByUrl("/dash/student");
      return true; // Retourne true si toutes les opérations ont réussi
    })
    .catch((err) => {
      console.error('Erreur lors de l\'enregistrement des élèves:', err);
      return false; // Retourne false en cas d'erreur
    });
}










    readExcelFile(file: File): Promise<any> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e: any) => {
          const data = e.target.result;
          
          try {
            // Utilisez SheetJS pour convertir les données en JSON
            const workbook = XLSX.read(data, { type: 'binary' });
            
            // Récupérer toutes les feuilles du fichier Excel
            let allSheetsData: { [key: string]: any[] } = {};
            // Parcours de toutes les feuilles
            workbook.SheetNames.forEach(sheetName => {
              const sheet = workbook.Sheets[sheetName];
              //allSheetsData[sheetName] = XLSX.utils.sheet_to_json(sheet);
              allSheetsData[sheetName] = XLSX.utils.sheet_to_json(sheet, { range: 1 });
            });
    
            // Retourner les données JSON pour toutes les feuilles
            resolve(allSheetsData);
          } catch (error) {
            reject('Erreur lors de la lecture du fichier Excel : ' + error);
          }
        };
        
        reader.onerror = (error) => {
          reject('Erreur lors de la lecture du fichier : ' + error);
        };
    
        // Lire le fichier Excel en tant que binaire
        reader.readAsBinaryString(file);
      })
    }
 




    
    generatePdf(students: Eleve[], classe: string): void {
      if(students.length>0){
      const doc = new jsPDF();
      // Ajouter l'en-tête centré et stylisé
      const title = `La liste des élèves de la classe ${classe}`;
      const pageWidth = doc.internal.pageSize.width;  // Largeur de la page
      const titleWidth = doc.getTextWidth(title);  // Largeur du texte
      const x = (pageWidth - titleWidth) / 2;  // Calculer la position pour centrer le texte
      doc.setFontSize(18);
      doc.setTextColor(0, 102, 204);  // Changer la couleur du texte en bleu
      doc.setFont("helvetica", "bold");  // Utiliser une police en gras
      doc.text(title, x, 10);  // Ajouter l'en-tête centré
    
      // Préparer les données du tableau
      const headers = ['Prénom','Nom',  'Classe', 'Matricule'];
      const data = students.map(student => [
        student.prenom,
        student.nom,
        student.classe,
        student.matricule,
      ]);
    
      // Ajouter un tableau avec autoTable
      autoTable(doc, {
        head: [headers],
        body: data,
        startY: 20, // Positionner le tableau sous l'en-tête
        theme: 'grid',  // Style du tableau
        headStyles: {
          fillColor: [0, 102, 204],  // Couleur de fond des en-têtes (bleu)
          textColor: 255,  // Couleur du texte des en-têtes (blanc)
          fontStyle: 'bold',  // Police en gras pour les en-têtes
          halign: 'center',  // Centrer le texte des en-têtes
        },
        bodyStyles: {
          fillColor: [240, 240, 240],  // Couleur de fond des lignes de données (gris clair)
          textColor: 0,  // Couleur du texte des données (noir)
        },
        alternateRowStyles: {
          fillColor: [255, 255, 255],  // Couleur de fond des lignes alternées (blanc)
        },
        styles: {
          cellPadding: 5,  // Padding des cellules
          font: 'helvetica',  // Police utilisée pour le contenu
        },
      });
    
      // Sauvegarder ou télécharger le PDF
      doc.save(`liste_eleves_classe_${classe}.pdf`);
    }else{
      alert(`Vous n'avez pas d'élèves en ${classe}`);

    }
  }
}
