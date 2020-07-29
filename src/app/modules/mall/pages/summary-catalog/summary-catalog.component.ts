import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet, MatBottomSheetConfig, MatPaginator, MatSort, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormInfoService } from 'mt-form-builder';
import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { hasValue } from 'src/app/clazz/utility';
import { FORM_CONFIG } from 'src/app/form-configs/catalog-view.config';
import { CategoryService, ICatalogCustomer, ICatalogCustomerHttp } from 'src/app/services/catalog.service';
import { DeviceService } from 'src/app/services/device.service';
import { CatalogComponent } from '../catalog/catalog.component';
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
  displayedColumns: string[] = ['id', 'name', 'parentId', 'edit', 'delete'];
  dataSource: MatTableDataSource<ICatalogCustomer>;
  catalogType: string;
  viewType: "TREE_VIEW" | "LIST_VIEW" = "LIST_VIEW";
  pageSizeOffset = 2;
  public catalogsData: ICatalogCustomer[];
  private subs: Subscription = new Subscription()
  totoalItemCount: number;
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
        return this.catalogSvc.getCatalogFrontend(this.catalogSvc.currentPageIndex, this.getPageSize());
      } else if (queryMaps.get('type') === 'backend') {
        return this.catalogSvc.getCatalogBackend(this.catalogSvc.currentPageIndex, this.getPageSize());
      } else {
      }
    }));
    let sub = ob.subscribe(next => { this.updateSummaryData(next) });
    let sub0 = this.catalogSvc.refreshSummary.pipe(switchMap(() => ob)).subscribe(next => { this.updateSummaryData(next) });
    this.subs.add(sub)
    this.subs.add(sub0)
  }
  updateSummaryData(next: ICatalogCustomerHttp) {
    this.dataSource = new MatTableDataSource(next.data)
    if (next.data) {
      this.catalogsData = next.data;
      this.totoalItemCount = next.totalItemCount;
    }
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.fis.reset(this.formId);
  }
  ngAfterViewInit(): void {
    let sub = this.fis.formGroupCollection[this.formId].valueChanges.subscribe(e => {
      this.viewType = e.view;
      if (this.viewType === 'TREE_VIEW') {
        if (this.catalogType === 'frontend') {
          this.catalogSvc.getCatalogFrontend().subscribe(next => {
            this.updateSummaryData(next)
          });
        } else {
          this.catalogSvc.getCatalogBackend().subscribe(next => {
            this.updateSummaryData(next)
          });
        }
      } else {
        if (this.catalogType === 'frontend') {
          this.catalogSvc.getCatalogFrontend(this.catalogSvc.currentPageIndex, this.getPageSize()).subscribe(next => {
            this.updateSummaryData(next)
          });
        } else {
          this.catalogSvc.getCatalogBackend(this.catalogSvc.currentPageIndex, this.getPageSize()).subscribe(next => {
            this.updateSummaryData(next)
          });
        }
      }
    });
    this.subs.add(sub)
    this.fis.formGroupCollection[this.formId].get('view').setValue(this.viewType, { onlySelf: true });
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
    this.catalogSvc.currentPageIndex = e.pageIndex;
    if (this.catalogType === 'frontend') {
      this.catalogSvc.getCatalogFrontend(this.catalogSvc.currentPageIndex, this.getPageSize()).subscribe(next => {
        this.updateSummaryData(next)
      });
    } else {
      this.catalogSvc.getCatalogBackend(this.catalogSvc.currentPageIndex, this.getPageSize()).subscribe(next => {
        this.updateSummaryData(next)
      });
    }
  }
  getParenteName(id: number) {
    return ((id !== null && id !== undefined) && this.dataSource.data.find(e => e.id === id)) ? this.dataSource.data.find(e => e.id === id).name : '';
  }
  private getPageSize() {
    return (this.deviceSvc.pageSize - this.pageSizeOffset) > 0 ? (this.deviceSvc.pageSize - this.pageSizeOffset) : 1;
  }
  updateTable(sort: Sort) {
    if (this.catalogType === 'frontend') {
      this.catalogSvc.getCatalogFrontend(this.catalogSvc.currentPageIndex, this.getPageSize(), sort.active, sort.direction).subscribe(next => {
        this.updateSummaryData(next)
      });
    } else {
      this.catalogSvc.getCatalogBackend(this.catalogSvc.currentPageIndex, this.getPageSize(), sort.active, sort.direction).subscribe(next => {
        this.updateSummaryData(next)
      });
    }
  }
}
