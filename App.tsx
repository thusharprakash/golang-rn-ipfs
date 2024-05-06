/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  TextInput,
  NativeEventEmitter,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {NativeModules} from 'react-native';
const {IPFSModule} = NativeModules;

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [peerid, setPeerid] = React.useState<string | null>(null);

  const sendMessage = () => {
    IPFSModule.sendMessage(message);
    setMessage('');
  };

  useEffect(() => {
    const emitter = new NativeEventEmitter(IPFSModule);
    let listener = emitter.addListener('ORBITDB', handleEvent);

    return () => {
      listener.remove();
    };
  }, []);

  const handleEvent = data => {
    console.log('Got message', data.message);
    setMessages(prevMessages => [...prevMessages, data.message]);
  };
  useEffect(() => {
    IPFSModule.start(id => {
      setPeerid(id);
      IPFSModule.startSubscription();
    });
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="GoMobile IPFS">
            {peerid === null
              ? 'Generating peerID. Please allow permissions'
              : `PeerID: ${peerid}`}
          </Section>
          <View>
            {messages.map((msg, index) => (
              <Text key={index}>{msg}</Text>
            ))}
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Type your message here..."
              style={styles.textInput}
            />
            <Button title="Send" onPress={sendMessage} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    maxWidth: 400,
    marginTop: 40,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
