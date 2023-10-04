import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NumbersOnlyDirective } from './common/NumbersOnlyDirective';
import { FormViewerComponent } from './form-viewer/form-viewer.component';
import { FormBuilderComponent } from './form-builder/form-builder.component';


@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    declarations: [NumbersOnlyDirective, FormViewerComponent, FormBuilderComponent],
    providers: [],
    exports: [FormViewerComponent, FormBuilderComponent]
})

export class NgFormEngineModule {
    static forRoot(): ModuleWithProviders<NgFormEngineModule> {
        return {
            ngModule: NgFormEngineModule
        };
    }
}