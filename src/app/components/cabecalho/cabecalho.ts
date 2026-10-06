import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CarrinhoService } from '../../service/carrinho.service';
import { Login } from '../login/login'; 

@Component({
  imports: [RouterLink, Login],
  selector: 'app-cabecalho',
  styleUrl: './cabecalho.css',
  templateUrl: './cabecalho.html',
})
export class Cabecalho {
  protected carrinhoService = inject(CarrinhoService);
  protected auth = inject(AuthService);
  protected totalCarrinho = computed(() => this.carrinhoService.total());

  constructor(private router: Router) {}

  irParaCatalogo(): void {
    this.router.navigate(['/catalogo']);
  }

}