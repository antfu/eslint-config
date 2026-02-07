import type { OnInit } from '@angular/core'
import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <section class="app">
      <h1>{{ title }}</h1>
      <img src="logo.svg" alt="Logo">
    </section>
`
})
export class AppComponent implements OnInit {
  readonly title = 'eslint-config'

  ngOnInit(): void {
    console.error()
  }
}
