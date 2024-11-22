import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {forkJoin, Observable} from 'rxjs';
import {Eleve} from "../model/Eleve";
import {StudentPayment} from "../model/StudentPayment";
import {Establishment} from "../../../../admin/admin-component/shared/models/establishment";
import {catchError, switchMap} from "rxjs/operators";
import * as XLSX from 'xlsx';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import { Router } from '@angular/router';
import { generateStudentId } from '../utilis/studentID';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment, establishment } from '../../../../../environments/environment';


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
  

uploadFile(fileXlsx: File, establishment: string): Promise<boolean> {

  return this.readExcelFile(fileXlsx)
    .then((jsonData: any) => {
      const lyceeClasses = ['10èCG', '11èL', '11èSc', '11èSES','TSS', 'TSECO', 'TSEXP','TSE', 'TLL', 'TAL'];
      const professionalClasses = ['1ère TC', '2è TC', '3è TCA', '4è TCA', '1ère SD', '2è SD', '3è SD', '4è SD', '1ère EM', '2è EM', '3è EM', '4è EM'];
      const cycle1Classes = ['1ère A','1ère B', '2ème A','2ème B', '3ème A','3ème B','4ème A','4ème B','5ème A', '5ème B', '6ème A', '6ème B'];
      const cycle2Classes = ['7ème A','7ème B','8ème A', '8ème B', '9ème A','9ème B','9ème C','9ème D','9ème E'];

      
      const allEleves: Eleve[] = [];
      // Parcours de chaque feuille dans le fichier Excel
      Object.keys(jsonData).forEach(sheetName => {
        const sheetData = jsonData[sheetName];
        const normalizedData = sheetData.map((data: any) => {
          const normalizedRow: any = {};
          Object.keys(data).forEach(columnName => {
            const normalizedColumnName = this.normalizeColumnName(columnName);
            normalizedRow[normalizedColumnName] = data[columnName];
          });
          return normalizedRow;
        });
      
       // console.info(normalizedData);
        // Transformer les données JSON de la feuille en objets de type Eleve
      
       
        const eleves: Eleve[] = normalizedData.map((data: any) => {
          // Détecter les noms de colonnes pour 'nom' et 'prenom'
            const nomKey = Object.keys(data).find(key => ['nom', 'noms'].includes(key.toLowerCase()));
            const prenomKey = Object.keys(data).find(key => ['prenom', 'prenoms'].includes(key.toLowerCase()));
            const matriculeKey = Object.keys(data).find(key => ['n°mle', 'n°matricule'].includes(key.toLowerCase()));
          
            // Détecter les noms de colonnes pour 'classe'
            const classeKey = Object.keys(data).find(key =>
              ['classe', 'classe 2024-2025', 'classe 24-25']
                .map(k => k.toLowerCase())
                .includes(key.toLowerCase())
            );
            // Si les champs obligatoires ne sont pas trouvés, ignorer l'entrée
            if (!nomKey || !prenomKey || !classeKey ) {
              return undefined;
            }
         const eleve = new Eleve();
         eleve.registerPaymentStudent=[];
          if(data["frais d'inscription"] && data["total general"]){ 
            const studentPayment = new StudentPayment();
            studentPayment.fees=true;
            studentPayment.month='octobre';
            studentPayment.paymentReason="Frais d'inscription";
            studentPayment.amount=data["frais d'inscription"];
            studentPayment.paymentStatus='normal';
            studentPayment.totalAnnualCosts=data["total general"];
            studentPayment.establishment=establishment;
            eleve.registerPaymentStudent.push(studentPayment);

            if(data["total paye"]){
              const studentPayment1 = new StudentPayment();
              studentPayment1.fees=false;
              studentPayment1.month='october';
              studentPayment1.paymentReason="Frais du premier paiement";
              studentPayment1.amount=data["total paye"];
              studentPayment1.paymentStatus=this.updatePaymentStatus(studentPayment,'octobre',data["montant paye"]);
              studentPayment1.totalAnnualCosts=data["total general"]-studentPayment1.amount;
              studentPayment1.establishment=establishment;
              eleve.registerPaymentStudent.push(studentPayment1);
            }
                 
           }
          
          
          eleve.nom = data[nomKey]?.trim();
          eleve.prenom = data[prenomKey]?.trim();
          eleve.classe = data[classeKey]?.trim();
          eleve.matricule = eleve.matricule = matriculeKey && typeof data[matriculeKey] === 'string' ? data[matriculeKey].trim() : '';
          eleve.establishment = establishment;
          eleve.studentID = generateStudentId();

          
          eleve.dateNaissance = data['date naiss'] || null;
          eleve.nomPere = data['nom du père']?.trim() || eleve.nom;
          eleve.prenomPere = data['prenom du père']?.trim() || '';
          eleve.nomMere = data['nom de la mère']?.trim() || '';
          eleve.prenomMere = data['prenom de la mère']?.trim() || '';
          eleve.tel1 = data['tel1']?.trim() || '00 00 00 00';
          eleve.tel2 = data['tel2']?.trim() || '';

          if(eleve.matricule!==''){
            eleve.transfere = "Étatique";
          }else{
            eleve.transfere = "Privé";
          }
          if (lyceeClasses.includes(eleve.classe)) {
            eleve.niveau = 'Lycee';
          } else if(professionalClasses.includes(eleve.classe)) {
            eleve.niveau = 'Professionnel';
          }else if(cycle1Classes.includes(eleve.classe)){
            eleve.niveau='cycle1';
          }else if(cycle2Classes.includes(eleve.classe)){
            eleve.niveau='cycle2';
          }else{
            return undefined;
          }

          if(eleve.niveau === 'Professionnel' || eleve.niveau === 'Lycee'){
            eleve.userKey = "high school";
          }else{
            eleve.userKey = "primary school";
          }    
          return eleve;
        }).filter((eleve: Eleve | undefined) => eleve !== undefined);

        // Ajouter les élèves de la feuille courante au tableau global
        allEleves.push(...eleves);
      });
      console.info(allEleves);
      // Création des élèves dans le système
      return forkJoin(
        allEleves.map((eleve) => {
          const photo = new File([''], ''); // Remplacer par la vraie photo si disponible
      
          // Extraire les paiements associés à l'élève
          const studentPayments = eleve.registerPaymentStudent || [];
          eleve.registerPaymentStudent = []; // Réinitialiser pour éviter de renvoyer cette propriété à l'API
      
          if (studentPayments.length > 0) {
            return this.createStudent(eleve, photo).pipe(
              switchMap((createdStudent) => {
                // Gestion séquentielle des paiements
                const paymentRequests = studentPayments.map((payment) => {
                  payment.register_student_id = createdStudent.id;
                  return this.createPayment(payment, createdStudent.id);
                });
      
                // Retourner tous les paiements liés à cet étudiant
                return forkJoin(paymentRequests);
              })
            );
          }
      
          // Si aucun paiement, créer seulement l'étudiant
          return this.createStudent(eleve, photo);
        })
      ).toPromise();
      // Convertit l'observable forkJoin en promesse*/
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



private normalizeColumnName(columnName: string): string {
  return columnName.toLowerCase().replace(/\s+/g, ' ').trim();
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

              workbook.SheetNames.forEach(sheetName => {
                const sheet = workbook.Sheets[sheetName];

                // Convertir la feuille en tableau brut (chaque ligne est un tableau)
                const sheetData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                if (sheetData.length > 0) {
                  // Trouver la ligne d'en-tête contenant les colonnes spécifiées
                  const headerRowIndex = sheetData.findIndex(row => 
                    row.some(cell => 
                      typeof cell === 'string' && 
                      ['nom', 'noms', 'prenom', 'prenoms', 'classe'].includes(cell.trim().toLowerCase())
                    )
                  );

                  if (headerRowIndex !== -1) {
                    // Obtenir les en-têtes
                    const headers = sheetData[headerRowIndex].map((header: any) =>
                      typeof header === 'string' ? header.trim() : header
                    );

                    // Filtrer les colonnes vides
                    const validColumns = headers.reduce((acc: number[], header, index) => {
                      const isEmptyColumn = sheetData.slice(headerRowIndex + 1).every(row => !row[index]);
                      if (!isEmptyColumn) acc.push(index); // Conserver les colonnes non vides
                      return acc;
                    }, []);

                    // Lire les données filtrées à partir de la ligne d'en-tête
                    const filteredData = sheetData.slice(headerRowIndex + 1).map(row => 
                      validColumns.reduce((obj: any, colIndex) => {
                        if (headers[colIndex]) obj[headers[colIndex]] = row[colIndex];
                        return obj;
                      }, {})
                    );

                    // Ajouter les données filtrées
                    allSheetsData[sheetName] = filteredData;
                  } else {
                    // Si aucune ligne d'en-tête correspondante n'est trouvée, laisser vide ou lever une erreur
                    allSheetsData[sheetName] = [];
                  }
                } else {
                  // Si la feuille est vide, retourner un tableau vide
                  allSheetsData[sheetName] = [];
                }
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
 





    updatePaymentStatus(registerPaymentStudent: StudentPayment, currentMonth: string, amountPaid: number): string {
      // Vérifier que le coût total annuel est bien défini pour l'élève
      const lastPayment = registerPaymentStudent;
      const totalAnnualCosts = lastPayment?.totalAnnualCosts || 0;
      
      if (totalAnnualCosts === 0) {
      //  console.error("Le coût annuel total n'est pas défini pour cet élève.");
        return '';
      }
  
      // Calcul du montant à payer chaque mois en fonction du montant annuel
      const monthlyCost = totalAnnualCosts / 9; // Diviser le montant annuel par le nombre de mois (9)
  
      // Convertir le mois en cours sélectionné en un index de mois (1 à 9)
      const monthMap: { [key: string]: number } = {
        'octobre': 1, 'novembre': 2, 'decembre': 3,
        'janvier': 4, 'fevrier': 5, 'mars': 6,
        'avril': 7, 'mai': 8, 'juin': 9
      };
  
      
      const selectedMonthIndex = monthMap[currentMonth] || 0;
  
      if (selectedMonthIndex === 0) {
        console.error("Mois sélectionné invalide.");
        return '';
      }
  
      const expectedPayment = selectedMonthIndex * monthlyCost;
      let totalPaid = 0
  
      let paymentStatus = '';
      if (totalPaid > expectedPayment) {
        paymentStatus = 'avance'; // L'élève a payé plus que ce qu'il devait jusqu'à maintenant
      } else if (totalPaid < expectedPayment) {
        paymentStatus = 'retard'; // L'élève est en retard
      } else {
        paymentStatus = 'normal'; // L'élève est à jour
      }
  
      return paymentStatus;
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
