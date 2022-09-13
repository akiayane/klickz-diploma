import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BuildingsComponent } from './buildings/buildings.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { StartverificationComponent } from './startverification/startverification.component';
import { CodeInputModule } from 'angular-code-input';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatExpansionModule } from '@angular/material/expansion';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { FilterPipe } from './filter.pipe';
import { TagsFilterPipe } from './tagsfilter.pipe';

import { ShellComponent } from './shell/shell.component';
import { LinksComponent } from './links/links.component';
import { CreatelinkComponent } from './createlink/createlink.component';
import { LinkComponent } from './link/link.component';
import { ProfileComponent } from './profile/profile.component';

import { Angular2CsvModule } from 'angular2-csv';
import { DocumentationComponent } from './documentation/documentation.component';
import { TestComponent } from './test/test.component';
import { AccountComponent } from './account/account.component';
import { ApiComponent } from './api/api.component';
import { InvitesComponent } from './invites/invites.component';
import { InviteComponent } from './invite/invite.component';
import { from } from 'rxjs';
import { LinkInviteComponent } from './link-invite/link-invite.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BuildingsComponent,
    AuthorizationComponent,
    StartverificationComponent,
    DashboardComponent,
    ShellComponent,
    LinksComponent,
    CreatelinkComponent,
    LinkComponent,
    ProfileComponent,
    FilterPipe,
    TagsFilterPipe,
    DocumentationComponent,
    TestComponent,
    AccountComponent,
    ApiComponent,
    InvitesComponent,
    InviteComponent,
    LinkInviteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CodeInputModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatPaginatorModule,
    NgxSkeletonLoaderModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatSelectModule,
    MatChipsModule,
    MatSlideToggleModule,
    DragDropModule,
    MatExpansionModule,
    ClipboardModule,
    MatAutocompleteModule,
    Angular2CsvModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
