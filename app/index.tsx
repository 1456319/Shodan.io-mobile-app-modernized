import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Input, Text } from '../src/components/ui';
import { ChromecastDiagnosticReport, formatReport, runChromecastDiagnostics } from '../src/api/chromecast';
import { Colors } from '../src/theme/colors';
import { Radius, Spacing } from '../src/theme/spacing';

const ROADMAP = [
  'Phase 1: manual-IP diagnostics through Chromecast local HTTP setup endpoints.',
  'Phase 2: Android dev build with mDNS discovery for _googlecast._tcp.local and optional SoftAP onboarding checks.',
  'Phase 3: Cast V2 sender controls over TLS for app launch, status, media transport, volume, and custom receiver experiments.',
  'Phase 4: guarded admin modules for any write endpoints your Ultra proves it exposes without cloud dependencies.',
];

export default function ChromecastLabScreen() {
  const [host, setHost] = useState('192.168.1.100');
  const [report, setReport] = useState<ChromecastDiagnosticReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rawReport = useMemo(() => (report ? formatReport(report) : ''), [report]);

  async function runProbe() {
    setIsRunning(true);
    setError(null);
    try {
      setReport(await runChromecastDiagnostics(host));
    } catch (probeError) {
      setError(probeError instanceof Error ? probeError.message : 'Unable to run diagnostics.');
    } finally {
      setIsRunning(false);
    }
  }

  async function copyReport() {
    if (rawReport) await Clipboard.setStringAsync(rawReport);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <Text variant="caption" color="accent">CHROMECAST ULTRA RECOVERY LAB</Text>
          <Text variant="displayLg" style={styles.title}>Local-first Cast diagnostics without Google Home.</Text>
          <Text color="textMuted">
            Start with the Ultra IP address. The app checks readable local setup surfaces first, then tells us which native modules are worth adding for deeper Cast control.
          </Text>
        </View>

        <Card>
          <Input
            label="Chromecast IP address"
            value={host}
            onChangeText={setHost}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="numbers-and-punctuation"
            placeholder="192.168.1.100"
          />
          <Button title="Run local diagnostic sweep" onPress={runProbe} loading={isRunning} fullWidth />
          {error && <Text color="danger" style={styles.message}>{error}</Text>}
        </Card>

        {report && (
          <Card style={styles.section}>
            <Text variant="headingMd">Probe results</Text>
            <Text color="textMuted" style={styles.message}>Host {report.host} • completed {new Date(report.finishedAt).toLocaleString()}</Text>
            {report.endpoints.map((endpoint) => (
              <View key={endpoint.path} style={styles.endpointRow}>
                <View style={[styles.statusDot, endpoint.state === 'ok' ? styles.ok : endpoint.state === 'warn' ? styles.warn : styles.bad]} />
                <View style={styles.endpointText}>
                  <Text variant="body" style={styles.endpointTitle}>{endpoint.label}</Text>
                  <Text variant="caption" color="textMuted">GET {endpoint.path}{endpoint.status ? ` • HTTP ${endpoint.status}` : ''}</Text>
                  <Text color="textMuted">{endpoint.summary}</Text>
                </View>
              </View>
            ))}
            <Button title="Copy JSON report" onPress={copyReport} variant="secondary" fullWidth />
          </Card>
        )}

        <Card style={styles.section}>
          <Text variant="headingMd">Build plan</Text>
          {ROADMAP.map((item) => <Text key={item} color="textMuted" style={styles.bullet}>• {item}</Text>)}
        </Card>

        {report && (
          <Card style={styles.section}>
            <Text variant="headingMd">Raw report</Text>
            <Text variant="mono" style={styles.raw}>{rawReport}</Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.lg, gap: Spacing.md },
  hero: { gap: Spacing.sm, paddingVertical: Spacing.md },
  title: { lineHeight: 38 },
  section: { marginTop: Spacing.sm },
  message: { marginTop: Spacing.sm },
  endpointRow: { flexDirection: 'row', gap: Spacing.sm, paddingVertical: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
  endpointText: { flex: 1, gap: Spacing.xxs },
  endpointTitle: { fontWeight: '700' },
  statusDot: { width: 12, height: 12, borderRadius: 6, marginTop: 5 },
  ok: { backgroundColor: Colors.accent },
  warn: { backgroundColor: Colors.warning },
  bad: { backgroundColor: Colors.danger },
  bullet: { marginTop: Spacing.sm },
  raw: { marginTop: Spacing.sm, backgroundColor: Colors.backgroundAlt, borderRadius: Radius.sm, padding: Spacing.sm },
});
