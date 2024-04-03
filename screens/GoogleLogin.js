import { StyleSheet, Text, View, Button, Image } from 'react-native'
import React, { useState, useEffect } from 'react';
import 'expo-dev-client';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

const GoogleLogin = () => {


  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();


  GoogleSignin.configure({
    webClientId: '601616374412-gm653pgm0c276jqkl2hqvti1ufp4l08f.apps.googleusercontent.com',
  });


  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);


  async function onGoogleButtonPress() {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    const user_sign_in = auth().signInWithCredential(googleCredential);
    user_sign_in.then((user) => {
      console.log(user);
    })
      .catch((error) => {
        console.log(error);
      })
  }


  const SignOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await auth().signOut();
    } catch (error) {
      console.log(error);
    }
  }


  if (initializing) return null;

  if (!user) {

    return (
      <Button
        title="Google Sign-In"
        onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}
      />
    );

  }

  return (
    <View>
      <Text>GoogleLogin,  {user.displayName}</Text>
      <Image
        style={{ width: 300, height: 300 }}
        source={{ uri: user.photoURL }}
      />
      <Button title='Sign Out' onPress={SignOut} />
    </View>
  )
}

export default GoogleLogin

const styles = StyleSheet.create({})