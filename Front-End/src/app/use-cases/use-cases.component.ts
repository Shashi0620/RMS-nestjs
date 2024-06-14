/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable no-undef */
/*
 * This is contactus.component.ts
 */
import {Component, OnInit} from '@angular/core'

@Component({
  selector: 'use-case',
  templateUrl: './use-cases.component.html',
  styleUrls: ['./use-cases.component.css']
})
export class UseCasesComponent implements OnInit {
  storeTranslate: string
  constructor() {}

  ngOnInit(): void {
    this.storeTranslate = localStorage.getItem('Stores')
  }
}
