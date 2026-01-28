import type { OnInit } from '@angular/core'
import { Component } from '@angular/core'

// eslint-disable-next-line ts/no-unsafe-call
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './angular.component.html',
})
export class AppComponent implements OnInit {
  readonly title = 'eslint-config'

  ngOnInit(): void {
    // eslint-disable-next-line no-console
    console.error()
  }
}
