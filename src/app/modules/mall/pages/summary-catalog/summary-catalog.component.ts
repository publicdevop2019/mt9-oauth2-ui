import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CategoryService, ICatalogCustomer, ICatalogCustomerTreeNode, ICatalogCustomerHttp } from 'src/app/services/category.service';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material';
import { FlatTreeControl } from '@angular/cdk/tree';
import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { FORM_CONFIG } from 'src/app/form-configs/catalog-view.config';
import { FormInfoService } from 'mt-form-builder';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
interface CatalogCustomerFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-summary-category',
  templateUrl: './summary-catalog.component.html',
  styleUrls: ['./summary-catalog.component.css']
})
export class SummaryCatalogComponent implements OnInit, AfterViewInit, OnDestroy {
  formId = 'summaryCatalogCustomerView';
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  displayedColumns: string[] = ['id', 'name', 'parentId', 'tags', 'star'];
  dataSource: MatTableDataSource<ICatalogCustomer>;
  catalogType: string;
  treeControl = new FlatTreeControl<CatalogCustomerFlatNode>(node => node.level, node => node.expandable);
  viewType: "TREE_VIEW" | "LIST_VIEW" = "LIST_VIEW";
  private _transformer = (node: ICatalogCustomerTreeNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      id: node.id
    };
  }
  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  treeDataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(public categorySvc: CategoryService, private fis: FormInfoService, public translate: TranslateService, private route: ActivatedRoute) {
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
        if (catalogs.data)
          this.treeDataSource.data = this.convertToTree(catalogs.data);
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
  hasChild = (_: number, node: CatalogCustomerFlatNode) => node.expandable;
  notLeafNode(catalogs: ICatalogCustomer[], nodes: ICatalogCustomerTreeNode[]): boolean {
    return nodes.filter(node => {
      return catalogs.filter(el => el.parentId === node.id).length >= 1
    }).length >= 1
  }
  convertToTree(catalogs: ICatalogCustomer[]): ICatalogCustomerTreeNode[] {
    let rootNodes = catalogs.filter(e => e.parentId === null || e.parentId === undefined);
    let treeNodes = rootNodes.map(e => <ICatalogCustomerTreeNode>{
      id: e.id,
      name: e.name,
    });
    let currentLevel = treeNodes;
    while (this.notLeafNode(catalogs, currentLevel)) {
      let nextLevelCol: ICatalogCustomerTreeNode[] = []
      currentLevel.forEach(childNode => {
        let nextLevel = catalogs.filter(el => el.parentId === childNode.id).map(e => <ICatalogCustomerTreeNode>{
          id: e.id,
          name: e.name,
        });
        childNode.children = nextLevel;
        nextLevelCol.push(...nextLevel);
      });
      currentLevel = nextLevelCol;
    }
    return treeNodes;
  }
}
