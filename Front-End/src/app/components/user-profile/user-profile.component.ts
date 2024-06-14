/*
 * This is user-profile.component.ts
 */
import {Component, OnInit} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'
import {Profile} from '../../models/userProfile.model'
import {UploadFilesService} from '../../services/upload-files.service'
import {UserProfileService} from '../../services/user-profile.service'
import {HttpEventType, HttpResponse} from '@angular/common/http'
import {Observable} from 'rxjs'
import {AlertService} from '../_alert/alert.service'
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import {User} from '../../models/user.model'
import {environment} from '../../../environments/environment'
import {FileImg} from '../../models/fileimg.model'
import {LogService} from '../../services/log.service'
const serverBaseURL = environment.baseUrl
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  UserObj: User = {}
  user_fk: number
  selectedFiles?: FileList
  currentFile?: File
  progress = 0
  message = ''
  profileForm: FormGroup
  fileId = undefined
  fileInfos?: Observable<FileImg>
  submitted = false
  isExist = false
  profile: Profile = {
    id: 0,
    userName: '',
    email: '',
    address: '',
    city: '',
    image: '',
    phone: '',
    user_fk: 0
  }

  file: FileImg = {
    filename: '',
    filepath: `${serverBaseURL}/api/user/files/profile/`,
    user_fk: 0
  }

  options = {
    autoClose: true,
    keepAfterRouteChange: false
  }
  constructor(
    private userProfile: UserProfileService,
    private route: ActivatedRoute,
    private uploadService: UploadFilesService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private logger: LogService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.profileForm = this.formBuilder.group({
      userName: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      // city: ['', Validators.required],
      phone: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    this.user_fk = this.UserObj.id
    this.fetchProfileObject(this.route.snapshot.params.id)
  }

  get f(): any {
    return this.profileForm.controls
  }

  selectFile(event): void {
    this.selectedFiles = event.target.files
    this.upload()
  }

  onSubmit(): void {
    this.submitted = true
    if (this.profileForm.invalid) {
      return
    }
    this.updateProfile()
  }

  updateProfile(): void {
    this.logger.log('Start of UserProfile : updateProfile')
    this.userProfile
      .updateProfile(this.profile.id, this.profile)
      .subscribe(user => {
        this.alertService.success('Profile Updated Successfully', this.options)
        sessionStorage.setItem('userProfileName', user[0].userName)
        this.logger.log(
          'UserProfile : updateProfile server response',
          this.profile
        )
        sessionStorage.setItem('redirect_to', `/userProfile/${this.profile.id}`)
        window.location.reload()
        //this.fetchProfileObject(this.profile.id)
      })
  }

  upload(): void {
    this.logger.log('Start of UserProfile : upload')
    this.progress = 0

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0)

      if (file) {
        this.currentFile = file

        this.uploadService.upload(this.currentFile).subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round((100 * event.loaded) / event.total)
              this.file.filename = this.currentFile.name
              this.file.user_fk = this.user_fk
              if (this.fileId !== undefined) {
                this.uploadService
                  .updateFile(this.fileId, this.file)
                  .subscribe(() => {
                    this.profile.image = this.file.filepath + this.file.filename
                    this.alertService.success(
                      'Image Updated successfully',
                      this.options
                    )

                    this.logger.log(
                      'UserProfile : upload : updateFile :server response',
                      this.file
                    )
                    this.fetchAllFiles(this.currentFile.name)
                  })
              } else {
                this.uploadService.createFile(this.file).subscribe(() => {
                  this.profile.image = this.file.filepath + this.file.filename
                  this.alertService.success(
                    'Image uploaded successfully',
                    this.options
                  )
                  this.logger.log(
                    'UserProfile : updateProfile : createFile : server response',
                    this.file
                  )
                  this.fetchAllFiles(this.file.filename)
                })
              }
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message
              this.fileInfos = this.uploadService.getFiles()
            }
          },
          err => {
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

  fetchProfileObject(id: number): void {
    this.logger.log('Start of UserProfile : fetchProfileObject :id', id)
    this.userProfile.fetchProfileById(id).subscribe(response => {
      this.profile = response
      this.logger.log(
        'End of UserProfile : fetchProfileObject :server response',
        this.profile
      )
      this.fetchFile(this.UserObj.id)
    })
  }

  fetchFile(user_fk: number): void {
    this.logger.log('Start of UserProfile : fetchFile :user_fk', user_fk)
    this.uploadService.fetchFile(user_fk).subscribe(response => {
      this.profile.image = this.file.filepath + response[0].filename
      this.fileId = response[0].id
      this.logger.log('Start of UserProfile : fetchFile :response', this.fileId)
    })
  }

  fetchAllFiles(name): void {
    this.logger.log('Start of UserProfile : fetchAllFiles :name', name)
    this.uploadService.fetchAllFiles().subscribe(response => {
      for (let i = 0; i < response.length; i++) {
        if (response[i].filename === name) {
          this.profile.image = this.file.filepath + response[i].filename
        }
      }
      this.logger.log(
        'End of UserProfile : fetchAllFiles :server response',
        this.profile.image
      )
    })
  }
}
