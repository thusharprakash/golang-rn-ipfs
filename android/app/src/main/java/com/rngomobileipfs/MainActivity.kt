package com.rngomobileipfs

import android.content.pm.PackageManager
import android.widget.Toast
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.rngomobileipfs.ipfs.PeerCounter
import com.rngomobileipfs.module.PermissionChecker
import com.facebook.react.bridge.Callback
import com.rngomobileipfs.module.PermissionCallback


class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "RNGoMobileIPFS"

    var permissionCallback: PermissionCallback? =null

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)


    override fun onDestroy() {
        super.onDestroy()
        PeerCounter.stop()
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        when (requestCode) {
            PermissionChecker.REQUEST_PERMISSION_CODE -> {
                if ((grantResults.isNotEmpty() && grantResults.all { it == PackageManager.PERMISSION_GRANTED })) {
                    permissionCallback?.onPermitted()
                } else {
                    Toast.makeText(this,"Not all permissions are granted. Cannot start IPFS",Toast.LENGTH_SHORT).show()
                }
                return
            }
        }
    }
}
