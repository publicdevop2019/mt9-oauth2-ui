import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormInfoService } from 'mt-form-builder';
import { AbstractAggregate } from 'src/app/clazz/abstract-aggregate';
import { IEndpoint } from 'src/app/clazz/validation/aggregate/endpoint/interfaze-endpoint';
import { EndpointValidator } from 'src/app/clazz/validation/aggregate/endpoint/validator-endpoint';
import { ErrorMessage } from 'src/app/clazz/validation/validator-common';
import { FORM_CONFIG } from 'src/app/form-configs/endpoint.config';
import { EndpointService } from 'src/app/services/endpoint.service';
@Component({
  selector: 'app-endpoint',
  templateUrl: './endpoint.component.html',
  styleUrls: ['./endpoint.component.css']
})
export class EndpointComponent extends AbstractAggregate<EndpointComponent,IEndpoint> implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    public endpointSvc: EndpointService,
    private fis: FormInfoService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    bottomSheetRef: MatBottomSheetRef<EndpointComponent>
  ) {
    super('securityProfile',JSON.parse(JSON.stringify(FORM_CONFIG)),new EndpointValidator(),bottomSheetRef,data)
  }
  ngOnDestroy(): void {
    this.fis.resetAll();
  }
  ngAfterViewInit(): void {
    if (this.aggregate) {
      this.fis.restore(this.formId, this.aggregate)
    }
    else {

    }
  }
  ngOnInit() {
  }
  convertToPayload(endpointCmpt: EndpointComponent): IEndpoint {
    let formGroup = endpointCmpt.fis.formGroupCollection[endpointCmpt.formId];
    return {
      id: formGroup.get('id').value,
      description: formGroup.get('description').value,
      resourceId: formGroup.get('resourceId').value,
      path: formGroup.get('path').value,
      method: formGroup.get('method').value,
      expression: formGroup.get('expression').value,
    }
  }
  update() {
    if (this.validateHelper.validate(this.validator, this.convertToPayload, 'rootUpdateEndpointCommandValidator', this.fis, this, this.errorMapper))
      this.endpointSvc.update(this.fis.formGroupCollection[this.formId].get('id').value, this.convertToPayload(this), this.changeId)
  }
  create() {
    if (this.validateHelper.validate(this.validator, this.convertToPayload, 'rootCreateEndpointCommandValidator', this.fis, this, this.errorMapper))
      this.endpointSvc.create(this.convertToPayload(this), this.changeId)
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
