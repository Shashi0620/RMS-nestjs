/*
 * This is add-form.component.ts
 */
import {Component, OnInit} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'
import {Formdata} from '../../models/form-builder.model'
import {FormService} from './../../services/app.form.service'
import swal from 'sweetalert2'
import {User} from '../../models/user.model'

@Component({
  selector: 'app-add-forms',
  templateUrl: './add-forms.component.html',
  styleUrls: ['./add-forms.component.css']
})
export class AddFormComponent implements OnInit {
  model: Formdata = {
    name: '',
    description: '',
    attributes: [],
    id: '',
    quantity: 0
  }
  itemTempId = ''
  clientFk = 0
  success = false
  UserObj: User = {}
  pageSize = 25
  currentPage = 0
  product: string
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    this.itemTempId = this.route.snapshot.params.id
    this.getFormData(this.route.snapshot.params.id)
    this.clientFk = this.UserObj.clientFk
    this.product = localStorage.getItem('product')
    if (this.product === null) {
      this.product = 'Products'
    }
  }

  toggleValue(item): void {
    item.selected = !item.selected
  }

  getFormData(id: number): void {
    let datas
    this.formService.get(id).subscribe(data => {
      datas = data
      sessionStorage.setItem('formname', datas.name)
      if (Array.isArray(datas.attributes)) {
        this.model = datas
      } else {
        datas.attributes = JSON.parse(datas.attributes)
        this.model = datas
      }
    })
  }

  handleError(err: string): void {
    alert(err)
  }

  cancel(): void {
    this.router.navigate([
      `/menu/${this.route.snapshot.params.name}/${this.route.snapshot.params.id}`
    ])
    this.formService.getAll(this.clientFk)
  }

  quantityNegativeAlert(): void {
    swal({
      title: 'Alert Wrong Quantity!',
      text: 'Please enter valid quantity',
      type: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ok'
    })
  }

  submit(): boolean {
    let valid = true
    if (this.model.quantity <= 0) {
      this.quantityNegativeAlert()
    } else {
      const validationArray = JSON.parse(JSON.stringify(this.model.attributes))
      validationArray.reverse().forEach(field => {
        if (field.required && !field.value && field.type !== 'checkbox') {
          swal('Error', `Please enter ${field.label}`, 'error')
          valid = false
          return false
        }
        if (field.required && field.regex) {
          const regex = new RegExp(field.regex)
          if (regex.test(field.value) === false) {
            swal('Error', field.errorText, 'error')
            valid = false
            return false
          }
        }
        if (field.required && field.type === 'checkbox') {
          if (field.values.filter(r => r.selected).length === 0) {
            swal('Error', `Please enter ${field.label}`, 'error')
            valid = false
            return false
          }
        }
      })
      if (!valid) {
        return false
      }
      const input = new FormData()
      input.append('formId', this.model.id)
      input.append('attributes', JSON.stringify(this.model.attributes))
      const modelname = sessionStorage.getItem('formname')
      if (this.model.quantity === null) {
        this.model.quantity = 0
      }
      const data = {
        name: modelname,
        description: this.model.description,
        attributes: this.model.attributes,
        itemTempId: this.itemTempId,
        quantity: this.model.quantity
      }
      const schemaName = sessionStorage.getItem('clientName')
      this.formService
        .createForm(data, this.route.snapshot.params.name, schemaName)
        .subscribe(
          () => {
            this.success = true
            this.router.navigate([
              `/menu/${this.route.snapshot.params.name}/${this.route.snapshot.params.id}`
            ])
            this.formService.getAll(this.clientFk)
            // this.submitted = true;
          },
          error => {
            this.handleError(
              'Please fill the form before clicking on save button'
            )
          }
        )
    }
  }
}
