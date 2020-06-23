import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { CatalogCustomerFlatNode } from '../../pages/summary-catalog/summary-catalog.component';
import { ICatalogCustomerTreeNode, ICatalogCustomer } from 'src/app/services/category.service';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material';

@Component({
  selector: 'app-catalog-tree',
  templateUrl: './catalog-tree.component.html',
  styleUrls: ['./catalog-tree.component.css']
})
export class CatalogTreeComponent implements OnInit, OnChanges {
  @Input() catalogs: ICatalogCustomer[];
  @Output() leafNodeClicked = new EventEmitter<ICatalogCustomer>();
  @Output() nonLeafNodeClicked = new EventEmitter<ICatalogCustomer>();
  treeControl = new FlatTreeControl<CatalogCustomerFlatNode>(node => node.level, node => node.expandable);
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
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.catalogs)
      this.treeDataSource.data = this.convertToTree(this.catalogs);
  }

  ngOnInit() {
  }
  hasChild = (_: number, node: CatalogCustomerFlatNode) => node.expandable;
  private notLeafNode(catalogs: ICatalogCustomer[], nodes: ICatalogCustomerTreeNode[]): boolean {
    return nodes.filter(node => {
      return catalogs.filter(el => el.parentId === node.id).length >= 1
    }).length >= 1
  }
  private convertToTree(catalogs: ICatalogCustomer[]): ICatalogCustomerTreeNode[] {
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
  emitBranchNodeClick(id: number) {
    this.nonLeafNodeClicked.emit(this.catalogs.find(e => e.id === id))
  }
  emitLeafNodeClick(id: number) {
    this.leafNodeClicked.emit(this.catalogs.find(e => e.id === id))
  }
}