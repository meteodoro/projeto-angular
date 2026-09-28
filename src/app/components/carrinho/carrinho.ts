// carrinho-drawer.ts
import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CarrinhoService } from '../../service/carrinho.service';

@Component({
  selector: 'app-carrinho',
  imports: [DecimalPipe],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css',
})
export class Carrinho {
  protected carrinhoService = inject(CarrinhoService);

  protected remover(id: number) {
    this.carrinhoService.remover(id);
  }

  protected fechar() {
    this.carrinhoService.fechar();
  }
}