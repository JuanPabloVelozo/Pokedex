import { Component, Input, OnChanges } from '@angular/core';
import { Pokemon } from '../../interfaces/pokemon';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent  {
  @Input() pokemon?: Pokemon;
  descripcion: string = "";
  constructor(private pokemonService: PokemonService) { }
  ngOnChanges(): void {
    if (this.pokemon) {
      this.pokemonService.getByDescripcion(this.pokemon?.id).then(res => {
        this.descripcion = res;
      })
    }
  }
  
}
