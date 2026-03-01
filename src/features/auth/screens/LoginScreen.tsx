/**
 * 登录页面
 * 
 * 作用：
 * 1. 提供邮箱密码登录表单
 * 2. 表单验证（邮箱格式、密码长度）
 * 3. 调用 authStore.login() 进行登录
 * 4. 显示错误提示
 * 5. 跳转到注册页面
 * 
 * 使用场景：
 * - 用户未登录时显示此页面
 * - 用户点击"登录"按钮进入
 * 
 * 导航：
 * - 登录成功 → 自动跳转到地图页面（由 RootNavigator 控制）
 * - 点击"注册" → 跳转到 RegisterScreen
 */

import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';
import { colors, spacing, typography } from '@shared/constants/theme';
import { validateEmail, getEmailError, getPasswordError } from '@shared/utils/validation';

interface LoginScreenProps {
  navigation: any;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  const { login, isLoading } = useAuthStore();

  // 验证邮箱
  const handleEmailBlur = () => {
    const error = getEmailError(email);
    setEmailError(error);
  };

  // 验证密码
  const handlePasswordBlur = () => {
    const error = getPasswordError(password);
    setPasswordError(error);
  };

  // 登录
  const handleLogin = async () => {
    // 验证表单
    const emailErr = getEmailError(email);
    const passwordErr = getPasswordError(password);

    if (emailErr || passwordErr) {
      setEmailError(emailErr);
      setPasswordError(passwordErr);
      return;
    }

    try {
      await login(email, password);
      // 登录成功后，RootNavigator 会自动跳转到 MainNavigator
    } catch (error: any) {
      setErrorMessage(error.message || '登录失败，请检查邮箱和密码');
      setShowError(true);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* 标题 */}
          <Text style={styles.title}>欢迎回来</Text>
          <Text style={styles.subtitle}>登录您的账号</Text>

          {/* 邮箱输入 */}
          <TextInput
            label="邮箱"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError(null);
            }}
            onBlur={handleEmailBlur}
            autoCapitalize="none"
            keyboardType="email-address"
            error={!!emailError}
            style={styles.input}
            mode="outlined"
          />
          {emailError && <Text style={styles.errorText}>{emailError}</Text>}

          {/* 密码输入 */}
          <TextInput
            label="密码"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError(null);
            }}
            onBlur={handlePasswordBlur}
            secureTextEntry={!showPassword}
            error={!!passwordError}
            style={styles.input}
            mode="outlined"
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
          {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

          {/* 登录按钮 */}
          <Button
            mode="contained"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            style={styles.loginButton}
          >
            登录
          </Button>

          {/* 注册链接 */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>还没有账号？</Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Register')}
              disabled={isLoading}
            >
              立即注册
            </Button>
          </View>
        </View>
      </ScrollView>

      {/* 错误提示 */}
      <Snackbar
        visible={showError}
        onDismiss={() => setShowError(false)}
        duration={3000}
        action={{
          label: '关闭',
          onPress: () => setShowError(false),
        }}
      >
        {errorMessage}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  input: {
    marginBottom: spacing.sm,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginBottom: spacing.md,
    marginLeft: spacing.sm,
  },
  loginButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  registerText: {
    color: colors.textSecondary,
  },
});

