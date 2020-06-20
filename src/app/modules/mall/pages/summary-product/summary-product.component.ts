import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material';
import { IProductSimple, ProductService, IProductTotalResponse } from 'src/app/services/product.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription, Observable, interval } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ICatalogCustomerHttp, ICatalogCustomer, ICatalogCustomerTreeNode, CategoryService } from 'src/app/services/category.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { CatalogCustomerFlatNode } from '../summary-catalog/summary-catalog.component';
import { FormControl } from '@angular/forms';
import { debounce, filter, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-summary-product',
  templateUrl: './summary-product.component.html',
  styleUrls: ['./summary-product.component.css']
})
export class SummaryProductComponent implements OnInit, OnDestroy {
  exactSearch = new FormControl('', []);
  rangeSearch = new FormControl('', []);
  displayedColumns: string[] = ['id', 'category', 'name', 'orderStorage', 'actualStorage', 'star'];
  dataSource: MatTableDataSource<IProductSimple>;
  pageNumber = 0;
  pageSize = 20;
  totoalProductCount = 0;
  treeControl = new FlatTreeControl<CatalogCustomerFlatNode>(node => node.level, node => node.expandable);
  private _transformer = (node: ICatalogCustomerTreeNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      id: node.id,
      tags: node.tags
    };
  }
  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  treeDataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  private sub: Subscription
  constructor(private productSvc: ProductService, private breakpointObserver: BreakpointObserver, private categorySvc: CategoryService) {
    this.productSvc.getAllProduct(this.pageNumber || 0, this.pageSize).subscribe(products => {
      this.totalProductHandler(products)
    });
    this.sub = this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe(next => {
      if (next.breakpoints[Breakpoints.XSmall]) {
        this.displayedColumns = ['id', 'name', 'actualStorage', 'star'];
      }
      else if (next.breakpoints[Breakpoints.Small]) {
        this.displayedColumns = ['id', 'name', 'orderStorage', 'actualStorage', 'star'];
      }
      else if (next.breakpoints[Breakpoints.Medium]) {
        this.displayedColumns = ['id', 'category', 'name', 'orderStorage', 'actualStorage', 'star'];
      }
      else if (next.breakpoints[Breakpoints.Large]) {
        this.displayedColumns = ['id', 'category', 'name', 'orderStorage', 'actualStorage', 'star'];
      }
      else if (next.breakpoints[Breakpoints.XLarge]) {
        this.displayedColumns = ['id', 'category', 'name', 'orderStorage', 'actualStorage', 'star'];
      }
      else {
        console.warn('unknown device width match!')
      }
    });
    let ob = this.categorySvc.getCatalogBackend()
      .subscribe(catalogs => {
        if (catalogs.data)
          this.treeDataSource.data = this.convertToTree(catalogs.data);
      });
    this.exactSearch.valueChanges.pipe(debounce(() => interval(1000)))
      .pipe(filter(el => this.invalidSearchParam(el))).pipe(map(el => el.trim())).pipe(switchMap(e => {
        return this.productSvc.searchProductById(e)
      })).subscribe(next => {
        this.totalProductHandler(next)
      })
    this.rangeSearch.valueChanges.pipe(debounce(() => interval(1000)))
      .pipe(filter(el => this.invalidSearchParam(el))).pipe(map(el => el.trim())).pipe(switchMap(e => {
        this.pageNumber = 0;
        return this.productSvc.searchProductByKeyword(this.pageNumber, this.pageSize, e)
      })).subscribe(next => {
        this.totalProductHandler(next)
      })

  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  ngOnInit() {
  }
  searchWithTags(tags: string[]) {
    this.pageNumber = 0;
    this.productSvc.searchProductsByTags(this.pageNumber, this.pageSize, tags).subscribe(products => {
      this.totalProductHandler(products)
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  pageHandler(e: PageEvent) {
    this.pageNumber = e.pageIndex;
    this.productSvc.getAllProduct(this.pageNumber || 0, this.pageSize).subscribe(products => {
      this.totalProductHandler(products)
    });
  }
  private totalProductHandler(products: IProductTotalResponse) {
    this.dataSource = new MatTableDataSource(products.data);
    this.totoalProductCount = products.meta.totalProductCount;
    this.dataSource.sort = this.sort;
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
  private invalidSearchParam(input: string): boolean {
    let spaces: RegExp = new RegExp(/^\s*$/)
    return !spaces.test(input)
  }
}
