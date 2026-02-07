import type { OnInit } from "@angular/core"
import { Component } from "@angular/core"

@Component({
	selector: "app-root",
	standalone: true,
	templateUrl: "./angular.component.html",
})
export class AppComponent implements OnInit {
	readonly title = "eslint-config"

	ngOnInit(): void {
		console.error()
	}
}
