/*
 * This is template-details.component.ts
 */
import {FormService} from './../../services/app.form.service'
import {Component, OnInit} from '@angular/core'
import {ActivatedRoute} from '@angular/router'
import {Template} from '../../models/template.model'

@Component({
  selector: 'app-Template-details',
  templateUrl: './template-details.component.html',
  styleUrls: ['./template-details.component.css']
})
export class TemplateDetailsComponent implements OnInit {
  currentTemplate: Template = {
    name: '',
    subscriberId: ''
  }
  message = ''

  constructor(
    private formService: FormService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.message = ''
    this.getTemplate(this.route.snapshot.params.id)
  }

  getTemplate(id: number): void {
    this.formService.get(id).subscribe(
      data => {
        this.currentTemplate = data
      },
      error => {
        return error
      }
    )
  }

  updatePublished(): void {
    const data = {
      name: this.currentTemplate.name,
      subscriberId: this.currentTemplate.subscriberId
    }

    this.message = ''

    this.formService.update(this.currentTemplate.id, data).subscribe(
      response => {
        this.message = response.message
          ? response.message
          : 'This Template was updated successfully!'
      },
      error => {
        return error
      }
    )
  }

  updateTemplate(): void {
    this.message = ''

    this.formService
      .update(this.currentTemplate.id, this.currentTemplate)
      .subscribe(
        response => {
          this.message = response.message
            ? response.message
            : 'This Template was updated successfully!'
        },
        error => {
          return error
        }
      )
  }
}
