package com.rngomobileipfs.module;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.rngomobileipfs.ipfs.IPFSManager;

public class IPFSModule extends ReactContextBaseJavaModule {

    ReactApplicationContext context;
    IPFSModule(ReactApplicationContext context){
        super(context);
        this.context = context;
    }
    @NonNull
    @Override
    public String getName() {
        return "IPFSModule";
    }

    @ReactMethod
    public void start(Callback callBack){
        PermissionChecker.INSTANCE.checkPermissions(getCurrentActivity());
        Log.e("ATHUL","Permission checked");

        IPFSManager.INSTANCE.startIpfs(context);
        new Thread(()->{
            String address = IPFSManager.INSTANCE.getPeerAddress();
            callBack.invoke(address);
        }).start();
    }

}
