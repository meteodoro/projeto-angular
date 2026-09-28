import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { DiscoService } from '../../service/disco.service';
import { FavoritosService } from '../../service/favoritos.service';
import { CarrinhoService } from '../../service/carrinho.service';
import { Disco } from '../../models/disco.model';

@Component({
  imports: [ DecimalPipe ],
  selector: 'app-disco-detalhe',
  styleUrl: './disco-detalhe.css',
  templateUrl: './disco-detalhe.html',
})
export class DiscoDetalhe {
  private discoService = inject(DiscoService);
  private route = inject(ActivatedRoute);
  private favoritosService = inject(FavoritosService);
  private carrinhoService = inject(CarrinhoService);



  protected disco = signal<Disco | null>(null);
  protected carregando = signal(true);
  protected erro = signal<string | null>(null);
  protected girando = signal(false);
  protected ladoApareceu = signal<'A' | 'B' | null>(null);
  protected adicionado = signal(false);


  protected favoritado = computed(() => {
    const d = this.disco();
    return d ? this.favoritosService.isFavorito(d.id) : false;
  });

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.discoService.getDisco(id).subscribe({
      next: (d) => {
        this.disco.set(d);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível encontrar esse disco.');
        this.carregando.set(false);
      },
    });
  }

  protected girar() {
    this.girando.set(true);
    setTimeout(() => {
      this.girando.set(false);
      this.ladoApareceu.set(this.ladoApareceu() === 'A' ? 'B' : 'A');
    }, 600);
  }

  protected onFavoritar() {
    const d = this.disco();
    if (d) this.favoritosService.toggle(d.id);
  }

  protected onAdicionarCarrinho() {
    const d = this.disco();
    if (d) this.carrinhoService.adicionar(d);
  }

}
