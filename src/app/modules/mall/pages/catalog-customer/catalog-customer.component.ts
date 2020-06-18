import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormInfoService } from 'mt-form-builder';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ValidateHelper } from 'src/app/clazz/validateHelper';
import { FORM_CONFIG } from 'src/app/form-configs/category.config';
import { CategoryService, ICategory } from 'src/app/services/category.service';
import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-catalog-customer',
  templateUrl: './catalog-customer.component.html',
  styleUrls: ['./catalog-customer.component.css']
})
export class CatalogCustomerComponent implements OnInit, AfterViewInit, OnDestroy {
  state: string;
  category: ICategory;
  category$: Observable<ICategory>;
  formId = 'category';
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  validator: ValidateHelper;
  constructor(
    private route: ActivatedRoute,
    public categorySvc: CategoryService,
    private fis: FormInfoService,
    public translate: TranslateService
  ) {
    this.validator = new ValidateHelper(this.formId, this.formInfo, fis)
  }
  ngAfterViewInit(): void {
    this.validator.updateErrorMsg(this.fis.formGroupCollection[this.formId]);
    this.route.queryParamMap.subscribe(queryMaps => {
      this.state = queryMaps.get('state');
      if (queryMaps.get('state') === 'update') {
        this.category$.subscribe(byId => {
          this.fis.formGroupCollection[this.formId].get('id').setValue(byId.id)
          this.fis.formGroupCollection[this.formId].get('title').setValue(byId.title)
        })
      } else if (queryMaps.get('state') === 'none') {

      } else {
      }
    });
  }
  ngOnDestroy(): void {
    this.fis.formGroupCollection[this.formId].reset();
    this.sub.unsubscribe();
  }
  private sub: Subscription;
  private transKeyMap: Map<string, string> = new Map();
  ngOnInit() {
    this.formInfo.inputs.forEach(e => {
      this.translate.get(e.label).subscribe((res: string) => {
        this.transKeyMap.set(e.key, e.label);
        e.label = res;
      });
    })
    this.sub = this.translate.onLangChange.subscribe(() => {
      this.formInfo.inputs.forEach(e => {
        this.translate.get(this.transKeyMap.get(e.key)).subscribe((res: string) => {
          e.label = res;
        });
      })
    })
    this.category$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.categorySvc.getCategoryById(+params.get('id')))
    );
  }
  convertToCategoryPayload(): ICategory {
    let formGroup = this.fis.formGroupCollection[this.formId];
    return {
      id: formGroup.get('id').value,
      title: formGroup.get('title').value
    }
  }
}
