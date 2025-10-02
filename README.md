# GTK Demo

A simple, heavily-commented GTK4 demo application written in JavaScript (GJS). This demo is designed to teach you the basics of building GUI applications with GTK.

## What This Is About

This is an educational GTK demo. The code is extensively commented to explain every concept, making it perfect for learning how GTK works.

**What it does:** Type text into an input field, click a button, and see the text displayed on screen.

**What you'll learn:**
- GTK widgets (buttons, input fields, labels)
- Event handling (signals and callbacks)
- Layout management (arranging widgets)
- The GObject type system
- Building complete GTK applications

## Publishing to AUR
See AUR_PUBLISH.md

## Requirements

- GJS (GNOME JavaScript)
- GTK 4
- Libadwaita

```bash
# Arch Linux
sudo pacman -S gjs gtk4 libadwaita
```

## Running

```bash
chmod +x main.js
./main.js
```

## Next Steps

The code is heavily commented with explanations. Read through `main.js` to understand how it works, then try modifying it:

- Add more buttons
- Change the styling with CSS
- Add keyboard shortcuts
- Make the input field multi-line
- Add images or icons

Happy hacking!

---

## GTK in Other Languages

While this demo uses JavaScript (GJS), GTK is available in many programming languages. Here are the official language bindings:

### Python (PyGObject)

**Resources:**
- [PyGObject Documentation](https://pygobject.readthedocs.io/)
- [Python GTK 4 Tutorial](https://python-gtk-3-tutorial.readthedocs.io/)

### Rust (gtk-rs)

**Resources:**
- [gtk-rs Book](https://gtk-rs.org/gtk4-rs/stable/latest/book/)
- [gtk-rs Documentation](https://gtk-rs.org/)

### C++ (gtkmm)

**Resources:**
- [gtkmm Documentation](https://www.gtkmm.org/)
- [gtkmm Tutorial](https://gnome.pages.gitlab.gnome.org/gtkmm-documentation/)

### C (Native)

GTK is written in C.

**Resources:**
- [GTK Documentation](https://docs.gtk.org/gtk4/)
- [GTK Tutorial](https://www.gtk.org/docs/getting-started/)


## Apps
- [Awesome GTK](https://github.com/valpackett/awesome-gtk)

### Other Languages

GTK has bindings for many more languages via GObject Introspection:

- **Vala** - C#-like language designed specifically for GNOME
- **C#** - Via GtkSharp
- **Go** - Via gotk3/gotk4
- **Haskell** - Via gi-gtk
- **Ruby** - Via ruby-gnome

Why GObject Introspection? Most GTK bindings (including JavaScript/GJS) use GObject Introspection, which automatically generates language bindings from GTK's API. This means all languages get the same features and stay in sync with GTK updates.

---

[x.com/iamdothash](https://x.com/iamdothash)
