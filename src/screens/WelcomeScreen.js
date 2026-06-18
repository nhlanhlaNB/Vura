import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows, typography } from '../theme/design';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  return (
    <LinearGradient
      colors={[colors.primary, '#C40000']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animatable.View animation="fadeInDown" duration={800} style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBg}>
              <Text style={styles.logoText}>Vura</Text>
            </View>
          </View>
          <Text style={styles.title}>Vura</Text>
          <Text style={styles.subtitle}>Your Happy Ride Awaits</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={400} duration={800} style={styles.features}>
          <View style={styles.featureCard}>
            <View style={styles.featureIconBg}>
              <Ionicons name="flash" size={28} color={colors.white} />
            </View>
            <Text style={styles.featureTitle}>Quick & Reliable</Text>
            <Text style={styles.featureDesc}>Get your ride in minutes</Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconBg}>
              <Ionicons name="shield-checkmark" size={28} color={colors.white} />
            </View>
            <Text style={styles.featureTitle}>Safe & Secure</Text>
            <Text style={styles.featureDesc}>Verified drivers & real-time tracking</Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconBg}>
              <Ionicons name="cash" size={28} color={colors.white} />
            </View>
            <Text style={styles.featureTitle}>Best Prices</Text>
            <Text style={styles.featureDesc}>Transparent pricing, no surprises</Text>
          </View>
        </Animatable.View>

        </ScrollView>

        <Animatable.View animation="fadeInUp" delay={600} duration={800} style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Login</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.primary} style={{ marginLeft: spacing[2] }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Signup')}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryButtonText}>Create Account</Text>
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
    justifyContent: 'space-between',
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing[4],
    justifyContent: 'flex-start',
  },
  header: {
    alignItems: 'center',
    marginTop: spacing[2],
    marginBottom: spacing[6],
  },
  logoContainer: {
    marginBottom: spacing[4],
  },
  logoBg: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.base,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.xl,
  },
  logoText: {
    fontSize: 40,
    fontWeight: typography.bold,
    color: colors.primary,
  },
  title: {
    fontSize: 42,
    fontWeight: typography.bold,
    color: colors.white,
    marginBottom: spacing[2],
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: typography.normal,
    letterSpacing: 0.3,
  },
  features: {
    gap: spacing[3],
    marginVertical: spacing[4],
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  featureIconBg: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: typography.semibold,
    color: colors.white,
    marginBottom: spacing[1],
    textAlign: 'center',
  },
  featureDesc: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: typography.normal,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
  primaryButton: {
    backgroundColor: colors.white,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...shadows.xl,
  },
  primaryButtonText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: typography.bold,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: colors.white,
  },
  secondaryButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: typography.bold,
    letterSpacing: 0.5,
  },
});
