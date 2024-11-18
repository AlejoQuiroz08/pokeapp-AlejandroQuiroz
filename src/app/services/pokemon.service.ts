import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2/pokemon/';

  constructor(private http: HttpClient) {}

  // Obtener detalles de un Pokémon por nombre
  getPokemon(name: string): Observable<any> {
    return this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${name}`);
  }
  

  // Obtener lista de tipos de Pokémon
  getPokemonTypes(): Observable<any> {
    return this.http.get<any>('https://pokeapi.co/api/v2/type');
  }

  // Obtener lista de Pokémons por tipo
  getPokemonByType(type: string): Observable<any> {
    return this.http.get<any>(`https://pokeapi.co/api/v2/type/${type}`);
  }
}
