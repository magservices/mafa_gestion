import {Directive, ElementRef, HostListener} from '@angular/core';
import {NgControl} from "@angular/forms";

@Directive({
  selector: '[appThousandSeparatorDirective]',
  standalone: true
})
export class ThousandSeparatorDirectiveDirective {

  constructor(private el: ElementRef, private control: NgControl) {
  }

  // Méthode pour appliquer le formatage français avec des espaces comme séparateurs de milliers
  private formatValue(value: number): string {
    return value.toLocaleString('fr-FR');
  }

  // Ecoute l'événement input pour appliquer le formatage
  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = this.el.nativeElement as HTMLInputElement;

    // Supprime les espaces pour obtenir la valeur numérique brute
    const rawValue = input.value.replace(/\s+/g, '');
    const numericValue = parseInt(rawValue, 10) || 0;

    // Met à jour le FormControl avec la valeur numérique sans formatage
    this.control.control?.setValue(numericValue, {emitEvent: false});

    // Applique le formatage pour l'affichage
    input.value = this.formatValue(numericValue);
  }

  // Applique le formatage lors de la sortie du champ de saisie
  @HostListener('blur')
  onBlur(): void {
    const controlValue = this.control.control?.value || 0;
    this.el.nativeElement.value = this.formatValue(controlValue);
  }

}
