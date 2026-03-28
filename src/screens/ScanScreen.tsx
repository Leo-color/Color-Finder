import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
  Animated as RNAnimated,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MlkitOcr from 'react-native-mlkit-ocr';

import { Colors, Gradients, Spacing, BorderRadius, Shadows } from '../theme';
import { cleanMathText, extractBestExpression, isValidMathExpression } from '../utils/textCleaner';
import { solveExpression } from '../utils/mathSolver';
import { useHistory } from '../hooks/useHistory';
import { RootStackParamList } from '../navigation/AppNavigator';

const { width, height } = Dimensions.get('window');
const SCAN_BOX_WIDTH = width * 0.85;
const SCAN_BOX_HEIGHT = 180;

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export default function ScanScreen() {
  const navigation = useNavigation<NavProp>();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [processing, setProcessing] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const { addEntry } = useHistory();

  // Corner animation for scan box
  const scanAnim = useRef(new RNAnimated.Value(0)).current;
  const pulseAnim = useRef(new RNAnimated.Value(1)).current;

  useEffect(() => {
    const loop = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(scanAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        RNAnimated.timing(scanAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  useEffect(() => {
    const pulse = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(pulseAnim, { toValue: 1.06, duration: 900, useNativeDriver: true }),
        RNAnimated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const processImage = useCallback(
    async (imageUri: string) => {
      setProcessing(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      try {
        // Run on-device OCR (Google ML Kit — no API key)
        const ocrResult = await MlkitOcr.detectFromUri(imageUri);
        const rawText = ocrResult.map(b => b.text).join('\n');

        if (!rawText.trim()) {
          Alert.alert(
            'No Text Found',
            'Point the camera at a math expression and make sure it is clear and well-lit.',
            [{ text: 'OK' }]
          );
          return;
        }

        // Extract and clean expression
        const bestExpr = extractBestExpression(rawText);
        const cleaned = cleanMathText(bestExpr);

        if (!isValidMathExpression(cleaned)) {
          Alert.alert(
            'Not a Math Expression',
            `Detected: "${cleaned}"\n\nTry pointing at a clearer math expression.`,
            [{ text: 'OK' }]
          );
          return;
        }

        // Solve
        const solveResult = solveExpression(cleaned);
        solveResult.timestamp = Date.now();

        // Save to history
        await addEntry(solveResult, imageUri);

        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        navigation.navigate('Result', { result: solveResult, imageUri });
      } catch (err) {
        Alert.alert('Error', 'Could not process the image. Please try again.');
      } finally {
        setProcessing(false);
      }
    },
    [addEntry, navigation]
  );

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current || processing) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.85,
        base64: false,
      });
      if (photo?.uri) await processImage(photo.uri);
    } catch {
      Alert.alert('Camera Error', 'Could not take photo. Please try again.');
    }
  }, [processing, processImage]);

  const handleGallery = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Grant photo library access to import images.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      await processImage(result.assets[0].uri);
    }
  }, [processImage]);

  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.accent} size="large" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <LinearGradient colors={Gradients.dark} style={StyleSheet.absoluteFill} />
        <MaterialCommunityIcons name="camera-off" size={64} color={Colors.textMuted} />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          MathSnap needs camera access to scan and solve math expressions.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <LinearGradient colors={Gradients.button} style={styles.permissionButtonGrad}>
            <Text style={styles.permissionButtonText}>Enable Camera</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        flash={flashOn ? 'on' : 'off'}
      />

      {/* Dark overlay with hole (simulated via gradient borders) */}
      <LinearGradient
        colors={['rgba(10,10,26,0.65)', 'transparent']}
        style={[styles.topOverlay, { paddingTop: insets.top }]}
      />
      <LinearGradient
        colors={['transparent', 'rgba(10,10,26,0.85)']}
        style={styles.bottomOverlay}
      />

      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <View style={styles.logoRow}>
          <MaterialCommunityIcons name="calculator-variant" size={26} color={Colors.accent} />
          <Text style={styles.appName}>MathSnap</Text>
        </View>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => setFlashOn(f => !f)}
        >
          <Ionicons
            name={flashOn ? 'flash' : 'flash-off'}
            size={24}
            color={flashOn ? Colors.warning : Colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Scan box */}
      <View style={styles.scanArea}>
        <Text style={styles.scanHint}>Align math expression inside the box</Text>

        <Animated.View style={[styles.scanBox, { transform: [{ scale: pulseAnim }] }]}>
          {/* Corners */}
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />

          {/* Scanning line */}
          <RNAnimated.View
            style={[
              styles.scanLine,
              {
                transform: [
                  {
                    translateY: scanAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, SCAN_BOX_HEIGHT - 2],
                    }),
                  },
                ],
              },
            ]}
          />
        </Animated.View>

        <Text style={styles.scanSubHint}>Works on printed & handwritten expressions</Text>
      </View>

      {/* Processing overlay */}
      {processing && (
        <View style={styles.processingOverlay}>
          <LinearGradient
            colors={['rgba(10,10,26,0.9)', 'rgba(10,10,26,0.95)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.processingCard}>
            <ActivityIndicator size="large" color={Colors.accent} />
            <Text style={styles.processingText}>Scanning & Solving...</Text>
            <Text style={styles.processingSubText}>Running on-device AI</Text>
          </View>
        </View>
      )}

      {/* Bottom controls */}
      <View style={[styles.bottomControls, { paddingBottom: insets.bottom + 20 }]}>
        {/* Gallery button */}
        <TouchableOpacity style={styles.sideBtn} onPress={handleGallery} disabled={processing}>
          <View style={styles.sideBtnInner}>
            <Ionicons name="images" size={28} color={Colors.text} />
          </View>
          <Text style={styles.sideBtnLabel}>Gallery</Text>
        </TouchableOpacity>

        {/* Capture button */}
        <TouchableOpacity
          onPress={handleCapture}
          disabled={processing}
          style={styles.captureWrapper}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={processing ? ['#333', '#333'] : Gradients.button}
            style={styles.captureBtn}
          >
            <View style={styles.captureInner}>
              <MaterialCommunityIcons
                name="camera-iris"
                size={36}
                color={Colors.text}
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Flip button */}
        <TouchableOpacity
          style={styles.sideBtn}
          onPress={() => setFacing(f => (f === 'back' ? 'front' : 'back'))}
          disabled={processing}
        >
          <View style={styles.sideBtnInner}>
            <Ionicons name="camera-reverse" size={28} color={Colors.text} />
          </View>
          <Text style={styles.sideBtnLabel}>Flip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Alias so JSX works
const Animated = RNAnimated;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    zIndex: 1,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 220,
    zIndex: 1,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    zIndex: 10,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  appName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.3,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.round,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  scanArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  scanHint: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: Spacing.md,
    opacity: 0.9,
  },
  scanSubHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  scanBox: {
    width: SCAN_BOX_WIDTH,
    height: SCAN_BOX_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: Colors.accent,
    borderWidth: 3,
  },
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.accent,
    opacity: 0.7,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingCard: {
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.lg,
    minWidth: 220,
  },
  processingText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  processingSubText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: Spacing.xl,
    zIndex: 10,
  },
  sideBtn: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  sideBtnInner: {
    width: 54,
    height: 54,
    borderRadius: BorderRadius.round,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideBtnLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  captureWrapper: {
    ...Shadows.accent,
  },
  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  captureInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Permission screen
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  permissionText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  permissionButton: {
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.round,
    overflow: 'hidden',
    ...Shadows.md,
  },
  permissionButtonGrad: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  permissionButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
});
