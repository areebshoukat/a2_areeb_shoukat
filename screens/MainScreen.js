import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import LabeledInput from '../components/LabeledInput';

// Your API key inserted here:
const API_KEY = 'fca_live_TMzNq5g3EQuu7vc5fHHB4xuqPjR6p4ZgEvP9FVUH';

export default function MainScreen({ navigation }) {
  const [baseCurrency, setBaseCurrency] = useState('CAD');
  const [destCurrency, setDestCurrency] = useState('');
  const [amount, setAmount] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);

  const validateInput = () => {
    const base = baseCurrency.trim().toUpperCase();
    const dest = destCurrency.trim().toUpperCase();
    const amountNumber = parseFloat(amount);

    if (!/^[A-Z]{3}$/.test(base)) {
      setError('Base currency must be 3 uppercase letters (e.g. CAD).');
      return null;
    }

    if (!/^[A-Z]{3}$/.test(dest)) {
      setError('Destination currency must be 3 uppercase letters (e.g. USD).');
      return null;
    }

    if (isNaN(amountNumber) || amountNumber <= 0) {
      setError('Amount must be a positive number.');
      return null;
    }

    setError('');
    return { base, dest, amountNumber };
  };

  const handleConvert = async () => {
    const validated = validateInput();
    if (!validated) {
      return;
    }

    const { base, dest, amountNumber } = validated;

    if (!API_KEY) {
      setError('Missing API key.');
      return;
    }

    setLoading(true);
    setError('');
    setConvertedAmount(null);
    setExchangeRate(null);

    try {
      const url = `https://api.freecurrencyapi.com/v1/latest?apikey=${API_KEY}&base_currency=${base}&currencies=${dest}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Network error. Please try again.');
      }

      const data = await response.json();

      if (!data || !data.data) {
        throw new Error('Unexpected response from API.');
      }

      const rate = data.data[dest];

      if (rate === undefined) {
        throw new Error('Destination currency not found in API response.');
      }

      const converted = amountNumber * rate;

      setExchangeRate(rate);
      setConvertedAmount(converted.toFixed(2));
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Button to go to About screen */}
      <View style={styles.aboutButton}>
        <Button title="About" onPress={() => navigation.navigate('About')} />
      </View>

      <Text style={styles.title}>Simple Currency Converter</Text>

      <LabeledInput
        label="Base Currency (3 letters, e.g. CAD)"
        value={baseCurrency}
        onChangeText={(text) => setBaseCurrency(text.toUpperCase())}
        placeholder="CAD"
      />

      <LabeledInput
        label="Destination Currency (3 letters, e.g. USD)"
        value={destCurrency}
        onChangeText={(text) => setDestCurrency(text.toUpperCase())}
        placeholder="USD"
      />

      <LabeledInput
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        placeholder="1"
        keyboardType="numeric"
      />

      <View style={styles.buttonContainer}>
        <Button
          title={loading ? 'Converting...' : 'Convert'}
          onPress={handleConvert}
          disabled={loading}
        />
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" />
          <Text style={styles.loadingText}>Fetching exchange rate...</Text>
        </View>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {convertedAmount && exchangeRate && !error && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>
            Exchange rate: {exchangeRate}
          </Text>
          <Text style={styles.resultText}>
            Converted amount: {convertedAmount} {destCurrency}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  aboutButton: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 8,
  },
  loadingContainer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    marginLeft: 8,
  },
  error: {
    marginTop: 12,
    color: 'red',
  },
  resultBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  resultText: {
    fontSize: 16,
    marginBottom: 4,
  },
});
