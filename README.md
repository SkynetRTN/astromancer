# Astromancer by Skynet

Astromancer is a collection of data intuitivizer tools,
based on the original [Skynet Plotting Tools](https://github.com/SkynetRTN/skynet-plotting),
which was designed to make data anlysis easy for the students taking the intro level astronony lab course
[Our Place in Space](https://skynet.unc.edu/astr101l)
and it's follow-up course [Multi Wavelength Universe](https://openpress.usask.ca/skynet).

This project is based on the [Angular 15 framework](https://angular.io).
Some of the key libaries are
[Angular Material](http://material.angular.io),
[Bootstrap](http://getbootstrap.com),
[Handsontable](http://handsontable.com),
and [Highcharts](http://highcharts.com).

The first motivation for this projector is to re-implement the functionality of the existing graphing tools,
but under a modern framework with good design pattern to make it maintainable in the long term, even not by its original
authors.

The ultimate goal however, is to make observation data be understood intuitively by the students,
then inspire learning and facilitate research.

Documentations have been set up as a GitHub Page through GitHub Actions.
Check it out [here](https://ruidefu.github.io/astromancer/).

----
To build for development, run

```bash
npm run start
```

To build for production, run

```bash
npm run build
```

To generate documentations, run

```bash
npm run generate-docs
```

To view documentations in development environment, run

```bash
npm run serve-docs
```

To extract the source language file, run

```bash
ng extract-i18n --output-path src/locale
```

----
Contact author: [Reed Fu](mailto:rfugithub@outlook.com)
