import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import * as Print from 'expo-print';
import { Ionicons } from '@expo/vector-icons';

export default function RideReceiptScreen({ route, navigation }) {
  const { ride } = route.params || {};

  const formatCurrency = (value) => `R${Number(value || 0).toFixed(2)}`;

  const formatLocation = (value, fallbackAddress) => {
    if (fallbackAddress) return fallbackAddress;
    if (typeof value === 'string') return value;
    if (value?.latitude && value?.longitude) {
      return `${Number(value.latitude).toFixed(5)}, ${Number(value.longitude).toFixed(5)}`;
    }
    return '-';
  };

  const amount = useMemo(() => Number(ride?.price || 0).toFixed(2), [ride]);
  const vat = useMemo(() => (Number(ride?.price || 0) * 0.15).toFixed(2), [ride]);
  const fareBreakdown = ride?.fareBreakdown || null;
  const surgeLabel = ride?.surgeMultiplier
    ? `${Number(ride.surgeMultiplier).toFixed(2)}x`
    : fareBreakdown?.surgeMultiplier
      ? `${Number(fareBreakdown.surgeMultiplier).toFixed(2)}x`
      : '1.00x';

  const breakdownHtml = fareBreakdown
    ? `
          <hr />
          <h3 style="margin-bottom: 8px;">Fare breakdown</h3>
          <p><strong>Base fare:</strong> ${formatCurrency(fareBreakdown.baseFare)}</p>
          <p><strong>Distance charge:</strong> ${formatCurrency(fareBreakdown.distanceCharge)}</p>
          <p><strong>Time charge:</strong> ${formatCurrency(fareBreakdown.timeCharge)}</p>
          <p><strong>Booking fee:</strong> ${formatCurrency(fareBreakdown.bookingFee)}</p>
          <p><strong>Surge multiplier:</strong> ${surgeLabel}</p>
          <p><strong>Minimum fare:</strong> ${formatCurrency(fareBreakdown.minimumFare)}</p>
          <p><strong>Minimum applied:</strong> ${fareBreakdown.appliedMinimumFare ? 'Yes' : 'No'}</p>
        `
    : '';

  const receiptHtml = useMemo(
    () => `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 24px;">
          <h2 style="margin-bottom: 8px;">Vura Ride Receipt</h2>
          <p style="margin-top: 0; color: #666;">Ride ID: ${ride?.id || '-'} </p>
          <hr />
          <p><strong>Date:</strong> ${ride?.date || new Date(ride?.createdAt || Date.now()).toLocaleDateString()}</p>
          <p><strong>Pickup:</strong> ${formatLocation(ride?.pickup, ride?.pickupAddress)}</p>
          <p><strong>Destination:</strong> ${formatLocation(ride?.destination, ride?.destinationAddress)}</p>
          <p><strong>Driver:</strong> ${ride?.driver || ride?.driver?.name || '-'}</p>
          ${breakdownHtml}
          <hr />
          <p><strong>Fare:</strong> R${amount}</p>
          <p><strong>VAT (15%):</strong> R${vat}</p>
          <h3>Total: R${(Number(amount) + Number(vat)).toFixed(2)}</h3>
        </body>
      </html>
    `,
    [amount, breakdownHtml, ride, vat]
  );

  const handlePrint = async () => {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const receiptWindow = window.open('', '_blank');
        if (!receiptWindow) throw new Error('Unable to open print window');
        receiptWindow.document.write(receiptHtml);
        receiptWindow.document.close();
        receiptWindow.focus();
        receiptWindow.print();
        return;
      }

      await Print.printAsync({ html: receiptHtml });
    } catch (error) {
      Alert.alert('Print failed', error.message || 'Could not print receipt');
    }
  };

  if (!ride) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>No receipt data found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ride Receipt</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Vura Receipt</Text>
          <Text style={styles.item}>Ride ID: {ride.id}</Text>
          <Text style={styles.item}>Pickup: {formatLocation(ride.pickup, ride.pickupAddress)}</Text>
          <Text style={styles.item}>Destination: {formatLocation(ride.destination, ride.destinationAddress)}</Text>
          <Text style={styles.item}>Date: {ride.date || new Date(ride.createdAt || Date.now()).toLocaleDateString()}</Text>
          <Text style={styles.item}>Driver: {ride.driver || ride.driver?.name || 'Assigned Driver'}</Text>

          {fareBreakdown ? (
            <>
              <View style={styles.separator} />
              <Text style={styles.subTitle}>Fare breakdown</Text>
              <Text style={styles.item}>Base fare: {formatCurrency(fareBreakdown.baseFare)}</Text>
              <Text style={styles.item}>Distance charge: {formatCurrency(fareBreakdown.distanceCharge)}</Text>
              <Text style={styles.item}>Time charge: {formatCurrency(fareBreakdown.timeCharge)}</Text>
              <Text style={styles.item}>Booking fee: {formatCurrency(fareBreakdown.bookingFee)}</Text>
              <Text style={styles.item}>Surge multiplier: {surgeLabel}</Text>
              <Text style={styles.item}>Minimum fare: {formatCurrency(fareBreakdown.minimumFare)}</Text>
              <Text style={styles.item}>Minimum applied: {fareBreakdown.appliedMinimumFare ? 'Yes' : 'No'}</Text>
            </>
          ) : null}

          <View style={styles.separator} />

          <Text style={styles.item}>Fare: R{amount}</Text>
          <Text style={styles.item}>VAT (15%): R{vat}</Text>
          <Text style={styles.total}>Total: R{(Number(amount) + Number(vat)).toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.printBtn} onPress={handlePrint}>
          <Ionicons name="print-outline" size={18} color="#fff" />
          <Text style={styles.printBtnText}>Print Receipt</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  item: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 6,
  },
  printBtn: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 14,
    gap: 8,
  },
  printBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#666',
  },
});