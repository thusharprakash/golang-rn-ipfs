package com.rngomobileipfs.module

import android.Manifest
import android.app.Activity
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

object PermissionChecker {

    private val permissions = arrayOf(
        Manifest.permission.BLUETOOTH_ADVERTISE,
        Manifest.permission.BLUETOOTH_CONNECT,
        Manifest.permission.BLUETOOTH_SCAN,
        Manifest.permission.INTERNET,
        Manifest.permission.ACCESS_FINE_LOCATION,
        Manifest.permission.ACCESS_COARSE_LOCATION,
        Manifest.permission.CHANGE_WIFI_MULTICAST_STATE
    )

    private val REQUEST_PERMISSION_CODE = 1001

     fun checkPermissions(context: Activity) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val neededPermissions = ArrayList<String>()

            for (permission in permissions) {
                if (ContextCompat.checkSelfPermission(context, permission) != PackageManager.PERMISSION_GRANTED) {
                    neededPermissions.add(permission)
                }
            }

            if (neededPermissions.isNotEmpty()) {
                ActivityCompat.requestPermissions(context, neededPermissions.toTypedArray(), REQUEST_PERMISSION_CODE)
            }
        }
    }

}