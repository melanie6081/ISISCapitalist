import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SessionComponent } from "./session/session.component";
import { FormsModule } from "@angular/forms";
import { ProductComponent } from "./product/product.component";

@NgModule({
    declarations:[],
    imports:[CommonModule,FormsModule, SessionComponent]
    })

export class AppModule{}