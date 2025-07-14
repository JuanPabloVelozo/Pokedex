import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { Resultado } from '../../interfaces/pokeapi';
import { Pokemon } from '../../interfaces/pokemon';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private pokemonService: PokemonService) { }

  listaPokemon: Resultado[] = [];
  listaPokemonOrigen: Resultado[] = [];
  terminoBusqueda = "";
  pokemonSelect?: Pokemon;
  detalle: boolean=false;

  ngOnInit(): void {
    this.cargarLista();

    this.pokemonService.terminoBusqueda$.subscribe(termino => {
      this.terminoBusqueda = termino;
      this.filtrarLista();
    });
  }

  async cargarLista() {
    this.listaPokemonOrigen = await this.pokemonService.getByPage();
    this.listaPokemon = [...this.listaPokemonOrigen];
  }

  filtrarLista() {
    if (this.terminoBusqueda !== "") {
      this.listaPokemon = this.listaPokemonOrigen.filter(pokemon =>
        pokemon.name.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
      );
    } else {
      // Si no hay término de búsqueda, mostrar todos los Pokémon
      this.listaPokemon = [...this.listaPokemonOrigen];
    }
  }

  async tarjetaClickeada(id: string) {
    if (this.pokemonSelect && id.toString() === this.pokemonSelect?.id.toString()) {
      return this.cambiarEstadoDetalle()
    }
    this.pokemonSelect = await this.pokemonService.getById(id);

  }


  cambiarEstadoDetalle() {
    if (this.pokemonSelect) {
      this.detalle = !this.detalle;
    }
  }
}
