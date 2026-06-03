#!/bin/bash
# Run the Reps Android dev build. Wires up the JDK (from Android Studio) and
# Android SDK env that aren't on the default PATH, boots the Pixel_7 emulator
# if nothing is connected, then builds + installs the dev client.
set -e

export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"

# Boot an emulator if no device/emulator is attached.
if ! adb devices | grep -qw device; then
  echo "No device attached — booting Pixel_7..."
  nohup emulator -avd Pixel_7 -no-snapshot-save >/tmp/emulator.log 2>&1 &
  adb wait-for-device
  until [ "$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" = "1" ]; do sleep 2; done
fi

cd "$(dirname "$0")/.."
npx expo run:android "$@"
