
<a name="readme-top"></a>
# DailyPhoto

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#introduction">Introduction</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#installation">Installation</a>
      <ul>
        <li>JavaScript Dependencies</li>
        <li>Python Dependencies</li>
      </ul>
    </li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#usage">Usage</a></li>
  </ol>
</details>

## Introduction
This is a personal project that allows the user to capture their everyday lives simply with colors. Images can be uploaded every day with a description and the site will process them, find the dominant colors, and return it back.
<br>
I am planning to implement a life strip where I can combine all the colors of the year into a single strip. Another thing I will implement is sentiment analysis based on the description with colors. A picture will only show the five dominant colors but won't tell the entire story of the user's day but their description with their colors may help.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [Cloudinary][Cloudinary-url]
* [Mongoose][Mongoose-url]
* [Express.js][Express-url]
* [Node.js][Node-url]
* [Python][Python-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Installation

### JavaScript Dependencies
1) Navigate to the root directory of the project and use npm (Node Package Manager) to create a project and run: `npm init -y`.
2) Use npm to install the JavaScript libraries and packages which can be found in the `package.json` file.
### Python Dependencies  
1) To install the required Python dependencies, navigate to the project's root directory and run: `pip install -r requirements.txt`

## Getting Started
1) You need to create a Cloudinary account and create a `.env` file and get these THREE keys after creating an account.
* **CLOUDINARY_CLOUD_NAME** - CLOUDINARY_CLOUD_NAME=``<br>
* **CLOUDINARY_KEY** - CLOUDINARY_KEY=``<br>
* **CLOUDINARY_SECRET** - CLOUDINARY_SECRET=``<br>
2) Change `secret` in `app.js` for the session configuration.
3) Connect to the correct Mongo database in the `app.js` file.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage
To run the website on your local server,  go to the  run `nodemon app.js`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS -->
[Cloudinary-url]: https://cloudinary.com/developers
[Mongoose-url]: https://www.npmjs.com/package/mongoose
[Python-url]: https://www.python.org/
[Mongoose-url]: https://www.python.org/
[Express-url]: https://expressjs.com/
[Node-url]: https://nodejs.org/en
