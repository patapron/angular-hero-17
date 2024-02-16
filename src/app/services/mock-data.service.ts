import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';

import { Hero } from '../interfaces/hero.interface';

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  private staticHeroes: Hero[] = []
  private readonly _cachedHeroes = new BehaviorSubject<Hero[]>([]);
  public cachedHeroes$: Observable<any[]> = this._cachedHeroes.asObservable();

  constructor(private http: HttpClient) {}

  loadData(): void {
    if (!this._cachedHeroes.value || this._cachedHeroes.value.length == 0) {
      this.http
        .get<Hero[]>('assets/heroes.json')
        .pipe(
          tap((heroes) => {
            this.saveHeroes(heroes);
          })
        )
        .subscribe();
    }
  }

  addHero(hero: Hero): void {
    hero.id = this.getNextId();
    const updatedHeroes = [...this._cachedHeroes.value, hero];
    this.saveHeroes(updatedHeroes);
  }

  updateHero(hero: Hero): void {
    const prevHeroes = [...this._cachedHeroes.value];
    const index = prevHeroes.findIndex((h) => h.id === hero.id);
    if (index !== -1) {
      prevHeroes[index] = { ...prevHeroes[index], ...hero };
      this.saveHeroes(prevHeroes);
    } else {
      console.error(`Not updated ${hero.id}`);
    }
  }

  getHeroById(id: number): Observable<Hero | undefined> {
    const foundHero = this._cachedHeroes.value.find((hero) => hero.id === id);
    return of(foundHero);
  }

  getNextId(): number {
    const highestId = this._cachedHeroes.value.reduce(
      (maxId, hero) => Math.max(maxId, hero.id),
      0
    );
    return highestId + 1;
  }

  saveHeroes(heroes: Hero[]){
    this.staticHeroes = heroes;
    this._cachedHeroes.next(heroes);
  }

  getHeroesByName(name: string): void {
    const filteredHeroes = this.staticHeroes.filter((hero) =>
      hero.name.toLowerCase().includes(name.toLowerCase())
    );
    this._cachedHeroes.next(filteredHeroes);
  }

  deleteHeroById(heroId: number){
    const updatedHeroes = this.staticHeroes.filter((hero) => hero.id !== heroId);
    this._cachedHeroes.next(updatedHeroes);
  }
}
