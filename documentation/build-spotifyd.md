Original on: https://github.com/Spotifyd/spotifyd/blob/612553aaafbcc13a0234b4369da7c0bd3e18e551/docs/src/installation/Build-on-Linux.md

# Linux build guide

This guide covers Debian based systems with APT packet manager.

## Install required packages

Raspberry Pi OS (Bookworm):

```bash
sudo apt install libasound2-dev portaudio19-dev libdbus-1-dev pkg-config
```

> **Note:** Depending on your feature flags, you can also leave packages out, e.g.  
> libasound2-dev: no ALSA backend (--no-default-features)  
> portaudio19-dev:  No PortAudio backend

## Uninstall the preinstalled rust compiler

> **Note:** spotifyd may require a newer rust toolchain than the one which is delivered with your Linux system,  
> we recommend to uninstall the current version if you are not sure which version you have and if it is sufficient.  
> We recommend to always use the latest version and don't guarantee compatibility with older ones.

If it was installed from apt packet manager:

```bash
sudo apt remove rustc
```

If it was installed from rustup:

```bash
rustup self uninstall
```

## Install the rust toolchain

To install the latest rust toolchain, follow the installation instructions on [rustup.rs][rustup].

Currently it is (chose option 1):

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Set up evnironment variables:

```bash
source "$HOME/.cargo/env"
```

## Clone the repository

Switch to a folder where you want the sources to be downloaded, then:

```bash
git clone https://github.com/Spotifyd/spotifyd.git
```

Swtich to the repository folder:

```bash
cd spotifyd
```

## Building spotifyd

If you want to build the latest release and not the latest commit, look up the (heading) of the latest release  
on https://github.com/Spotifyd/spotifyd/releases or https://github.com/Spotifyd/spotifyd/tags. Then:

```bash
git checkout tags/v0.3.5
```

Replace v0.3.5 with the desired tag.

This takes a while...

```bash
cargo build --release
```

If you want it to be build with additional features like DBus and PulseAudio backend:

```bash
cargo build --release --features dbus_mpris,pulseaudio_backend
```

For MuPiBox:
```bash
cargo build --release --features pulseaudio_backend
```


The resulting binary will be placed in `target/release/spotifyd`

## Running spotifyd

You can run it using `./target/release/spotifyd`

[rustup]: https://rustup.rs/