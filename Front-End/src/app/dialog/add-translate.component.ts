/*
 * This is add-translate.component.ts
 */
import {Component, Inject, Optional} from '@angular/core'
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog'

export interface UsersData {
  action: string
  name: string
  id: number
}
@Component({
  selector: 'app-dialog-box',
  templateUrl: './add-translate.html',
  styleUrls: ['./Translate.css']
})
export class AddMenuComponent {
  action: string
  local_data: UsersData

  constructor(
    public dialogRef: MatDialogRef<AddMenuComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: UsersData
  ) {
    this.local_data = {...data}
    this.action = this.local_data.action
  }

  doAction(): void {
    this.dialogRef.close({event: this.action, data: this.local_data})
  }

  closeDialog(): void {
    this.dialogRef.close({event: 'Cancel'})
  }
}
