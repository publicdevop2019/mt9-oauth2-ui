import { Injectable } from '@angular/core';
import { HttpProxyService } from './http-proxy.service';
import { MatDialog } from '@angular/material';
import { CustomHttpInterceptor } from './http.interceptor';
export interface IUserReactionResult {
  results: IUserReaction[];
  total:number;
}
export interface IUserReaction {
  count: number,
  referenceId: string,
  referenceType: string
}
@Injectable({
  providedIn: 'root'
})
export class ReactionService {
  rankLikes(pageNum: number, pageSize: number) {
    return this.httpProxy.netImpl.rankLikes(pageNum, pageSize)
  }
  rankDislikes(pageNum: number, pageSize: number) {
    return this.httpProxy.netImpl.rankDisLikes(pageNum, pageSize)
  }
  rankReports(pageNum: number, pageSize: number) {
    return this.httpProxy.netImpl.rankReports(pageNum, pageSize)
  }
  rankNotInterested(pageNum: number, pageSize: number) {
    return this.httpProxy.netImpl.rankNotInterested(pageNum, pageSize)
  }
  constructor(private httpProxy: HttpProxyService, public dialog: MatDialog, private _httpInterceptor: CustomHttpInterceptor) { }
}
