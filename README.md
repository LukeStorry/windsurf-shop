# windsurf-shop
A simple web store written for the University of Bristol's COMS32500 Web Technologies unit.

[![herokubadge](https://img.shields.io/website-up-down-green-red/http/shields.io.svg?label=windsurf-shop.herokuapp.com)](https://windsurf-shop.herokuapp.com/)
[![Licence MIT](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/LukeStorry/windsurf-shop)
[![License Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FLukeStorry%2Fwindsurf-shop.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FLukeStorry%2Fwindsurf-shop?ref=badge_shield)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FLukeStorry%2Fwindsurf-shop.svg?type=small)](https://app.fossa.io/projects/git%2Bgithub.com%2FLukeStorry%2Fwindsurf-shop?ref=badge_small)

### [![logo](/public/images/logo.png) Live Demo](https://windsurf-shop.herokuapp.com)

## Installation
Simply clone the repo, and install dependencies:
```bash
git clone http://github.com/lukestorry/windsurf-shop
cd windsurf-shop
npm install
```


## Usage

`npm start`: runs the server with `node`, head to `http://localhost:3000/` to see it.

`npm run devstart`: same as above, but with `nodemon`, so the server restarts upon file changes.

`npm run deploy`: deploys to Heroku, if the remote app has been set up.

`npm run reset-database`: removes the database, and instantiates new empty tables.

`npm run update-products`: overwrites the products table in the database with the contents of the products.csv file.

`npm run check-database`: outputs the schema and names of items of both the user and products table, to check functionality.

## Main Technologies
Uses a [Node.js](https://nodejs.org) [Express Server](https://expressjs.com/) to deliver XHTML rendered by the [Pug](https://www.npmjs.com/package/pug) templating engine, with adapted [Bootstrap](https://getbootstrap.com) styling.

[Bcrypt](https://www.npmjs.com/package/bcrypt) and [Passport](http://www.passportjs.org/) handles authentication and authorization, with CSRF protection from [csurf](https://www.npmjs.com/package/csurf)

Products and users stored on an SQL server accessed and monitored using [sqlite3](https://www.npmjs.com/package/sqlite3).



## Licenses & Copyright

Products, images, and descriptions are retouched/edited versions of products for sale at [Boardwise](http://www.boardwisecannock.co.uk/windsurfing-c-385.html).

[Express-generator](https://www.npmjs.com/package/express-generator) was used to get up and running ([MIT License](https://opensource.org/licenses/MIT)).

All other modules used are listed in `package.json`, and apart from `sqlite3`, (which has a [BSD-3-Clause Licence](https://opensource.org/licenses/BSD-3-Clause)), they are all licensed under the [MIT License](https://opensource.org/licenses/MIT).

&nbsp;

##### Fossa Licences Analysis:
[![FOSSA Licences Scan Results](https://app.fossa.io/api/projects/git%2Bgithub.com%2FLukeStorry%2Fwindsurf-shop.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FLukeStorry%2Fwindsurf-shop?ref=badge_large)
