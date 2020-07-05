import { Component, OnInit } from '@angular/core';
import { IAttribute, AttributeService } from 'src/app/services/attribute.service';
import { Observable, Subscription } from 'rxjs';
import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { FORM_CONFIG, FORM_CONFIG_ATTR_VALUE } from 'src/app/form-configs/attribute.config';
import { ValidateHelper } from 'src/app/clazz/validateHelper';
import { ActivatedRoute } from '@angular/router';
import { CategoryService, ICatalogCustomer } from 'src/app/services/category.service';
import { FormInfoService } from 'mt-form-builder';
import { TranslateService } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.css']
})
export class AttributeComponent implements OnInit {

  state: string;
  attribute: IAttribute;
  attribute$: Observable<IAttribute>;
  formId = 'attributes';
  manualEnter = false;
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  formIdAttrValue = 'attributesValue';
  formInfoAttrValue: IForm = JSON.parse(JSON.stringify(FORM_CONFIG_ATTR_VALUE));
  formInfoAttrValueI18n: IForm = JSON.parse(JSON.stringify(FORM_CONFIG_ATTR_VALUE));
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
          this.fis.formGroupCollection[this.formId].get('type').setValue(byId.type);
          this.fis.formGroupCollection[this.formId].get('description').setValue(byId.description);
          setTimeout(() => {
            if (byId.selectValues && byId.selectValues.length !== 0) {
              byId.selectValues.forEach((e, index) => {
                if (index === 0) {
                  this.fis.formGroupCollection[this.formIdAttrValue].get('attrValue').setValue(e);
                } else {
                  this.fis.formGroupCollection[this.formIdAttrValue].addControl('attrValue_' + this.fis.formGroupCollection_index[this.formIdAttrValue], new FormControl(e));
                  this.fis.add(this.formIdAttrValue);
                }
                this.fis.refreshLayout(this.formInfoAttrValue, this.formIdAttrValue);
              })
            }
          }, 0)
        });
      } else if (queryMaps.get('state') === 'none') {

      } else {
      }
    });
    this.fis.formGroupCollection[this.formId].get('method').valueChanges.subscribe(next => {
      this.manualEnter = next === 'SELECT';
      if (this.manualEnter) {
        this.formInfoAttrValue = JSON.parse(JSON.stringify(this.formInfoAttrValueI18n));
      }
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
    this.formInfoAttrValue.inputs.filter(e => e.label).forEach(e => {
      this.translate.get(e.label).subscribe((res: string) => {
        this.transKeyMap.set(e.key, e.label);
        e.label = res;
      });
    })
    this.formInfoAttrValueI18n = JSON.parse(JSON.stringify(this.formInfoAttrValue));
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
      });
      this.formInfoAttrValue.inputs.filter(e => e.label).forEach(e => {
        this.translate.get(e.label).subscribe((res: string) => {
          this.transKeyMap.set(e.key, e.label);
          e.label = res;
        });
      })
    });
    this.attribute$ = this.attributeSvc.getAttributeById(+this.route.snapshot.paramMap.get('id'))
  }
  convertToPayload(): IAttribute {
    let formGroup = this.fis.formGroupCollection[this.formId];
    let values = null;
    if (formGroup.get('method').value === 'SELECT') {
      let valueSnapshot = this.fis.formGroupCollection[this.formIdAttrValue].value;
      values = Object.keys(valueSnapshot).map(e => valueSnapshot[e] as string);
    }
    return {
      id: formGroup.get('id').value,
      name: formGroup.get('name').value,
      description: formGroup.get('description').value ? formGroup.get('description').value : null,
      method: formGroup.get('method').value,
      selectValues: values,
      type: formGroup.get('type').value,
    }
  }
}
