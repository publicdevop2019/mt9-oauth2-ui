import { Component, OnInit, Input, HostBinding, HostListener, Output, EventEmitter } from '@angular/core';
import { IOption } from 'mt-form-builder/lib/classes/template.interface';
import { MatAutocompleteSelectedEvent } from '@angular/material';
export interface IEditListEvent {
  original: IOption[],
  next: IOption[]
}
@Component({
  selector: 'app-editable-list',
  templateUrl: './editable-list.component.html',
  styleUrls: ['./editable-list.component.css']
})
export class EditableListComponent implements OnInit {
  @Input() inputOptions: IOption[] = [];
  @Input() list: IOption[] = [];
  inputOptionsNext: IOption[] = [];
  inputLabelNext: string[] = [];
  inputLabel: string[] = [];
  @Output() newValue: EventEmitter<IEditListEvent> = new EventEmitter();
  displayEdit = 'hidden';
  editView = false;
  constructor() {
  }
  public newInputOptions: string[] = []
  ngOnInit() {
    this.inputLabel = this.inputOptions.map(e => e.label)
  }
  showEditIcon() {
    this.displayEdit = 'visible'
  }
  hideEditIcon() {
    this.displayEdit = 'hidden'
  }
  doCancel() {
    this.displayEdit = 'hidden';
    this.editView = false;
  }
  doUpdate() {
    this.newValue.emit({ original: this.inputOptions, next: this.inputOptionsNext });
    this.displayEdit = 'hidden';
    this.editView = false;
  }
  selected(e: IOption): void {
    this.inputOptionsNext.push(e);
    this.inputLabelNext = this.inputOptionsNext.map(e => e.label);
  }
  doEdit() {
    this.editView = true;
    this.inputOptionsNext = JSON.parse(JSON.stringify(this.inputOptions))
    this.inputLabelNext = this.inputOptionsNext.map(e => e.label)
  }
  remove(item: string): void {
    const index = this.inputLabelNext.indexOf(item);
    if (index >= 0) {
      this.inputLabelNext.splice(index, 1);
    }
  }
}
