import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageCropPage } from './image-crop.page';

describe('ImageCropPage', () => {
  let component: ImageCropPage;
  let fixture: ComponentFixture<ImageCropPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageCropPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
