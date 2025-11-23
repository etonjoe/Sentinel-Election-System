import React, { useState } from 'react';
import { Copy, Terminal, Smartphone, Database, Server } from 'lucide-react';

const DeveloperResources: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'backend' | 'mobile'>('backend');

  const djangoCode = `
# --- models.py ---
from django.db import models
from django.contrib.auth.models import User

class PollingUnit(models.Model):
    unit_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)
    region = models.CharField(max_length=100)
    registered_voters = models.IntegerField()

    def __str__(self):
        return f"{self.name} ({self.unit_id})"

class ElectionResult(models.Model):
    unit = models.ForeignKey(PollingUnit, on_delete=models.CASCADE)
    accredited_voters = models.IntegerField()
    # Storing votes as JSON for flexibility: {'party_a': 200, 'party_b': 100}
    votes = models.JSONField() 
    proof_image = models.ImageField(upload_to='results/')
    submitted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    status = models.CharField(
        max_length=20, 
        choices=[('pending', 'Pending'), ('verified', 'Verified'), ('flagged', 'Flagged')],
        default='pending'
    )
    timestamp = models.DateTimeField(auto_now_add=True)

# --- serializers.py ---
from rest_framework import serializers
from .models import ElectionResult

class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectionResult
        fields = '__all__'

# --- views.py ---
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ResultSerializer
from .tasks import send_sms_alert # Celery task

class SubmitResultView(APIView):
    def post(self, request):
        serializer = ResultSerializer(data=request.data)
        if serializer.is_valid():
            result = serializer.save()
            
            # Simple anomaly check logic
            if result.accredited_voters > result.unit.registered_voters:
                result.status = 'flagged'
                result.save()
                send_sms_alert.delay(f"Anomaly detected in {result.unit.name}")
                
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
`;

  const reactNativeCode = `
// --- App.js ---
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import UploadScreen from './screens/UploadScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Upload" component={UploadScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// --- screens/UploadScreen.js ---
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function UploadScreen({ navigation }) {
  const [accredited, setAccredited] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const submitResult = async () => {
    if (!image || !accredited) {
      Alert.alert('Error', 'Please enter data and take a photo.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('accredited_voters', accredited);
    formData.append('proof_image', {
      uri: image,
      type: 'image/jpeg',
      name: 'proof.jpg',
    });
    // Add votes and unit ID to formData here...

    try {
      await axios.post('https://api.sentinel-election.com/v1/results/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Alert.alert('Success', 'Results uploaded securely.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Upload failed. check connection.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Accredited Voters</Text>
      <TextInput 
        style={styles.input} 
        keyboardType="numeric"
        value={accredited}
        onChangeText={setAccredited}
      />
      
      <Button title="Take Result Sheet Photo" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.preview} />}
      
      <View style={{ marginTop: 20 }}>
        <Button 
          title={uploading ? "Uploading..." : "Secure Submit"} 
          onPress={submitResult} 
          disabled={uploading} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontWeight: 'bold', marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 20, borderRadius: 5 },
  preview: { width: '100%', height: 200, marginTop: 10, resizeMode: 'contain' }
});
`;

  return (
    <div className="space-y-6 animate-fade-in h-[calc(100vh-8rem)] flex flex-col">
      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold flex items-center gap-2">
              <Terminal className="text-green-400" />
              Developer Source Code
          </h2>
          <p className="text-slate-400 text-sm mt-1">
              Copy the source code below to initialize your Backend and Mobile Application projects.
          </p>
      </div>

      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-200">
              <button 
                  onClick={() => setActiveTab('backend')}
                  className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                      activeTab === 'backend' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-slate-50 text-slate-500 hover:text-slate-700'
                  }`}
              >
                  <Server size={16} /> Django Backend (Python)
              </button>
              <button 
                  onClick={() => setActiveTab('mobile')}
                  className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                      activeTab === 'mobile' ? 'bg-white text-purple-600 border-b-2 border-purple-600' : 'bg-slate-50 text-slate-500 hover:text-slate-700'
                  }`}
              >
                  <Smartphone size={16} /> React Native App (Mobile)
              </button>
          </div>

          <div className="flex-1 overflow-y-auto relative bg-slate-900 p-0">
              <button 
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors z-10"
                title="Copy Code"
                onClick={() => {
                    navigator.clipboard.writeText(activeTab === 'backend' ? djangoCode : reactNativeCode);
                    alert('Code copied to clipboard!');
                }}
              >
                  <Copy size={18} />
              </button>
              
              <pre className="p-6 text-sm font-mono text-slate-300 leading-relaxed">
                  <code>
                      {activeTab === 'backend' ? djangoCode : reactNativeCode}
                  </code>
              </pre>
          </div>
      </div>
    </div>
  );
};

export default DeveloperResources;