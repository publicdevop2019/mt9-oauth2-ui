import { ChangeDetectorRef } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { FormInfoService } from 'mt-form-builder';
import { IAddDynamicFormEvent, IRemoveDynamicFormEvent, IForm, ISetValueEvent } from 'mt-form-builder/lib/classes/template.interface';
import { Subject, Subscription } from 'rxjs';
import * as UUID from 'uuid/v1';
import { EntityCommonService } from './entity.common-service';
import { IBottomSheet, IIdBasedEntity } from './summary.component';
import { ValidatorHelper } from './validateHelper';
import { ErrorMessage, IAggregateValidator } from './validation/validator-common';
export abstract class Aggregate<C, T extends IIdBasedEntity>{
    formId: string;
    formInfo: IForm;
    validator: IAggregateValidator;
    changeId: string = UUID();
    bottomSheetRef: MatBottomSheetRef<C>
    aggregateSvc: EntityCommonService<T, T>
    subs: { [key: string]: Subscription } = {};
    aggregate: T;
    eventStore: any[] = []
    eventVersion: number;
    fis: FormInfoService;
    cdr: ChangeDetectorRef;
    delayResume: boolean = false;
    resumeComplete: Subject<boolean> = new Subject<boolean>();
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
        this.eventStore = bottomSheetData.events?.events || [];
        this.eventVersion = bottomSheetData.events?.version;
        this.fis = fis;
        this.cdr = cdr;
        if (!skipResume) {
            this.resumeFromEventStore();
        }
        let sub = fis.$eventPub.subscribe(_ => {
            console.dir('[DEV ONLY] capture event')
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
    cleanUp() {
        Object.keys(this.subs).forEach(k => { this.subs[k].unsubscribe() })
        this.fis.resetAll();
    }
    resumeFromEventStore() {
        //dispatch stored events
        if (this.eventStore.length > 0) {
            this.fis.eventEmit = false;
            let eventCount = new Subject<number>();
            let count = 0;
            eventCount.subscribe(_ => {
                count++;
                if (count === this.eventStore.length) {
                    console.dir('[DEV ONLY] event complete ')
                    this.fis.eventEmit = true;
                    this.resumeComplete.next(true)
                }
            })
            this.eventStore.forEach(e => {
                console.dir('[DEV ONLY] dispatch stored event')
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
                } else if (e.type === 'deleteForm') {
                    let e2 = e as IRemoveDynamicFormEvent;
                    setTimeout(() => {
                        this.fis.remove(e2.index, e2.formId);//this will not emit add event
                        this.cdr.markForCheck();
                        eventCount.next();
                    }, 0, eventCount)
                }
            })
        }
    }
}