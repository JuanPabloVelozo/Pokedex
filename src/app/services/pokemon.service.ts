import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Resultado } from '../interfaces/pokeapi';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private _terminoBusqueda = new BehaviorSubject<string>('');

  constructor() { }

  // Observable para la variable terminoBusqueda
  get terminoBusqueda$() {
    return this._terminoBusqueda.asObservable();
  }

  async getByPage(): Promise<Resultado[]> {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=151');
    const resJson = await res.json();
    if (resJson.results.length > 0) return resJson.results;
    return [];
  }

  async getById(id: string) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const resJson = await res.json();
    return resJson;
  }

  getByDescripcion() {
  }

  almacenarBusqueda(termino: string): void {
    this._terminoBusqueda.next(termino); // Actualizamos el valor de terminoBusqueda y notificamos a los suscriptores
  }
}
