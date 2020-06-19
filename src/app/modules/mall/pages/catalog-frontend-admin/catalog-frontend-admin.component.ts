import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormInfoService } from 'mt-form-builder';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ValidateHelper } from 'src/app/clazz/validateHelper';
import { FORM_CONFIG } from 'src/app/form-configs/catalog.config';
import { CategoryService, ICatalogCustomer } from 'src/app/services/category.service';
import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-catalog-frontend-admin',
  templateUrl: './catalog-frontend-admin.component.html',
  styleUrls: ['./catalog-frontend-admin.component.css']
})
export class CatalogCustomerComponent implements OnInit, AfterViewInit, OnDestroy {
  state: string;
  category: ICatalogCustomer;
  category$: Observable<ICatalogCustomer>;
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
          this.fis.formGroupCollection[this.formId].get('id').setValue(byId.id);
          this.fis.formGroupCollection[this.formId].get('name').setValue(byId.name);
          this.fis.formGroupCollection[this.formId].get('parentId').setValue(byId.parentId);
          this.fis.formGroupCollection[this.formId].get('catalogType').setValue(byId.catalogType);
          if (byId.tags)
            this.fis.formGroupCollection[this.formId].get('tags').setValue(byId.tags.join(','));
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
        this.categorySvc.getCatalogById(+params.get('id')))
    );
  }
  convertToCategoryPayload(): ICatalogCustomer {
    let formGroup = this.fis.formGroupCollection[this.formId];

    return {
      id: formGroup.get('id').value,
      name: formGroup.get('name').value,
      parentId: formGroup.get('parentId').value,
      tags: formGroup.get('tags').value ? String(formGroup.get('tags').value).split(',') : null,
      catalogType: formGroup.get('catalogType').value ? formGroup.get('catalogType').value : null,
    }
  }
}
