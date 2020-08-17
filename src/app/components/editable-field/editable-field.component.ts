import { Component, OnInit, Input, HostBinding, HostListener, Output, EventEmitter } from '@angular/core';
export interface IEditEvent {
  original: string,
  next: string
}
@Component({
  selector: 'app-editable-field',
  templateUrl: './editable-field.component.html',
  styleUrls: ['./editable-field.component.css']
})
export class EditableFieldComponent implements OnInit {
  @Input() inputValue: string = '';
  @Output() newValue: EventEmitter<IEditEvent> = new EventEmitter();
  displayEdit = 'hidden';
  editView: false;
  constructor() {
  }

  ngOnInit() {
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
  doUpdate(newValue: string) {
    this.newValue.emit({ original: this.inputValue, next: newValue });
    this.displayEdit = 'hidden';
    this.editView = false;
  }

}
