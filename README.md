# Skynet Plotting _neo_

Skynet Plotting _neo_ is a re-imagination of the original [Skynet Plotting Tools](https://github.com/SkynetRTN/skynet-plotting), which was designed to make data anlysis easy for the students taking the intro level astronony lab course [Our Place in Space](https://skynet.unc.edu/astr101l) and it's follow-up course [Multi Wavelength Universe](https://openpress.usask.ca/skynet).

This project is based on the [Angular 14 framework](https://angular.io). Some of the key libaries are [Handsontable](http://handsontable.com), [Chart.js](http://chartjs.org), [Angular Material](http://material.angular.io), and [Bootstrap](https://getbootstrap.com).

The ultimate goal for this projector is to re-implement the functinoality of the existing graphing tools, but under a modern framework with good design pattern to make it maintainble in the long term, even not by its original authors.

Documentations have been set up as a Github Page through Github Actions. Check it out [here](https://ruidefu.github.io/skynet-plotting-neo/).

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
