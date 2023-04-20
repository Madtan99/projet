import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View, Button, Pressable, TouchableOpacity, ToastAndroid } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import { Audio } from 'expo-av';
import Ionicons from '@expo/vector-icons/Ionicons';


//////////////////////////////////////////////////////////////
//                Noms des coéquipiers
//       Sammy Gailloux      Marc-Antoine Duquette
/////////////////////////////////////////////////////////////

const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <NavigationContainer >
      <Tab.Navigator initialRouteName="Home" >
      <Tab.Screen name="Home" component={HomeScreen} options={{tabBarIcon: ({size, focused, color}) => 
        <Ionicons name="home" size={size} color="#000" />}} />
      <Tab.Screen name="Photo" component={PhotoScreen} options={{tabBarIcon: ({size, focused, color}) => 
        <Ionicons name="camera" size={size} color="#000" />}} />
      <Tab.Screen name="Audio" component={AudioScreen} options={{tabBarIcon: ({size, focused, color}) => 
        <Ionicons name="mic" size={size} color="#000" />}} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const HomeScreen = ({navigation}) => <View><Text>Accueil</Text><Text>Noms des coéquipiers</Text><Text>Sammy Gailloux et Marc-Antoine Duquette</Text></View>
const PhotoScreen = () => {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [picturePermission, requestPicturePermission] = MediaLibrary.usePermissions();
  const [type, setType] = useState(CameraType.back);
  const [zoom, setZoom] = useState(0);
  const isFocused = useIsFocused();
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
      if (asset || true){
        ToastAndroid.show('Photo sauvegardé!', ToastAndroid.SHORT);
      }
    }
  };

  if (!permission){
    requestPermission();
  }
  if (!picturePermission){
    requestPicturePermission();
  }
  
  return <View>
    <View style={styles.container}>
      {permission && permission.granted && isFocused ? <Camera style={styles.camera} type={type} zoom={zoom} ref={(ref) => { camera = ref }}>
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
  const [audioPerm, requestAudioPerm] = useState(Audio.requestPermissionsAsync());
  const [storagePermission, requestStoragePermission] = MediaLibrary.usePermissions();
  const [recording, setRecording] = useState();
  const [uri, setUri] = useState();
  const [sound, setSound] = useState();
  async function startRecording(){
    try{
      const {recording} = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      if(!audioPerm) requestAudioPerm();
      if(!storagePermission) requestStoragePermission;
      setRecording(recording);
    }
    catch(error){
      console.log("Tentative d'enregistrement à échoué", error);
    }
  }
  async function stopRecording(){ 
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const {sound} = await recording.createNewLoadedSoundAsync();
    setSound(sound); 
    setUri(recording.getURI());
    //const asset = await MediaLibrary.createAssetAsync(uri);
    //console.log(uri);
    if(uri) ToastAndroid.show(`Audio sauvegardé ${uri}!`, ToastAndroid.LONG);
  }

  async function playRecordedAudio(){
    //access mediaLibrary to get the recorded audio
    //try{
      //const s = new Audio.Sound();
      //const player = await Audio.Sound.
      console.log(sound); 
      if(sound != null){
        //await sound.setPostionAsync(0);
        await sound.replayAsync();
      }
      //await s.loadAsync(sound);
      //console.log(test);
      //await sound.playAsync();
      //await sound.unloadAsync();
    //}
    //catch(error){
    //  console.log("test", error);
    //}
    //https://docs.expo.dev/versions/latest/sdk/media-library/
    //https://docs.expo.dev/versions/latest/sdk/audio/#api
  }
  
  return <View>
          <Text>Audio</Text>
          <View style={styles.container}>
            <Button title={recording ? 'Stop Recording' : 'Start Recording'} onPress={recording? stopRecording : startRecording}></Button>
            <Button title={"Replay recorded audio"} onPress={playRecordedAudio}></Button>
          </View>
        </View>
        
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
  visible:{
    visibility:'visible',
  },
  hidden:{
    display: 'none',
  },
  camera: {
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'stretch'
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