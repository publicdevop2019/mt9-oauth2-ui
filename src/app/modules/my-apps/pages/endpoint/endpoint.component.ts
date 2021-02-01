import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormInfoService } from 'mt-form-builder';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { Aggregate } from 'src/app/clazz/abstract-aggregate';
import { IEndpoint } from 'src/app/clazz/validation/aggregate/endpoint/interfaze-endpoint';
import { EndpointValidator } from 'src/app/clazz/validation/aggregate/endpoint/validator-endpoint';
import { ErrorMessage, hasValue } from 'src/app/clazz/validation/validator-common';
import { FORM_CONFIG } from 'src/app/form-configs/endpoint.config';
import { EndpointService } from 'src/app/services/endpoint.service';
@Component({
  selector: 'app-endpoint',
  templateUrl: './endpoint.component.html',
  styleUrls: ['./endpoint.component.css']
})
export class EndpointComponent extends Aggregate<EndpointComponent, IEndpoint> implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    public endpointSvc: EndpointService,
    fis: FormInfoService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    bottomSheetRef: MatBottomSheetRef<EndpointComponent>,
    cdr: ChangeDetectorRef
  ) {
    super('securityProfile', JSON.parse(JSON.stringify(FORM_CONFIG)), new EndpointValidator(), bottomSheetRef, data, fis, cdr)
    this.fis.$ready.pipe(filter(e => e === this.formId)).pipe(take(1)).subscribe(_ => {
      this.fis.formGroupCollection[this.formId].get('secured').valueChanges.subscribe(next => {
        this.fis.formGroupCollection_formInfo[this.formId].inputs.filter(e => ['limitAccess', 'clientRoles', 'clientScopes', 'userRoles'].includes(e.key)).forEach(ee => {
          ee.display = next
        })
      })
      this.fis.formGroupCollection[this.formId].get('limitAccess').valueChanges.subscribe(next => {
        this.fis.formGroupCollection_formInfo[this.formId].inputs.filter(e => ['clientRoles'].includes(e.key)).forEach(ee => {
          ee.display = next === 'clientOnly'
        })
        this.fis.formGroupCollection_formInfo[this.formId].inputs.filter(e => ['userRoles'].includes(e.key)).forEach(ee => {
          ee.display = next === 'userOnly'
        })
      })
    })
  }
  ngOnDestroy(): void {
    this.cleanUp()
  }
  ngAfterViewInit(): void {
    if (this.aggregate && this.eventStore.length === 0) {
      this.fis.restore(this.formId, this.aggregate);
      this.fis.formGroupCollection[this.formId].get("secured").setValue(this.aggregate.secured);
      if (this.aggregate.userOnly)
        this.fis.formGroupCollection[this.formId].get("limitAccess").setValue('userOnly');
      if (this.aggregate.clientOnly) {
        this.fis.formGroupCollection[this.formId].get("limitAccess").setValue('clientOnly');
      }
      this.fis.formGroupCollection_formInfo[this.formId].inputs.filter(e => ['userRoles'].includes(e.key)).forEach(ee => {
        ee.display = this.fis.formGroupCollection[this.formId].get("limitAccess").value === 'userOnly'
      });
      this.fis.formGroupCollection_formInfo[this.formId].inputs.filter(e => ['clientRoles'].includes(e.key)).forEach(ee => {
        ee.display = this.fis.formGroupCollection[this.formId].get("limitAccess").value === 'clientOnly'
      });
      this.fis.formGroupCollection[this.formId].get("clientRoles").setValue(this.aggregate.clientRoles);
      this.fis.formGroupCollection[this.formId].get("clientScopes").setValue(this.aggregate.clientScopes);
      this.fis.formGroupCollection[this.formId].get("userRoles").setValue(this.aggregate.userRoles);
    }
    else {

    }
  }
  ngOnInit() {
  }
  convertToPayload(cmpt: EndpointComponent): IEndpoint {
    let formGroup = cmpt.fis.formGroupCollection[cmpt.formId];
    return {
      id: formGroup.get('id').value,
      description: formGroup.get('description').value ? formGroup.get('description').value : null,
      resourceId: formGroup.get('resourceId').value,
      path: formGroup.get('path').value,
      method: formGroup.get('method').value,
      secured: formGroup.get('secured').value,
      userOnly: formGroup.get('limitAccess').value === 'userOnly',
      clientOnly: formGroup.get('limitAccess').value === 'clientOnly',
      clientRoles: formGroup.get('clientRoles').value,
      clientScopes: formGroup.get('clientScopes').value,
      userRoles: formGroup.get('userRoles').value,
      version: cmpt.aggregate && cmpt.aggregate.version
    }
  }
  update() {
    if (this.validateHelper.validate(this.validator, this.convertToPayload, 'rootUpdateEndpointCommandValidator', this.fis, this, this.errorMapper))
      this.endpointSvc.update(this.aggregate.id, this.convertToPayload(this), this.changeId, this.eventStore, this.eventVersion)
  }
  create() {
    if (this.validateHelper.validate(this.validator, this.convertToPayload, 'rootCreateEndpointCommandValidator', this.fis, this, this.errorMapper))
      this.endpointSvc.create(this.convertToPayload(this), this.changeId, this.eventStore)
  }
  errorMapper(original: ErrorMessage[], cmpt: EndpointComponent) {
    return original.map(e => {
      return {
        ...e,
        formId: cmpt.formId
      }
    })
  }
}
