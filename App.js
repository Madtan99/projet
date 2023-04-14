import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View, Button, Pressable } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';

const Tab = createBottomTabNavigator();
export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home" >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Photo" component={PhotoScreen}/>
      <Tab.Screen name="Audio" component={AudioScreen}/>
      </Tab.Navigator>
    </NavigationContainer>
  );


  /*if (!permission) ... 

  if (!permission.granted) ... */

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }
}
const HomeScreen = ({navigation}) => <View><Text>Accueil</Text></View>
const PhotoScreen = () => <View>
  <Text>Photo</Text>
  <View style={styles.container}>
    <Camera style={styles.camera} type={type}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>
      </View>
    </Camera>
  </View>
</View>
const AudioScreen = () => <View><Text>Audio</Text></View>

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {

  },
  camera: {

  },
  buttonContainer: {

  },
  text: {
    
  }
});
