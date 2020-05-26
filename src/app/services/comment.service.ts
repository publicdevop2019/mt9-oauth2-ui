import { Injectable } from '@angular/core';
import { HttpProxyService } from './http-proxy.service';
import { MatDialog } from '@angular/material';
import { CustomHttpInterceptor } from './http.interceptor';
export interface ICommentSummary {
  results: IComment[]
  total: number
}
export interface IComment {
  id: number,
  content: string,
  publishedAt: string
}
@Injectable({
  providedIn: 'root'
})
export class CommentService {
  getAllComments(pageNum: number, pageSize: number) {
    return this.httpProxy.netImpl.getAllComments(pageNum, pageSize)
  }
  deleteComment(id: string) {
    return this.httpProxy.netImpl.deleteComment(id).subscribe()
  }
  constructor(private httpProxy: HttpProxyService, public dialog: MatDialog, private _httpInterceptor: CustomHttpInterceptor) { }
}
