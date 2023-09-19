import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FormViewerComponent } from './form-viewer/form-viewer.component';
import { FormBuilderComponent } from './form-builder/form-builder.component';

@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [FormViewerComponent, FormBuilderComponent],
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