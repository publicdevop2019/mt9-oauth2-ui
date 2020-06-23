import { Component, OnInit } from '@angular/core';
import { IAttribute, AttributeService } from 'src/app/services/attribute.service';
import { Observable, Subscription } from 'rxjs';
import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { FORM_CONFIG } from 'src/app/form-configs/attribute.config';
import { ValidateHelper } from 'src/app/clazz/validateHelper';
import { ActivatedRoute } from '@angular/router';
import { CategoryService, ICatalogCustomer } from 'src/app/services/category.service';
import { FormInfoService } from 'mt-form-builder';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.css']
})
export class AttributeComponent implements OnInit {

  state: string;
  attribute: IAttribute;
  attribute$: Observable<IAttribute>;
  formId = 'tag';
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  validator: ValidateHelper;
  constructor(
    private route: ActivatedRoute,
    public attributeSvc: AttributeService,
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
        this.attribute$.subscribe(byId => {
          this.fis.formGroupCollection[this.formId].get('id').setValue(byId.id);
          this.fis.formGroupCollection[this.formId].get('name').setValue(byId.name);
          this.fis.formGroupCollection[this.formId].get('method').setValue(byId.method);
          this.fis.formGroupCollection[this.formId].get('value').setValue(byId.value);
        })
      } else if (queryMaps.get('state') === 'none') {

      } else {
      }
    });
    this.fis.formGroupCollection[this.formId].get('method').valueChanges.subscribe(next => {
      this.formInfo.inputs.find(e => e.key === 'value').display = next === 'SELECT';
    })
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
    this.attribute$ = this.attributeSvc.getAttributeById(+this.route.snapshot.paramMap.get('id'))
  }
  convertToPayload(): IAttribute {
    let formGroup = this.fis.formGroupCollection[this.formId];
    return {
      id: formGroup.get('id').value,
      name: formGroup.get('name').value,
      value: formGroup.get('value').value,
      method: formGroup.get('method').value,
    }
  }
}
