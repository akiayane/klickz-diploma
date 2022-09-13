import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { ApiComponent } from './api/api.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { BuildingsComponent } from './buildings/buildings.component';
import { CreatelinkComponent } from './createlink/createlink.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DocumentationComponent } from './documentation/documentation.component';
import { HomeComponent } from './home/home.component';
import { InvitesComponent } from './invites/invites.component';
import { LinksComponent } from './links/links.component';
import { ProfileComponent } from './profile/profile.component';
import { ShellComponent } from './shell/shell.component';
import { StartverificationComponent } from './startverification/startverification.component';
import { TestComponent } from './test/test.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "buildings", component: BuildingsComponent},
  {path: "auth", component: AuthorizationComponent},
  {path: "verification", component: StartverificationComponent},
  {path: "documentation", component: DocumentationComponent},
  {path: "test", component: TestComponent},


  {
    path: "dashboard", component: ShellComponent, children : [
      // {path: "main", component: DashboardComponent},
      {path: "profile", component: ProfileComponent, data: { animationState: 'profile' }, children : [
        {path: "account", component: AccountComponent},
        {path: "api", component: ApiComponent},
        {path: "invites", component: InvitesComponent}
      ]
    },
      {path: "links", component: LinksComponent, data: { animationState: 'links' }},
      {path: "createlink", component: CreatelinkComponent, data: { animationState: 'createlink' }},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }