import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cabecalho } from './components/cabecalho/cabecalho';
import { Rodape } from './components/rodape/rodape';
import { Carrinho } from './components/carrinho/carrinho';

@Component({
  imports: [RouterOutlet, Cabecalho, Rodape, Carrinho],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('solstice');
}
