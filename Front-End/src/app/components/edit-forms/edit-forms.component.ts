/*
 * This is edit-form.component.ts
 */
import {Component, OnInit} from '@angular/core'
import swal from 'sweetalert2'
import {FormService} from './../../services/app.form.service'
import {ActivatedRoute, Router} from '@angular/router'
import {Formdata} from '../../models/form-builder.model'
import {UploadFilesService} from '../../services/upload-files.service'
import {HttpEventType, HttpResponse} from '@angular/common/http'
import {Observable} from 'rxjs'
import {FileImg} from '../../models/fileimg.model'
@Component({
  selector: 'app-edit-forms',
  templateUrl: './edit-forms.component.html',
  styleUrls: ['./edit-forms.component.css']
})
export class EditFormsComponent implements OnInit {
  model: Formdata = {
    name: '',
    description: '',
    attributes: [],
    quantity: 0
  }
  selectedFiles?: FileList
  currentFile?: File
  progress = 0
  message = ''
  fileInfos?: Observable<FileImg>
  menuName: string
  success = false
  constructor(
    private formService: FormService,
    private route: ActivatedRoute,
    private router: Router,
    private uploadService: UploadFilesService
  ) {}
  product: string

  ngOnInit(): void {
    this.getFormData(
      this.route.snapshot.params.id,
      this.route.snapshot.params.name
    )
    this.product = localStorage.getItem('product')
    if (this.product === null) {
      this.product = 'product'
    }
  }

  getFormData(id: number, name: string): void {
    this.menuName = sessionStorage.getItem('menuName')
    const schemaName = sessionStorage.getItem('clientName')
    let datas
    this.formService.getFormDataByName(id, name, schemaName).subscribe(
      data => {
        datas = data[0]
        if (Array.isArray(datas.attributes)) {
          this.model = datas
        } else {
          datas.attributes = JSON.parse(datas.attributes)
          this.model = datas
        }
      },
      error => {
        this.handleError(error.message)
      }
    )
  }

  cancel(): void {
    this.router.navigate([
      `/menu/${this.route.snapshot.params.name}/${this.route.snapshot.params.id}`
    ])
    this.formService.getAllProducts()
  }
  toggleValue(item): void {
    item.selected = !item.selected
  }

  submit(): boolean {
    let valid = true
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
          swal('Error', `Please enterrr ${field.label}`, 'error')
          valid = false
          return false
        } else {
          return true
        }
      }
    })
    if (!valid) {
      return false
    }
    const input = new FormData()
    input.append('formId', this.model.id)
    input.append('attributes', JSON.stringify(this.model.attributes))

    const schemaName = sessionStorage.getItem('clientName')
    this.formService
      .updateFormData(
        this.model.id,
        this.model,
        this.route.snapshot.params.name,
        schemaName
      )
      .subscribe(
        () => {
          this.success = true
          this.router.navigate([
            `/menu/${this.route.snapshot.params.name}/${this.route.snapshot.params.id}`
          ])
          this.formService.getAllProducts()
        },
        error => {
          this.handleError(error.message)
        }
      )
  }

  handleError(err: ErrorEvent): void {
    alert(err)
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files
    this.upload()
  }
  upload(): void {
    this.progress = 0

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0)

      if (file) {
        this.currentFile = file
        this.uploadService.upload(this.currentFile).subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round((100 * event.loaded) / event.total)
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message
              this.fileInfos = this.uploadService.getFiles()
            }
          },
          (err: any) => {
            this.handleError(err.message)
            this.progress = 0

            if (err.error && err.error.message) {
              this.message = err.error.message
            } else {
              this.message = 'Could not upload the file!'
            }

            this.currentFile = undefined
          }
        )
      }

      this.selectedFiles = undefined
    }
  }
}
