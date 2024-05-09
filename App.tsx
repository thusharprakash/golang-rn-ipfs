import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  NativeEventEmitter,
  useColorScheme,
} from 'react-native';

import {Buffer} from 'buffer';
global.Buffer = Buffer; // Ensure Buffer is available globally

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {NativeModules} from 'react-native';
const {IPFSModule} = NativeModules;

import {generateOrder, updateOrder} from './utils';
import {computeOrderState} from '@oolio-group/order-helper';
import OrderCard from './orderCard';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [orders, setOrders] = useState({});
  const [lastProcessedEventIds, setLastProcessedEventIds] = useState(new Map());
  const [modalVisible, setModalVisible] = useState(false);
  const [peers, setPeers] = useState([]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#333' : '#FFF',
  };

  const textColor = {
    color: isDarkMode ? '#FFF' : '#333',
  };

  useEffect(() => {
    const emitter = new NativeEventEmitter(IPFSModule);
    const orderListener = emitter.addListener('ORBITDB', handleReceivedData);
    const peersListener = emitter.addListener('PEERS', data => {
      setPeers(
        JSON.parse(data.peers).map(peer => `${peer.Peer} ===> ${peer.Addr}`),
      );
    });

    IPFSModule.start(id => {
      console.log(`Started with PeerID: ${id}`);
      IPFSModule.startSubscription();
    });

    return () => {
      orderListener.remove();
      peersListener.remove();
    };
  }, []);

  const handleReceivedData = data => {
    const message = Buffer.from(data.message, 'hex').toString();
    const orderData = JSON.parse(message);
    console.log('Received order data:', orderData);

    setOrders(prevOrders => {
      const prevOrder = prevOrders[orderData.orderId];
      const newOrder = computeOrderState(
        orderData.events,
        prevOrder || undefined,
      );
      console.log('Previous order:', prevOrder);
      console.log('New order:', newOrder);

      return {...prevOrders, [orderData.orderId]: newOrder};
    });

    setLastProcessedEventIds(prevEventIds => {
      const lastEventId = orderData.events[orderData.events.length - 1].id;
      return new Map(prevEventIds).set(orderData.orderId, lastEventId);
    });
  };

  const createOrder = index => {
    const newOrderEvents = generateOrder(index);
    const message = Buffer.from(
      JSON.stringify({
        orderId: newOrderEvents[0].orderId,
        events: newOrderEvents,
      }),
    ).toString('hex');
    IPFSModule.sendMessage(message);
  };

  const updateOrderEvent = orderId => {
    const lastEventId = lastProcessedEventIds.get(orderId);
    const updatedEvents = updateOrder(orderId, lastEventId);
    const message = Buffer.from(
      JSON.stringify({
        orderId: orderId,
        events: updatedEvents,
      }),
    ).toString('hex');
    IPFSModule.sendMessage(message);
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        {Object.entries(orders).map(([id, order]) => (
          <OrderCard
            key={id}
            order={order}
            onUpdateOrder={() => updateOrderEvent(id)}
            lastProcessedEventIds={lastProcessedEventIds}
          />
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        {Array.from({length: 3}).map((_, index) => (
          <TouchableOpacity
            key={index}
            style={styles.iconButton}
            onPress={() => createOrder(index)}>
            <Icon name="plus-box" size={20} color="#fff" />
            <Text style={styles.iconText}>Create Order {index + 1}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setModalVisible(true)}>
          <Icon name="account-multiple" size={20} color="#fff" />
          <Text style={styles.iconText}>Show Peers</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={styles.centeredView}>
          <View
            style={[
              styles.modalView,
              {backgroundColor: isDarkMode ? '#555' : '#fff'},
            ]}>
            <Text style={[styles.modalText, textColor]}>Connected Peers:</Text>
            {peers.map((peer, index) => (
              <Text key={index} style={[styles.modalText, textColor]}>
                {peer}
              </Text>
            ))}
            <TouchableOpacity
              style={styles.buttonClose}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Hide Modal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  iconButton: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  iconText: {
    color: '#fff',
    marginLeft: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  peersContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
  },
  peerText: {
    fontSize: 16,
  },
});

export default App;
