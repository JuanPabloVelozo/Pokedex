import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { Resultado } from '../../interfaces/pokeapi';

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
}
