import { Component, computed, inject } from '@angular/core';
import { CarrinhoService } from '../../service/carrinho.service';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-cabecalho',
  styleUrl: './cabecalho.css',
  templateUrl: './cabecalho.html',
})
export class Cabecalho {
  private carrinhoService = inject(CarrinhoService);
  protected totalCarrinho = computed(() => this.carrinhoService.total());

  constructor(private router: Router) {}

  irParaCatalogo(): void {
    this.router.navigate(['/catalogo']);
  }

}
