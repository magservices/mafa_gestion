import {Component, OnInit} from '@angular/core';
import {StudentService} from "../../shared/services/student.service";
import {StudentPayment} from "../../shared/model/StudentPayment";
import {Eleve} from "../../shared/model/Eleve";
import {DatePipe, DecimalPipe, NgOptimizedImage, SlicePipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import {SidebarComponent} from "../../basic-component/sidebar/sidebar.component";
import {UserService} from "../../shared/services/user.service";
import {User} from "../../shared/model/User";

@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe, 
    RouterLink,
    SlicePipe,
    NgbPaginationModule,
    NgOptimizedImage,
    SidebarComponent
  ],
  templateUrl: './dash.component.html',
  styleUrl: './dash.component.scss'
})
export class DashComponent implements OnInit {
  payments: any[] = [];
  students: Eleve[] = [];
  pStudents: Eleve[] = []; // fondamentale
  hStudents: Eleve[] = []; // lycée
  studentT: Eleve[] = [];// Etatique
  fees: number = 0;
  amountPay: number = 0;
  monthTotalAnnuelle: number = 0;
  paymentPage!: number;
  studentPage: number = 5;
  pageSize = 5;
  user!: User

  constructor(private studentService: StudentService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getUsersByAccessKey().subscribe(
      (user) => {
        if (user !== undefined) {
          this.user = user;
          this.getAllPaymentStudent();
          this.getAllStudent(user);
        }
      }
    )
  }

  private getAllPaymentStudent() {
    this.studentService.getAllPayments().subscribe(
      (resPayment) => {
        this.getStudentByID(resPayment);
        this.paymentPage = resPayment.length / this.pageSize;
        this.feesRegister(resPayment);
        this.amountAlreadyPaid(resPayment);
        this.totalAnnuelle(resPayment);
        
        
      }
    )
  }


  private getStudentByID(students: StudentPayment[]) {
    students.forEach(
      (studentPayment) => {
        this.studentService.getStudentByID(studentPayment.register_student_id).subscribe(
          (student) => {
            Object.assign(studentPayment, {student: student})
            if(this.user.roles[0]==="ROLE_CENSOR"){
              if(student.niveau==="Lycee" || student.niveau==="Professionnel" || student.niveau==="sante"){
                this.payments.push(studentPayment);
              }
            }
            if(this.user.roles[0]==="ROLE_DIRECTOR"){
              if(student.niveau==="cycle1" || student.niveau==="cycle2"){
                this.payments.push(studentPayment);
              }
              
            }

            if(this.user.roles[0]==="ROLE_ADMIN"){
              this.payments.push(studentPayment);
            }

            
          }
        )
      }
    )
  }

  private getAllStudent(user : User) {
    this.studentService.getAllStudent().subscribe(
      (resStudent) => {

        // Mapping des rôles aux valeurs userKey correspondantes
        const roleUserKeyMap: { [role: string]: string | null } = {
          "ROLE_DIRECTOR": "primary school",
          "ROLE_CENSOR": "high school",
        };

        const userRole = user.roles[0];
        const userKey = roleUserKeyMap[userRole];

        // Filtrer en fonction du rôle ou retourner tous les étudiants
        this.students = userKey ? resStudent.filter(student => student.userKey === userKey) : resStudent;



        this.transferStudent(resStudent)
        this.getPrimarySchoolStudent(resStudent)
        this.getHighSchoolStudent(resStudent)
      }
    )
  }

  // pour recupere les eleves fondamentale
  private getPrimarySchoolStudent(students: Eleve[]) {
    // Filtrer les étudiants du niveau "primary school" et les ajouter à la liste `pStudents`
    this.pStudents = students.filter(student => student.userKey === "primary school");
  }

  // pour recupere les eleves du lycée
  private getHighSchoolStudent(students: Eleve[]) {
    // Filtrer les étudiants du niveau "primary school" et les ajouter à la liste `pStudents`
    this.hStudents = students.filter(student => student.userKey === "high school" && student.transfere !== "Étatique");
  }


  private transferStudent(students: Eleve[]) {
    this.studentT = students.filter(student => student.transfere === "Étatique");

  }

  private feesRegister(payments: StudentPayment[]) {
    // Calculer le total des montants associés aux paiements avec frais en utilisant `reduce`
    this.fees = payments.reduce((total, payment) => {
      return payment.fees ? total + payment.amount : total;
    }, 0);

  }


  private amountAlreadyPaid(payments: StudentPayment[]) {
    // Calculer le total des paiements sans frais en utilisant `reduce`
    this.amountPay = payments.reduce((total, payment) => {
      return !payment.fees ? total + payment.amount : total;
    }, 0);
  }
 private totalAnnuelle(payments: StudentPayment[]){
   // Calculer le total des paiements sans frais en utilisant `reduce`
   this.monthTotalAnnuelle = payments.reduce((total, payment) => {
    return payment.fees ? total + payment.amount+ payment.totalAnnualCosts : total;}, 0);
 }

}
