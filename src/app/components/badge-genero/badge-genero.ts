import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-badge-genero',
  styleUrl: './badge-genero.css',
  templateUrl: './badge-genero.html',
})
export class BadgeGenero {
  genero = input.required<string>();
  faixas = input.required<number>();
}