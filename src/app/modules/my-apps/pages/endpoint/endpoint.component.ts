import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormInfoService } from 'mt-form-builder';
import { IOption } from 'mt-form-builder/lib/classes/template.interface';
import { combineLatest, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { Aggregate } from 'src/app/clazz/abstract-aggregate';
import { IEndpoint } from 'src/app/clazz/validation/aggregate/endpoint/interfaze-endpoint';
import { EndpointValidator } from 'src/app/clazz/validation/aggregate/endpoint/validator-endpoint';
import { ErrorMessage, hasValue } from 'src/app/clazz/validation/validator-common';
import { FORM_CONFIG } from 'src/app/form-configs/endpoint.config';
import { ClientService } from 'src/app/services/client.service';
import { EndpointService } from 'src/app/services/endpoint.service';
@Component({
  selector: 'app-endpoint',
  templateUrl: './endpoint.component.html',
  styleUrls: ['./endpoint.component.css']
})
export class EndpointComponent extends Aggregate<EndpointComponent, IEndpoint> implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    public endpointSvc: EndpointService,
    public clientSvc: ClientService,
    fis: FormInfoService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    bottomSheetRef: MatBottomSheetRef<EndpointComponent>,
    cdr: ChangeDetectorRef
  ) {
    super('securityProfile', JSON.parse(JSON.stringify(FORM_CONFIG)), new EndpointValidator(), bottomSheetRef, data, fis, cdr)
    this.fis.queryProvider[this.formId + '_' + 'resourceId'] = clientSvc;
    this.fis.$ready.pipe(filter(e => e === this.formId)).pipe(take(1)).subscribe(_ => {
      this.fis.formGroupCollection[this.formId].valueChanges.subscribe(() => {

        this.fis.formGroupCollection_formInfo[this.formId].inputs.filter(e => ['limitAccess', 'clientScopes'].includes(e.key)).forEach(ee => {
          ee.display = !!this.fis.formGroupCollection[this.formId].get('secured').value
        })
        this.fis.formGroupCollection_formInfo[this.formId].inputs.filter(e => ['clientRoles'].includes(e.key)).forEach(ee => {
          if (!!this.fis.formGroupCollection[this.formId].get('secured').value) {
            if ((!this.fis.formGroupCollection[this.formId].get('limitAccess').value || this.fis.formGroupCollection[this.formId].get('limitAccess').value === 'clientOnly')) {
              ee.display = true
            } else {
              ee.display = false
            }
          } else {
            ee.display = false;
          }
        })
        this.fis.formGroupCollection_formInfo[this.formId].inputs.filter(e => ['userRoles'].includes(e.key)).forEach(ee => {
          if (!!this.fis.formGroupCollection[this.formId].get('secured').value) {
            if ((!this.fis.formGroupCollection[this.formId].get('limitAccess').value || this.fis.formGroupCollection[this.formId].get('limitAccess').value === 'userOnly')) {
              ee.display = true
            } else {
              ee.display = false
            }
          } else {
            ee.display = false;
          }
        })
        this.fis.formGroupCollection_formInfo[this.formId].inputs.filter(e => ['method'].includes(e.key)).forEach(ee => {
          ee.display = this.fis.formGroupCollection[this.formId].get('isWebsocket').value === 'yes'
        })
        this.fis.formGroupCollection_formInfo[this.formId].inputs.filter(e => ['method'].includes(e.key)).forEach(ee => {
          ee.display = this.fis.formGroupCollection[this.formId].get('isWebsocket').value === 'no';
        })
        //if auth is required then is client only
        if (this.fis.formGroupCollection[this.formId].get('isWebsocket').value === 'yes') {
          this.fis.formGroupCollection_formInfo[this.formId].inputs.filter(e => ['limitAccess'].includes(e.key)).forEach(ee => {
            this.fis.formGroupCollection[this.formId].get('limitAccess').disable({ emitEvent: false })
            // this.fis.$refresh.next();
          })
          this.fis.formGroupCollection_formInfo[this.formId].inputs.filter(e => ['clientRoles'].includes(e.key)).forEach(ee => {
            ee.display = false;
          })
          this.fis.formGroupCollection[this.formId].get('limitAccess').setValue('userOnly', { emitEvent: false })
        } else if(this.fis.formGroupCollection[this.formId].get('isWebsocket').value === 'no'){
          this.fis.formGroupCollection[this.formId].get('limitAccess').enable({ emitEvent: false })
        }
      })
    })
  }
  ngOnDestroy(): void {
    this.cleanUp()
  }
  ngAfterViewInit(): void {
    if (this.aggregate) {
      combineLatest([this.clientSvc.readEntityByQuery(0, 1, 'id:' + this.aggregate.resourceId)]).pipe(take(1))
        .subscribe(next => {
          this.formInfo.inputs.find(e => e.key === 'resourceId').options = next[0].data.map(e => <IOption>{ label: e.name, value: e.id })

          this.fis.restore(this.formId, this.aggregate);
          this.fis.formGroupCollection[this.formId].get("secured").setValue(this.aggregate.secured);
          this.fis.formGroupCollection[this.formId].get("isWebsocket").setValue(this.aggregate.websocket ? 'yes' : 'no');
          if (this.aggregate.userOnly)
            this.fis.formGroupCollection[this.formId].get("limitAccess").setValue('userOnly');
          if (this.aggregate.clientOnly) {
            this.fis.formGroupCollection[this.formId].get("limitAccess").setValue('clientOnly');
          }
          this.fis.formGroupCollection_formInfo[this.formId].inputs.filter(e => ['userRoles'].includes(e.key)).forEach(ee => {
            ee.display = (this.fis.formGroupCollection[this.formId].get("limitAccess").value === 'userOnly' || !this.fis.formGroupCollection[this.formId].get("limitAccess").value)
          });
          this.fis.formGroupCollection_formInfo[this.formId].inputs.filter(e => ['clientRoles'].includes(e.key)).forEach(ee => {
            ee.display = (this.fis.formGroupCollection[this.formId].get("limitAccess").value === 'clientOnly' || !this.fis.formGroupCollection[this.formId].get("limitAccess").value)
          });
          this.fis.formGroupCollection[this.formId].get("clientRoles").setValue(this.aggregate.clientRoles);
          this.fis.formGroupCollection[this.formId].get("clientScopes").setValue(this.aggregate.clientScopes);
          this.fis.formGroupCollection[this.formId].get("userRoles").setValue(this.aggregate.userRoles);
        })

    }
  }
  ngOnInit() {
  }
  convertToPayload(cmpt: EndpointComponent): IEndpoint {
    let formGroup = cmpt.fis.formGroupCollection[cmpt.formId];
    const secured = !!formGroup.get('secured').value;
    return {
      id: formGroup.get('id').value,
      description: formGroup.get('description').value ? formGroup.get('description').value : null,
      resourceId: formGroup.get('resourceId').value,
      path: formGroup.get('path').value,
      method: formGroup.get('method').value,
      secured: secured,
      userOnly: secured ? formGroup.get('limitAccess').value === 'userOnly' : false,
      clientOnly: secured ? formGroup.get('limitAccess').value === 'clientOnly' : false,
      clientRoles: secured ? (formGroup.get('clientRoles').value || []) : [],
      clientScopes: secured ? (formGroup.get('clientScopes').value || []) : [],
      userRoles: secured ? (formGroup.get('userRoles').value || []) : [],
      websocket: formGroup.get('isWebsocket').value === 'yes',
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
