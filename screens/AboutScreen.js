import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>About This App</Text>

      <Text style={styles.label}>Name:</Text>
      <Text style={styles.value}>Areeb Shoukat</Text>

      <Text style={styles.label}>Student ID:</Text>
      <Text style={styles.value}>101513564</Text>

      <Text style={styles.descriptionTitle}>Description</Text>
      <Text style={styles.description}>
        This application converts an amount of money from one currency to
        another using a live exchange rate API. The user enters the base
        currency, destination currency, and amount, and the app shows the
        exchange rate and the converted amount.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginTop: 8,
  },
  value: {
    marginBottom: 4,
  },
  descriptionTitle: {
    marginTop: 16,
    fontWeight: '700',
    fontSize: 16,
  },
  description: {
    marginTop: 8,
    lineHeight: 20,
  },
});
