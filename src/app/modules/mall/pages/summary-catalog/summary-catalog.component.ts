import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CategoryService, ICatalogCustomer, ICatalogCustomerTreeNode, ICatalogCustomerHttp } from 'src/app/services/catalog.service';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, MatTreeFlatDataSource, MatTreeFlattener, MatBottomSheet, MatBottomSheetConfig } from '@angular/material';
import { FlatTreeControl } from '@angular/cdk/tree';
import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { FORM_CONFIG } from 'src/app/form-configs/catalog-view.config';
import { FormInfoService } from 'mt-form-builder';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceService } from 'src/app/services/device.service';
import { AttributeComponent } from '../attribute/attribute.component';
import { CatalogComponent } from '../catalog/catalog.component';
import { switchMap } from 'rxjs/operators';
import { hasValue } from 'src/app/clazz/utility';
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
  displayedColumns: string[] = ['name', 'parentId', 'attributes', 'edit', 'delete'];
  dataSource: MatTableDataSource<ICatalogCustomer>;
  catalogType: string;
  viewType: "TREE_VIEW" | "LIST_VIEW" = "LIST_VIEW";
  pageSizeOffset = 2;
  public catalogsData: ICatalogCustomer[];
  private subs: Subscription = new Subscription()
  constructor(
    public catalogSvc: CategoryService,
    private fis: FormInfoService,
    public translate: TranslateService,
    private route: ActivatedRoute,
    public deviceSvc: DeviceService,
    private _bottomSheet: MatBottomSheet,
  ) {

    let ob = this.route.queryParamMap.pipe(switchMap(queryMaps => {
      this.catalogType = queryMaps.get('type');
      if (queryMaps.get('type') === 'frontend') {
        return this.catalogSvc.getCatalogFrontend();
      } else if (queryMaps.get('type') === 'backend') {
        return this.catalogSvc.getCatalogBackend();
      } else {
      }
    }));
    let sub = ob.subscribe(next => { this.updateSummaryData(next) });
    let sub0 = this.catalogSvc.refreshSummary.pipe(switchMap(() => ob)).subscribe(next => { this.updateSummaryData(next) });
    this.subs.add(sub)
    this.subs.add(sub0)
  }
  updateSummaryData(catalogs: ICatalogCustomerHttp) {
    this.dataSource = new MatTableDataSource(catalogs.data)
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (catalogs.data) {
      this.catalogsData = catalogs.data;
    }
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }
  ngAfterViewInit(): void {
    this.fis.formGroupCollection[this.formId].valueChanges.subscribe(e => {
      this.viewType = e.view;
    });
    this.fis.formGroupCollection[this.formId].get('view').setValue(this.viewType);
  }
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
    let sub = this.translate.onLangChange.subscribe(() => {
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
    this.subs.add(sub)
  }
  openBottomSheet(id?: number): void {
    let config = new MatBottomSheetConfig();
    config.autoFocus = true;
    if (hasValue(id)) {
      if (this.catalogType === 'frontend') {
        this.catalogSvc.getCatalogFrontendById(id).subscribe(next => {
          config.data = next;
          this._bottomSheet.open(CatalogComponent, config);
        })
      } else {
        this.catalogSvc.getCatalogBackendById(id).subscribe(next => {
          config.data = next;
          this._bottomSheet.open(CatalogComponent, config);
        })
      }
    } else {
      this._bottomSheet.open(CatalogComponent, config);
    }
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  pageHandler(e: PageEvent) {
    this.catalogSvc.currentPageIndex = e.pageIndex
  }
  getParenteName(id: number) {
    return ((id !== null && id !== undefined) && this.dataSource.data.find(e => e.id === id)) ? this.dataSource.data.find(e => e.id === id).name : '';
  }
}
