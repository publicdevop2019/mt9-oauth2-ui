import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormInfoService } from 'mt-form-builder';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ValidateHelper } from 'src/app/clazz/validateHelper';
import { FORM_CONFIG } from 'src/app/form-configs/catalog.config';
import { CategoryService, ICatalogCustomer } from 'src/app/services/category.service';
import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit, AfterViewInit, OnDestroy {
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
    public translate: TranslateService,
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
          if (byId.attributes)
            this.fis.formGroupCollection[this.formId].get('tags').setValue(byId.attributes.join(','));
        })
        // use non-observable hence forkjoin does not work with route observable
        if (this.route.snapshot.queryParamMap.get('type').toLowerCase() === 'frontend') {
          this.category$ = this.categorySvc.getCatalogFrontendById(+this.route.snapshot.paramMap.get('id'))
        } else {
          this.category$ = this.categorySvc.getCatalogBackendById(+this.route.snapshot.paramMap.get('id'))
        }
      } else if (queryMaps.get('state') === 'none') {

      } else {
      }
    });
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  private sub: Subscription;
  private transKeyMap: Map<string, string> = new Map();
  ngOnInit() {
    this.formInfo.inputs.forEach(e => {
      if (e.options) {
        e.options.forEach(el => {
          this.translate.get(el.label).subscribe((res: string) => {
            this.transKeyMap.set(e.key + el.value, el.label);
            el.label = res;
          });
        })
      }
      e.label && this.translate.get(e.label).subscribe((res: string) => {
        this.transKeyMap.set(e.key, e.label);
        e.label = res;
      });
    })
    this.sub = this.translate.onLangChange.subscribe(() => {
      this.formInfo.inputs.forEach(e => {
        e.label && this.translate.get(this.transKeyMap.get(e.key)).subscribe((res: string) => {
          e.label = res;
        });
        if (e.options) {
          e.options.forEach(el => {
            this.translate.get(this.transKeyMap.get(e.key + el.value)).subscribe((res: string) => {
              el.label = res;
            });
          })
        }
      })
    });
  }
  convertToCategoryPayload(): ICatalogCustomer {
    let formGroup = this.fis.formGroupCollection[this.formId];

    return {
      id: formGroup.get('id').value,
      name: formGroup.get('name').value,
      parentId: formGroup.get('parentId').value,
      attributes: formGroup.get('tags').value ? String(formGroup.get('tags').value).split(',') : null,
      catalogType: formGroup.get('catalogType').value ? formGroup.get('catalogType').value : null,
    }
  }
}
