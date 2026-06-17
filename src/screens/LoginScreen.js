import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { AuthContext } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows, typography } from '../theme/design';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginWithGoogle } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Oops!', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      if (error.code !== 'SIGN_IN_CANCELLED') {
        Alert.alert('Google Sign-In Failed', error.message);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.lightGray]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Animatable.View animation="slideInLeft" duration={600} style={styles.backButtonContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View animation="fadeInDown" duration={700} style={styles.header}>
            <Text style={styles.title}>Welcome Back! 👋</Text>
            <Text style={styles.subtitle}>Get back on the road</Text>
          </Animatable.View>

          <Animatable.View animation="fadeIn" delay={200} duration={700} style={styles.content}>
            <View style={styles.inputsContainer}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={colors.textGray}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor={colors.darkGray}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={colors.textGray}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={colors.darkGray}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={colors.textGray}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => Alert.alert('Info', 'Password reset coming soon!')}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <LinearGradient
              colors={colors.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loginButtonGradient}
            >
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} size="large" />
                ) : (
                  <>
                    <Text style={styles.loginButtonText}>Login</Text>
                    <Ionicons
                      name="arrow-forward"
                      size={20}
                      color={colors.white}
                      style={{ marginLeft: spacing[2] }}
                    />
                  </>
                )}
              </TouchableOpacity>
            </LinearGradient>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleGoogleLogin}
              disabled={googleLoading}
              activeOpacity={0.8}
            >
              {googleLoading ? (
                <ActivityIndicator color={colors.primary} size="small" />
              ) : (
                <>
                  <Ionicons name="logo-google" size={20} color={colors.primary} />
                  <Text style={styles.socialButtonText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={400} duration={700} style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')} activeOpacity={0.7}>
              <Text style={styles.signupLink}>Sign Up Now</Text>
            </TouchableOpacity>
          </Animatable.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  backButtonContainer: {
    padding: spacing[2],
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.base,
  },
  header: {
    paddingHorizontal: spacing[4],
    marginTop: spacing[2],
    marginBottom: spacing[6],
  },
  title: {
    fontSize: 28,
    fontWeight: typography.bold,
    color: colors.black,
    marginBottom: spacing[1],
  },
  subtitle: {
    fontSize: 16,
    color: colors.textGray,
    fontWeight: typography.normal,
  },
  content: {
    paddingHorizontal: spacing[4],
    flex: 1,
  },
  inputsContainer: {
    marginBottom: spacing[4],
    gap: spacing[3],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.mediumGray,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing[3],
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  inputIcon: {
    marginRight: spacing[2],
  },
  input: {
    flex: 1,
    padding: spacing[4],
    fontSize: 16,
    fontWeight: typography.normal,
    color: colors.black,
  },
  eyeIcon: {
    padding: spacing[2],
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing[4],
  },
  forgotPasswordText: {
    color: colors.primary,
    fontWeight: typography.semibold,
    fontSize: 14,
  },
  loginButtonGradient: {
    borderRadius: borderRadius.lg,
    marginBottom: spacing[4],
    ...shadows.lg,
  },
  loginButton: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: typography.bold,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.mediumGray,
  },
  dividerText: {
    marginHorizontal: spacing[3],
    color: colors.textGray,
    fontWeight: typography.normal,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderWidth: 1.5,
    borderColor: colors.mediumGray,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    gap: spacing[2],
    ...shadows.sm,
  },
  socialButtonText: {
    color: colors.black,
    fontWeight: typography.semibold,
    fontSize: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
  },
  signupText: {
    color: colors.textGray,
    fontWeight: typography.normal,
    marginRight: spacing[1],
  },
  signupLink: {
    color: colors.primary,
    fontWeight: typography.bold,
    fontSize: 16,
  },
});
