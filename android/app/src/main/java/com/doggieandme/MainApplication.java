package com.yanamal.doggieandme;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.rnimmersive.RNImmersivePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import it.innove.BleManagerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RCTCameraPackage(),
            new OrientationPackage(),
            new RNImmersivePackage(),
            new VectorIconsPackage(),
            new BleManagerPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
