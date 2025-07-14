import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Resultado } from '../interfaces/pokeapi';
import { Pokemon } from '../interfaces/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  // Creamos un BehaviorSubject que almacenará el término de búsqueda y permitirá emitir valores a suscriptores
  private _terminoBusqueda = new BehaviorSubject<string>('');

  constructor() { }

  // Recuperación del valor actual de 'terminoBusqueda' como un Observable para que otros componentes puedan suscribirse
  get terminoBusqueda$() {
    return this._terminoBusqueda.asObservable();
  }

  // Método que obtiene los primeros 151 Pokémon desde la API de PokeAPI
  // Realiza una petición HTTP GET a PokeAPI para obtener la lista de Pokémon
  async getByPage(): Promise<Resultado[]> {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=1025`);
    // 'resJson' es el objeto JSON que contiene los resultados de la petición
    const resJson = await res.json();
    // Si se reciben resultados, los retorna, de lo contrario retorna un array vacío
    if (resJson.results.length > 0) return resJson.results;
    return [];
  }

  async getById(id: string): Promise<Pokemon> {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      if (!res.ok) throw new Error('Pokémon no encontrado');
      const resJson = await res.json();

      // Función auxiliar para obtener el nombre en español desde una URL
      const obtenerNombreEnEspanol = async (url: string): Promise<string> => {
        const res = await fetch(url);
        const data = await res.json();
        const nombre = data.names.find((n: any) => n.language.name === 'es');
        return nombre?.name ?? data.name;
      };

      // Traducir tipos
      resJson.types = await Promise.all(
        resJson.types.map(async (tipo: any) => ({
          type: { name: await obtenerNombreEnEspanol(tipo.type.url) }
        }))
      );

      // Traducir habilidades
      resJson.abilities = await Promise.all(
        resJson.abilities.map(async (habilidad: any) => ({
          ability: { name: await obtenerNombreEnEspanol(habilidad.ability.url) }
        }))
      );

      return resJson;

    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener el Pokémon');
    }
  }

  // Método que obtiene una descripción de un Pokémon por su ID o nombre desde la API de PokeAPI
  async getByDescripcion(id: string | number): Promise<string> {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    // 'resJson' es el objeto JSON que contiene la información de la especie del Pokémon
    const resJson = await res.json();
    // 'texto' es el objeto que contiene la descripción en español del Pokémon
    const texto = resJson.flavor_text_entries.find((entry: any) => entry.language.name === 'es');
    return texto.flavor_text;
  }

  // Método que actualiza el término de búsqueda y notifica a los suscriptores sobre el cambio
  almacenarBusqueda(termino: string): void {
    // 'termino' es el término de búsqueda que se quiere almacenar y notificar a los suscriptores
    this._terminoBusqueda.next(termino);
  }
}
