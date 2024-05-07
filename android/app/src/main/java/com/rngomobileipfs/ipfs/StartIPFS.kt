package com.rngomobileipfs.ipfs

import android.content.Context
import com.rngomobileipfs.bridge.IPFS


object IPFSManager {
    private lateinit var ipfs: IPFS

    fun startIpfs(activity: Context) {
        ipfs = IPFS(activity.applicationContext)
    }
    fun getPeerAddress():String{
        ipfs.start()
        val jsonList = ipfs.newRequest("id").sendToJSONList()
        return jsonList[0].getString("ID")
    }

    fun getIPFS():IPFS?{
        if(this::ipfs.isInitialized && ipfs!=null){
            return ipfs
        }else{
            return null
        }
    }
}