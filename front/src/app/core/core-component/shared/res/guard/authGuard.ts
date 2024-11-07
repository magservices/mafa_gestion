import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from "@angular/router";
import {jwtDecode} from "jwt-decode";  // Import correct pour jwt-decode

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const token = localStorage.getItem('USER-TOKEN-MAFA');

    // Vérifiez si l'utilisateur est authentifié
    if (!token) {
      // Vérifiez si la route actuelle a des segments d'URL
      if (route.url && route.url.length > 0) {
        const allowedWithoutAuth = ['/','/user-form'];
        if (allowedWithoutAuth.includes(route.url[0].path)) {
          return true;
        }
      }

      // Rediriger l'utilisateur vers la page d'authentification
      return this.router.parseUrl('/');
    }

    // Décodage du token pour vérifier le rôle de l'utilisateur
    const decodedToken: any = jwtDecode(token);
    const userRole: string = decodedToken.roles[0];

    // Vérification des rôles et redirection si nécessaire
    if (userRole === 'ROLE_ADMIN' ||
      userRole === 'ROLE_DIRECTOR' ||
      userRole === 'ROLE_CENSOR' && route.url[0].path === 'dash') {
      return true;  // L'utilisateur est autorisé à accéder à la route
    }

    // Si l'utilisateur n'a pas l'autorisation pour accéder à cette route, redirection vers une page par défaut
    return this.router.parseUrl('/');
  }

}
