import { Component, OnInit } from '@angular/core';
import { OverlayService } from 'src/app/services/overlay.service';
@Component({
  selector: 'app-object-detail',
  templateUrl: './object-detail.component.html',
  styleUrls: ['./object-detail.component.css']
})
export class ObjectDetailComponent implements OnInit {
  constructor(private overlaySvc: OverlayService) {
  }
  ngOnInit(): void {
  }
  printJson() {
    return JSON.stringify(this.overlaySvc.data, null, 4)
  }
}
