import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormInfoService } from 'magic-form';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ValidateHelper } from 'src/app/clazz/validateHelper';
import { FORM_CONFIG } from 'src/app/form-configs/category.config';
import { CategoryService, ICategory } from 'src/app/service/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, AfterViewInit {
  state: string;
  category: ICategory;
  category$: Observable<ICategory>;
  formId = 'category';
  formInfo = FORM_CONFIG;
  validator: ValidateHelper;
  constructor(
    private route: ActivatedRoute,
    public categorySvc: CategoryService,
    private fis: FormInfoService
  ) {
    this.validator = new ValidateHelper(this.formId, this.formInfo, fis)
  }
  ngAfterViewInit(): void {
    this.validator.updateErrorMsg(this.fis.formGroupCollection[this.formId]);
  }
  ngOnInit() {
    this.category$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.categorySvc.getCategoryById(+params.get('id')))
    );
    this.route.queryParamMap.subscribe(queryMaps => {
      this.state = queryMaps.get('state');
      if (queryMaps.get('state') === 'update') {
        this.category$.subscribe(byId => {
          this.fis.formGroupCollection[this.formId].get('id').setValue(byId.id)
          this.fis.formGroupCollection[this.formId].get('title').setValue(byId.title)
        })
      } else if (queryMaps.get('state') === 'none') {

      } else {
        this.fis.formGroupCollection[this.formId].get('url').disable()
      }
    })
  }
  convertToCategoryPayload(formGroup: FormGroup): ICategory {
    return {
      id: formGroup.get('id').value,
      title: formGroup.get('title').value
    }
  }
}
