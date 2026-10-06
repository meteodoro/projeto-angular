import { Component, inject, signal, computed } from '@angular/core';
import { DiscoService } from '../../service/disco.service';
import { Disco } from '../../models/disco.model';
import { FormsModule } from '@angular/forms';
import { DiscoCard } from '../disco-card/disco-card';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FavoritosService } from '../../service/favoritos.service';
import { AnimarScroll } from '../animar-scroll/animar-scroll';


@Component({
  imports: [FormsModule, DiscoCard, RouterLink, AnimarScroll],
  selector: 'app-catalogo',
  styleUrl: './catalogo.css',
  templateUrl: './catalogo.html',
})
export class Catalogo {
  private discoService = inject(DiscoService);
  private favoritosService = inject(FavoritosService);
  private route = inject(ActivatedRoute);

  protected discos = signal<Disco[]>([]);
  protected carregando = signal(true);
  protected erro = signal<string | null>(null);
  protected busca = signal('');
  protected mostrarSoFavoritos = signal(false);


  protected discosFiltrados = computed(() => {
    const termo = this.busca().toLowerCase();
    const soFavoritos = this.mostrarSoFavoritos();

    return this.discos().filter(d => {
      const bateBusca = d.titulo.toLowerCase().includes(termo) || d.artista.toLowerCase().includes(termo);
      const bateFavorito = !soFavoritos || this.favoritosService.isFavorito(d.id);
      return bateBusca && bateFavorito;
    });
  });
  
  protected total = computed(() => this.discosFiltrados().length);
  
  constructor() {
    const generoDaUrl = this.route.snapshot.queryParamMap.get('genero');
    const termos = generoDaUrl ? [generoDaUrl] : undefined;

    this.discoService.getDiscos(termos).subscribe({
      next: (discos) => {
        this.discos.set(discos); 
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar o catálogo'); 
        this.carregando.set(false);
      }
    });
  }

  protected onFavoritar(disco: Disco) {
  console.log('favoritado:', disco.titulo);
  }
  
}
