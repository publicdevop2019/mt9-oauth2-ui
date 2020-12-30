import { Component, OnDestroy } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { ISumRep, SummaryEntityComponent } from 'src/app/clazz/summary.component';
import { ISkuNew, IProductSimple } from 'src/app/clazz/validation/aggregate/product/interfaze-product';
import { AttributeService } from 'src/app/services/attribute.service';
import { DeviceService } from 'src/app/services/device.service';
import { ProductService } from 'src/app/services/product.service';
import { SkuService } from 'src/app/services/sku.service';
@Component({
  selector: 'app-summary-sku',
  templateUrl: './summary-sku.component.html',
  styleUrls: ['./summary-sku.component.css']
})
export class SummarySkuComponent extends SummaryEntityComponent<ISkuNew, ISkuNew> implements OnDestroy {
  displayedColumns: string[] = ['id', 'coverImage', 'referenceId', 'salesAttr', 'description', 'storageOrder', 'storageActual', 'price', 'sales', 'delete'];
  productRef: ISumRep<IProductSimple>
  constructor(
    public entitySvc: SkuService,
    private productSvc: ProductService,
    private attrSvc: AttributeService,
    public deviceSvc: DeviceService,
    public bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
  ) {
    super(entitySvc, deviceSvc, bottomSheet, 7, true);
    let sub0 = this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize()).subscribe(next => { this.updateSummaryData(next); this.loadProduct(next) });
    let sub = this.entitySvc.refreshSummary.pipe(switchMap(() =>
      this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize(), this.queryString)
    )).subscribe(next => { this.updateSummaryData(next); this.loadProduct(next) })
    this.subs.add(sub)
    this.subs.add(sub0)
  }
  public parsedRef: { [key: number]: IProductSimple } = {};
  public parsedRefAttr: { [key: number]: string } = {};
  loadProduct(input: ISumRep<ISkuNew>) {
    let parsedRef: { [key: number]: IProductSimple } = {};
    let parsedRefAttr: { [key: number]: string } = {};
    let ids = input.data.map(e => e.referenceId);
    let var0 = new Set(ids);
    let var1 = new Array(...var0);
    this.productSvc.readByQuery(0, var1.length, "id:" + var1.join('.')).subscribe(next => {
      this.productRef = next;
      this.dataSource.data.forEach(e => {
        parsedRef[e.id] = this.parseRef(e.referenceId)
        parsedRefAttr[e.id] = this.parseSalesAttr(e.referenceId, e.id)
      });
      let reqAttrIds: string[] = []
      Object.values(parsedRefAttr).forEach(e => {
        e.split(',').forEach(ee => {
          reqAttrIds.push(ee.split(':')[0]);
        })
      })
      let var2 = new Set(reqAttrIds);
      let var3 = new Array(...var2);
      this.attrSvc.readByQuery(0, var3.length, "id:" + var3.filter(e=>e).join('.')).subscribe(next2 => {
        Object.keys(parsedRefAttr).forEach(e => {
          let attr = parsedRefAttr[+e];
          let parsed = attr.split(',').map(ee => {
            if(ee){
              let attrId = ee.split(':')[0];
              return next2.data.find(eee => eee.id === attrId).name + ":" + ee.split(':')[1];
            }
          }).join(',')
          parsedRefAttr[+e] = parsed;
        })
      })
      this.parsedRef = parsedRef;
      this.parsedRefAttr = parsedRefAttr;
    })
  }
  private parseRef(id: string): IProductSimple {
    return this.productRef && (this.productRef.data.filter(e => e.id === id)[0] ? this.productRef.data.filter(e => e.id === id)[0] : undefined)
  }
  private parseSalesAttr(refId: string, id: string) {
    if (this.productRef && this.productRef.data.filter(e => e.id === refId)[0]) {
      let map = this.productRef.data.filter(e => e.id === refId)[0].attrSalesMap
      let output: string = '';
      Object.keys(map).forEach(key => {
        if (map[key] === id) {
          output = key;
          return key
        }
      })
      return output;
    } else {
      return ''
    }
  }
  pageHandler(e: PageEvent) {
    this.entitySvc.currentPageIndex = e.pageIndex;
    this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize(), this.queryString, this.sortBy, this.sortOrder).subscribe(next => {
      this.updateSummaryData(next);
      this.loadProduct(next);
    });
  }
}
