/**
 * 注册页面
 * 
 * 作用：
 * 1. 提供用户注册表单（邮箱、密码、确认密码）
 * 2. 表单验证（邮箱格式、密码强度、两次密码一致）
 * 3. 调用 authStore.register() 进行注册
 * 4. 显示错误提示
 * 5. 注册成功后自动登录
 * 
 * 使用场景：
 * - 新用户注册账号
 * - 从登录页面点击"注册"进入
 * 
 * 导航：
 * - 注册成功 → 自动登录 → 跳转到地图页面
 * - 点击"返回登录" → 返回 LoginScreen
 */

import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';
import { colors, spacing, typography } from '@shared/constants/theme';
import { getEmailError, getPasswordError } from '@shared/utils/validation';

interface RegisterScreenProps {
  navigation: any;
}

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const { register, isLoading } = useAuthStore();

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

  // 验证确认密码
  const handleConfirmPasswordBlur = () => {
    if (confirmPassword && confirmPassword !== password) {
      setConfirmPasswordError('两次密码不一致');
    } else {
      setConfirmPasswordError(null);
    }
  };

  // 注册
  const handleRegister = async () => {
    // 验证表单
    const emailErr = getEmailError(email);
    const passwordErr = getPasswordError(password);
    let confirmPasswordErr = null;

    if (confirmPassword !== password) {
      confirmPasswordErr = '两次密码不一致';
    }

    if (emailErr || passwordErr || confirmPasswordErr) {
      setEmailError(emailErr);
      setPasswordError(passwordErr);
      setConfirmPasswordError(confirmPasswordErr);
      return;
    }

    try {
      await register(email, password);
      setSuccessMessage('注册成功！正在跳转...');
      setShowSuccess(true);
      // 注册成功后，RootNavigator 会自动跳转到 MainNavigator
    } catch (error: any) {
      setErrorMessage(error.message || '注册失败，请稍后重试');
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
          <Text style={styles.title}>创建账号</Text>
          <Text style={styles.subtitle}>加入女性安全地图</Text>

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

          {/* 确认密码输入 */}
          <TextInput
            label="确认密码"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setConfirmPasswordError(null);
            }}
            onBlur={handleConfirmPasswordBlur}
            secureTextEntry={!showConfirmPassword}
            error={!!confirmPasswordError}
            style={styles.input}
            mode="outlined"
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
          />
          {confirmPasswordError && <Text style={styles.errorText}>{confirmPasswordError}</Text>}

          {/* 注册按钮 */}
          <Button
            mode="contained"
            onPress={handleRegister}
            loading={isLoading}
            disabled={isLoading}
            style={styles.registerButton}
          >
            注册
          </Button>

          {/* 登录链接 */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>已有账号？</Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              disabled={isLoading}
            >
              立即登录
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

      {/* 成功提示 */}
      <Snackbar
        visible={showSuccess}
        onDismiss={() => setShowSuccess(false)}
        duration={2000}
      >
        {successMessage}
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
  registerButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  loginText: {
    color: colors.textSecondary,
  },
});

