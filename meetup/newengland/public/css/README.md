## Less Middleware 1.4.0

We have released 1.4.0. This includes new features such as extends, the data-uri function and more maths functions. See the changelog for a full list of changes.

There are some known breaking changes.

@import-once is removed and is now default behaviour for @import.

(~".myclass_@{index}") { ... selector interpolation is deprecated, do this instead .myclass_@{index} { .... This works in 1.3.1 onwards.

The browser version no longer bundles a version of es5-shim.js - the version we previously used was inaccurate and the new version is significantly larger. Please include your choice of es-5 shim or only use on modern browsers.

We have introduced a optional strictMath mode, where math is required to be in parenthesis, e.g.

    (1 + 1)  // 2
    1 + 1    // 1+1


In 1.4.0 this option is turned off, but we intend to turn this on by default. We recommend you upgrade code and switch on the option (–strict-math=on in the command line or strictMath: true in JavaScript). Code written with brackets is backwards compatible with older versions of the less compiler.

We also added a strict units option (strictUnits: true or strict-units=on) and this causes lessc to validate the units used are valid (e.g. 4px/2px = 2, not 2px and 4em/2px throws an error). There are no longer any plans to switch this option on permanently, but some users will find it useful for bug finding.

Unit maths is done, so (4px * 3em) / 4px used to equal 3px and it now equals 3em. However we do not cancel units down to unitless numbers unless strict units is on. The selector interpolation, maths and units changes can be made to your less now and will compile fine with less 1.3.3.

## Variables

Variables allow you to specify widely used values in a single place, and then re-use them throughout the style sheet, making global changes as easy as changing one line of code.

    // LESS
    @color: #4D926F;
    
    #header {
         color: @color; 
    }
         h2 {
      color: @color;
    }
    /* Compiled CSS */
    
    #header {
      color: #4D926F;
    }
    h2 {
      color: #4D926F;
    }
    
## Mixins

Mixins allow you to embed all the properties of a class into another class by simply including the class name as one of its properties. It’s just like variables, but for whole classes. Mixins can also behave like functions, and take arguments, as seen in the example below.


    
    // LESS
    
    .rounded-corners (@radius: 5px) {
      -webkit-border-radius: @radius;
      -moz-border-radius: @radius;
      -ms-border-radius: @radius;
      -o-border-radius: @radius;
      border-radius: @radius;
    }
    
    #header {
      .rounded-corners;
    }
    #footer {
      .rounded-corners(10px);
    }
    /* Compiled CSS */
    
    #header {
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      -ms-border-radius: 5px;
      -o-border-radius: 5px;
      border-radius: 5px;
    }
    #footer {
      -webkit-border-radius: 10px;
      -moz-border-radius: 10px;
      -ms-border-radius: 10px;
      -o-border-radius: 10px;
      border-radius: 10px;
    }
    
    
## Nested Rules

Rather than constructing long selector names to specify inheritance, in Less you can simply nest selectors inside other selectors. This makes inheritance clear and style sheets shorter.


    // LESS
    
    #header {
      h1 {
        font-size: 26px;
        font-weight: bold;
      }
      p { font-size: 12px;
        a { text-decoration: none;
          &:hover { border-width: 1px }
        }
      }
    }
    
    /* Compiled CSS */
    
    #header h1 {
      font-size: 26px;
      font-weight: bold;
    }
    #header p {
      font-size: 12px;
    }
    #header p a {
      text-decoration: none;
    }
    #header p a:hover {
      border-width: 1px;
    }

## Functions & Operations

Are some elements in your style sheet proportional to other elements? Operations let you add, subtract, divide and multiply property values and colors, giving you the power to create complex relationships between properties. Operations should only be performed within parentheses in order to ensure compatibility with CSS. Functions map one-to-one with JavaScript code, allowing you to manipulate values however you want.

    // LESS
    
    @the-border: 1px;
    @base-color: #111;
    @red:        #842210;
    
    #header {
      color: (@base-color * 3);
      border-left: @the-border;
      border-right: (@the-border * 2);
    }
    #footer {
      color: (@base-color + #003300);
      border-color: desaturate(@red, 10%);
    }
    
    /* Compiled CSS */
    
    #header {
      color: #333;
      border-left: 1px;
      border-right: 2px;
    }
    #footer {
      color: #114411;
      border-color: #7d2717;
    }

##Client-side usage

Client-side is the easiest way to get started and good for developing your LESS. For production and especially if performance is important, we recommend pre-compiling using node or one of the many third party tools.

Link your .less stylesheets with the rel set to “stylesheet/less”:

    <link rel="stylesheet/less" type="text/css" href="styles.less" />

Then download less.js from the top of the page, and include it in the <head> element of your page, like so:

    <script src="less.js" type="text/javascript"></script>

Make sure you include your stylesheets before the script.

You can set options by setting things on a global LESS object before the script. E.g.

    <script type="text/javascript">
        less = {
            env: "development", // or "production"
            async: false,       // load imports async
            fileAsync: false,   // load imports async when in a page under
                                // a file protocol
            poll: 1000,         // when in watch mode, time in ms between polls
            functions: {},      // user functions, keyed by name
            dumpLineNumbers: "comments", // or "mediaQuery" or "all"
            relativeUrls: false,// whether to adjust url's to be relative
                                // if false, url's are already relative to the
                                // entry less file
            rootpath: ":/a.com/"// a path to add on to the start of every url
                                //resource
        };
    </script>
    <script src="less.js" type="text/javascript"></script>

## Watch mode

Watch mode is a client-side feature which enables your styles to refresh automatically as they are changed.

To enable it, append ‘#!watch’ to the browser URL, then refresh the page. Alternatively, you can run less.watch() from the console.

Modify variables

modifyVars enables modification of LESS variables in run-time. When called with new values, the LESS file is recompiled without reloading. Simple basic usage:

    less.modifyVars({
        '@buttonFace': '#5B83AD',
        '@buttonText': '#D9EEF2'
    });


## Debugging

It is possible to output rules in your CSS which allow tools to locate the source of the rule.

Either specify the option dumpLineNumbers as above or add !dumpLineNumbers:mediaQuery to the url.

You can use the “comments” option with FireLESS and the “mediaQuery” option with FireBug/Chrome dev tools (it is identical to the SCSS media query debugging format).

## Server-side usage

## Installation

The easiest way to install LESS on the server, is via npm, the node package manager, as so:


     $ npm install -g less

## Command-line usage

Once installed, you can invoke the compiler from the command-line, as such:

    $ lessc styles.less

This will output the compiled CSS to stdout, you may then redirect it to a file of your choice:

    $ lessc styles.less > styles.css


To output minified CSS, simply pass the -x option. If you would like more involved minification, the YUI CSS Compressor is also available with the --yui-compress option.

To see all the command line options run lessc without parameters.

## Usage in Code

You can invoke the compiler from node, as such:

    var less = require('less');
    
    less.render('.class { width: (1 + 1) }', function (e, css) {
        console.log(css);
    });
    which will output
    
    .class {
      width: 2;
    }

you may also manually invoke the parser and compiler:

    var parser = new(less.Parser);
    
    parser.parse('.class { width: (1 + 1) }', function (err, tree) {
        if (err) { return console.error(err) }
        console.log(tree.toCSS());
    });

## Configuration

You may pass some options to the compiler:


    var parser = new(less.Parser)({
        paths: ['.', './lib'], // Specify search paths for @import directives
        filename: 'style.less' // Specify a filename, for better error messages
    });

    parser.parse('.class { width: (1 + 1) }', function (e, tree) {
        tree.toCSS({ compress: true }); // Minify CSS output
    });
    
