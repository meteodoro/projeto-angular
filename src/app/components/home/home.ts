import { Component, inject, signal, computed } from '@angular/core';
import { AnimarScroll } from '../animar-scroll/animar-scroll';
import { Disco } from '../../models/disco.model';
import { DiscoService } from '../../service/disco.service';
import { DiscoCard } from '../disco-card/disco-card';
import { RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';


@Component({
  imports: [ DiscoCard, RouterLink, ReactiveFormsModule, AnimarScroll ],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})

export class Home {
  private discoService = inject(DiscoService);

  protected discos = signal<Disco[]>([])
  protected carregando = signal(true)
  protected destaques = computed(() => this.discos().slice(0, 4));

  constructor(){
    this.discoService.getDiscos().subscribe({
      next: (d) => {
        this.discos.set(d);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }

  protected form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  mensagemSucesso = false;

  inscrever() {
    console.log('Inscrito com sucesso!');
    this.mensagemSucesso = true;

    setTimeout(() => { 
      this.mensagemSucesso = false; 
    }, 1500);
  }

  protected onFavoritar(disco: Disco) {
    console.log('favoritado:', disco.titulo);
  }

  protected generos = [
    { nome: 'Jazz', termo: 'jazz', capa: '/assets/generos/jazz.jpg' },
    { nome: 'Blues', termo: 'blues', capa: '/assets/generos/blues.jpg' },
    { nome: 'Soul', termo: 'soul', capa: '/assets/generos/soul.jpg' },
    { nome: 'Rock Psicodélico', termo: 'rock psicodélico', capa: '/assets/generos/rock.jpg' },
    { nome: 'R&B', termo: 'r&b', capa: '/assets/generos/rnb.jpg' },
    { nome: 'MPB', termo: 'mpb', capa: '/assets/generos/mpb.jpg' },
  ];

}
