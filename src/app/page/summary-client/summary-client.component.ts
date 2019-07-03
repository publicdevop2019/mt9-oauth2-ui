import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ClientService } from 'src/app/service/client.service';
export interface IAuthority {
  grantedAuthority: string;
}
export enum grantTypeEnums {
  refresh_token = 'refresh_token',
  password = 'password',
  client_credentials = 'client_credentials',
  authorization_code = 'authorization_code'
}
export enum scopeEnums {
  read = 'read',
  write = 'write',
  trust = 'trust'
}
export interface IClient {
  id?: number;
  clientId: string;
  clientSecret?: string;
  grantTypeEnums: grantTypeEnums[];
  grantedAuthorities: IAuthority[];
  scopeEnums: scopeEnums[];
  accessTokenValiditySeconds: number;
  refreshTokenValiditySeconds: number;
  resourceIds: string[]
  hasSecret: boolean;
  resourceIndicator:boolean;
  registeredRedirectUri:string[]
}

@Component({
  selector: 'app-summary-client',
  templateUrl: './summary-client.component.html',
  styleUrls: ['./summary-client.component.css']
})
export class SummaryClientComponent implements OnInit {
  displayedColumns: string[] = ['id', 'clientId', 'hasSecret', 'star'];
  dataSource: MatTableDataSource<IClient>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private clientService: ClientService) {
    this.clientService.getClients().subscribe(clients => {
      this.clientService.cachedClients = clients;
      this.dataSource = new MatTableDataSource(clients)
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

}