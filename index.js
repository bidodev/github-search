// More API
"use strict";

// 'sloppy mode';

class Search {
  constructor(options = {}) {
    //console.log("Search -> constructor -> options", options);

    this.options = {
      container: "",
    };
    //Object.assign(target, ...sources)
    Object.assign(this.options, options); //options is our parameter which received the object from new Search()
    //now we have an object with a propertie called container
    /**
     * {
        "container": ".result"
        }
     */
    ////
    this.apiUrl = "https://api.github.com";
    this.userNameEndpoint = "/users/:username/repos";

    // create ab empty object for elements..
    this.elements = {};

    /**upon this point our object created by our constructor looks like this
     * {
        options: {
          container: ".result"
        },
        apiUrl: "https://api.github.com",
        userNameEndpoint: "/users/:username/repos",
        elements: {}
        }
     */
    //start widget method
    this.init();
  }

  //init method
  init() {
    /*this will be translate in
    elements = {
      container: '<div class=".result">'; //why is that? because this value is the result of document.querySelector('.result)
      
    }
    */
    this.elements.container = document.querySelector(this.options.container);

    //the innerHTML of our elements.container now will be the result of the method parsedInitialTemplate()
    this.elements.container.innerHTML = this.parsedInitialTemplate();

    // getting all the elements
    /* this three lines will fill up our object elements 
    /* now we have an the follow values inside elements
         elements = {
            container: ,
            form:  the value here will be the result of (result.querySelector(".form"));,
            input: the same as above but now we were targeting ('.inputText'),
            list": the same as above but now we were targeting ('.repositories'),
          }
    */
    this.elements.form = this.elements.container.querySelector(".form");
    this.elements.input = this.elements.container.querySelector(".inputText");
    this.elements.list = this.elements.container.querySelector(".repositories");

    // call the method to register the events
    this.registerEvents();
  }

  parsedInitialTemplate() {
    return `
      <form class="form">
        <label for="username">Name</label>
        <input type="text" class="inputText" placeholder="Github username" required>
        <input type="submit" class="btn" value="Submit"/>
      </form>
      <div class="repositories"></div>
  `;
  }

  registerEvents() {
    this.elements.form.addEventListener("submit", e => {
      e.preventDefault();

      // getting the value from input field
      const username = this.elements.input.value.trim();

      this.getRepositories(username, repositories => {
        repositories = this.filterReposResult(repositories);
        const markup = this.createListTemplate(repositories);
        this.elements.list.innerHTML = markup;
      });
    });
  }

  async getRepositories(username, callback) {
    const url = `${this.apiUrl}${this.userNameEndpoint}`.replace(
      ":username",
      encodeURIComponent(username)
    );
    const response = await fetch(url);
    const data = await response.json();

    callback(data);
  }

  filterReposResult(repositoryData) {
    const repositories = repositoryData.map(repo => {
      //destructuring
      const { name, description, html_url: url, created_at: created } = repo;

      return {
        description: description ? description : "Description not avaiable",
        name: name,
        url: url,
        createdAt: created,
      };
    });
    return repositories;
  }

  createListTemplate(repositories) {
    return `
      <div>
        ${repositories
          .map(repository => this.listTemplate(repository))
          .join("")}
      </div>
    `;
  }
  listTemplate(repository) {
    return `
        <a href="${repository.url}" target="_blank" class="widget-box">
            <h4>${repository.name}</h4>
            <small>${repository.createdAt}</small>
          <p>
            ${repository.description}
          </p>
        </a>
      `;
  }
}

//1 - Create an instance on Search class passing an object as argument
//2 - Save the result inside the variable widget
const widget = new Search({ container: ".result" });
