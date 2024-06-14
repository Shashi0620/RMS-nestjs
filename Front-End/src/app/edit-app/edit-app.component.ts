/*
 * This is edit-app.component.ts
 */
import {Component, OnInit} from '@angular/core'
import {DndDropEvent, DropEffect} from 'ngx-drag-drop'
import {field, value} from '../global.model'
import swal from 'sweetalert2'
import {User} from '../models/user.model'
//import {Template} from '@angular/compiler/src/render3/r3_ast'
import {LogService} from '../services/log.service'
import {Item} from '../models/item.model'
import {ItemObject} from '../models/itemobject.model'
import {FormService} from '../services/app.form.service'
import {UserService} from '../services/user.service'
import {ActivatedRoute, Router} from '@angular/router'

@Component({
  selector: 'app-edit-app',
  templateUrl: './edit-app.component.html',
  styleUrls: ['./edit-app.component.css']
})
export class EditAppComponent implements OnInit {
  value: value = {
    label: '',
    value: ''
  }
  //tempData: Template[]
  success = false
  isExist = false

  fieldModels: field[] = [
    {
      type: 'text',
      icon: 'fa-font',
      label: 'Text',
      description: 'Enter your name',
      placeholder: 'Enter your name',
      className: 'form-control',
      subtype: 'text',
      regex: '',
      handle: true
    },
    {
      type: 'email',
      icon: 'fa-envelope',
      required: true,
      label: 'Email',
      description: 'Enter your email',
      placeholder: 'Enter your email',
      className: 'form-control',
      subtype: 'text',
      regex: '^([a-zA-Z0-9_.-]+)@([a-zA-Z0-9_.-]+).([a-zA-Z]{2,5})$',
      errorText: 'Please enter a valid email',
      handle: true
    },
    {
      type: 'phone',
      icon: 'fa-phone',
      label: 'Phone',
      description: 'Enter your phone',
      placeholder: 'Enter your phone',
      className: 'form-control',
      subtype: 'text',
      regex: '^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$',
      errorText: 'Please enter a valid phone number',
      handle: true
    },
    {
      type: 'number',
      label: 'Number',
      icon: 'fa-html5',
      description: 'Age',
      placeholder: 'Enter your age',
      className: 'form-control',
      value: '20',
      min: 12,
      max: 90
    },
    {
      type: 'date',
      icon: 'fa-calendar',
      label: 'Date',
      placeholder: 'Date',
      className: 'form-control'
    },
    {
      type: 'datetime-local',
      icon: 'fa-calendar',
      label: 'DateTime',
      placeholder: 'Date Time',
      className: 'form-control'
    },
    {
      type: 'textarea',
      icon: 'fa-text-width',
      label: 'Textarea'
    },
    {
      type: 'paragraph',
      icon: 'fa-paragraph',
      label: 'Paragraph',
      placeholder: 'Type your text to display here only'
    },
    {
      type: 'checkbox',
      required: true,
      label: 'Checkbox',
      icon: 'fa-list',
      description: 'Checkbox',
      inline: true,
      values: [
        {
          label: 'Option 1',
          value: 'option-1'
        },
        {
          label: 'Option 2',
          value: 'option-2'
        }
      ]
    },
    {
      type: 'radio',
      icon: 'fa-list-ul',
      label: 'Radio',
      description: 'Radio boxes',
      values: [
        {
          label: 'Option 1',
          value: 'option-1'
        },
        {
          label: 'Option 2',
          value: 'option-2'
        }
      ]
    },
    {
      type: 'autocomplete',
      icon: 'fa-bars',
      label: 'Select',
      description: 'Select',
      placeholder: 'Select',
      className: 'form-control',
      values: [
        {
          label: 'Option 1',
          value: 'option-1'
        },
        {
          label: 'Option 2',
          value: 'option-2'
        },
        {
          label: 'Option 3',
          value: 'option-3'
        }
      ]
    },
    {
      type: 'file',
      icon: 'fa-file',
      label: 'File Upload',
      className: 'form-control',
      subtype: 'file'
    },
    {
      type: 'button',
      icon: 'fa-paper-plane',
      subtype: 'submit',
      label: 'Submit'
    }
  ]

  modelFields: field[] = []
  model: ItemObject = {
    name: '',
    description: '',
    theme: {
      bgColor: 'ffffff',
      textColor: '555555',
      bannerImage: ''
    },
    attributes: this.modelFields,
    clientFk: 0
  }

  report = false
  UserObj: User = {}
  createForm: boolean
  clientFk: number

  constructor(
    private formService: FormService,
    private router: Router,
    private logger: LogService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (
      this.route.snapshot.params.id === null ||
      this.route.snapshot.params.id === undefined
    ) {
      this.createForm = true
    }
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    this.clientFk = this.UserObj.clientFk
    this.model.clientFk = this.UserObj.clientFk
    this.retrieveTemplates()
  }

  onDragStart(event: DragEvent): void {
    console.log('drag started', JSON.stringify(event, null, 2))
  }

  onDragEnd(event: DragEvent): void {
    console.log('drag ended', JSON.stringify(event, null, 2))
  }

  onDraggableCopied(event: DragEvent): void {
    console.log('draggable copied', JSON.stringify(event, null, 2))
  }

  onDraggableLinked(event: DragEvent): void {
    console.log('draggable linked', JSON.stringify(event, null, 2))
  }

  onDragged(item: Item, list: Item[], effect: DropEffect): void {
    if (effect === 'move') {
      const index = list.indexOf(item)
      list.splice(index, 1)
    }
  }

  onDragCanceled(event: DragEvent): void {
    console.log('drag cancelled', JSON.stringify(event, null, 2))
  }

  onDragover(event: DragEvent): void {
    console.log('dragover', JSON.stringify(event, null, 2))
  }

  onDrop(event: DndDropEvent, list?: Item[]): void {
    if (list && (event.dropEffect === 'copy' || event.dropEffect === 'move')) {
      if (event.dropEffect === 'copy') {
        event.data.name = `${event.data.type}-${new Date().getTime()}`
      }
      let index = event.index
      if (typeof index === 'undefined') {
        index = list.length
      }
      list.splice(index, 0, event.data)
    }
  }

  addValue(values): void {
    values.push(this.value)
    this.value = {label: '', value: ''}
  }

  removeField(i): void {
    swal({
      title: 'Are you sure?',
      text: 'Do you want to remove this field?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove!'
    }).then(result => {
      if (result.value) {
        this.model.attributes.splice(i, 1)
      }
    })
  }

  public async createTemplate(): Promise<void> {
    const input = new FormData()
    input.append('formId', this.model._id)
    input.append('attributes', JSON.stringify(this.model.attributes))
    // unused so removed
    this.formService
      .createTemplate(this.clientFk, this.UserObj.username, this.model)
      .subscribe(response => {
        this.logger.log(
          'End of Edit-Form-Component : createTemplate :Response',
          response
        )
        this.success = true
        this.userService.changePage('template', 'TemplateListComponent')
        // this.router.navigate(['/template']).then(() => {
        //   window.location.reload()
        // })
        this.router
          .navigateByUrl(`/template`, {skipLocationChange: true})
          .then(() => {
            this.router.navigate([`template`], {relativeTo: this.route})
          })
        this.formService.getAll(this.clientFk)
      })
  }

  updateForm(): void {
    const input = new FormData()
    input.append('id', this.model._id)
    input.append('name', this.model.name)
    input.append('description', this.model.description)
    input.append('bannerImage', this.model.theme.bannerImage)
    input.append('bgColor', this.model.theme.bgColor)
    input.append('textColor', this.model.theme.textColor)
    input.append('attributes', JSON.stringify(this.model.attributes))
  }

  saveForm(): void {
    this.logger.log('Start of EditAppComponent : saveForm')
    const data = {
      name: this.model.name,
      description: this.model.description
    }

    this.formService.saveForm(data).subscribe(() => {})
    this.logger.log('End of EditAppComponent : saveForm :reponse', data)
  }

  initReport(): void {
    this.report = true
  }

  toggleValue(item): void {
    item.selected = !item.selected
  }

  retrieveTemplates(): void {
    this.logger.log('Start of EditAppComponent : retrieveTemplates')
    this.formService.getAll(this.UserObj.clientFk).subscribe(data => {
      this.logger.log(
        'End of EditAppComponent : retrieveTemplates :reponse',
        data
      )
    })
  }

  submit(): void {
    this.logger.log('Start of EditAppComponent : submit')
    const input = new FormData()
    input.append('formId', this.model._id)
    input.append('attributes', JSON.stringify(this.model.attributes))
    const data = {
      name: this.model.name,
      description: this.model.description,
      attributes: this.model.attributes,
      clientFk: this.UserObj.clientFk
    }
    this.formService.templateValidation(this.model.name).subscribe(response => {
      if (response.length > 0) {
        this.isExist = true
      } else
        this.formService.saveForm(data).subscribe(() => {
          this.success = true
          this.userService.changePage('template', 'TemplateListComponent')
          // this.router.navigate(['/template']).then(() => {
          //   window.location.reload()
          // })
          this.logger.log('End of EditAppComponent : submit :reponse', data)
          // this.router.navigate(['menu', response.id]);
          this.formService.getAll(this.UserObj.clientFk)
          // this.submitted = true;
        })
    })
  }

  cancel(): void {
    this.router.navigate(['/template'])
    this.formService.getAll(this.UserObj.clientFk)
  }
}
