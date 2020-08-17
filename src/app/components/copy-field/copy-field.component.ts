import { Component, OnInit, Input } from '@angular/core';
import { CustomHttpInterceptor } from 'src/app/services/http.interceptor';

@Component({
  selector: 'app-copy-field',
  templateUrl: './copy-field.component.html',
  styleUrls: ['./copy-field.component.css']
})
export class CopyFieldComponent implements OnInit {

  @Input() inputValue: string = '';
  displayEdit = 'hidden';
  editView: false;
  constructor(private _httpInterceptor: CustomHttpInterceptor) {
  }

  ngOnInit() {
  }
  showIcon() {
    this.displayEdit = 'visible'
  }
  hideIcon() {
    this.displayEdit = 'hidden'
  }
  doCopy() {
    this.updateClipboard(this.inputValue);
  }
  updateClipboard(newClip: string) {
    navigator.clipboard.writeText(newClip).then(() => {
      this._httpInterceptor.openSnackbar('COPY_SUCCESS');
    }, () => {
      this._httpInterceptor.openSnackbar('COPY_FAILED');
    });
  }
}