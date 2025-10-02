#!/usr/bin/env gjs
/**
 * ↑ This is called a "shebang" (pronounced "shuh-bang")
 *
 * It tells your operating system how to run this file when you execute it.
 *
 * Breaking it down:
 *   #!          - The shebang marker (must be the very first two characters)
 *   /usr/bin/env - A program that finds other programs in your PATH
 *   gjs         - The interpreter we want to use (GNOME JavaScript)
 *
 * Why use "/usr/bin/env gjs" instead of just "/usr/bin/gjs"?
 *   - Different systems install gjs in different locations
 *   - "env" searches your PATH to find wherever gjs is installed
 *   - This makes the script more portable across different systems
 *
 * With this shebang, you can run the file directly:
 *   ./main.js
 *
 * Instead of having to type:
 *   gjs main.js
 *
 * (Just remember to make it executable first: chmod +x main.js)
 */

/**
 * ============================================================================
 *                            THE GTK DEMO
 * ============================================================================
 *
 * Welcome! This is a heavily commented demo of a GTK4 application written in
 * JavaScript (GJS). Think of it as a guided tour through building a GUI app.
 *
 * This demo app does ONE thing: it lets you type text into an input field,
 * click a button, and see that text displayed on screen. Simple, right?
 * But along the way, you'll learn about:
 *
 *   - GTK widgets (buttons, input fields, labels)
 *   - Event handling (what happens when you click that button?)
 *   - Layout management (how do we arrange things on screen?)
 *   - The GObject type system (how GTK organizes objects)
 *
 * Let's get started!
 */

/**
 * ============================================================================
 *                                 IMPORTS
 * ============================================================================
 *
 * Before we can use GTK, we need to import it. GJS (GNOME JavaScript) uses
 * a special imports system to load native libraries.
 *
 * Think of this like "import" in Node.js or Python, but for GNOME libraries.
 */

// First, we tell GJS which versions of these libraries we want.
// This prevents compatibility issues if multiple versions are installed.
imports.gi.versions.Gtk = '4.0';    // We want GTK version 4
imports.gi.versions.Adw = '1';      // We want libadwaita version 1

// Now we import the actual libraries and destructure the objects we need.
// "gi" stands for "GObject Introspection" - it's the magic that lets
// JavaScript talk to C libraries like GTK.
const { Gtk, Gio, Adw, GObject } = imports.gi;

// Let's break down what each import does:
//
//   Gtk     - The GTK toolkit. This gives us buttons, windows, labels, etc.
//   Gio     - GNOME Input/Output. Handles files, apps, and async operations.
//   Adw     - Libadwaita. Modern GNOME app patterns and widgets.
//   GObject - The object system that underlies all GNOME libraries.

/**
 * ============================================================================
 *                               CONSTANTS
 * ============================================================================
 *
 * Every GTK application needs a unique ID. This is used by the system to
 * identify your app, manage its windows, and handle settings.
 *
 * The format is reverse-domain notation, like Java packages.
 */
const APP_ID = 'com.example.gtk.demo';

/**
 * ============================================================================
 *                              THE APPLICATION
 * ============================================================================
 *
 * In GTK, everything starts with an Application object. This manages the
 * lifecycle of your app: starting up, creating windows, shutting down.
 *
 * We're going to use GObject.registerClass to create a custom Application
 * class. This is GTK's way of doing inheritance in JavaScript.
 */

const DemoApplication = GObject.registerClass(
  // This creates a new class that extends Adw.Application
  class DemoApplication extends Adw.Application {

    /**
     * _init() is the constructor in GTK's JavaScript bindings.
     * (In regular JS, this would be constructor().)
     */
    _init() {
      // Call the parent class constructor first
      super._init({
        application_id: APP_ID,  // Our unique app ID from above
      });
    }

    /**
     * vfunc_activate() is called when the application starts up.
     * ("vfunc" means "virtual function" - it's a method we're overriding)
     *
     * This is where we create our main window and show it to the user.
     */
    vfunc_activate() {
      // First, check if we already have a window open
      let window = this.active_window;

      // If not, create a new one
      if (!window) {
        window = new DemoWindow(this);
      }

      // Show the window to the user
      // (present() brings the window to the front if it's already open)
      window.present();
    }
  }
);

/**
 * ============================================================================
 *                              THE MAIN WINDOW
 * ============================================================================
 *
 * Now we create our actual window with the UI elements.
 *
 * We're going to have:
 *   1. An input field (Entry widget) to type text
 *   2. A button (Button widget) to click
 *   3. A label (Label widget) to display the text
 *
 * When you click the button, we'll take whatever is in the input field
 * and display it in the label. Simple!
 */

const DemoWindow = GObject.registerClass(
  class DemoWindow extends Adw.ApplicationWindow {

    _init(application) {
      // Set up the window with some basic properties
      super._init({
        application,                 // Link this window to our app
        title: 'GTK Demo',          // Window title (shows in title bar)
        default_width: 400,         // Window width in pixels
        default_height: 300,        // Window height in pixels
      });

      /**
       * Now we build the UI!
       *
       * We'll use a vertical Box to stack our widgets on top of each other:
       *   [Input Field]
       *   [Button]
       *   [Display Label]
       */
      this._buildUI();
    }

    /**
     * _buildUI() constructs all our widgets and arranges them on screen.
     *
     * Think of this like building with LEGO bricks. We create each piece,
     * then snap them together in a container.
     */
    _buildUI() {
      /**
       * STEP 1: Create a Box to hold everything
       *
       * A Box is a container that arranges widgets in a line (either
       * horizontal or vertical). We want vertical, so things stack up.
       */
      const mainBox = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,  // Stack widgets vertically
        spacing: 12,                             // 12 pixels between each widget
        margin_start: 24,                        // Margins on all sides (padding)
        margin_end: 24,
        margin_top: 24,
        margin_bottom: 24,
      });

      /**
       * STEP 2: Create the input field
       *
       * An Entry is a single-line text input field. This is where users
       * will type their text.
       *
       * We store a reference to it (this._inputField) so we can read
       * its value later when the button is clicked.
       */
      this._inputField = new Gtk.Entry({
        placeholder_text: 'Type something here...',  // Hint text
        hexpand: true,                                // Expand horizontally
      });

      /**
       * STEP 3: Create the button
       *
       * When this button is clicked, we want something to happen!
       * We'll connect a function to its 'clicked' signal.
       *
       * Signals are GTK's event system. Widgets emit signals when things
       * happen (a button is clicked, text changes, a window closes, etc.)
       * and we can connect functions to run when those signals fire.
       */
      const button = new Gtk.Button({
        label: 'Display Text',  // The text shown on the button
      });

      // This is the magic! We connect the 'clicked' signal to our handler.
      // When the button is clicked, _onButtonClicked() will run.
      button.connect('clicked', () => this._onButtonClicked());

      /**
       * STEP 4: Create the display label
       *
       * A Label widget displays text. Initially it's empty, but when the
       * button is clicked, we'll update it with whatever is in the input.
       *
       * We use markup to style it a bit - the <big> tag makes text larger,
       * and <b> makes it bold.
       */
      this._displayLabel = new Gtk.Label({
        label: '<big><b>Your text will appear here</b></big>',
        use_markup: true,   // Allow HTML-like markup in the label
        wrap: true,         // Wrap text if it's too long
      });

      /**
       * STEP 5: Put it all together!
       *
       * Now we add each widget to our Box, in the order we want them
       * to appear from top to bottom.
       */
      mainBox.append(this._inputField);   // Input field at the top
      mainBox.append(button);              // Button in the middle
      mainBox.append(this._displayLabel);  // Display label at the bottom

      /**
       * STEP 6: Set the Box as the window's content
       *
       * A window needs content to display. We set our Box (which contains
       * all our widgets) as the content of this window.
       */
      this.set_content(mainBox);
    }

    /**
     * _onButtonClicked() is called when the user clicks the button.
     *
     * Here's what we do:
     *   1. Get the text from the input field
     *   2. Update the label to display that text
     *
     * That's it! This is the core functionality of our demo app.
     */
    _onButtonClicked() {
      // Get the current text from the input field
      // .get_text() is a method on Entry widgets that returns the text
      const inputText = this._inputField.get_text();

      // Check if the user actually typed something
      if (inputText.trim()) {
        // If yes, update the label to show the text in big, bold letters
        this._displayLabel.set_markup(
          `<big><b>${inputText}</b></big>`
        );
      } else {
        // If the input is empty, show a helpful message instead
        this._displayLabel.set_markup(
          '<big><i>Please type something first!</i></big>'
        );
      }

      /**
       * And that's it! We've successfully taken text from the input,
       * and displayed it in the label. Mission accomplished!
       */
    }
  }
);

/**
 * ============================================================================
 *                              START THE APP!
 * ============================================================================
 *
 * Finally, we create an instance of our Application and run it.
 *
 * This hands control over to GTK, which manages the event loop (listening
 * for clicks, key presses, etc.) and keeps the app running until the user
 * closes it.
 */

const app = new DemoApplication();

// Run the application!
// ARGV contains command-line arguments (if any were passed)
app.run([imports.system.programInvocationName].concat(ARGV));

/**
 * ============================================================================
 *                              YOU'RE DONE!
 * ============================================================================
 *
 * Congratulations! You've just built a complete GTK application.
 *
 * To run this demo:
 *   chmod +x main.js
 *   ./main.js
 *
 * Try modifying it! Some ideas:
 *   - Add more buttons that do different things
 *   - Change the styling with CSS
 *   - Add keyboard shortcuts
 *   - Make the input field multi-line (use Gtk.TextView instead)
 *   - Add an icon or image
 *
 * The GTK documentation is your friend: https://docs.gtk.org/gtk4/
 *
 * Happy hacking! ٩(◕‿◕)۶
 */
