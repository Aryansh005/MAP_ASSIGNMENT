import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NativeModules } from 'react-native';

const PowerSavingModeModule = NativeModules.PowerSavingModeModule;

const SaverMode = () => {
   const [toggle, setToggle] = useState(false);
   const [errorMsg, setErrorMsg] = useState('');

   const checkPowerSavingMode = () => {
      PowerSavingModeModule.isPowerSavingModeEnabled()
         .then(isEnabled => {
            setToggle(isEnabled);
            console.log('Power Saving Mode is enabled:', isEnabled);
         })
         .catch(error => {
            setErrorMsg(`Error checking power saving mode: ${error}`);
         });
   };

   useEffect(() => {
      checkPowerSavingMode();
   }, []);

   return (
      <View style={styles.container}>
         <Text style={styles.titleText}>Battery Saver Mode</Text>
         <View style={styles.statusContainer}>
            <Text style={styles.statusText}>
               Status: {toggle ? 'Enabled' : 'Disabled'}
            </Text>
            <View
               style={[
                  styles.statusIndicator,
                  { backgroundColor: toggle ? 'green' : 'red' },
               ]}
            />
         </View>
         {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
         <TouchableOpacity style={styles.refreshButton} onPress={checkPowerSavingMode}>
            <Text style={styles.buttonText}>Refresh</Text>
         </TouchableOpacity>
      </View>
   );
};

export default SaverMode;

const styles = StyleSheet.create({
   container: {
      backgroundColor: '#1F1F1F',
      borderRadius: 15,
      margin: 10,
      padding: 15,
      width: '90%',
      alignSelf: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 5,
   },
   titleText: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
   },
   statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 10,
   },
   statusText: {
      color: 'white',
      fontSize: 18,
   },
   statusIndicator: {
      width: 20,
      height: 20,
      borderRadius: 10,
   },
   errorText: {
      color: 'red',
      fontSize: 14,
      marginTop: 10,
      textAlign: 'center',
   },
   refreshButton: {
      backgroundColor: '#007BFF',
      padding: 10,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 15,
   },
   buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
   },
});
