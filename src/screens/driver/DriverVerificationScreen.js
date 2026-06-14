import React, { useContext, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';

const REQUIRED_DOCUMENTS = [
  { key: 'driversLicense', title: 'Driver’s License', required: true },
  { key: 'vehicleRegistration', title: 'Vehicle Registration', required: true },
  { key: 'idDocument', title: 'National ID / Passport', required: true },
  { key: 'vehicleInsurance', title: 'Vehicle Insurance', required: false },
];

export default function DriverVerificationScreen() {
  const {
    getDriverVerification,
    uploadDriverDocument,
    submitDriverVerification,
  } = useContext(AuthContext);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingKey, setUploadingKey] = useState('');

  const verification = getDriverVerification();

  const completion = useMemo(() => {
    const uploadedRequired = REQUIRED_DOCUMENTS.filter((doc) => doc.required && verification[doc.key]).length;
    const totalRequired = REQUIRED_DOCUMENTS.filter((doc) => doc.required).length;
    return { uploadedRequired, totalRequired };
  }, [verification]);

  const handlePickAndUpload = async (documentKey) => {
    try {
      setUploadingKey(documentKey);
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) return;

      const file = result.assets?.[0];
      if (!file) return;

      await uploadDriverDocument(documentKey, {
        uri: file.uri,
        name: file.name,
        size: file.size,
        mimeType: file.mimeType,
      });

      Alert.alert('Uploaded', 'Document uploaded successfully.');
    } catch (error) {
      Alert.alert('Upload failed', error.message || 'Could not upload document');
    } finally {
      setUploadingKey('');
    }
  };

  const handleSubmitVerification = async () => {
    try {
      setSubmitting(true);
      await submitDriverVerification();
      Alert.alert('Submitted', 'Your documents were submitted for verification.');
    } catch (error) {
      Alert.alert('Submission failed', error.message || 'Unable to submit documents');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Driver Verification</Text>
        <Text style={styles.subtitle}>Upload required documents to activate driving.</Text>

        <View style={styles.progressCard}>
          <Text style={styles.progressText}>
            Required uploaded: {completion.uploadedRequired}/{completion.totalRequired}
          </Text>
        </View>

        {REQUIRED_DOCUMENTS.map((doc) => {
          const uploaded = verification[doc.key];
          const status = uploaded?.status || 'missing';

          return (
            <View key={doc.key} style={styles.docCard}>
              <View style={styles.docHeader}>
                <Text style={styles.docTitle}>
                  {doc.title} {doc.required ? '*' : ''}
                </Text>
                {status === 'under_review' ? (
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Under review</Text>
                  </View>
                ) : status === 'uploaded' ? (
                  <View style={styles.statusBadgeUploaded}>
                    <Text style={styles.statusTextUploaded}>Uploaded</Text>
                  </View>
                ) : null}
              </View>

              {uploaded?.name ? <Text style={styles.fileName}>{uploaded.name}</Text> : null}

              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => handlePickAndUpload(doc.key)}
                disabled={uploadingKey === doc.key || submitting}
              >
                {uploadingKey === doc.key ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
                    <Text style={styles.uploadButtonText}>{uploaded ? 'Replace file' : 'Upload file'}</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          );
        })}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitVerification}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit for Verification</Text>
          )}
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
  content: {
    padding: 16,
    paddingTop: 56,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  docCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  docTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  fileName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  statusBadge: {
    backgroundColor: '#fff3cd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    color: '#856404',
    fontWeight: '600',
  },
  statusBadgeUploaded: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusTextUploaded: {
    fontSize: 11,
    color: '#2e7d32',
    fontWeight: '600',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 12,
    gap: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#1f9d55',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 12,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});