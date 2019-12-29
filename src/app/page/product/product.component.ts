import { Component, OnInit } from '@angular/core';
import { ICategory, CategoryService } from 'src/app/service/category.service';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { IProductDetail, ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  state: string;
  product$: Observable<IProductDetail>;
  productForm = new FormGroup({
    id: new FormControl('', [
      Validators.required
    ]),
    category: new FormControl('', [
      Validators.required
    ]),
    name: new FormControl('', [
      Validators.required
    ]),
    price: new FormControl('', [
      Validators.required
    ]),
    imageUrlSmall: new FormControl('', [
      Validators.required
    ]),
    description: new FormControl('', [
      Validators.required
    ]),
    sales: new FormControl('', [
      Validators.required
    ]),
  });
  constructor(
    private route: ActivatedRoute,
    public productSvc: ProductService,
  ) { }

  ngOnInit() {
    this.product$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.productSvc.getProductDetailById(+params.get('id')))
    );
    this.route.queryParamMap.subscribe(queryMaps => {
      this.state = queryMaps.get('state');
      if (queryMaps.get('state') === 'update') {
        this.product$.subscribe(byId => {
          this.productForm.get('id').setValue(byId.id)
          this.productForm.get('category').setValue(byId.category)
          this.productForm.get('name').setValue(byId.name)
          this.productForm.get('price').setValue(byId.price)
          this.productForm.get('imageUrlSmall').setValue(byId.imageUrlSmall)
          this.productForm.get('description').setValue(byId.description)
          this.productForm.get('sales').setValue(byId.sales)
        })
      } else if (queryMaps.get('state') === 'none') {

      } else {

      }
    })
  }
  convertToPayload(formGroup: FormGroup): IProductDetail {
    return {
      id: formGroup.get('id').value,
      category: formGroup.get('category').value,
      name: formGroup.get('name').value,
      price: formGroup.get('price').value,
      imageUrlSmall: formGroup.get('imageUrlSmall').value,
      description:formGroup.get('description').value,
      sales: formGroup.get('sales').value,
    }
  }
}
