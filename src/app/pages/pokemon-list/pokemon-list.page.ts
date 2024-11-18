import { Component, OnInit, ViewChild } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.page.html',
  styleUrls: ['./pokemon-list.page.scss'],
})
export class PokemonListPage implements OnInit {
  @ViewChild('cryAudio') cryAudio: any;  // Referencia al elemento de audio en el HTML
  pokemonTypes: string[] = [];
  selectedType: string = '';
  selectedPokemon: string = '';
  pokemonData: any = null;
  error: string | null = null;
  pokemonList: string[] = [];
  cryUrl: string = 'https://cors-anywhere.herokuapp.com/https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/132.ogg';  // URL de audio del cry de Ditto
  isShiny: boolean = false;  // Estado para alternar entre la versión normal y shiny
  evolutionData: any = null;  // Datos de la evolución
  preevolutionData: any = null;  // Datos de la preevolución

  typeColors: any = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD'
  };

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.loadPokemonTypes();  // Cargar los tipos de Pokémon al iniciar
  }

  // Cargar los tipos de Pokémon desde el servicio
  loadPokemonTypes() {
    this.pokemonService.getPokemonTypes().subscribe({
      next: (data) => {
        this.pokemonTypes = data.results.map((type: any) => type.name);
      },
      error: () => {
        this.error = 'No se pudieron cargar los tipos de Pokémon';
      },
    });
  }

  // Cargar Pokémons de acuerdo al tipo seleccionado
  loadPokemonByType() {
    if (this.selectedType) {
      this.pokemonService.getPokemonByType(this.selectedType).subscribe({
        next: (data) => {
          this.pokemonList = data.pokemon.map((poke: any) => poke.pokemon.name);
        },
        error: () => {
          this.error = 'No se pudieron cargar los Pokémon de este tipo';
          this.pokemonList = [];
        },
      });
    }
  }

  // Buscar un Pokémon por nombre
  searchPokemon() {
    if (this.selectedPokemon) {
      this.pokemonService.getPokemon(this.selectedPokemon).subscribe({
        next: (data) => {
          this.pokemonData = data;
          this.error = null;
          this.playCry();  // Reproducir el cry del Pokémon al cargar sus datos
        },
        error: () => {
          this.error = 'No se encontró el Pokémon';
          this.pokemonData = null;
        },
      });
    }
  }

  // Función para reproducir el cry del Pokémon
  playCry() {
    if (this.cryAudio) {
      this.cryAudio.nativeElement.play();  // Reproducir el audio del cry
    }
  }

  // Alternar entre la versión normal y shiny
  toggleShiny() {
    this.isShiny = !this.isShiny;
  }

  // Función para obtener el color de la barra de progreso según el valor de la estadística
  getStatColor(statValue: number): string {
    if (statValue <= 85) {
      return 'danger';  // Rojo para valores bajos
    } else if (statValue <= 170) {
      return 'warning';  // Amarillo para valores medios
    } else {
      return 'success';  // Verde para valores altos
    }
  }
  loadNextEvolution() {
    if (this.evolutionData?.evolves_to?.length) {
      const nextEvolution = this.evolutionData.evolves_to[0];
      this.selectedPokemon = nextEvolution.species.name;
      this.searchPokemon();  // Realizar la búsqueda para cargar el siguiente Pokémon
    }
  }

  // Cargar el Pokémon de la preevolución anterior
  loadPreviousEvolution() {
    if (this.preevolutionData) {
      this.selectedPokemon = this.preevolutionData.species.name;
      this.searchPokemon();  // Realizar la búsqueda para cargar el Pokémon anterior
    }
  }
  getTypeColor(type: string): string {
    return this.typeColors[type.toLowerCase()] || '#A8A77A';  // Devolver color predeterminado si no se encuentra el tipo
  }
}
