package com.rngomobileipfs.ipfs

import org.json.JSONArray

interface PeerCallback{
    abstract fun onData(array:JSONArray)
}
object PeerCounter {

    private const val TAG = "PeerCounter"
    private const val interval = 1000
    private var runner: Thread? = null

    fun start(callback: PeerCallback) {
        runner = Thread(Runnable {
            while (!Thread.currentThread().isInterrupted) {
                try {
                    val peers = getPeersData()
                    callback.onData(peers)
                    Thread.sleep(interval.toLong())
                } catch (e: InterruptedException) {
                    return@Runnable
                }
            }
        })
        runner!!.start()
    }

    fun getPeersData():JSONArray{
        try {
            val ipfs = IPFSManager.getIPFS()
            ipfs?.let {
                val jsonList = it.newRequest("swarm/peers")
                    .withOption("verbose", false)
                    .withOption("streams", false)
                    .withOption("latency", false)
                    .withOption("direction", false)
                    .sendToJSONList()
                val peerList = jsonList[0].getJSONArray("Peers")
                return peerList
            }

        }catch (e:Exception){
            e.printStackTrace()
        }
        return JSONArray()
    }

    fun stop() {
        if (runner != null) {
            if (!runner!!.isInterrupted) runner!!.interrupt()
            runner = null
        }
    }
}