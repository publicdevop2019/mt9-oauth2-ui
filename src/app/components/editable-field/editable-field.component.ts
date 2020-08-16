import { Component, OnInit, Input, HostBinding, HostListener, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-editable-field',
  templateUrl: './editable-field.component.html',
  styleUrls: ['./editable-field.component.css']
})
export class EditableFieldComponent implements OnInit {
  @Input() inputValue: string;
  @Output() newValue: EventEmitter<string>=new EventEmitter();
  displayEdit = 'none';
  editView: false;
  constructor() {
  }

  ngOnInit() {
  }
  showEditIcon() {
    this.displayEdit = 'block'
  }
  hideEditIcon() {
    this.displayEdit = 'none'
  }
  doCancel() {
    this.displayEdit = 'none';
    this.editView = false;
  }
  doUpdate(newValue: string) {
    this.newValue.emit(newValue);
    this.displayEdit = 'none';
    this.editView = false;
  }

}
