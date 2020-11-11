import { ChangeDetectorRef } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { FormInfoService } from 'mt-form-builder';
import { IAddDynamicFormEvent, IForm, ISetValueEvent } from 'mt-form-builder/lib/classes/template.interface';
import { Subject, Subscription } from 'rxjs';
import * as UUID from 'uuid/v1';
import { EntityCommonService } from './entity.common-service';
import { IBottomSheet, IIdBasedEntity } from './summary.component';
import { ValidatorHelper } from './validateHelper';
import { ErrorMessage, IAggregateValidator } from './validation/validator-common';
export abstract class AbstractAggregate<C, T extends IIdBasedEntity>{
    formId: string;
    formInfo: IForm;
    validator: IAggregateValidator;
    changeId: string = UUID();
    bottomSheetRef: MatBottomSheetRef<C>
    aggregateSvc: EntityCommonService<T, T>
    subs: { [key: string]: Subscription } = {};
    aggregate: T;
    eventStore: any[] = []
    fis: FormInfoService;
    cdr: ChangeDetectorRef;
    delayResume: boolean = false;
    constructor(
        formId: string,
        formInfo: IForm,
        validator: IAggregateValidator,
        bottomSheetRef: MatBottomSheetRef<C>,
        bottomSheetData: IBottomSheet<T>,
        fis: FormInfoService,
        cdr: ChangeDetectorRef,
        skipResume?: boolean
    ) {
        this.formId = formId;
        this.formInfo = formInfo;
        this.validator = validator;
        this.bottomSheetRef = bottomSheetRef;
        this.aggregate = bottomSheetData.from;
        this.eventStore = bottomSheetData.events;
        this.fis = fis;
        this.cdr = cdr;
        if (!skipResume) {
            this.resumeFromEventStore();
        }
        let sub = fis.$eventPub.subscribe(_ => {
            console.dir(_)
            this.eventStore.push(_)
        })
        this.subs['eventPub'] = sub;
    }
    validateHelper = new ValidatorHelper()
    abstract convertToPayload(cmpt: C): T;
    abstract create(): void;
    abstract update(): void;
    abstract errorMapper(original: ErrorMessage[], cmpt: C): ErrorMessage[];
    dismiss(event: MouseEvent) {
        this.bottomSheetRef.dismiss();
        event.preventDefault();
    }
    resumeFromEventStore() {
        //dispatch stored events
        if (this.eventStore.length>0) {
            this.fis.eventEmit = false;
            let eventCount = new Subject<number>();
            let count = 0;
            eventCount.subscribe(_ => {
                count++;
                if (count === this.eventStore.length) {
                    console.dir('event complete ')
                    //replay complete
                    this.fis.eventEmit = true;
                }
            })
            this.eventStore.forEach(e => {
                console.dir('dispatch stored event')
                if (e.type === 'setvalue') {
                    let e2 = e as ISetValueEvent;
                    setTimeout(() => {
                        this.fis.formGroupCollection[e2.formId].get(e2.key).setValue(e2.value)
                        eventCount.next();
                    }, 0, eventCount)
                } else if (e.type === 'addForm') {
                    let e2 = e as IAddDynamicFormEvent;
                    setTimeout(() => {
                        this.fis.add(e2.formId);//this will not emit add event
                        this.cdr.markForCheck();
                        eventCount.next();
                    }, 0, eventCount)
                }
            })
        }
    }
}