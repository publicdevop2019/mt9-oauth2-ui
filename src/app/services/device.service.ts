import { Injectable } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
@Injectable({
    providedIn: 'root'
})
export class DeviceService {
    private summaryRow = 48;
    private optionalVerticalScrollbar = 48;
    public topBar = 48;
    private contentTitle = 74.81;
    private contentTitleFilter = 65.5;
    private summaryRowHeader = 56;
    private summaryRowFooter = 56;
    constructor(private breakpointObserver: BreakpointObserver,public httpClient:HttpClient) {
    }
    public pageSize: number = Math.floor((window.innerHeight - this.topBar - this.contentTitle - this.contentTitleFilter - this.summaryRowHeader - this.summaryRowFooter - this.optionalVerticalScrollbar) / this.summaryRow) === 0 ?
        1 :
        Math.floor((window.innerHeight - this.topBar - this.contentTitle - this.contentTitleFilter - this.summaryRowHeader - this.summaryRowFooter - this.optionalVerticalScrollbar) / this.summaryRow);
}