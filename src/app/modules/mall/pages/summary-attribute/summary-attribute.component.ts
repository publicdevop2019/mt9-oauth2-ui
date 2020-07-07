import { Component, OnInit, ViewChild } from '@angular/core';
import { IAttribute, AttributeService } from 'src/app/services/attribute.service';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, MatBottomSheet, MatBottomSheetConfig } from '@angular/material';
import { DeviceService } from 'src/app/services/device.service';
import { AttributeComponent } from '../attribute/attribute.component';

@Component({
  selector: 'app-summary-attribute',
  templateUrl: './summary-attribute.component.html',
})
export class SummaryAttributeComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description', 'value', 'type', 'edit', 'delete'];
  dataSource: MatTableDataSource<IAttribute>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    public attrSvc: AttributeService,
    public deviceSvc: DeviceService,
    private _bottomSheet: MatBottomSheet,
  ) {
    this.attrSvc.getAttributeList().subscribe(next => {
      this.dataSource = new MatTableDataSource(next.data)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }
  openBottomSheet(id?: number): void {
    let config = new MatBottomSheetConfig();
    config.autoFocus = true;
    if (id) {
      this.attrSvc.getAttributeById(id).subscribe(next => {
        config.data = next;
        this._bottomSheet.open(AttributeComponent, config);
      })
    } else {
      this._bottomSheet.open(AttributeComponent, config);
    }
  }
  ngOnInit() {
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  pageHandler(e: PageEvent) {
    this.attrSvc.currentPageIndex = e.pageIndex
  }
}
