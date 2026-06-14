import React, { useContext, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RideContext } from '../context/RideContext';
import { AuthContext } from '../context/AuthContext';

export default function RideChatScreen({ route, navigation }) {
  const { rideId: routeRideId } = route.params || {};
  const { activeRide, getRideMessages, sendRideMessage } = useContext(RideContext);
  const { user } = useContext(AuthContext);
  const [messageText, setMessageText] = useState('');

  const rideId = routeRideId || activeRide?.id;
  const messages = getRideMessages(rideId);

  const title = useMemo(() => {
    const peer = user?.userType === 'driver' ? 'Passenger' : 'Driver';
    return `${peer} Chat`;
  }, [user?.userType]);

  const handleSend = async () => {
    if (!rideId || !messageText.trim()) return;

    await sendRideMessage({
      rideId,
      senderType: user?.userType || 'user',
      senderName: user?.name || 'User',
      text: messageText,
    });

    setMessageText('');
  };

  const renderItem = ({ item }) => {
    const isMine = item.senderType === (user?.userType || 'user');

    return (
      <View style={[styles.messageRow, isMine && styles.messageRowMine]}>
        <View style={[styles.messageBubble, isMine ? styles.messageMine : styles.messageOther]}>
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.messageMeta}>{item.senderName}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.backBtn} />
        </View>

        {!rideId ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No active ride chat available.</Text>
          </View>
        ) : (
          <>
            <FlatList
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.messagesList}
              ListEmptyComponent={<Text style={styles.emptyText}>Start the conversation</Text>}
            />

            <View style={styles.inputBar}>
              <TextInput
                style={styles.input}
                placeholder="Type message"
                value={messageText}
                onChangeText={setMessageText}
              />
              <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                <Ionicons name="send" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    height: 56,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  backBtn: {
    width: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  messagesList: {
    padding: 12,
  },
  messageRow: {
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  messageRowMine: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 12,
    padding: 10,
  },
  messageMine: {
    backgroundColor: '#d9fdd3',
  },
  messageOther: {
    backgroundColor: '#fff',
  },
  messageText: {
    fontSize: 14,
    color: '#111',
  },
  messageMeta: {
    marginTop: 4,
    fontSize: 10,
    color: '#666',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
  },
});