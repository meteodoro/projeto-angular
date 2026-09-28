import { Injectable, signal, computed } from '@angular/core';
import { Disco } from '../models/disco.model';

@Injectable({ providedIn: 'root' })
export class CarrinhoService {
    private readonly STORAGE_KEY = 'solstice-carrinho';

    private itens = signal<Disco[]>(this.carregarCarrinho());
    private aberto = signal(false);

    lista = computed(() => this.itens());
    total = computed(() => this.itens().length);
    totalPreco = computed(() => this.itens().reduce((soma, d) => soma + d.preco, 0));
    estaAberto = computed(() => this.aberto());

    adicionar(disco: Disco) {
        this.itens.update(atual => { const novoCarrinho = [...atual, disco];
            this.salvarCarrinho(novoCarrinho);
            return novoCarrinho;});
        this.aberto.set(true);
    }

    remover(id: number) {
        this.itens.update(atual => { const novoCarrinho = atual.filter(d => d.id !== id);
        this.salvarCarrinho(novoCarrinho);
        return novoCarrinho;
        });
    }

    private salvarCarrinho(itens: Disco[]): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(itens));
    }

    private carregarCarrinho(): Disco[] {
        const dados = localStorage.getItem(this.STORAGE_KEY);
        
        if (!dados) { 
            return []; 
        }

        try {
            return JSON.parse(dados);

        } catch {
            return [];
        }
    }

    abrir() { 
        this.aberto.set(true); 
    }

    fechar() { 
        this.aberto.set(false); 
    }
}