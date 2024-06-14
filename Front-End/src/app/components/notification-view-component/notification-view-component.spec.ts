import {ComponentFixture, TestBed} from '@angular/core/testing'

import {NotificationViewComponent} from './notification-view-component'

describe('CreateRackComponent', () => {
  let component: NotificationViewComponent
  let fixture: ComponentFixture<NotificationViewComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationViewComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationViewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })
})
