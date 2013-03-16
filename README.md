# ReadMyFeed

ReadMyFeed is a node.js based, self-hosted RSS/Atom feed aggregator.


## Application Structure

* **server.js**: Bootstrapper script. Starts web server as well as synchronizer background job.
* **app**: Exposes requirable express app instance. Contains everything served through web server as well as related logic.
* **synchronizer**: Exposes the synchronizer as an independent object. Though it runs in the main process now, it's meant to be run as a separate child process invoked and monitored by server.js.
* **models**: Mongoose models.
* **lib**: Required utility files nonexistent in external modules.

## What's working

* Authentication using Google OAuth2
* Google Reader feed sync

## TODO

* Finish the synchronizer - read and save articles from feeds, setup sync schedule
* Display articles - searchable and filterable by categories
* Write tests

## Prerequisites

* node 0.10.x and npm 1.2.x
* mongodb >= 2.x

## Setup

  git clone git://github.com/deltasquare4/ReadMyFeed.git
  cd ReadMyFeed && npm install

  // Rename config/server.*.json.sample to config/server.*.json and replace placeholders with relevant information
  cp config/server.development.json.sample config/server.development.json

  # run
  node server.js