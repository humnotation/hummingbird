# grunt-web-server

> A Web Server task for grunt similar to Python's SimpleHTTPServer, with Cross-Origin Resource Sharing and No-Cache options.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-web-server --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-web-server');
```

## The "web_server" task

### Overview

In your project's Gruntfile, add a section named `web_server` to the data
object passed into `grunt.initConfig()`.

**Please take special note of the `foo: "bar"` property below. For some reason an extra key with a non-object value is necessary for things to work. Clearly I'm not understanding something about writing a Grunt plugin here... would appreciate a pull or note if anyone knows what I'm doing wrong.**

```js
grunt.initConfig({
  web_server: {
    options: {
      cors: true,
      port: 8000,
      nevercache: true,
      logRequests: true
    },
    foo: 'bar' // For some reason an extra key with a non-object value is necessary
  },
})
```

### Options

#### options.cors
Type: `Boolean`
Default value: `true`

Whether to send Cross-Origin Resource Sharing headers.

#### options.port
Type: `Int`
Default value: `1337`

What port to server web requests on.

#### options.nevercache
Type: `Boolean`
Default value: `true`

If true, then the server will send headers to try to force the browser to request files afresh each time.

#### options.logRequests
Type: `Boolean`
Default value: `true`

If true, then the server will log all incoming requests and the HTTP status of their result.

## Running

Once you've configured the web server as above, run the web server with:

```js
grunt web_server
```

Terminate the web server with `Ctrl-C`

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

*   *2013-09-27* Initial release.
