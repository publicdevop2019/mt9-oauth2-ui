import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ISecurityProfile } from '../summary-security-profile/summary-security-profile.component';
import { SecurityProfileService } from 'src/app/service/security-profile.service';
import { ICategory, CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  state: string;
  category: ICategory;
  category$: Observable<ICategory>;
  categoryForm = new FormGroup({
    id: new FormControl('', [
      Validators.required
    ]),
    title: new FormControl('', [
      Validators.required
    ]),
    url: new FormControl('', [
      Validators.required
    ]),
  });
  constructor(
    private route: ActivatedRoute,
    public categorySvc: CategoryService,
  ) { }

  ngOnInit() {
    this.category$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.categorySvc.getCategoryById(+params.get('id')))
    );
    this.route.queryParamMap.subscribe(queryMaps => {
      this.state = queryMaps.get('state');
      if (queryMaps.get('state') === 'update') {
        this.category$.subscribe(byId => {
          this.categoryForm.get('id').setValue(byId.id)
          this.categoryForm.get('title').setValue(byId.title)
          this.categoryForm.get('url').setValue(byId.url)
        })
      } else if (queryMaps.get('state') === 'none') {

      } else {

      }
    })
  }
  convertToCategoryPayload(formGroup: FormGroup): ICategory {
    return {
      id: formGroup.get('id').value,
      title: formGroup.get('title').value,
      url: formGroup.get('url').value,
    }
  }
}
