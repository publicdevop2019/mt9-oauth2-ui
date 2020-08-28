import { Component, Output, EventEmitter, OnDestroy, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CatalogService, ICatalog } from 'src/app/services/catalog.service';
import { AttributeService, IBizAttribute } from 'src/app/services/attribute.service';
import { debounce, filter, map, switchMap } from 'rxjs/operators';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnDestroy, OnInit {
  @Input() fields: string[] = [];
  @Output() search: EventEmitter<string> = new EventEmitter()
  options: FormGroup;
  searchTypeCtrl = new FormControl();
  searchQueryCtrl = new FormControl();
  searchByIdCtrl = new FormControl();
  searchByNameCtrl = new FormControl();
  searchByAttr = new FormControl();
  searchByAttrSelect = new FormControl();
  searchByAttrManual = new FormControl();
  public catalogsDataBack: ICatalog[];
  public catalogsDataFront: ICatalog[];
  public bizAttr: IBizAttribute[];
  private subs: Subscription = new Subscription();
  constructor(fb: FormBuilder, private catalogSvc: CatalogService, private attrSvc: AttributeService) {
    this.options = fb.group({
      searchType: this.searchTypeCtrl,
      searchQuery: this.searchQueryCtrl,
      searchHelperValue: this.searchByIdCtrl,
      searchByName: this.searchByNameCtrl,
      searchByAttr: this.searchByAttr,
      searchByAttrSelect: this.searchByAttrSelect,
      searchByAttrManual: this.searchByAttrManual,
    });
    let sub2 = this.searchQueryCtrl.valueChanges.pipe(debounce(() => interval(1000)))
      .pipe(filter(el => this.invalidSearchParam(el))).pipe(map(el => el.trim())).subscribe(next => {
        this.search.emit(next);
      });
    this.searchTypeCtrl.valueChanges.subscribe(next => {
      if (next === 'byId') {
        this.searchQueryCtrl.setValue('id:')
      } else if (next === 'byName') {
        this.searchQueryCtrl.setValue('name:')
      } else if (next === 'byAttr') {
        this.searchQueryCtrl.setValue('attributes:')
      } else if (next === 'byCatalogFront') {
        this.searchQueryCtrl.setValue('attributes:')
      } else if (next === 'byCatalogBack') {
        this.searchQueryCtrl.setValue('attributes:')
      } else {
      }
    });
    this.subs.add(sub2)

  }
  ngOnInit(): void {
    if (this.fields.includes('byCatalogFront')) {

      let sub4 = this.catalogSvc.readByQuery(this.catalogSvc.currentPageIndex, 1000, 'query=type:FRONTEND')
        .subscribe(catalogs => {
          if (catalogs.data)
            this.catalogsDataFront = catalogs.data;
        });
      this.subs.add(sub4)
    }
    if (this.fields.includes('byCatalogBack')) {

      let sub1 = this.catalogSvc.readByQuery(this.catalogSvc.currentPageIndex, 1000, 'query=type:BACKEND')
        .subscribe(catalogs => {
          if (catalogs.data)
            this.catalogsDataBack = catalogs.data;
        });
      this.subs.add(sub1)
    }
    if (this.fields.includes('byAttr')) {
      let sub5 = this.attrSvc.readByQuery(0, 1000)
        .subscribe(next => {
          if (next.data)
            this.bizAttr = next.data;
        });
      this.subs.add(sub5)
    }
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  private invalidSearchParam(input: string): boolean {
    if (['attributes:', 'id:', 'name:'].includes(input))
      return false;
    let spaces: RegExp = new RegExp(/^\s*$/)
    return (!spaces.test(input))
  }
  appendId() {
    this.searchQueryCtrl.setValue(this.searchQueryCtrl.value === 'id:' ? this.searchQueryCtrl.value + this.searchByIdCtrl.value : this.searchQueryCtrl.value + ',' + this.searchByIdCtrl.value)
  }
  appendAttr() {
    let var1 = (this.searchByAttr.value as IBizAttribute);
    let var2 = var1.id + ":" + (var1.method === 'SELECT' ? this.searchByAttrSelect.value : this.searchByAttrManual.value);
    this.searchQueryCtrl.setValue(this.searchQueryCtrl.value === 'attributes:' ? 'attributes:' + var2 : this.searchQueryCtrl.value + ',' + var2)
  }
  appendName() {
    let var1 = (this.searchByNameCtrl.value as string);
    if (this.searchQueryCtrl.value === 'name:')
      this.searchQueryCtrl.setValue('name:' + var1)
    else {
      this.searchQueryCtrl.setValue(this.searchQueryCtrl.value + "," + var1)

    }
  }
  searchWithTags(catalog: ICatalog) {
    this.searchQueryCtrl.setValue('attributes:' + catalog.attributes.join(','))
  }
  doReset() {
    this.options.reset({
      searchType: '',
      searchQuery: '',
      searchHelperValue: '',
      searchByName: '',
      searchByAttr: '',
      searchByAttrSelect: '',
      searchByAttrManual: '',
    }, { emitEvent: false });
    this.search.emit('')
  }
  doRefresh(){
    this.search.emit();
  }
}
