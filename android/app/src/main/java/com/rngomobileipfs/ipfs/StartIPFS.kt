package com.rngomobileipfs.ipfs

import android.app.Activity
import android.content.Context
import android.util.Log
import com.rngomobileipfs.bridge.IPFS


object IPFSManager {
    lateinit var ipfs: IPFS

    fun startIpfs(activity: Context) {
        ipfs = IPFS(activity.applicationContext)
    }
    fun getPeerAddress():String{
        ipfs.start()
        val jsonList = ipfs.newRequest("id").sendToJSONList()
        return jsonList[0].getString("ID")
    }
}