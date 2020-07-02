import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CategoryService, ICatalogCustomer, ICatalogCustomerTreeNode, ICatalogCustomerHttp } from 'src/app/services/category.service';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material';
import { FlatTreeControl } from '@angular/cdk/tree';
import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { FORM_CONFIG } from 'src/app/form-configs/catalog-view.config';
import { FormInfoService } from 'mt-form-builder';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceService } from 'src/app/services/device.service';
export interface CatalogCustomerFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-summary-category',
  templateUrl: './summary-catalog.component.html',
})
export class SummaryCatalogComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  formId = 'summaryCatalogCustomerView';
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  displayedColumns: string[] = ['id', 'name', 'parentId', 'attributes', 'star'];
  dataSource: MatTableDataSource<ICatalogCustomer>;
  catalogType: string;
  viewType: "TREE_VIEW" | "LIST_VIEW" = "LIST_VIEW";
  pageSizeOffset = 2;
  public catalogsData: ICatalogCustomer[];
  constructor(public categorySvc: CategoryService, private fis: FormInfoService, public translate: TranslateService, private route: ActivatedRoute, private router: Router, public deviceSvc: DeviceService) {
    this.route.queryParamMap.subscribe(queryMaps => {
      this.catalogType = queryMaps.get('type');
      let ob: Observable<ICatalogCustomerHttp>;
      if (queryMaps.get('type') === 'frontend') {
        ob = this.categorySvc.getCatalogFrontend();
      } else if (queryMaps.get('type') === 'backend') {
        ob = this.categorySvc.getCatalogBackend();
      } else {
        console.error('unknow catalog type')
      }
      ob.subscribe(catalogs => {
        this.dataSource = new MatTableDataSource(catalogs.data)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (catalogs.data) {
          this.catalogsData = catalogs.data;
        }
      })
    });
  }
  ngOnDestroy(): void {
    if (this.sub)
      this.sub.unsubscribe();
  }
  ngAfterViewInit(): void {
    this.fis.formGroupCollection[this.formId].valueChanges.subscribe(e => {
      this.viewType = e.view;
    });
    this.fis.formGroupCollection[this.formId].get('view').setValue(this.viewType);
  }
  private sub: Subscription;
  private transKeyMap: Map<string, string> = new Map();
  ngOnInit() {
    this.formInfo.inputs.forEach(e => {
      if (e.options) {
        e.options.forEach(el => {
          this.translate.get(el.label).subscribe((res: string) => {
            this.transKeyMap.set(e.key + el.value, el.label);
            el.label = res;
          });
        })
      }
      e.label && this.translate.get(e.label).subscribe((res: string) => {
        this.transKeyMap.set(e.key, e.label);
        e.label = res;
      });
    })
    this.sub = this.translate.onLangChange.subscribe(() => {
      this.formInfo.inputs.forEach(e => {
        e.label && this.translate.get(this.transKeyMap.get(e.key)).subscribe((res: string) => {
          e.label = res;
        });
        if (e.options) {
          e.options.forEach(el => {
            this.translate.get(this.transKeyMap.get(e.key + el.value)).subscribe((res: string) => {
              el.label = res;
            });
          })
        }
      })
    })
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  pageHandler(e: PageEvent) {
    this.categorySvc.currentPageIndex = e.pageIndex
  }
  navCatalog($event: ICatalogCustomer) {
    this.router.navigate(['/dashboard/catalogs/' + $event.id], { queryParams: { state: 'update', type: $event.catalogType } })
  }
}
