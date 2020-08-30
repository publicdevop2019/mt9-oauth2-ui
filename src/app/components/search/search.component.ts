import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { IOption } from 'mt-form-builder/lib/classes/template.interface';
import { interval, Observable, Subscription } from 'rxjs';
import { debounce } from 'rxjs/operators';
import { IClient } from 'src/app/modules/my-apps/interface/client.interface';
import { AttributeService, IBizAttribute } from 'src/app/services/attribute.service';
import { CatalogService, ICatalog } from 'src/app/services/catalog.service';
import { ClientService } from 'src/app/services/client.service';
import { CONST_ROLES, CONST_GRANT_TYPE, CONST_HTTP_METHOD } from 'src/app/clazz/constants';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnDestroy, OnInit {
  @Input() fields: string[] = [];
  @Output() search: EventEmitter<string> = new EventEmitter()
  filteredList: Observable<IOption[]>;
  searchItems: string[] = [];
  autoCompleteList: IOption[] = [];
  selectedItem = new FormControl();
  options: FormGroup;
  searchType = new FormControl();
  searchQuery = new FormControl({ value: [] });
  searchByString = new FormControl();
  searchBySelect = new FormControl();
  searchByBoolean = new FormControl();
  searchByAttr = new FormControl();
  searchByAttrSelect = new FormControl();
  searchByAttrManual = new FormControl();
  public catalogsDataBack: ICatalog[];
  public catalogsDataFront: ICatalog[];
  public bizAttr: IBizAttribute[];
  public resourceClients: IClient[];
  public allClients: IClient[];

  public searchHelper: IOption[] = [
    { label: 'ID', value: "id" },
    { label: 'NAME', value: "name" },
    { label: 'RESOURCE_INDICATOR', value: "resourceIndicator" },
    { label: 'RESOURCE_ID', value: "resourceId" },
    { label: 'GRANTTYPE_ENUMS', value: "grantTypeEnums" },
    { label: 'ACCESS_TOKEN_VALIDITY_SECONDS', value: "accessTokenValiditySeconds" },
    { label: 'GRANTED_AUTHORITIES', value: "grantedAuthorities" },
    { label: 'RESOURCEIDS', value: "resourceIds" },
    { label: 'METHOD', value: "method" },
    { label: 'SEARCH_BY_ATTRIBUTES', value: "attributes" },
    { label: 'SEARCH_BY_CATALOG_FRONT', value: "catalogFront" },
    { label: 'SEARCH_BY_CATALOG_BACK', value: "catalogBack" }
  ]

  separatorKeysCodes: number[] = [ENTER, COMMA];
  private subs: Subscription = new Subscription();
  constructor(fb: FormBuilder, private catalogSvc: CatalogService, private attrSvc: AttributeService, public translateSvc: TranslateService, private clientSvc: ClientService) {
    this.options = fb.group({
      searchType: this.searchType,
      searchQuery: this.searchQuery,
      searchByString: this.searchByString,
      searchBySelect: this.searchBySelect,
      searchByBoolean: this.searchByBoolean,
      searchByAttr: this.searchByAttr,
      searchByAttrSelect: this.searchByAttrSelect,
      searchByAttrManual: this.searchByAttrManual,
    });
    let sub2 = this.searchQuery.valueChanges.pipe(debounce(() => interval(1000)))
      .subscribe(next => {
        let delimiter = '$'
        if (['id', 'name','resourceId','method'].includes(this.searchType.value))
          delimiter = '.'
        let prefix = this.searchType.value;
        if (['catalogFront', 'catalogBack'].includes(this.searchType.value))
          prefix = 'attributes'
        this.search.emit(prefix + ":" + (<Array<string>>next).join(delimiter));
      });
    this.searchType.valueChanges.subscribe(next => {
      this.searchItems = [];
      if (next === 'grantTypeEnums') {
        this.autoCompleteList = CONST_GRANT_TYPE;
      }
      else if (next === 'grantedAuthorities') {
        this.autoCompleteList = CONST_ROLES;
      }
      else if (next === 'method') {
        this.autoCompleteList = CONST_HTTP_METHOD;
      }
      else if (next === 'resourceIds' ) {
        this.autoCompleteList = this.resourceClients.map(e => <IOption>{ label: e.name, value: e.id });
      }
      else if (next === 'resourceId' ) {
        this.autoCompleteList = this.allClients.map(e => <IOption>{ label: e.name, value: e.id });
      }
      else {

      }
      this.options.reset({
        searchType: this.searchType.value,
        searchQuery: '',
        searchByStringCtrl: '',
        searchByName: '',
        searchByAttr: '',
        searchByAttrSelect: '',
        searchByAttrManual: '',
      }, { emitEvent: false });
    });
    this.subs.add(sub2)
  }
  ngOnInit(): void {
    if (this.fields.includes('catalogFront')) {

      this.catalogSvc.readByQuery(this.catalogSvc.currentPageIndex, 1000, 'query=type:FRONTEND')
        .subscribe(catalogs => {
          if (catalogs.data)
            this.catalogsDataFront = catalogs.data;
        });
    }
    if (this.fields.includes('catalogBack')) {

     this.catalogSvc.readByQuery(this.catalogSvc.currentPageIndex, 1000, 'query=type:BACKEND')
        .subscribe(catalogs => {
          if (catalogs.data)
            this.catalogsDataBack = catalogs.data;
        });
    }
    if (this.fields.includes('attributes')) {
      this.attrSvc.readByQuery(0, 1000)
        .subscribe(next => {
          if (next.data)
            this.bizAttr = next.data;
        });
    }
    if (this.fields.includes('resourceIds')) {
      this.clientSvc.readByQuery(0, 1000, 'resourceIndicator:1')
        .subscribe(next => {
          if (next.data)
            this.resourceClients = next.data;
        });
    }
    if (this.fields.includes('resourceId')) {
      this.clientSvc.readByQuery(0, 1000)
        .subscribe(next => {
          if (next.data)
            this.allClients = next.data;
        });
    }
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  appendAttr() {
    let var1 = (this.searchByAttr.value as IBizAttribute);
    let var2 = var1.id + ":" + (var1.method === 'SELECT' ? this.searchByAttrSelect.value : this.searchByAttrManual.value);
    this.searchItems.push(var2);
    this.searchQuery.setValue(this.searchItems)
  }
  searchWithTags(catalog: ICatalog) {
    this.searchItems.push(...(catalog.attributes || []));
    this.searchQuery.setValue(this.searchItems)

  }
  overwriteCommon(value: string) {
    this.searchQuery.setValue([value])
  }
  doReset() {
    this.searchItems = [];
    this.options.reset({
      searchType: '',
      searchQuery: '',
      searchByStringCtrl: '',
      searchByName: '',
      searchByAttr: '',
      searchByAttrSelect: '',
      searchBySelect: '',
      searchByBoolean: '',
      searchByAttrManual: '',
    }, { emitEvent: false });
    this.search.emit('')
  }
  doRefresh() {
    this.search.emit();
  }
  add(value: string) {
    this.searchItems.push(value);
    this.searchQuery.setValue(this.searchItems)
  }
  remove(item: string): void {
    const index = this.searchItems.indexOf(item);
    if (index >= 0) {
      this.searchItems.splice(index, 1);
      this.searchQuery.setValue(this.searchItems)
    }
  }

  selected(event: IOption): void {
    this.searchItems.push(event.label);
    this.searchQuery.setValue(this.parseLable(this.searchItems))
  }
  parseLable(searchItems: string[]): string[]{
    return searchItems.map(e=>this.autoCompleteList.find(ee=>ee.label===e).value as string)
  }
}
