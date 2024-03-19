import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SessionComponent } from "./session/session.component";
import { FormsModule } from "@angular/forms";
import { ProductComponent } from "./product/product.component";
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatBadgeModule} from '@angular/material/badge'

@NgModule({
    declarations:[],
    imports:[CommonModule,FormsModule, SessionComponent, MatSnackBarModule, MatBadgeModule]
    })

export class AppModule{}