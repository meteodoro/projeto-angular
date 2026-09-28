import { Component, input, output, computed, inject } from '@angular/core';
import { Disco } from '../../models/disco.model';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BadgeGenero } from '../badge-genero/badge-genero';
import { FavoritosService } from '../../service/favoritos.service';

@Component({
  imports: [ DecimalPipe, RouterLink, BadgeGenero ],
  selector: 'app-disco-card',
  styleUrl: './disco-card.css',
  templateUrl: './disco-card.html',
})
export class DiscoCard {
  private favoritosService = inject(FavoritosService);

  disco = input.required<Disco>();
  favoritar = output<Disco>();

  protected favoritado = computed(() => this.favoritosService.isFavorito(this.disco().id));

  protected onFavoritar() {
    this.favoritosService.toggle(this.disco().id);
    this.favoritar.emit(this.disco());
  }

}
