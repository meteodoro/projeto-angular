import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Catalogo } from './components/catalogo/catalogo';
import { DiscoDetalhe } from './components/disco-detalhe/disco-detalhe';
import { NaoEncontrado } from './components/nao-encontrado/nao-encontrado';
import { Sobre } from './components/sobre/sobre';
import { Contato } from './components/contato/contato';
import { Login } from './components/login/login';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'catalogo', component: Catalogo },
    { path: 'sobre', component: Sobre },
    { path: 'contato', component: Contato },
    { path: 'discos/:id', component: DiscoDetalhe },
    { path: 'login', component: Login },
    { path: '**', component: NaoEncontrado },

];
