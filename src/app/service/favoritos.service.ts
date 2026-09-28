import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private ids = signal<Set<number>>(new Set());

  isFavorito(id: number): boolean {
    return this.ids().has(id);
  }

  toggle(id: number) {
    this.ids.update(atual => {
      const novo = new Set(atual);
      novo.has(id) ? novo.delete(id) : novo.add(id);
      return novo;
    });
  }
}