import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IOption } from 'mt-form-builder/lib/classes/template.interface';
import { interval, Observable, Subscription, combineLatest } from 'rxjs';
import { debounce, filter } from 'rxjs/operators';
import { CONST_ATTR_TYPE, CONST_GRANT_TYPE, CONST_HTTP_METHOD, CONST_ROLES, CONST_ROLES_USER } from 'src/app/clazz/constants';
import { AttributeService } from 'src/app/services/attribute.service';
import { CatalogService } from 'src/app/services/catalog.service';
import { ClientService } from 'src/app/services/client.service';
import { IClient } from 'src/app/clazz/validation/aggregate/client/interfaze-client';
import { hasValue } from 'src/app/clazz/validation/validator-common';
import { ICatalog } from 'src/app/clazz/validation/aggregate/catalog/interfaze-catalog';
import { IBizAttribute } from 'src/app/clazz/validation/aggregate/attribute/interfaze-attribute';
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
  searchItemsShadow: string[] = [];
  autoCompleteList: IOption[] = [];
  selectedItem = new FormControl();
  options: FormGroup;
  searchType = new FormControl();
  searchQuery = new FormControl({ value: [] });
  searchByString = new FormControl();
  searchByNumMin = new FormControl();
  searchByNumMax = new FormControl();
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
    { label: 'REFERENCE_ID', value: "referenceId" },
    { label: 'PARENT_ID_FRONT', value: "parentId_front" },
    { label: 'PARENT_ID_BACK', value: "parentId_back" },
    { label: 'NAME', value: "name" },
    { label: 'CATALOGS', value: "catalogs" },
    { label: 'EMAIL', value: "email" },
    { label: 'RESOURCE_INDICATOR', value: "resourceIndicator" },
    { label: 'RESOURCE_ID', value: "resourceId" },
    { label: 'LOWEST_PRICE', value: "lowestPrice" },
    { label: 'GRANTTYPE_ENUMS', value: "grantTypeEnums" },
    { label: 'ACCESS_TOKEN_VALIDITY_SECONDS', value: "accessTokenValiditySeconds" },
    { label: 'GRANTED_AUTHORITIES', value: "grantedAuthorities" },
    { label: 'GRANTED_AUTHORITIES', value: "grantedAuthorities_user" },
    { label: 'RESOURCEIDS', value: "resourceIds" },
    { label: 'METHOD', value: "method" },
    { label: 'TYPE', value: "type" },
    { label: 'SEARCH_BY_ATTRIBUTES', value: "attributes" },
    { label: 'SEARCH_BY_CATALOG_FRONT', value: "catalogFront" },
    { label: 'SEARCH_BY_CATALOG_BACK', value: "catalogBack" }
  ]

  separatorKeysCodes: number[] = [ENTER, COMMA];
  private subs: Subscription = new Subscription();
  private queryFinal: string;
  constructor(fb: FormBuilder, private catalogSvc: CatalogService, private attrSvc: AttributeService, public translateSvc: TranslateService, private clientSvc: ClientService) {
    this.options = fb.group({
      searchType: this.searchType,
      searchQuery: this.searchQuery,
      searchByString: this.searchByString,
      searchBySelect: this.searchBySelect,
      searchByBoolean: this.searchByBoolean,
      searchByAttr: this.searchByAttr,
      searchByNumMin: this.searchByNumMin,
      searchByNumMax: this.searchByNumMax,
      searchByAttrSelect: this.searchByAttrSelect,
      searchByAttrManual: this.searchByAttrManual,
    });
    let sub3 = combineLatest([this.searchByNumMin.valueChanges, this.searchByNumMax.valueChanges]).subscribe(next => {
      let min: number = next[0];
      let max: number = next[1];
      if (!hasValue(next[0]) && !hasValue(next[1])) {
        //do nothing
      } else if (!hasValue(next[0]) && hasValue(next[1])) {
        this.searchQuery.setValue(["<=" + max])
      } else if (hasValue(next[0]) && !hasValue(next[1])) {
        this.searchQuery.setValue([">=" + min])
      } else {
        this.searchQuery.setValue(["<=" + max, ">=" + min])
      }
    });
    this.searchByNumMin.setValue('')//make sure at least one value emit for combineLatest to trigger
    this.searchByNumMax.setValue('')
    let sub2 = this.searchQuery.valueChanges.pipe(filter(e => e !== null && e !== undefined && e !== '' && JSON.stringify(e) !== JSON.stringify([]))).pipe(debounce(() => interval(1000)))
      .subscribe(next => {
        let delimiter = '$'
        if (['id', 'name', 'resourceId', 'method', 'parentId_front', 'parentId_back', 'type', 'email','referenceId'].includes(this.searchType.value))
          delimiter = '.'
        let prefix = this.searchType.value;
        if (['catalogFront', 'catalogBack', 'attributes'].includes(this.searchType.value)) {
          prefix = 'attributes';
          next = (<Array<string>>next).map(e => e.replace(":", "-"));
        }
        if (['grantedAuthorities_user'].includes(this.searchType.value))
          prefix = 'grantedAuthorities'
        if (['parentId_front', 'parentId_back'].includes(this.searchType.value))
          prefix = 'parentId'
        this.queryFinal = prefix + ":" + (<Array<string>>next).join(delimiter)
        this.search.emit(this.queryFinal);
      });
    this.searchType.valueChanges.subscribe(next => {
      this.searchItems = [];
      this.searchItemsShadow = [];
      if (next === 'grantTypeEnums') {
        this.autoCompleteList = CONST_GRANT_TYPE;
      }
      else if (next === 'grantedAuthorities') {
        this.autoCompleteList = CONST_ROLES;
      }
      else if (next === 'grantedAuthorities_user') {
        this.autoCompleteList = CONST_ROLES_USER;
      }
      else if (next === 'method') {
        this.autoCompleteList = CONST_HTTP_METHOD;
      }
      else if (next === 'type') {
        this.autoCompleteList = CONST_ATTR_TYPE;
      }
      else if (next === 'catalogs') {
        this.autoCompleteList = this.catalogsDataFront.map(e => <IOption>{ label: e.name, value: e.id });
      }
      else if (next === 'parentId_front') {
        this.autoCompleteList = this.catalogsDataFront.map(e => <IOption>{ label: e.name, value: e.id });
      }
      else if (next === 'parentId_back') {
        this.autoCompleteList = this.catalogsDataBack.map(e => <IOption>{ label: e.name, value: e.id });
      }
      else if (next === 'resourceIds') {
        this.autoCompleteList = this.resourceClients.map(e => <IOption>{ label: e.name, value: e.id });
      }
      else if (next === 'resourceId') {
        this.autoCompleteList = this.allClients.map(e => <IOption>{ label: e.name, value: e.id });
      }
      else {
        this.autoCompleteList = []
      }
      this.options.reset({
        searchType: this.searchType.value,
        searchQuery: '',
        searchByStringCtrl: '',
        searchByName: '',
        searchByAttr: '',
        searchByAttrSelect: '',
        searchByNumMin: '',
        searchByNumMax: '',
        searchByAttrManual: '',
      }, { emitEvent: false });
    });
    this.subs.add(sub2)
    this.subs.add(sub3)
  }
  ngOnInit(): void {
    if (this.fields.includes('catalogFront') || this.fields.includes('parentId_front') || this.fields.includes('catalogs')) {

      this.catalogSvc.readByQuery(this.catalogSvc.currentPageIndex, 1000, 'type:FRONTEND')
        .subscribe(catalogs => {
          if (catalogs.data)
            this.catalogsDataFront = catalogs.data;
        });
    }
    if (this.fields.includes('catalogBack') || this.fields.includes('parentId_back')) {

      this.catalogSvc.readByQuery(this.catalogSvc.currentPageIndex, 1000, 'type:BACKEND')
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
    let var2 = var1.name + ":" + (var1.method === 'SELECT' ? this.searchByAttrSelect.value : this.searchByAttrManual.value);
    let var3 = var1.id + ":" + (var1.method === 'SELECT' ? this.searchByAttrSelect.value : this.searchByAttrManual.value);
    this.searchItems.push(var2);
    this.searchItemsShadow.push(var3);
    this.searchQuery.setValue(this.searchItemsShadow)
  }
  searchWithTags(catalog: ICatalog) {
    this.searchItems.push(...this.parseAttrId(this.loadAttributes(catalog)));
    this.searchItemsShadow.push(...(this.loadAttributes(catalog) || []))
    this.searchQuery.setValue(this.searchItemsShadow)

  }
  public loadAttributes(attr: ICatalog) {
    let tags: string[] = [];
    tags.push(...attr.attributes);
    let catalogs = this.catalogsDataFront;
    if (this.searchType.value === 'catalogBack')
      catalogs = this.catalogsDataBack;
    while (attr.parentId !== null && attr.parentId !== undefined) {
      let nextId = attr.parentId;
      attr = catalogs.find(e => e.id === nextId);
      tags.push(...attr.attributes);
    }
    return tags;
  }
  parseAttrId(attributes: string[]): string[] {
    if (!attributes)
      return []
    return attributes.map(e => this.bizAttr.find(ee => ee.id === +e.split(":")[0]).name + ":" + e.split(":")[1])
  }
  overwriteCommon(value: string) {
    this.searchQuery.setValue([value])
  }
  doReset() {
    this.searchItems = [];
    this.searchItemsShadow = [];
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
    this.search.emit(this.queryFinal);
  }
  add(value: string) {
    this.searchItems.push(value);
    this.searchQuery.setValue(this.searchItems)
  }
  remove(item: string): void {
    const index = this.searchItems.indexOf(item);
    if (index >= 0) {
      this.searchItems.splice(index, 1);
      if (this.searchItemsShadow.length > 0)
        this.searchItemsShadow.splice(index, 1);
      if (this.autoCompleteList.length > 0) {
        this.searchQuery.setValue(this.parseLable(this.searchItems))
      } else {
        if (['catalogBack', 'catalogFront'].includes(this.searchType.value)) {
          this.searchQuery.setValue(this.searchItemsShadow)
        } else {
          this.searchQuery.setValue(this.searchItems)
        }
      }
    }
  }

  selected(event: IOption): void {
    this.searchItems.push(event.label);
    this.searchQuery.setValue(this.parseLable(this.searchItems))
  }
  parseLable(searchItems: string[]): string[] {
    return searchItems.map(e => this.autoCompleteList.find(ee => ee.label === e).value as string)
  }
}
