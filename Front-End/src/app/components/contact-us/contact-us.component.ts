/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable no-undef */
/*
 * This is contactus.component.ts
 */
import {Component, OnInit, ViewChild} from '@angular/core'
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'
import {UserService} from '../../services/user.service'
import {User} from 'src/app/models/user.model'
import swal from 'sweetalert2'

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  FormData: FormGroup
  UserObj: User = {}
  @ViewChild('attachments') attachment: any
  selectedFile: FileList
  currentFile: File | null
  isLoading = false
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    if (this.UserObj === null) {
      this.FormData = this.formBuilder.group({
        email: new FormControl('', [Validators.required]),
        subject: 'Enquiry',
        message: new FormControl('', [Validators.required])
      })
    } else {
      this.FormData = this.formBuilder.group({
        email: new FormControl('', [Validators.required]),
        subject: 'Ticket',
        id: this.UserObj.id,
        message: new FormControl('', [Validators.required])
      })
    }
  }

  onEnquiryAndContactUsSubmit(FormData): void {
    if (this.selectedFile != null && this.selectedFile != undefined) {
      this.userService
        .uploadContactUsAttachment(this.currentFile)
        .subscribe(data => {
          console.log(data)
        })
      FormData.fileName = this.selectedFile.item(0).name
    }
    if (this.UserObj) {
      this.userService.contactUs(FormData).subscribe(() => {
        swal({
          title: 'Thank You!',
          text:
            'Your ticket is raised our support will contact you within 24 hrs.',
          type: 'success',
          showCancelButton: false,
          confirmButtonColor: '#00B96F',
          confirmButtonText: 'Ok'
        })
      })
      //Clear Email Field
      $('input[type=email]').val('')
      //Clear Message Field
      $('#message').val('')
    } else {
      this.userService.contactUs(FormData).subscribe(() => {
        swal({
          title: 'Thank You!',
          text:
            'Your enqury is posted to our support staff, will reply to you within 24 hrs.',
          type: 'success',
          showCancelButton: false,
          confirmButtonColor: '#00B96F',
          confirmButtonText: 'Ok'
        })
      })
      //Clear Email Field
      $('input[type=email]').val('')
      //Clear Message Field
      $('#message').val('')
      //Close Modal dailog
      ;($('#contactusModal') as any).modal('hide')
    }
  }

  onFileChanged(event: any) {
    this.selectedFile = event.target.files
    this.currentFile = this.selectedFile.item(0)
  }
}
