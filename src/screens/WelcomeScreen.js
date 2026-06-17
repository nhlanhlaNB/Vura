import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows, typography } from '../theme/design';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  return (
    <LinearGradient
      colors={[colors.primary, colors.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.content}>
        <Animatable.View animation="fadeInDown" duration={800} style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBg}>
              <Ionicons name="car-sport" size={50} color={colors.white} />
            </View>
          </View>
          <Text style={styles.title}>Vura</Text>
          <Text style={styles.subtitle}>Your Happy Ride Awaits</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={600} duration={800} style={styles.features}>
          <View style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Ionicons name="flash" size={24} color={colors.primary} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Quick & Reliable</Text>
              <Text style={styles.featureDesc}>Get your ride in minutes</Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Safe & Secure</Text>
              <Text style={styles.featureDesc}>Verified drivers & real-time tracking</Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Ionicons name="cash" size={24} color={colors.primary} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Best Prices</Text>
              <Text style={styles.featureDesc}>Transparent pricing, no surprises</Text>
            </View>
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={800} duration={800} style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Login</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.primary} style={{ marginLeft: spacing[2] }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.signupButton]}
            onPress={() => navigation.navigate('Signup')}
            activeOpacity={0.8}
          >
            <Text style={styles.signupButtonText}>Create Account</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.white} style={{ marginLeft: spacing[2] }} />
          </TouchableOpacity>
        </Animatable.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing[4],
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: spacing[4],
  },
  logoContainer: {
    marginBottom: spacing[5],
  },
  logoBg: {
    width: 100,
    height: 100,
    borderRadius: borderRadius['2xl'],
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },
  title: {
    fontSize: 48,
    fontWeight: typography.bold,
    color: colors.white,
    marginBottom: spacing[2],
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: typography.medium,
    letterSpacing: 0.5,
  },
  features: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: spacing[6],
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[5],
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing[3],
    borderRadius: borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.white,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: typography.semibold,
    color: colors.white,
    marginBottom: spacing[1],
  },
  featureDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: typography.normal,
  },
  buttonContainer: {
    marginBottom: spacing[4],
    gap: spacing[3],
  },
  button: {
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...shadows.lg,
  },
  loginButton: {
    backgroundColor: colors.white,
  },
  loginButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: typography.bold,
  },
  signupButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.white,
  },
  signupButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: typography.bold,
  },
});
