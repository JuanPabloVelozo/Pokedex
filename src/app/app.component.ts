import { Component } from '@angular/core';
import { PokemonService } from './services/pokemon.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Pokedex';
  constructor(private pokemonService: PokemonService) { }
  buscar(termino: string) {
    this.pokemonService.almacenarBusqueda(termino);  // Envía el término al servicio
  }
}
