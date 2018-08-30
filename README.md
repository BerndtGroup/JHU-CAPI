# JHU CAPI HTML Templates

> This readme.md acts as a starting point for the front end code of new TBG projects, update this file, and this description as new projects transtion into production.


##Table of Contents
* [Setup and Usage](#setup-and-usage)
* [File and Folder Setup](#file-folder-setup)
* [Pre-Development Production Checklist](#pre-dev-production-checklist)
* [Pre-Launch Production Checklist](#pre-launch-production-checklist)
* [Project specific notes](#notes)
  * [Accessibility](#accessibility)
  * [Browser Support](#browser-support)
  * [Font Licensing](#fonts)
  * [HTML](#notes-html)
  * [CSS](#notes-css)
* [Production Templates](#templates)
  * [Batch 0](#templates-b0)


## <a name="setup-and-usage"></a>Setup and Usage

To work locally on front end files, follow these steps. First, if you do not have Node installed on your computer:

1. Download [Node Version Manager for Windows](https://github.com/coreybutler/nvm-windows/releases) (nvm-setup.zip) and run the installer, or [Node Version Manager for Mac](https://github.com/creationix/nvm#installation) and follow the installation instructions.
> Note: This project currently requires Node.js version 6.4.0, and issues have been encountered with newer versions. To use Node.js 6.4.0, install via the terminal/command line using Node Version Manager
```
nvm install 6.4.0
nvm use 6.4.0
```
2. Install [Grunt](http://gruntjs.com/) globally via the terminal/command line

```
npm install -g grunt-cli
```

> Note: depending on your OS or how Node was installed, you may have to use the 'sudo' command, like so: 'sudo npm install -g grunt-cli'

Once Node and Grunt are successfully installed, go to the root of the project in your terminal/command line and install the project dependencies:

```
cd path/to/project
npm install
```

If everything installed correctly, you should now be able to run 'grunt' from your terminal in the same directory.

```
grunt
```

Pass the `--skip-install"` flag to prevent grunt from running an npm install.

```
grunt --skip-install
```

Performing the 'grunt' command will build all files to the Website directory. While this is the ultimate destination for these files, it would be very tedious to run this command every time changes are made. Instead, we'll fire up a local server that watches for changes:

```
grunt server
```

Typing this command in your terminal should open up the local server (localhost:9000) in your browser. Work out of the FrontEndSrc folder and test changes at this server. **Note: a couple folders exist in the FrontEndSrc folder that you should not touch - 'ProductionTemplates' and 'pattern-library' - these are just where source files are built to for previewing on the local server.**

Before you push changes to QA or Stage, run a full Grunt build. The build will also run on the server, but running it locally reduces risk that the build will encounter any errors on the server.

### Tips

* Install the [EditorConfig](http://editorconfig.org/) plugin for your code editor. It will automatically update your editor's configuration while working on the project to match project rules like indentation and line endings.
* Install the sass-lint plugin for your code editor to quickly point out stylistic issues in your Sass code (Grunt will point them out regardless).
* Install the JSHint plugin for your code editor to quickly point out JSHint errors (Grunt will point them out regardless).


## <a name="file-folder-setup"></a>File and Folder Setup/Philosophy

Except for build and other configuration changes, all front-end development work occurs in the FrontEndSrc folder. What follows is an explanation of our overall file organization methodology/philosophy.

_Group files by component, not type_

Except in cases of global styles or functionality, all code required for a given module/component should be contained within a single folder. This results in a more easily navigable code base that promotes modularization.

> Example: A secondary navigation component consists of component-specific Handlebars, Sass, JavaScript, and YAML (for the navigation data). All of those files are contained in a single folder located at FrontEndSrc/modules/macro/nav-secondary (because it is a module made up of many smaller elements).

For compatibility with Handlebars/Assemble partials and to make editor tab names more scannable/understandable, individual component files are named after the component, rather than being given an abstract name like view.hbs, styles.scss, etc.

> example: the files for the secondary navigation component are:
> * nav-secondary.hbs
> * nav-secondary.scss
> * nav-secondary.js
> * nav-secondary.yml

_Global utilities exist outside of the module structure_

There can be a lot of value in creating simple CSS rules and JS functionality that can be quickly applied in order to make code DRYer and quicker to write. This type of code resides in the FrontEndSrc/css or FrontEndSrc/js folder. There are no restrictions as to where these global utilities can be applied, therefore a module's HTML may contain module-specific classes, as well as global utility classes.

Within the css directory, global classes exist in the _base.scss, _layout.scss, _print.scss, _reset.scss, and _utilities.scss files, depending on their function. Sass-specific functionality that might be used by modules, such as variables, mixins, and functions, exists in the FrontEndSrc/css/imports folder.

> Example: many full width components require their content to be contained in an area 90% of the screen width, with a max-width of 1000px. Rather than repeating these styles in each module, a class called "l-contain" is created that can be applied as needed.

Similarly, JS that can be reused across modules should exist in the FrontEndSrc/js/imports directory. Some JS may start off as module-specific and then get abstracted out to this location.

> Example: several modules fire actions based on the scroll position and direction, so an abstract function (scrollActions.js) is created for those modules to reuse and placed in FrontEndSrc/js/imports.

_Module files are imported into a single file (or multiple, when it makes sense)_

For most projects that consist of a single website, there will exist only one main.css and main.js. Sass files are imported into FrontEndSrc/css/main.scss, grouped by type (base, layout, module, etc.) and sorted alphabetically. With proper modularization, there should be no cascade issues with alphabetizing the files imported (note we still include the reset before everything else for obvious reasons).

```scss
/* ======  Base styles/helpers ====== */

@import 'reset';
@import 'base';


/* ===== Layout Rules ===== */

@import 'layout';
@import 'layout/content/content';
@import 'layout/footer/footer';
@import 'layout/header/header';


/* ======  Micro Modules ====== */

@import 'modules/micro/btn/btn';


/* ======  Macro Modules ====== */

@import 'modules/macro/nav-primary/nav-primary';
@import 'modules/macro/portlet/portlet';


/* ======  Utilities ====== */

@import 'utilities';
```

All module JS files are imported into (and initialized via) FrontEndSrc/js/main.js using ES6 style import statements (transpiled into commonJS via Babel), like so:

```js
import Portlet from 'modules/macro/portlet/portlet.js';

$('.js-portlet').forEach(function(wrap) {
    Portlet().init({
        wrap: wrap
    });
});
```

On projects consisting of several sites with shared components, or projects with very distinct components, new master import files can be created to grab only the files needed for that site/piece of functionality.

> Example: a project that has a main website as well as a set of microsite templates has both a main.scss and microsite.scss file that import only the modules used.


## <a name="pre-dev-production-checklist"></a>Pre-Development Production Checklist

- [ ] Browser Support confirmed and [listed below](#browser-support)
- [ ] Font Licensing confirmed and [listed below](#fonts)
- [ ] Accessibility - confirmed and [listed below](#accessibility)
- [ ] package.json (in project root) updated with project name and url
- [ ] web.config (in project root) updated with prototype site url

For information about setting up HTML prototype site, refer to [the boilerplate wiki](https://github.com/BerndtGroup/TBG-Front-End-Boilerplate/wiki)


## <a name="pre-launch-production-checklist"></a>Pre-Launch Production Checklist

- [ ] HTML templates validated as W3C compliant HTML5 (as much as is possible)
- [ ] HTML templates validated as Section 508 (or relevant accessibility level) compliant
- [ ] Print styles applied to all templates
- [ ] Schema markup applied and [validated](https://developers.google.com/structured-data/testing-tool/)
  - [ ] Basic website/organization schema markup
    - [ ] [WebSite - Copyright Year](http://schema.org/copyrightYear)
    - [ ] [WebSite - Sitelinks Search](https://developers.google.com/webmasters/structured-data/slsb-overview)
    - [ ] [Organization - Logo](https://developers.google.com/webmasters/structured-data/customize/logos)
    - [ ] [Organization - Corporate Contacts](https://developers.google.com/webmasters/structured-data/customize/contact-points)
    - [ ] [Organization - Social Profiles](https://developers.google.com/webmasters/structured-data/customize/contact-points)
  - [ ] Secondary schema markup - Research/implement schemas where applicable if it is in scope
- [ ] Favicons added
  - [ ] favicon.ico - 16 x 16px - [more info](https://github.com/audreyr/favicon-cheat-sheet)
  - [ ] apple-touch-icon.png - 60 x 60px - [more info](https://developer.apple.com/library/ios/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
  - [ ] Windows pin - 144 x 144px - [more info](http://msdn.microsoft.com/library/windows/apps/jj662929(v=vs.105).aspx), [more info](http://davidwalsh.name/windows-8-pin-metas)
- [ ] Twitter cards validated / URL whitelisted - [more info](https://cards-dev.twitter.com/validator)
- [ ] Facebook OG tags validated- [more info](https://developers.facebook.com/tools/debug/)
- [ ] Performance testing complete / solutions implemented (test with Google PageSpeed and YSlow)
  - [ ] Browser caching enabled - [more info](http://dotnetdaily.net/tutorials/add-expires-headers-asp-net-website/)
  - [ ] Gzip enabled on server
  - [ ] Images are resized on the server to the smallest necessary size
  - [ ] Lazy-loading of images is used on pages with lots of images
- [ ] Google Analytics code is in place, uncommented, with the proper site ID


## <a name="notes"></a>Project specific notes

### <a name="accessibility"></a>Accessibility Level

* :warning: *__get confirmation__*

### <a name="browser-support"></a>Browser Support

* Chrome - Evergreen
* Firefox - Evergreen
* Safari - Evergreen
* Edge - Evergreen
* :warning: *__Internet Explorer - get confirmation and update__*

### <a name="fonts"></a>Font Licensing

* :warning: *__List fonts used in this project and how the fonts are served (hosted, third party)__*

### <a name="notes-html"></a>HTML

##### HTML5

##### Validate at http://validator.w3.org/

### <a name="notes-css"></a>CSS

##### Add a comment to the top of any new Sass modules
```css
/* === Title of Module === */
```

##### Use [YAPL](https://github.com/matt-diehl/YAPL) comments in Sass files for items that should appear in the Pattern Library
```css
/* YAPL
name: Module Name
partial: module-partial-file
context: context.ofPartial
selector: .unique-selector
notes: |
    - A note about the module
*/
```

##### Use BEM - block, element, modifier
* http://www.alwaystwisted.com/articles/2014-02-27-even-easier-bem-ing-with-sass-33
