import {
  Component,
  Inject
} from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { Hero } from '../../interfaces/hero.interface';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-hero-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './hero-form.component.html',
  styleUrl: './hero-form.component.scss',
})
export class HeroFormComponent {
  heroForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<HeroFormComponent>,
    private readonly _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Hero
  ) {
    this.heroForm = this._fb.group({
      id: this.data?.id || this._fb.nonNullable.control(''),
      name: this.data?.name || this._fb.nonNullable.control(''),
      origin: this.data?.origin || this._fb.nonNullable.control(''),
      age: this.data?.age || this._fb.nonNullable.control(''),
    });
  }

  onSubmit(event: Event) {
    const editedHeroData = this.heroForm.value;
    this.dialogRef.close(editedHeroData);
  }
}
