package com.rngomobileipfs.module;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.rngomobileipfs.MainActivity;
import com.rngomobileipfs.ipfs.IPFSManager;
import com.rngomobileipfs.ipfs.PeerCallback;
import com.rngomobileipfs.ipfs.PeerCounter;

import org.json.JSONArray;

import core.Core;
import core.OrbitDb;
import core.MessageCallback;

public class IPFSModule extends ReactContextBaseJavaModule implements PermissionCallback {

    OrbitDb db;
    ReactApplicationContext context;

    private Callback reactCallback = null;
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
        this.reactCallback = callBack;
        if(getCurrentActivity() instanceof MainActivity){
            ((MainActivity)getCurrentActivity()).setPermissionCallback(this);
        }
        if(PermissionChecker.INSTANCE.arePermissionsGranted(getCurrentActivity())){
            startIPFS(callBack);
        }else {
            PermissionChecker.INSTANCE.checkPermissions(getCurrentActivity());
        }
    }

    private void startIPFS(Callback callBack){
        IPFSManager.INSTANCE.startIpfs(context);
        new Thread(()->{
            String address = IPFSManager.INSTANCE.getPeerAddress();
            this.db = Core.newOrbitDB();
            callBack.invoke(address);
        }).start();
    }

    @ReactMethod
    public void startSubscription(){
        if(this.db!=null){
            this.db.startSubscription(s -> {
                WritableMap map = Arguments.createMap();
                map.putString("message",s);
                context
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("ORBITDB", map);
            });
            PeerCounter.INSTANCE.start(array -> {
                WritableMap map = Arguments.createMap();
                map.putString("peers",array.toString());
                context
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("PEERS", map);
            });
        }
    }

    @ReactMethod
    public void sendMessage(String message){
        if(this.db!=null){
           new Thread(()->{
               db.sendEvents(message.getBytes());
           }).start();
        }
    }

    @Override
    public void onPermitted() {
        startIPFS(this.reactCallback);
    }
}
