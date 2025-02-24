// // // This is the main.ts setup for "Module flow", basically if your app.component.ts(your bootstrapping component) is a module component (non-standalone component).

// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import { AppModule } from './app/app.module';

// platformBrowserDynamic()
//   .bootstrapModule(AppModule)
//   .catch((err) => console.error(err));

// // This is the main.ts setup for "standalone flow", basically if your app.component.ts(your bootstrapping component) is a standalone component.
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);

// //   Please just change the main.ts.

// // You should either use platformBrowserDynamic().bootstrapModule(AppModule) (modules flow - non standalone) or bootstrapApplication(AppComponent,...) (standalone flow).
