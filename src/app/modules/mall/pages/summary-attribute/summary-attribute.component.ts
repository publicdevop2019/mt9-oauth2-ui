import { Component, OnInit, ViewChild } from '@angular/core';
import { IAttribute, AttributeService } from 'src/app/services/attribute.service';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { DeviceService } from 'src/app/services/device.service';

@Component({
  selector: 'app-summary-attribute',
  templateUrl: './summary-attribute.component.html',
})
export class SummaryAttributeComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'method', 'value', 'type', 'star'];
  dataSource: MatTableDataSource<IAttribute>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(public attrSvc: AttributeService,public deviceSvc:DeviceService) {
    this.attrSvc.getAttributeList().subscribe(next => {
      this.dataSource = new MatTableDataSource(next.data)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
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
