import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { MockDataService } from '../../services/mock-data.service';
import { Hero } from '../../interfaces/hero.interface';
import { Subject, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { HeroFormComponent } from '../hero-form/hero-form.component';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hero-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatPaginator,
    MatPaginatorModule,
    MatButtonModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.scss',
})
export class HeroListComponent implements AfterViewInit {
  private onDestroy$ = new Subject<void>();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'id',
    'name',
    'origin',
    'age',
    'edit',
    'delete',
  ];
  dataSource = new MatTableDataSource<Hero>();
  name: string = '';

  constructor(
    private mockDataService: MockDataService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.mockDataService.loadData();
    this.mockDataService.cachedHeroes$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((heroes) => {
        this.dataSource.data = heroes;
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  openHeroForm(event: Event, hero?: Hero): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(HeroFormComponent, {
      width: '70%',
      data: hero,
    });

    dialogRef.afterClosed().subscribe((hero: Hero) => {
      if (hero) {
        hero.id? this.mockDataService.updateHero(hero): this.onAddHero(hero);
      }
    });
  }

  onAddHero(hero: Hero) {
    this.mockDataService.addHero(hero);
  }

  deleteHero(event: Event, hero: Hero) {
    event.stopPropagation();
    this.mockDataService.deleteHeroById(hero.id);
  }

  openDetail(event: Event, id: number): void {
    event.stopPropagation();
    this.router.navigate(['hero-detail', id]);
  }

  onSearch(event: Event) {
    this.mockDataService.getHeroesByName(this.name);
  }
}
