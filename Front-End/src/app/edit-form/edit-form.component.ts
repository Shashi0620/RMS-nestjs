/*
 * This is edit-form.component.ts
 */
import {Component, OnInit} from '@angular/core'
import {DndDropEvent, DropEffect} from 'ngx-drag-drop'
import {field, value} from '../global.model'
import {ActivatedRoute, Router} from '@angular/router'
import swal from 'sweetalert2'
import {FormService} from '../services/app.form.service'
import {User} from '../models/user.model'
import {Menu} from '../models/menu.model'
import {LogService} from '../services/log.service'
import {Item} from '../models/item.model'
import {ItemObject} from '../models/itemobject.model'
import {UserService} from '../services/user.service'
@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css']
})
export class EditFormComponent implements OnInit {
  value: value = {
    label: '',
    value: ''
  }
  show: any
  success = false
  disableTextbox = true
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
    attributes: this.modelFields
  }
  isInputDisable = true
  isEditButtonVisible = true
  saveButton = false
  report = false
  UserObj: User = {}
  menuObj: Menu = {}
  clientFk: number
  product: string
  constructor(
    private route: ActivatedRoute,
    private formService: FormService,
    private router: Router,
    private logger: LogService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    this.clientFk = this.UserObj.clientFk
    this.getFormData(this.route.snapshot.params.id)
    this.getMenyById(this.route.snapshot.params.id)
    this.product = localStorage.getItem('product')
  }

  getFormData(id: number): void {
    this.logger.log('start of Edit-Form-Component : getFormData :id', id)
    let datas
    this.formService.get(id).subscribe(data => {
      datas = data

      if (Object.keys(datas.attributes).length !== 0) {
        if (Array.isArray(datas.attributes)) {
          datas.attributes = datas.attributes
        } else {
          datas.attributes = JSON.parse(datas.attributes)
        }
      }

      if (datas.attributes === null || datas.attributes === undefined) {
        this.model.attributes = []
      } else {
        this.model.attributes = datas.attributes
      }
      this.model.name = datas.name
      this.model.description = datas.description
      this.logger.log('End of Edit-Form-Component : getFormData')
    })
  }

  onDragStart(event: DragEvent): void {
    this.logger.log('for test')
    this.logger.log('drag started', JSON.stringify(event, null, 2))
  }

  onDragEnd(event: DragEvent): void {
    this.logger.log('drag ended', JSON.stringify(event, null, 2))
  }

  onDraggableCopied(event: DragEvent): void {
    this.logger.log('draggable copied', JSON.stringify(event, null, 2))
  }

  onDraggableLinked(event: DragEvent): void {
    this.logger.log('draggable linked', JSON.stringify(event, null, 2))
  }

  onDragged(item: Item, list: Item[], effect: DropEffect): void {
    if (effect === 'move') {
      const index = list.indexOf(item)
      list.splice(index, 1)
    }
  }

  onDragCanceled(event: DragEvent): void {
    this.logger.log('drag cancelled', JSON.stringify(event, null, 2))
  }

  onDragover(event: DragEvent): void {
    this.logger.log('dragover', JSON.stringify(event, null, 2))
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
    const data = {
      name: this.model.name,
      description: this.model.description
    }

    this.formService.saveForm(data).subscribe()
  }

  initReport(): void {
    this.report = true
  }

  toggleValue(item): void {
    item.selected = !item.selected
  }

  getMenyById(id): void {
    this.formService.getMenyById(id).subscribe(data => {
      this.menuObj = data
      sessionStorage.setItem('menuid', this.menuObj[0].id)
    })
  }

  submit(): void {
    this.logger.log('start of Edit-Form-Component : submit :Save', this.model)
    const input = new FormData()
    input.append('formId', this.model._id)
    input.append('attributes', JSON.stringify(this.model.attributes))
    // unused so removed
    this.formService
      .updateForm(
        this.route.snapshot.params.id,
        this.route.snapshot.params.name,
        this.model
      )
      .subscribe(response => {
        this.logger.log(
          'End of Edit-Form-Component : submit :Response',
          response
        )
        this.success = true
        sessionStorage.setItem(
          'redirect_to',
          `/edit/${this.route.snapshot.params.name}/${this.route.snapshot.params.id}`
        )
        window.location.reload()

        // this.formService.getAll(this.clientFk)
      })
  }

  alterTable(): void {
    const menuid = sessionStorage.getItem('menuid')
    const schemaName = sessionStorage.getItem('clientName')
    this.formService
      .alterTable(
        this.route.snapshot.params.id,
        this.route.snapshot.params.name,
        schemaName,
        this.model,
        +menuid
      )
      .subscribe(response => {
        this.logger.log(
          'End of Edit-Form-Component : submit :Response',
          response
        )
        this.success = true
        sessionStorage.setItem(
          'redirect_to',
          `/edit/${this.route.snapshot.params.name}/${this.route.snapshot.params.id}`
        )
        window.location.reload()
        this.userService.changePage('template', 'TemplateListComponent')
      })
    this.isInputDisable = true
    this.isEditButtonVisible = true
    this.saveButton = false
  }
  cancel(): void {
    this.router.navigate(['/template'])
    this.formService.getAll(this.clientFk)
  }
  enableInput(): void {
    this.isInputDisable = false
    this.isEditButtonVisible = false
    this.saveButton = true
  }
}
