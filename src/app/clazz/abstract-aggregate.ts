import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { Subscription } from 'rxjs';
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
    constructor(formId: string, formInfo: IForm, validator: IAggregateValidator, bottomSheetRef: MatBottomSheetRef<C>, bottomSheetData: IBottomSheet<T>) {
        this.formId = formId;
        this.formInfo = formInfo;
        this.validator = validator;
        this.bottomSheetRef = bottomSheetRef;
        this.aggregate = bottomSheetData.from;
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
}