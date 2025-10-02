## Publishing to AUR (Arch User Repository)

If you want to publish your GTK application to the AUR, here's how:

### Prerequisites

1. Create an AUR account at https://aur.archlinux.org/register
2. Add your SSH public key to your AUR account settings
3. Install required tools:
   ```bash
   sudo pacman -S base-devel git
   ```

### Step 1: Create a PKGBUILD

Create a `PKGBUILD` file in your project:

```bash
# Maintainer: Your Name <your.email@example.com>
pkgname=your-app
pkgver=1.0.0
pkgrel=1
pkgdesc="Your GTK app description"
arch=('any')
url="https://github.com/yourusername/your-app"
license=('MIT')
depends=('gjs' 'gtk4' 'libadwaita')
source=("$pkgname-$pkgver.tar.gz::$url/archive/v$pkgver.tar.gz")
sha256sums=('SKIP')  # Update with actual checksum after release

package() {
    cd "$srcdir/your-app-$pkgver"

    # Install the main script
    install -Dm755 main.js "$pkgdir/usr/bin/your-app"

    # Install desktop file (if you have one)
    # install -Dm644 your-app.desktop "$pkgdir/usr/share/applications/your-app.desktop"

    # Install icon (if you have one)
    # install -Dm644 icon.png "$pkgdir/usr/share/pixmaps/your-app.png"
}
```

### Step 2: Create a GitHub Release

1. Tag your release:
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin v1.0.0
   ```

2. Create a release on GitHub

3. Generate checksum for the release tarball:
   ```bash
   wget https://github.com/yourusername/your-app/archive/v1.0.0.tar.gz
   sha256sum v1.0.0.tar.gz
   ```

4. Update `sha256sums` in PKGBUILD with the actual hash

### Step 3: Test Locally

```bash
makepkg -si
```

This builds and installs the package locally. Test that it works!

### Step 4: Generate .SRCINFO

```bash
makepkg --printsrcinfo > .SRCINFO
```

### Step 5: Publish to AUR

1. Clone the AUR repository:
   ```bash
   git clone ssh://aur@aur.archlinux.org/your-app.git
   cd your-app
   ```

2. Copy your build files:
   ```bash
   cp /path/to/PKGBUILD .
   cp /path/to/.SRCINFO .
   ```

3. Commit and push:
   ```bash
   git add PKGBUILD .SRCINFO
   git commit -m "Initial commit: your-app 1.0.0"
   git push
   ```

Your package will be available at `https://aur.archlinux.org/packages/your-app`

Users can install it with:
```bash
yay -S your-app
# or
paru -S your-app
```

### Updating Your Package

When releasing a new version:

1. Update `pkgver` in PKGBUILD
2. Reset `pkgrel` to 1
3. Update `sha256sums` with the new release checksum
4. Regenerate .SRCINFO: `makepkg --printsrcinfo > .SRCINFO`
5. Commit and push changes

### Important Notes

- Only PKGBUILD and .SRCINFO go in the AUR repository
- Your source code stays on GitHub
- AUR pulls source from your GitHub releases

### Package Naming: Stable vs -git

When publishing to AUR, choose your package name based on the source:

**Stable Package** (`your-app`)
- Builds from **tagged releases** (v1.0.0, v1.0.1, etc.)
- Use when: You want users to install tested, stable versions
- Best for: Production use, most end users

**Git Package** (`your-app-git`)
- Builds from **latest git commits** (main/master branch)
- Use when: You want users to get bleeding-edge features immediately
- Best for: Developers, testers, users who want the latest changes

**Which should you use?**
- Creating releases with git tags? → Use `your-app` (no -git suffix)
- Building directly from git HEAD? → Use `your-app-git` (with -git suffix)

This guide uses tagged releases, so we use `your-app` without the `-git` suffix.
