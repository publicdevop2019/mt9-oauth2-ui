import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CatalogService, ICatalogCustomer } from 'src/app/services/catalog.service';
import { AttributeService, IBizAttribute } from 'src/app/services/attribute.service';
import { debounce, filter, map, switchMap } from 'rxjs/operators';
import { interval } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  @Output() search: EventEmitter<string> = new EventEmitter()
  options: FormGroup;
  searchTypeCtrl = new FormControl();
  searchQueryCtrl = new FormControl();
  searchByIdCtrl = new FormControl();
  searchByNameCtrl = new FormControl();
  searchByAttr = new FormControl();
  searchByAttrSelect = new FormControl();
  searchByAttrManual = new FormControl();
  public catalogsDataBack: ICatalogCustomer[];
  public catalogsDataFront: ICatalogCustomer[];
  public bizAttr: IBizAttribute[];
  constructor(fb: FormBuilder, private categorySvc: CatalogService, private attrSvc: AttributeService) {
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
        console.dir(next)
        this.search.emit(next);
      });
    let sub1 = this.categorySvc.getCatalogBackend()
      .subscribe(catalogs => {
        if (catalogs.data)
          this.catalogsDataBack = catalogs.data;
      });
    let sub4 = this.categorySvc.getCatalogFrontend()
      .subscribe(catalogs => {
        if (catalogs.data)
          this.catalogsDataFront = catalogs.data;
      });
    let sub5 = this.attrSvc.getAttributeList()
      .subscribe(next => {
        if (next.data)
          this.bizAttr = next.data;
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
    this.searchByNameCtrl.valueChanges.subscribe(next => {
      this.searchQueryCtrl.setValue('name:' + next)
    })
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
  searchWithTags(catalog: ICatalogCustomer) {
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
}
