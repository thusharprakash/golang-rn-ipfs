import {View, Text, Button, StyleSheet} from 'react-native';

import React from 'react';

const OrderCard = ({
  order,
  onUpdateOrder,
  lastProcessedEventIds,
}: {
  order: any;
  onUpdateOrder: any;
  lastProcessedEventIds: any;
}) => {
  // console.log('Previous ', prevEvents);
  const lastEventId = lastProcessedEventIds.get(order.id);

  // get the last event for the order
  const orderId = order.id;
  console.log('Order : ', order.id, ' Last processed : ', lastEventId);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Order ID: {orderId}</Text>
      <Text style={styles.text}>Order Total: {order.totalPrice}</Text>
      <Text style={styles.text}>Items:</Text>
      {order.items?.map((item: any, index: any) => (
        <Text key={index} style={styles.text}>
          {item}
        </Text>
      ))}
      <Button
        title="Update Order"
        onPress={() => onUpdateOrder(orderId, lastEventId)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
});

export default OrderCard;
