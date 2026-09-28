import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map} from 'rxjs';
import { Disco } from '../models/disco.model';

@Injectable({ providedIn: 'root' })
export class DiscoService {
    private http = inject(HttpClient);
    private readonly baseBusca = 'https://itunes.apple.com/search';
    private readonly baseLookup = 'https://itunes.apple.com/lookup';
    private readonly MULTIPLICADOR_PRECO = 6;
    private readonly PRECO_MINIMO = 49.9;

    getDiscos(termos?: string[]): Observable<Disco[]> {
        const listaTermos = termos ?? ['rock psicodélico', 'jazz', 'blues', 'mpb', 'soul', 'r&b', 'black pumas'];
        const buscas = listaTermos.map(termo => this.buscarPorTermo(termo));

        return forkJoin(buscas).pipe(
            map(listasPorTermo => {
                const todos = listasPorTermo.flat();
                const vistos = new Set<number>();
                return todos.filter(d => (vistos.has(d.id) ? false : (vistos.add(d.id), true)));
            })
        );
    }
    
    getDisco(id: number): Observable<Disco> {
        const params = new HttpParams().set('id', id).set('entity', 'song');

        return this.http.get<any>(this.baseLookup, { params }).pipe(
            map(res => this.paraDiscoComFaixas(res.results))
        );
    }

    private buscarPorTermo(termo: string): Observable<Disco[]> {
        const params = new HttpParams()
            .set('term', termo)
            .set('entity', 'album')
            .set('limit', '12');
        
        return this.http.get<any>(this.baseBusca, { params }).pipe(
            map(response => response.results.map((a: any) => this.paraDisco(a)))
        );
    }

    private paraDisco(a: any): Disco {
        return {
            id: a.collectionId,
            titulo: a.collectionName,
            artista: a.artistName,
            preco: this.precoDeVinil(a.collectionPrice),
            capa: a.artworkUrl100?.replace('100x100', '600x600'),
            genero: a.primaryGenreName,
            faixas: a.trackCount,
            ladoA: [],
            ladoB: []
        };
    }

    private paraDiscoComFaixas(results: any[]): Disco {
        const album = results[0];
        const nomesFaixas = results.slice(1).map(r => r.trackName as string);
        const metade = Math.ceil(nomesFaixas.length / 2);

        return {
            id: album.collectionId,
            titulo: album.collectionName,
            artista: album.artistName,
            preco: this.precoDeVinil(album.collectionPrice),
            capa: album.artworkUrl100?.replace('100x100', '600x600'),
            genero: album.primaryGenreName,
            faixas: nomesFaixas.length,
            ladoA: nomesFaixas.slice(0, metade),
            ladoB: nomesFaixas.slice(metade),
        };
    }

    private precoDeVinil(precoOriginal: number | undefined): number {
        const base = (precoOriginal ?? 0) * this.MULTIPLICADOR_PRECO;
        return Math.max(base, this.PRECO_MINIMO);
    }
    
}