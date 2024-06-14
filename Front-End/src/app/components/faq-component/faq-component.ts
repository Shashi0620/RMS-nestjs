/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable no-undef */
/*
 * This is contactus.component.ts
 */
import {Component, OnInit} from '@angular/core'
import {UserService} from '../../services/user.service'

export interface Faq {
  question: string
  answer: string
}

@Component({
  selector: 'faq-component',
  templateUrl: './faq-component.html',
  styleUrls: ['./faq-component.css']
})
export class FaqComponent implements OnInit {
  faqData: any

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchFaqData()
  }

  public async fetchFaqData(): Promise<void> {
    const faqData = this.userService.fetchFaqData().subscribe(faq => {
      this.faqData = faq
    })
  }

  public async toggleAnswer(faq: any) {
    faq.showAnswer = !faq.showAnswer
  }
}
