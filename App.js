import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View, Button, Pressable, TouchableOpacity } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import { Audio } from 'expo-av';

const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <NavigationContainer >
      <Tab.Navigator initialRouteName="Home" >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Photo" component={PhotoScreen}/>
      <Tab.Screen name="Audio" component={AudioScreen}/>
      </Tab.Navigator>
    </NavigationContainer>
  );


  /*if (!permission) ... 

  if (!permission.granted) ... */

  
}
const HomeScreen = ({navigation}) => <View><Text>Accueil</Text></View>
const PhotoScreen = () => {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [picturePermission, requestPicturePermission] = MediaLibrary.usePermissions();
  const [type, setType] = useState(CameraType.back);
  const [zoom, setZoom] = useState(0);
  var camera;

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  function toggleZoom(){
    setZoom(zoom == 1 ? 0 : 1);
  }

  async function takePicture() {
    if (!picturePermission){
      requestPicturePermission();
    }
    if (camera) {
      const { uri } = await camera.takePictureAsync();
      const asset = await MediaLibrary.createAssetAsync(uri);
    }
  };

  if (!permission){
    requestPermission();
  }
  if (!picturePermission){
    requestPicturePermission();
  }
  
  return <View>   
    <Text>Photo</Text>
    <View style={styles.container}>
      {permission && permission.granted ? <Camera style={styles.camera} type={type} zoom={zoom} ref={(ref) => { camera = ref }}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleZoom}>
            <Text style={styles.text}>Zoom</Text>
          </TouchableOpacity>
        </View>
      </Camera> : <Text>La permission est refusé</Text>}
    </View>
  </View>
}
const AudioScreen = () => {
  const [audioPerm, requestAudioPerm] = Audio.requestPermissionsAsync();
  const [recording, setRecording] = useState();
  async function record(){
    await Audio.requestPermissionsAsync();
    const {recording} = await Audio.Sound.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    
    if(!audioPerm) requestAudioPerm();

    setRecording(recording);
  }
  
  return <Vew>
          <Text>Audio</Text>
          <View style={styles.container}>
          </View>
        </Vew>
}

const styles = StyleSheet.create({
  container: {
    width: 400,
    height: 400
  },
  camera: {
    width:400,
    height: 500
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});