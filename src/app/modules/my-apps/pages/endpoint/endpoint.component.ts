import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormInfoService } from 'mt-form-builder';
import { Aggregate } from 'src/app/clazz/abstract-aggregate';
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
export class EndpointComponent extends Aggregate<EndpointComponent, IEndpoint> implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    public endpointSvc: EndpointService,
    fis: FormInfoService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    bottomSheetRef: MatBottomSheetRef<EndpointComponent>,
    cdr: ChangeDetectorRef
  ) {
    super('securityProfile', JSON.parse(JSON.stringify(FORM_CONFIG)), new EndpointValidator(), bottomSheetRef, data, fis, cdr)
  }
  ngOnDestroy(): void {
    this.cleanUp()
  }
  ngAfterViewInit(): void {
    if (this.aggregate && this.eventStore.length === 0) {
      this.fis.restore(this.formId, this.aggregate)
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
      expression: formGroup.get('expression').value,
      version:cmpt.aggregate&&cmpt.aggregate.version
    }
  }
  update() {
    if (this.validateHelper.validate(this.validator, this.convertToPayload, 'rootUpdateEndpointCommandValidator', this.fis, this, this.errorMapper))
      this.endpointSvc.update(this.aggregate.id, this.convertToPayload(this), this.changeId, this.eventStore,this.version)
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
