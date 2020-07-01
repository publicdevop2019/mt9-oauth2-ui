import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent } from '@angular/material';
import { IOrder } from 'src/app/interfaze/commom.interface';
import { OrderService } from 'src/app/services/order.service';
import { DeviceService } from 'src/app/services/device.service';

@Component({
  selector: 'app-summary-order',
  templateUrl: './summary-order.component.html',
  styleUrls: ['./summary-order.component.css']
})
export class SummaryOrderComponent implements OnInit {
  displayedColumns: string[] = ['id', 'productList', 'paymentAmt','orderState','star'];
  dataSource: MatTableDataSource<IOrder>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(public orderSvc: OrderService,public deviceSvc:DeviceService) {
    this.orderSvc.getOrders().subscribe(orders => {
      this.dataSource = new MatTableDataSource(orders)
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
    this.orderSvc.currentPageIndex = e.pageIndex
  }
}
