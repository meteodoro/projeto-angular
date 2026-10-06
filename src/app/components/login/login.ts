import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { AnimarScroll } from '../animar-scroll/animar-scroll';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, AnimarScroll],
  templateUrl: './login.html',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected enviando = signal(false);
  protected erro = signal<string | null>(null);

  protected form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    senha: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor() {
    // Quem já está logado não precisa ver a tela de login
    if (this.auth.logado()) {
      this.router.navigateByUrl('/');
    }
  }

  protected entrar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.enviando()) {
      return;
    }

    this.enviando.set(true);
    this.erro.set(null);

    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.enviando.set(false);
        this.router.navigateByUrl(this.destino());
      },
      error: (e: HttpErrorResponse) => {
        this.enviando.set(false);
        this.erro.set(
          e.status === 401
            ? 'E-mail ou senha incorretos.'
            : 'Não foi possível entrar agora. Tente novamente em instantes.',
        );
      },
    });
  }

  // Volta para a página que a pessoa tentou acessar (só rotas internas)
  private destino(): string {
    const url = this.route.snapshot.queryParamMap.get('returnUrl');
    return url && url.startsWith('/') && !url.startsWith('//') ? url : '/';
  }
}
