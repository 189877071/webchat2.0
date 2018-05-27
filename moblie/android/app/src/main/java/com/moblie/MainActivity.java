package com.moblie;

import android.os.Bundle;

import com.mehcode.reactnative.splashscreen.SplashScreen;

import com.facebook.react.ReactActivity;
import com.horcrux.svg.SvgPackage;
import com.oblador.vectoricons.VectorIconsPackage;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "moblie";
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this, getReactInstanceManager());
        super.onCreate(savedInstanceState);
    }
}
