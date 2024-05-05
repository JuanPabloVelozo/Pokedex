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
  pokemonSelect?:Pokemon; 

  ngOnInit(): void {
    this.cargarLista();

    this.pokemonService.terminoBusqueda$.subscribe(termino => {
      this.terminoBusqueda = termino;
      this.filtrarLista();
    });
  }

  async cargarLista() {
    this.listaPokemonOrigen = await this.pokemonService.getByPage();
    this.listaPokemon = this.listaPokemonOrigen.slice(); 
  }

  filtrarLista() {
     if (this.terminoBusqueda !== "") {
      this.listaPokemon = this.listaPokemonOrigen.filter(pokemon => 
        pokemon.name.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
      );
    } else {
      this.listaPokemon = this.listaPokemonOrigen.slice(); 
    }
  }

  async tarjetaClickeada(id: string){
    this.pokemonSelect = await this.pokemonService.getById(id);

  }
}
