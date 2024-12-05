import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesShelfComponent } from './favorites-shelf.component';

describe('FavoritesShelfComponent', () => {
  let component: FavoritesShelfComponent;
  let fixture: ComponentFixture<FavoritesShelfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritesShelfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoritesShelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
