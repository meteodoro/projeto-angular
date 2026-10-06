import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnimarScroll } from '../animar-scroll/animar-scroll';


@Component({
  imports: [ RouterLink, AnimarScroll ],
  selector: 'app-sobre',
  styleUrl: './sobre.css',
  templateUrl: './sobre.html',
})
export class Sobre {

}
