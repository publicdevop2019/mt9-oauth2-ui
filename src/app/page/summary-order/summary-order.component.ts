import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { IClient } from '../summary-client/summary-client.component';
import { ClientService } from 'src/app/service/client.service';
import { IOrder } from 'src/app/interfaze/commom.interface';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-summary-order',
  templateUrl: './summary-order.component.html',
  styleUrls: ['./summary-order.component.css']
})
export class SummaryOrderComponent implements OnInit {
  displayedColumns: string[] = ['id', 'productList', 'finalPrice', 'star'];
  dataSource: MatTableDataSource<IOrder>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(public orderSvc: OrderService) {
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
