/*
 * This is upload-files.component.ts
 */
import {Component, OnInit} from '@angular/core'
import {HttpEventType, HttpResponse} from '@angular/common/http'
import {Observable} from 'rxjs'
import {UploadFilesService} from '../../services/upload-files.service'
import {FileImg} from '../../models/fileimg.model'

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css']
})
export class UploadFilesComponent implements OnInit {
  selectedFiles?: FileList
  currentFile?: File
  progress = 0
  message = ''
  isInvalidFileSelected: boolean
  fileInfos?: Observable<FileImg>

  constructor(private uploadService: UploadFilesService) {}

  ngOnInit(): void {
    this.fileInfos = this.uploadService.getFiles()
  }

  selectFile(event): void {
    this.selectedFiles = event.target.files
    this.isInvalidFileSelected = !this.selectedFiles[0].name.match(/\/(jpg|jpeg|png|gif|txt|pdf|mp4|mp3)$/)   
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
}
